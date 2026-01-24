package ws

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"server/graph"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

type MockHub struct {
	broadcastChannel chan graph.Operation
	unregisterCalled chan struct{}
}

func (h *MockHub) addListener(_ Listener) {}

func (h *MockHub) removeListener(_ Listener) {
	if h.unregisterCalled != nil {
		h.unregisterCalled <- struct{}{}
	}
}

func (h *MockHub) broadcastOperation(op graph.Operation) {
	h.broadcastChannel <- op
}

func newTestServer(t *testing.T, handler func(*websocket.Conn)) *httptest.Server {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool { return true },
	}

	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Fatalf("upgrade failed: %v", err)
		}
		handler(conn)
	}))
}

func TestNewClient_Success(t *testing.T) {
	newClientID = func() (string, error) {
		return "client-1", nil
	}

	c := newClient(nil, nil)
	if c == nil {
		t.Fatal("expected client, got nil")
	}

	if c.getID() != "client-1" {
		t.Fatalf("unexpected id: %s", c.getID())
	}
}

func TestNewClient_IDFailure(t *testing.T) {
	originalNewClientID := newClientID
	defer func() { newClientID = originalNewClientID }()

	newClientID = func() (string, error) {
		return "", errors.New("newClientID failed")
	}

	c := newClient(nil, nil)
	if c != nil {
		t.Fatal("expected nil client on error")
	}
}

func TestClient_Listen(t *testing.T) {
	hub := &MockHub{
		broadcastChannel: make(chan graph.Operation, 1),
		unregisterCalled: make(chan struct{}, 1),
	}

	server := newTestServer(t, func(conn *websocket.Conn) {
		client := newClient(conn, hub)
		go client.listen()
	})
	defer server.Close()

	u := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()

	op := graph.Operation{Type: "addNode"}
	conn.WriteJSON(op)

	select {
	case received := <-hub.broadcastChannel:
		if received.Type != op.Type {
			t.Fatalf("unexpected op")
		}
	case <-time.After(time.Second):
		t.Fatal("did not receive broadcast")
	}
}

func TestClient_SendID(t *testing.T) {
	server := newTestServer(t, func(conn *websocket.Conn) {
		client := &Client{
			id:          "client-1",
			conn:        conn,
			broadcaster: nil,
		}

		client.sendID()
	})

	defer server.Close()

	u := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		t.Fatalf("dial failed: %v", err)
	}
	defer conn.Close()

	var msg struct {
		Type     string `json:"type"`
		ClientID string `json:"clientId"`
	}

	if err := conn.ReadJSON(&msg); err != nil {
		t.Fatalf("read failed: %v", err)
	}

	if msg.Type != "clientId" || msg.ClientID != "client-1" {
		t.Fatalf("unexpected message: %+v", msg)
	}
}

func TestClient_SendOperation(t *testing.T) {
	op := graph.Operation{Type: "addNode"}

	server := newTestServer(t, func(conn *websocket.Conn) {
		client := &Client{conn: conn}
		client.sendOperation(op)
	})
	defer server.Close()

	u := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, _, _ := websocket.DefaultDialer.Dial(u, nil)

	var received graph.Operation
	conn.ReadJSON(&received)

	if received.Type != op.Type {
		t.Fatalf("unexpected operation: %+v", received)
	}
}

func TestClient_SendSnapshot(t *testing.T) {
	state := graph.NewState()

	server := newTestServer(t, func(conn *websocket.Conn) {
		client := &Client{conn: conn}
		client.sendSnapshot(state)
	})
	defer server.Close()

	u := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, _, _ := websocket.DefaultDialer.Dial(u, nil)

	var msg struct {
		Type  string       `json:"type"`
		State *graph.State `json:"state"`
	}
	conn.ReadJSON(&msg)

	if msg.Type != "snapshot" || msg.State == nil {
		t.Fatalf("unexpected snapshot message")
	}
}
