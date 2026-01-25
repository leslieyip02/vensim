package room

import (
	"server/graph"
	"server/ws"

	"github.com/gorilla/websocket"
)

type Room interface {
	GetID() string
	Run()
	Register(conn *websocket.Conn)
}

var newRoom = func(id string, state *graph.State) Room {
	return ws.NewHub(id, state)
}
