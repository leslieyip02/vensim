package room

import (
	"encoding/json"
	"net/http"
	"server/graph"
	"server/id"
	"server/ws"

	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
)

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

	roomID, err := id.NewShortId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	hub := ws.NewHub(req.State)
	go hub.Run()

	rm.mu.Lock()
	rm.rooms[roomID] = hub
	rm.mu.Unlock()

	json.NewEncoder(w).Encode(map[string]string{
		"roomId": roomID,
	})
}

func (rm *RoomManager) JoinRoom(w http.ResponseWriter, r *http.Request) {
	roomID := chi.URLParam(r, "roomId")
	if roomID == "" {
		http.Error(w, "missing roomId", http.StatusBadRequest)
		return
	}

	rm.mu.RLock()
	hub := rm.rooms[roomID]
	rm.mu.RUnlock()
	if hub == nil {
		http.Error(w, "room not found", http.StatusNotFound)
		return
	}

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "could not connect", http.StatusInternalServerError)
		return
	}

	client := ws.NewClient(conn, hub)
	hub.Register(client)
}
