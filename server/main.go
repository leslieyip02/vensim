package main

import (
	"flag"
	"log"
	"net/http"

	"server/env"
	"server/room"
	"server/sim"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	host := flag.String("host", env.GetOrDefault("HOST", "0.0.0.0"), "host")
	port := flag.String("port", env.GetOrDefault("PORT", "8080"), "port")
	flag.Parse()

	rm := room.NewRoomManager()

	corsHandler := cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	})

	r := chi.NewRouter()
	r.Use(corsHandler)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Post("/create", rm.CreateRoom)
	r.Get("/join/{roomId}", rm.JoinRoom)

	r.Post("/simulate", sim.RunSimulation)

	addr := *host + ":" + *port
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}
