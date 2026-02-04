package room

import (
	"fmt"
	"server/graph"
	"server/ws"
	"testing"
)

func setupTest(t *testing.T) (teardownFunc func()) {
	t.Helper()

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

	return func() {
		t.Helper()

		newRoom = originalNewRoom
		newRoomID = originalNewRoomID
	}
}

func TestGetRoom_Exists(t *testing.T) {
	tearDown := setupTest(t)
	defer func() { tearDown() }()

	sut := NewRoomManager()
	sut.createRoom(nil)

	if len(sut.rooms) != 1 {
		t.Error("expected 1 room to be created")
	}

	got := sut.getRoom("room-1")
	if got == nil || got.GetID() != "room-1" {
		t.Errorf("want room-1 but got %v", got)
	}
}

func TestGetRoom_NotExists(t *testing.T) {
	tearDown := setupTest(t)
	defer func() { tearDown() }()

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
	tearDown := setupTest(t)
	defer func() { tearDown() }()

	sut := NewRoomManager()
	sut.createRoom(nil)

	if len(sut.rooms) != 1 {
		t.Error("expected 1 room to be created")
	}

	got := sut.getRoom("room-1")
	if got == nil || got.GetID() != "room-1" {
		t.Errorf("want room-1 but got %v", got)
	}

	sut.destroyRoom("room-1")

	got = sut.getRoom("room-1")
	if got != nil {
		t.Errorf("want nil but got %v", got.GetID())
	}
}
