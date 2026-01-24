package ws

import (
	"server/graph"
	"server/id"

	"github.com/gorilla/websocket"
)

type Listener interface {
	getID() string
	listen()
	sendID()
	sendOperation(op graph.Operation)
	sendSnapshot(state *graph.State)
}

type Client struct {
	id          string
	send        chan []byte
	conn        *websocket.Conn
	broadcaster Broadcaster
}

var newClientID = id.NewShortId

var newClient = func(conn *websocket.Conn, broadcaster Broadcaster) Listener {
	id, err := newClientID()
	if err != nil {
		return nil
	}

	return &Client{
		id:          id,
		send:        make(chan []byte),
		conn:        conn,
		broadcaster: broadcaster,
	}
}

// ============================================================================
//  Listener
// ============================================================================

func (c *Client) getID() string {
	return c.id
}

func (c *Client) listen() {
	for {
		var op graph.Operation
		if err := c.conn.ReadJSON(&op); err != nil {
			c.broadcaster.removeListener(c)
			break
		}
		c.broadcaster.broadcastOperation(op)
	}
}

func (c *Client) sendID() {
	msg := struct {
		Type     string `json:"type"`
		ClientID string `json:"clientId"`
	}{
		Type:     "clientId",
		ClientID: c.id,
	}
	c.conn.WriteJSON(msg)
}

func (c *Client) sendOperation(op graph.Operation) {
	c.conn.WriteJSON(op)
}

func (c *Client) sendSnapshot(state *graph.State) {
	msg := struct {
		Type  string       `json:"type"`
		State *graph.State `json:"state"`
	}{
		Type:  "snapshot",
		State: state,
	}
	c.conn.WriteJSON(msg)
}
