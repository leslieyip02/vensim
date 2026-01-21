package ws

import (
	"server/graph"
	"server/id"

	"github.com/gorilla/websocket"
)

type Client struct {
	id   string
	send chan []byte
	conn *websocket.Conn
	hub  *Hub
}

func NewClient(conn *websocket.Conn, hub *Hub) *Client {
	id, err := id.NewShortId()
	if err != nil {
		return nil
	}

	return &Client{
		id:   id,
		send: make(chan []byte),
		conn: conn,
		hub:  hub,
	}
}

func (c *Client) ReadPump() {
	for {
		var op graph.Operation
		if err := c.conn.ReadJSON(&op); err != nil {
			break
		}
		c.hub.broadcast <- op
	}
}

func (c *Client) SendClientID() {
	msg := struct {
		Type     string `json:"type"`
		ClientID string `json:"clientId"`
	}{
		Type:     "clientId",
		ClientID: c.id,
	}
	c.conn.WriteJSON(msg)
}

func (c *Client) SendOperation(op graph.Operation) {
	c.conn.WriteJSON(op)
}

func (c *Client) SendSnapshot(state *graph.State) {
	msg := struct {
		Type  string       `json:"type"`
		State *graph.State `json:"state"`
	}{
		Type:  "snapshot",
		State: state,
	}
	c.conn.WriteJSON(msg)
}
