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
var autoCloseDuration = 5 * time.Minute

const OperationSyncThreshold = 10

type Broadcaster interface {
	addListener(listener Listener)
	removeListener(listener Listener)
	broadcast(message Envelope)
}

type Hub struct {
	id                string
	state             *graph.State
	listeners         map[Listener]bool
	registerChannel   chan Listener
	unregisterChannel chan Listener
	broadcastChannel  chan Envelope
	closeChannel      chan struct{}
	onClose           func()
}

func NewHub(id string, state *graph.State, onClose func()) *Hub {
	return &Hub{
		id:                id,
		state:             state,
		listeners:         make(map[Listener]bool),
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
	autoCloseTimer := timeout.NewTimer(autoCloseDuration, h.close)

	operationsApplied := 0

	for {
		select {
		case c := <-h.registerChannel:
			log.Printf("Hub %v: Client %v joined", h.GetID(), c.getID())

			wasEmpty := len(h.listeners) == 0
			h.listeners[c] = true

			if wasEmpty {
				autoCloseTimer.Reset()
			}

			c.sendID()
			c.sendSnapshot(h.state)

		case c := <-h.unregisterChannel:
			log.Printf("Hub %v: Client %v left", h.GetID(), c.getID())
			delete(h.listeners, c)

			for c := range h.listeners {
				c.sendLeaveMessage(c.getID())
			}

			if len(h.listeners) == 0 {
				autoCloseTimer.Start()
			}

		case envelope := <-h.broadcastChannel:
			// check if the envelope is an apply operation
			if envelope.Type == "graph" {
				var op graph.Operation
				json.Unmarshal(envelope.Data, &op)

				log.Printf("Hub %v: Applying %v", h.GetID(), op)
				_, succeeded := h.state.Apply(op)
				if !succeeded {
					// if the operation fails, force all clients to re-sync their states
					h.syncClients()
					continue
				}
				operationsApplied++
			}

			// forward all envelopes
			for c := range h.listeners {
				if c.getID() != envelope.SenderID {
					c.sendEnvelope(envelope)
				}
			}

			// periodically sync state
			if operationsApplied >= OperationSyncThreshold {
				h.syncClients()
				operationsApplied = 0
			}

		case <-h.closeChannel:
			if h.onClose != nil {
				h.onClose()
			}
			return
		}
	}
}

func (h *Hub) syncClients() {
	log.Printf("Hub %v: Syncing clients", h.GetID())
	for c := range h.listeners {
		c.sendSnapshot(h.state)
	}
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
