package room

import (
	"log"
	"server/graph"
	"server/id"
	"sync"
)

var newRoomID = id.NewShortId

type RoomManager struct {
	rooms map[string]*Room
	mu    sync.RWMutex
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		rooms: make(map[string]*Room),
	}
}

func (rm *RoomManager) getRoom(roomID string) Room {
	rm.mu.RLock()
	defer rm.mu.RUnlock()

	room, found := rm.rooms[roomID]
	if !found {
		return nil
	}

	return *room
}

func (rm *RoomManager) createRoom(state *graph.State) (Room, error) {
	roomID, err := newRoomID()
	if err != nil {
		return nil, err
	}

	room := newRoom(roomID, state, func() {
		rm.destroyRoom(roomID)
	})

	rm.mu.Lock()
	rm.rooms[roomID] = &room
	rm.mu.Unlock()

	return room, nil
}

func (rm *RoomManager) destroyRoom(roomID string) {
	log.Printf("Destroying room %s", roomID)

	rm.mu.Lock()
	delete(rm.rooms, roomID)
	rm.mu.Unlock()
}
