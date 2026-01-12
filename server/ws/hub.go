package ws

import (
	"server/graph"
)

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan graph.Operation
	register   chan *Client
	unregister chan *Client

	state *graph.State
}

func NewHub(state *graph.State) *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan graph.Operation),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		state:      state,
	}
}

func (h *Hub) Register(c *Client) {
	h.register <- c
	go c.ReadPump()
}

func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.clients[c] = true
			c.SendClientID()
			c.SendSnapshot(h.state)

		case c := <-h.unregister:
			delete(h.clients, c)

		case op := <-h.broadcast:
			h.state.Apply(op)

			for c := range h.clients {
				if c.id != op.SenderId {
					c.SendOperation(op)
				}
			}
		}
	}
}
