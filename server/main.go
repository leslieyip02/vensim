package main

import (
	"log"
	"net/http"
	"strings"

	"server/env"
	"server/room"
	"server/sim"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/ory/graceful"
)

func main() {
	_ = godotenv.Load()

	port := env.GetOrDefault("PORT", "8080")
	allowedOrigins := strings.Split(
		env.GetOrDefault("CORS_ORIGINS", "http://localhost:5173"), ",",
	)

	r := chi.NewRouter()
	configureRouter(r, allowedOrigins)
	configureRoomManager(r)
	configureSimulation(r)
	configureFileServer(r)
	run(r, port)
}

func configureRouter(r *chi.Mux, allowedOrigins []string) {
	corsHandler := cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	})

	r.Use(corsHandler)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
}

func configureRoomManager(r *chi.Mux) {
	rm := room.NewRoomManager()
	r.Post("/api/room/create", rm.CreateRoom)
	r.Get("/api/room/{roomId}", rm.CheckRoom)
	r.Get("/ws/room/{roomId}", rm.JoinRoom)
}

func configureSimulation(r *chi.Mux) {
	r.Post("/api/simulate", sim.RunSimulation)
}

func configureFileServer(r *chi.Mux) {
	dist := http.Dir("./dist")
	fs := http.FileServer(dist)

	r.Handle("/assets/*", fs)
	r.NotFound(func(w http.ResponseWriter, req *http.Request) {
		req.URL.Path = "/"
		fs.ServeHTTP(w, req)
	})
}

func run(r *chi.Mux, port string) {
	addr := ":" + port
	server := graceful.WithDefaults(&http.Server{
		Addr:    addr,
		Handler: r,
	})

	log.Printf("main: listening on %s", addr)
	if err := graceful.Graceful(server.ListenAndServe, server.Shutdown); err != nil {
		log.Fatalln("main: failed to shutdown")
	}
	log.Println("main: shutdown gracefully")
}
