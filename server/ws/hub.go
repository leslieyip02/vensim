package ws

import (
	"log"
	"server/graph"
	"server/timeout"
	"time"

	"github.com/gorilla/websocket"
)

var autoCloseDuration = 5 * time.Minute

type Broadcaster interface {
	addListener(listener Listener)
	removeListener(listener Listener)
	broadcastOperation(op graph.Operation)
}

type Hub struct {
	id                string
	state             *graph.State
	listeners         map[Listener]bool
	registerChannel   chan Listener
	unregisterChannel chan Listener
	broadcastChannel  chan graph.Operation
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
		broadcastChannel:  make(chan graph.Operation),
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

	for {
		select {
		case c := <-h.registerChannel:
			log.Printf("Client %v joined", c.getID())

			wasEmpty := len(h.listeners) == 0
			h.listeners[c] = true

			if wasEmpty {
				autoCloseTimer.Reset()
			}

			c.sendID()
			c.sendSnapshot(h.state)

		case c := <-h.unregisterChannel:
			log.Printf("Client %v left", c.getID())

			delete(h.listeners, c)

			if len(h.listeners) == 0 {
				autoCloseTimer.Start()
			}

		case op := <-h.broadcastChannel:
			h.state.Apply(op)

			for c := range h.listeners {
				if c.getID() != op.SenderId {
					c.sendOperation(op)
				}
			}

		case <-h.closeChannel:
			if h.onClose != nil {
				h.onClose()
			}
			return
		}
	}
}

func (h *Hub) close() {
	log.Printf("Closing hub due to inactivity")

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
	h.registerChannel <- listener
	go listener.listen()
}

func (h *Hub) removeListener(listener Listener) {
	h.unregisterChannel <- listener
}

func (h *Hub) broadcastOperation(op graph.Operation) {
	h.broadcastChannel <- op
}
