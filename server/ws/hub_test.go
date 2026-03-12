package ws

import (
	"encoding/json"
	"server/graph"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

type MockClient struct {
	id                    string
	listenCalled          chan struct{}
	sendIDCalled          chan struct{}
	envelopesReceived     chan struct{}
	snapshotsReceived     chan struct{}
	leaveMessagesReceived chan string
}

func (c *MockClient) getID() string {
	return c.id
}

func (c *MockClient) listen() {
	close(c.listenCalled)
}

func (c *MockClient) sendID() {
	close(c.sendIDCalled)
}

func (c *MockClient) sendSnapshot(_ *graph.State) {
	c.snapshotsReceived <- struct{}{}
}

func (c *MockClient) sendEnvelope(envelope Envelope) {
	c.envelopesReceived <- struct{}{}
}

func (c *MockClient) sendLeaveMessage(clientId string) {
	c.leaveMessagesReceived <- clientId
}

func newMockClient(id string) *MockClient {
	return &MockClient{
		id:                    id,
		listenCalled:          make(chan struct{}),
		sendIDCalled:          make(chan struct{}),
		envelopesReceived:     make(chan struct{}, 1),
		snapshotsReceived:     make(chan struct{}, 1),
		leaveMessagesReceived: make(chan string, 1),
	}
}

func TestHub_RegisterUnregisterClient(t *testing.T) {
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

	hub := NewHub("room-1", state, func() {})
	go hub.Run()
	t.Cleanup(func() { hub.close() })

	hub.Register(nil)
	select {
	case <-c1.listenCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c1 failed to start listening")
	}
	select {
	case <-c1.sendIDCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c1 didn't receive ID")
	}
	select {
	case <-c1.snapshotsReceived:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c1 didn't receive snapshot")
	}

	hub.Register(nil)
	select {
	case <-c2.listenCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c2 failed to start listening")
	}
	select {
	case <-c2.sendIDCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c2 didn't receive ID")
	}
	select {
	case <-c2.snapshotsReceived:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c2 didn't receive snapshot")
	}

	hub.removeListener(c1)
	select {
	case leaveID := <-c2.leaveMessagesReceived:
		if leaveID != c1.getID() {
			t.Fatal("c1 leave message not sent")
		}
	case <-time.After(time.Second):
		t.Fatal("c1 leave message not sent")
	}
}

func TestHub_Broadcast(t *testing.T) {
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

	hub := NewHub("room-1", state, func() {})
	go hub.Run()
	t.Cleanup(func() { hub.close() })

	hub.Register(nil)
	hub.Register(nil)

	op := graph.Operation{Clock: 1}
	encoded, _ := json.Marshal(op)
	envelope := Envelope{
		Type:     "graph",
		SenderID: "client-1",
		Data:     encoded,
	}
	hub.broadcast(envelope)

	select {
	case <-c2.envelopesReceived:
		// receiver got it
	case <-time.After(time.Second):
		t.Fatal("receiver did not receive op")
	}

	select {
	case <-c1.envelopesReceived:
		t.Fatal("sender should not receive op")
	case <-time.After(time.Second):
		// ok
	}
}

func TestHub_BroadcastOutdatedOperation(t *testing.T) {
	state := graph.NewState()
	state.Clock = 10

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

	hub := NewHub("room-1", state, func() {})
	go hub.Run()
	t.Cleanup(func() { hub.close() })

	hub.Register(nil)
	hub.Register(nil)

	// drain initial snapshot
	select {
	case <-c1.snapshotsReceived:
		// ok
	case <-time.After(time.Second):
		t.Fatal("c1 didn't receive snapshot")
	}

	op := graph.Operation{Clock: 1}
	encoded, _ := json.Marshal(op)
	envelope := Envelope{
		Type:     "graph",
		SenderID: "client-1",
		Data:     encoded,
	}
	hub.broadcast(envelope)

	select {
	case <-c2.envelopesReceived:
		t.Fatal("other client should not received outdated op")
	case <-time.After(time.Second):
		// ok
	}

	select {
	case <-c1.snapshotsReceived:
		// ok
	case <-time.After(time.Second):
		t.Fatal("hub should sync client")
	}
}

func TestHub_AutoShutdown(t *testing.T) {
	// mock
	shutdownTimeout = 100 * time.Millisecond

	state := graph.NewState()

	closed := make(chan struct{})
	hub := NewHub("room-1", state, func() {
		close(closed)
	})

	go hub.Run()
	t.Cleanup(func() { hub.close() })

	c := newMockClient("client-1")

	originalNewClient := newClient
	defer func() { newClient = originalNewClient }()
	newClient = func(_ *websocket.Conn, _ Broadcaster) Listener {
		return c
	}

	hub.Register(nil)
	<-c.listenCalled

	select {
	case <-closed:
		t.Fatal("hub closed while client was still connected")
	case <-time.After(shutdownTimeout + 50*time.Millisecond):
		// success
	}

	hub.unregisterClient(c)
}
