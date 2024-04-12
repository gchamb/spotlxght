package main

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"gorm.io/gorm"
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

	// create users
	// user := models.User{
	// 	Email: "test@gmail.com",
	// 	Password: "123",
	// 	ProfilePic: "123",
	// }

	// user2 := models.User{
	// 	Email: "test12@gmail.com",
	// 	Password: "123",
	// 	ProfilePic: "123",
	// }

	// db.Create(&user)
	// db.Create(&user2)
		
	// // create a follower
	// db.Create(&models.Follow{
	// 	FollowedID: user.ID ,
	// 	FollowerID: user2.ID,
	// })
	

	// create a song
	// var user models.User
	// db.Take(&user)

	// db.Create(&models.Song{
	// 	Name: "test songs",
	// 	Cover: "cover 123",
	// 	AzureBlobID: "123",
	// 	IsPublic: false,
	// 	UserID: user.ID,
	// })

	// fmt.Println("Hello world")

	// create tags
	// PopulateTags(db)

	
	// create a song with tags
	// var song models.Song
	// db.Take(&song)

	// var tag models.Tag
	// db.Take(&tag)
	
	// db.Create(&models.SongTag{
	// 	SongID: song.ID,
	// 	TagID: tag.ID,
	// })

	// create a song vote
	// var song models.Song
	// db.Take(&song)

	// var user models.User
	// db.Take(&user)

	// db.Create(&models.SongVote{
	// 	SongID: song.ID,
	// 	UserID: user.ID,
	// 	IsLiked: false,
	// })

	fmt.Println("Listening on port 3000...")
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func PopulateTags(db *gorm.DB){
	tags := []*models.Tag{
		&models.Tag{
			Name: "Hip Hop",
		},
		&models.Tag{
			Name: "Pop",
		},
		&models.Tag{
			Name: "Rock",
		},
	}

	db.Create(&tags)
}
