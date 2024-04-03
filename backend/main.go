package main

import (
	"backend/database"
	"backend/models"
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

	router.Get("/add-user", func(w http.ResponseWriter, r *http.Request) {

		// test create user
		user1 := models.User{ID: "3c1242ad-652f-4198-8e9d-18e1e211dfb8", Email: "test@gmail.com", Password: "123", Username: "G", ProfilePic: "123"}
		user2 := models.User{ID: "c443d920-3886-42d4-a803-ee23ad08d624", Email: "test2@gmail.com", Password: "123", Username: "G", ProfilePic: "123"}

		// db.Create(&user1)
		// db.Create(&user2)
		followers := db.Model(&user1).Association("Followers")
		followers.Append(&models.Follow{UserID: user1.ID, FollowerID: user2.ID})
		// test following
		// fmt.Print("hi")

		// db.Create(&models.Follow{FollowingUserID: user1.ID, FollowedUserID: user2.ID})

		write, err := w.Write([]byte("Added User"))
		if  err != nil {
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
