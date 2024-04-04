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

		// test create users
		user1 := models.User{Email: "test@gmail.com", Username: "G", ProfilePic: "123"}
		user2 := models.User{Email: "test2@gmail.com", Username: "G", ProfilePic: "123"}
		db.Create(&user1)
		db.Create(&user2)

		
		// test if the user has any associations
		// err := db.Model(models.User{}).Association("Followers").Error
		
		// if err != nil {
		// 	fmt.Println("ERROR", err.Error())
		// }
		
		// query user
		// var user models.User
		// var user2 models.User
		// db.Model(models.User{}).Where("id = ?", "8f5ea79f-3c58-48f7-9d4d-1be52390561d").First(&user)
		
	
		// this is the part that is erroring
		user1.Followers = append(user1.Followers, &user2)
		db.Save(&user1)
		// fmt.Println(user2)
		// 175d56e8-3836-400c-89a8-5c6ac73b14f1
		// followers.Append(&models.Follow{UserID: user1.ID, FollowerID: user2.ID})
		// test following
		// fmt.Print(t)

		// db.Create(&models.Follow{FollowingUserID: user1.ID, FollowedUserID: user2.ID})

		write, err := w.Write([]byte("Testing"))
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
