package room

import (
	"server/ws"
	"sync"
)

type RoomManager struct {
	rooms map[string]*ws.Hub
	mu    sync.RWMutex
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		rooms: make(map[string]*ws.Hub),
	}
}
