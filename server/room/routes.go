package room

import (
	"encoding/json"
	"net/http"
	"server/graph"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (rm *RoomManager) CreateRoom(w http.ResponseWriter, r *http.Request) {
	var req struct {
		State *graph.State `json:"state"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if req.State == nil {
		req.State = graph.NewState()
	}

	room, err := rm.createRoom(req.State)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	go room.Run()

	json.NewEncoder(w).Encode(map[string]string{
		"roomId": room.GetID(),
	})
}

func (rm *RoomManager) findRoom(w http.ResponseWriter, r *http.Request) Room {
	roomID := chi.URLParam(r, "roomId")
	if roomID == "" {
		http.Error(w, "Room ID is required", http.StatusBadRequest)
		return nil
	}
	room := rm.getRoom(roomID)
	if room == nil {
		http.Error(w, "This room does not exist or has been closed", http.StatusNotFound)
		return nil
	}
	return room
}

func (rm *RoomManager) CheckRoom(w http.ResponseWriter, r *http.Request) {
	if room := rm.findRoom(w, r); room != nil {
		w.WriteHeader(http.StatusOK)
	}
}

func (rm *RoomManager) JoinRoom(w http.ResponseWriter, r *http.Request) {
	room := rm.findRoom(w, r)
	if room == nil {
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	room.Register(conn)
}
