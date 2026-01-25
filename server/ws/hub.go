package ws

import (
	"server/graph"

	"github.com/gorilla/websocket"
)

type Broadcaster interface {
	addListener(listener Listener)
	removeListener(listener Listener)
	broadcastOperation(op graph.Operation)
}

type Hub struct {
	id                string
	listeners         map[Listener]bool
	registerChannel   chan Listener
	unregisterChannel chan Listener
	broadcastChannel  chan graph.Operation
	state             *graph.State
}

func NewHub(id string, state *graph.State) *Hub {
	return &Hub{
		id:                id,
		listeners:         make(map[Listener]bool),
		registerChannel:   make(chan Listener),
		unregisterChannel: make(chan Listener),
		broadcastChannel:  make(chan graph.Operation),
		state:             state,
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
	for {
		select {
		case c := <-h.registerChannel:
			h.listeners[c] = true
			c.sendID()
			c.sendSnapshot(h.state)

		case c := <-h.unregisterChannel:
			delete(h.listeners, c)

		case op := <-h.broadcastChannel:
			h.state.Apply(op)

			for c := range h.listeners {
				if c.getID() != op.SenderId {
					c.sendOperation(op)
				}
			}
		}
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
