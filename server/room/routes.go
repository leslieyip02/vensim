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

func (rm *RoomManager) JoinRoom(w http.ResponseWriter, r *http.Request) {
	roomID := chi.URLParam(r, "roomId")
	if roomID == "" {
		http.Error(w, "missing roomId", http.StatusBadRequest)
		return
	}

	room := rm.getRoom(roomID)
	if room == nil {
		http.Error(w, "room not found", http.StatusNotFound)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "could not connect", http.StatusInternalServerError)
		return
	}

	room.Register(conn)
}
