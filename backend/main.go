package main

import (
	"backend/database"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	db := database.ConnectDB()

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		write, err := w.Write([]byte("Server is up!"))
		if err != nil {
			fmt.Println(write)
		}
	})


	fmt.Println("Listening on port 3000...")
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		fmt.Println(err)
		return
	}
}
