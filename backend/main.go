package main

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	db := database.ConnectDB()

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		write, err := w.Write([]byte("How are you?"))
		if err != nil {
			fmt.Println(write)
		}
	})

	router.Get("/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		var user models.User
		db.First(&user, "id = ?", id)

		w.Header().Set("Content-Type", "application/json")
		if json.NewEncoder(w).Encode(user) != nil {
			panic("Error encoding user json")
		}
	})

	fmt.Println("Listening on port 3000...")
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		fmt.Println(err)
		return
	}
}
