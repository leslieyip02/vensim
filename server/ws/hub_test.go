package ws

import (
	"server/graph"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

type MockClient struct {
	id                 string
	listenCalled       chan struct{}
	gotID              bool
	gotSnapshot        bool
	operationsSent     []graph.Operation
	operationsReceived chan struct{}
}

func (c *MockClient) getID() string {
	return c.id
}

func (c *MockClient) listen() {
	close(c.listenCalled)
}

func (c *MockClient) sendID() {
	c.gotID = true
}

func (c *MockClient) sendSnapshot(_ *graph.State) {
	c.gotSnapshot = true
}

func (c *MockClient) sendOperation(op graph.Operation) {
	c.operationsSent = append(c.operationsSent, op)
	c.operationsReceived <- struct{}{}
}

func newMockClient(id string) *MockClient {
	return &MockClient{
		id:                 id,
		listenCalled:       make(chan struct{}),
		operationsReceived: make(chan struct{}, 1),
	}
}

func TestHub_BroadcastSkipsSender(t *testing.T) {
	state := graph.NewState()

	c1 := newMockClient("client-1")
	c2 := newMockClient("client-2")

	originalNewClient := newClient
	defer func() { newClient = originalNewClient }()

	index := 0
	mockClients := []*MockClient{c1, c2}
	newClient = func(_ *websocket.Conn, _ Broadcaster) Listener {
		c := mockClients[index]
		index++
		return c
	}

	hub := NewHub("room-1", state)
	go hub.Run()

	hub.Register(nil)
	select {
	case <-c1.listenCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c1 failed to start listening")
	}

	hub.Register(nil)
	select {
	case <-c2.listenCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c2 failed to start listening")
	}

	op := graph.Operation{SenderId: "client-1"}
	hub.broadcastOperation(op)

	select {
	case <-c2.operationsReceived:
		// receiver got it
	case <-time.After(time.Second):
		t.Fatal("receiver did not receive op")
	}

	if len(c1.operationsSent) != 0 {
		t.Fatal("sender should not receive op")
	}
}
