package ws

import (
	"encoding/json"
	"log"
	"server/graph"
	"server/id"

	"github.com/gorilla/websocket"
)

type Envelope struct {
	Type     string          `json:"type"`
	SenderID string          `json:"senderId"`
	Data     json.RawMessage `json:"data"`
}

type Listener interface {
	getID() string
	listen()
	sendID()
	sendEnvelope(envelope Envelope)
	sendSnapshot(state *graph.State)
	sendLeaveMessage(clientId string)
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
		var envelope Envelope
		if err := c.conn.ReadJSON(&envelope); err != nil {
			log.Printf("Client %v: %v", c.getID(), err)
			c.broadcaster.removeListener(c)
			break
		}
		c.broadcaster.broadcast(envelope)
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

func (c *Client) sendEnvelope(envelope Envelope) {
	c.conn.WriteJSON(envelope)
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

func (c *Client) sendLeaveMessage(clientId string) {
	msg := struct {
		Type     string `json:"type"`
		ClientID string `json:"clientId"`
	}{
		Type:     "leave",
		ClientID: clientId,
	}
	c.conn.WriteJSON(msg)
}
