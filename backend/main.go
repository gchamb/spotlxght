package main

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"

	"gorm.io/gorm"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Handler struct {
	DB *gorm.DB
}

func main() {
	db := database.ConnectDB()
	//h := Handler{DB: db}

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

	//h.addFollower("a7b49bc9-f30c-11ee-8675-0242ac130002", "2cb9eef6-f36d-11ee-ab47-0242ac130002")
	//h.addFollowers("a7b49bc9-f30c-11ee-8675-0242ac130002",
	//	"2cb9eef6-f36d-11ee-ab47-0242ac130002",
	//	"c4e7e431-f30c-11ee-8675-0242ac130002")

	//h.printFollowers("a7b49bc9-f30c-11ee-8675-0242ac130002")

	//db.Create(&models.Song{
	//	UserID:      uuid.MustParse("4ad223b9-f397-11ee-b19f-0242ac130002"),
	//	Name:        "Sing me song",
	//	Cover:       "Da cover",
	//	AzureBlobID: "whoo",
	//	FileType:    "mp3",
	//	IsPublic:    true,
	//	Tags:        nil,
	//	Votes:       nil,
	//})

	//var song models.Song
	//db.First(&song, "id = ?", uuid.MustParse("971cd715-f399-11ee-b19f-0242ac130002"))

	//tag := models.Tag{
	//	Name: "Rock",
	//	Songs: []*models.Song{
	//		{
	//			UserID:      uuid.MustParse("4ad223b9-f397-11ee-b19f-0242ac130002"),
	//			Name:        "New Song",
	//			Cover:       "New Cover",
	//			AzureBlobID: "blob",
	//			FileType:    "Type",
	//			IsPublic:    false,
	//		},
	//		{
	//			UserID:      uuid.MustParse("4ad223b9-f397-11ee-b19f-0242ac130002"),
	//			Name:        "New Song 2",
	//			Cover:       "New Cover 2",
	//			AzureBlobID: "blob 2",
	//			FileType:    "Type 2",
	//			IsPublic:    false,
	//		}},
	//}
	//db.Create(&tag)
	//fmt.Println("Created tag")

	db.Create(&models.User{
		Email:      "newemail@gmail.com",
		Password:   "pass",
		Username:   "uhiji",
		ProfilePic: "sun",
	})

	db.Create(&models.Song{
		UserID: uuid.MustParse("018eb15d-a273-7333-817f-e9ffbc0aaf2e"),
		Name:   "another song",
		Cover:  "cover",
	})

	//song := models.Song{ID: uuid.MustParse("971cd715-f399-11ee-b19f-0242ac130002")}
	//rockTag := models.Tag{ID: uuid.MustParse("971cd715-f399-11ee-b19f-0242ac130002")}
	//db.Model(&song).Association("Tags").Append(&rockTag)

	fmt.Println("Listening on port 3000...")
	err := http.ListenAndServe(":3000", router)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func (h *Handler) createSong(song models.Song) {
	h.DB.Create(&song)
}

func (h *Handler) createUser(user models.User) {
	h.DB.Create(&user)
}

func (h *Handler) addFollower(userID, followerID string) {
	var followed models.User
	if err := h.DB.First(&followed, "id = ?", userID).Error; err != nil {
		panic("User being followed not found")
	}

	var following models.User
	if err := h.DB.First(&following, "id = ?", followerID).Error; err != nil {
		panic("Following user not found")
	}

	if err := h.DB.Model(&followed).Association("Followers").Append(&following); err != nil {
		panic("Error adding follower to user")
	}
	fmt.Printf("Added follower %v to user %v\n", followerID, userID)
}

func (h *Handler) addFollowers(userID string, followerIDs ...string) {
	var followed models.User
	if err := h.DB.First(&followed, "id = ?", userID).Error; err != nil {
		panic("User being followed not found")
	}

	followers := make([]models.User, len(followerIDs))
	for i, followerID := range followerIDs {
		var follower models.User
		if err := h.DB.First(&follower, "id = ?", followerID).Error; err != nil {
			panic("Following user not found: " + followerID)
		}
		followers[i] = follower
	}

	if err := h.DB.Model(&followed).Association("Followers").Append(followers); err != nil {
		panic("Error adding followers to user")
	}
	fmt.Printf("Added followers %v to user %v\n", followerIDs, userID)
}

func (h *Handler) printFollowers(userID string) {
	var user models.User
	h.DB.First(&user, "id = ?", userID)
	var userFollowers []models.User
	h.DB.Model(&user).Association("Followers").Find(&userFollowers)

	followerBytes, err := json.MarshalIndent(userFollowers, "", "\t")
	if err != nil {
		panic("Error marshalling userFollowers")
	}
	fmt.Printf("User's followers: %v\n", string(followerBytes))
}
