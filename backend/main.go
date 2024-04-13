package main

import (
	"backend/database"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	db := database.ConnectDB()

	fmt.Printf("The %s database has been initialized.\n", db.Name())

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		write, err := w.Write([]byte("Server is up!"))
		if err != nil {
			fmt.Println(write)
		}
	})

	var port string
	if port = os.Getenv("PORT"); port == ""{
		panic("The environment variable PORT wasn't provided.")
	}

	fmt.Printf("Listening on port %s....\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), router)
	if err != nil {
		fmt.Println(err)
		return
	}
}
