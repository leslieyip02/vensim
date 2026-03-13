package ws

import (
	"encoding/json"
	"log"
	"server/graph"
	"server/timeout"
	"time"

	"github.com/gorilla/websocket"
)

// this is left as a var so that it can be overridden in tests
var shutdownTimeout = 5 * time.Minute

type Broadcaster interface {
	addListener(listener Listener)
	removeListener(listener Listener)
	broadcast(message Envelope)
}

type Hub struct {
	id                string
	state             *graph.State
	listeners         map[string]Listener
	registerChannel   chan Listener
	unregisterChannel chan Listener
	broadcastChannel  chan Envelope
	closeChannel      chan struct{}
	onClose           func()
	shutdownTimer     *timeout.TimeoutManager
}

func NewHub(id string, state *graph.State, onClose func()) *Hub {
	return &Hub{
		id:                id,
		state:             state,
		listeners:         make(map[string]Listener),
		registerChannel:   make(chan Listener),
		unregisterChannel: make(chan Listener),
		broadcastChannel:  make(chan Envelope),
		closeChannel:      make(chan struct{}),
		onClose:           onClose,
	}
}

// ============================================================================
//  Room
// ============================================================================

func (h *Hub) GetID() string {
	return h.id
}

func (h *Hub) Register(conn *websocket.Conn) {
	c := newClient(conn, h)
	h.addListener(c)
}

func (h *Hub) Run() {
	defer h.onClose()

	// automatically shutdown the room if all clients have left
	// with a grace period for reconnections
	h.shutdownTimer = timeout.NewTimer(shutdownTimeout, h.close)

	for {
		select {
		case c := <-h.registerChannel:
			h.registerClient(c)

		case c := <-h.unregisterChannel:
			h.unregisterClient(c)

		case envelope := <-h.broadcastChannel:
			h.handleEnvelope(envelope)

		case <-h.closeChannel:
			return
		}
	}
}

func (h *Hub) registerClient(c Listener) {
	log.Printf("Hub %v: Client %v joined", h.GetID(), c.getID())

	wasEmpty := len(h.listeners) == 0
	h.listeners[c.getID()] = c

	if wasEmpty {
		log.Printf("Hub %v: Room is no longer empty, resetting shutdown timer", h.GetID())
		h.shutdownTimer.Reset()
	}

	c.sendID()
	c.sendSnapshot(h.state)
}

func (h *Hub) unregisterClient(c Listener) {
	log.Printf("Hub %v: Client %v left", h.GetID(), c.getID())
	delete(h.listeners, c.getID())

	for _, other := range h.listeners {
		other.sendLeaveMessage(c.getID())
	}

	if len(h.listeners) == 0 {
		log.Printf("Hub %v: Room is empty, starting shutdown timer", h.GetID())
		h.shutdownTimer.Start()
	}
}

func (h *Hub) handleEnvelope(envelope Envelope) {
	// check if the envelope is an apply operation
	if envelope.Type == "graph" {
		var op graph.Operation
		json.Unmarshal(envelope.Data, &op)

		log.Printf("Hub %v: Applying %v", h.GetID(), op)
		_, succeeded := h.state.Apply(op)
		if !succeeded {
			log.Printf("Hub %v: Client %v desynced", h.GetID(), envelope.SenderID)
			h.syncClient(envelope.SenderID)
			return
		}
	}

	// forward all envelopes
	for id, c := range h.listeners {
		if id == envelope.SenderID {
			// client has already applied its own update
			continue
		}
		c.sendEnvelope(envelope)
	}
}

func (h *Hub) syncClient(id string) {
	c, found := h.listeners[id]
	if !found {
		return
	}

	log.Printf("Hub %v: Syncing client %v", h.GetID(), c.getID())
	c.sendSnapshot(h.state)
}

func (h *Hub) close() {
	log.Printf("Hub %v: Closing hub due to inactivity", h.GetID())

	select {
	case h.closeChannel <- struct{}{}:
		// signal
	default:
		// already closing
	}
}

// ============================================================================
//  Broadcaster
// ============================================================================

func (h *Hub) addListener(listener Listener) {
	log.Printf("Hub %v: Adding listener %v", h.GetID(), listener.getID())
	h.registerChannel <- listener
	go listener.listen()
}

func (h *Hub) removeListener(listener Listener) {
	h.unregisterChannel <- listener
}

func (h *Hub) broadcast(envelope Envelope) {
	h.broadcastChannel <- envelope
}
