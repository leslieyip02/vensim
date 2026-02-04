package room

import (
	"fmt"
	"os"
	"server/graph"
	"server/ws"
	"testing"
)

func TestMain(m *testing.M) {
	originalNewRoom := newRoom
	originalNewRoomID := newRoomID

	newRoom = func(id string, state *graph.State, onClose func()) Room {
		return ws.NewHub(id, state, onClose)
	}

	index := 1
	newRoomID = func() (string, error) {
		id := fmt.Sprintf("room-%d", index)
		index++
		return id, nil
	}

	code := m.Run()

	newRoom = originalNewRoom
	newRoomID = originalNewRoomID

	os.Exit(code)
}

func TestGetRoom_Exists(t *testing.T) {
	sut := NewRoomManager()
	sut.createRoom(nil)

	if len(sut.rooms) != 1 {
		t.Error("expected 1 room to be created")
	}

	want := "room-1"
	got := sut.getRoom("room-1")
	if got.GetID() != want {
		t.Errorf("want %v but got %v", want, got.GetID())
	}
}

func TestGetRoom_NotExists(t *testing.T) {
	sut := NewRoomManager()

	if len(sut.rooms) != 0 {
		t.Error("expected no rooms")
	}

	got := sut.getRoom("room-1")
	if got != nil {
		t.Errorf("want nil but got %v", got.GetID())
	}
}

func TestDestroyRoom(t *testing.T) {
	sut := NewRoomManager()
	sut.createRoom(nil)

	if len(sut.rooms) != 1 {
		t.Error("expected 1 room to be created")
	}

	want := "room-1"
	got := sut.getRoom("room-1")
	if got.GetID() != want {
		t.Errorf("want %v but got %v", want, got.GetID())
	}

	sut.destroyRoom("room-1")

	got = sut.getRoom("room-1")
	if got != nil {
		t.Errorf("want nil but got %v", got.GetID())
	}
}
