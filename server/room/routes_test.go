package room

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"server/graph"
	"strings"
	"testing"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

type MockRoom struct {
	id             string
	runCalled      chan struct{}
	registerCalled bool
}

func (r *MockRoom) GetID() string {
	return r.id
}

func (r *MockRoom) Register(_ *websocket.Conn) {
	r.registerCalled = true
}

func (r *MockRoom) Run() {
	close(r.runCalled)
}

func TestCreateRoom_Success(t *testing.T) {
	rm := NewRoomManager()

	originalNewRoomID := newRoomID
	originalNewRoom := newRoom
	defer func() {
		newRoomID = originalNewRoomID
		newRoom = originalNewRoom
	}()

	room := &MockRoom{
		runCalled: make(chan struct{}),
	}
	newRoomID = func() (string, error) {
		return "room-1", nil
	}
	newRoom = func(id string, state *graph.State) Room {
		if state == nil {
			t.Fatal("expected non-nil state")
		}

		room.id = id
		return room
	}

	body := bytes.NewBufferString(`{}`)
	req := httptest.NewRequest(http.MethodPost, "/rooms", body)
	w := httptest.NewRecorder()

	rm.CreateRoom(w, req)

	res := w.Result()
	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.StatusCode)
	}

	var response map[string]string
	json.NewDecoder(res.Body).Decode(&response)

	if response["roomId"] != "room-1" {
		t.Fatalf("unexpected roomId: %v", response)
	}

	if rm.rooms["room-1"] == nil {
		t.Fatal("room not stored in manager")
	}

	select {
	case <-room.runCalled:
		// ok
	case <-time.After(time.Second):
		t.Fatal("room.Run was not called")
	}
}

func TestCreateRoom_InvalidJSON(t *testing.T) {
	rm := NewRoomManager()

	req := httptest.NewRequest(
		http.MethodPost,
		"/rooms",
		bytes.NewBufferString("{invalid"),
	)
	w := httptest.NewRecorder()

	rm.CreateRoom(w, req)

	if w.Result().StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400")
	}
}

func TestCreateRoom_IDFailure(t *testing.T) {
	rm := NewRoomManager()

	originalNewRoom := newRoom
	defer func() { newRoom = originalNewRoom }()
	newRoomID = func() (string, error) {
		return "", errors.New("newRoomID failed")
	}

	req := httptest.NewRequest(
		http.MethodPost,
		"/rooms",
		bytes.NewBufferString(`{}`),
	)
	w := httptest.NewRecorder()

	rm.CreateRoom(w, req)

	if w.Result().StatusCode != http.StatusInternalServerError {
		t.Fatalf("expected 500")
	}
}

func TestJoinRoom_MissingRoomID(t *testing.T) {
	rm := NewRoomManager()

	req := httptest.NewRequest(http.MethodGet, "/rooms//join", nil)
	w := httptest.NewRecorder()

	rm.JoinRoom(w, req)

	if w.Result().StatusCode != http.StatusBadRequest {
		t.Fatalf("expected 400")
	}
}

func TestJoinRoom_RoomNotFound(t *testing.T) {
	rm := NewRoomManager()

	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("roomId", "room-2")

	req := httptest.NewRequest(http.MethodGet, "/rooms/nope/join", nil)
	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

	w := httptest.NewRecorder()

	rm.JoinRoom(w, req)

	if w.Result().StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404")
	}
}

func TestJoinRoom_WebSocketSuccess(t *testing.T) {
	rm := NewRoomManager()

	originalNewRoomID := newRoomID
	originalNewRoom := newRoom
	defer func() {
		newRoomID = originalNewRoomID
		newRoom = originalNewRoom
	}()

	newRoomID = func() (string, error) {
		return "room-1", nil
	}
	room := &MockRoom{}
	newRoom = func(id string, state *graph.State) Room {
		if state == nil {
			t.Fatal("expected non-nil state")
		}

		room.id = id
		return room
	}
	state := graph.State{}
	rm.createRoom(&state)

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.NewRouteContext()
		rctx.URLParams.Add("roomId", "room-1")
		r = r.WithContext(context.WithValue(r.Context(), chi.RouteCtxKey, rctx))
		rm.JoinRoom(w, r)
	}))
	defer server.Close()

	u := "ws" + strings.TrimPrefix(server.URL, "http")
	_, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		t.Fatalf("websocket dial failed: %v", err)
	}

	if !room.registerCalled {
		t.Fatal("expected client to be registered")
	}
}
