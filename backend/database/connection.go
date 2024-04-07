package database

import (
	"backend/models"
	// "encoding/json"
	// "fmt"

	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)


func ConnectDB() (*gorm.DB) {
	var dsn string
	if dsn = os.Getenv("MYSQL_CONNECTION_STRING"); dsn == "" {
		panic("MySQL connection string hasn't been provided.")
	}
	
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN:               dsn,
		DefaultStringSize: 255,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("Failed to connect to database.")
	}

	if err := db.AutoMigrate(&models.User{}, &models.Song{}, &models.Tag{}); err != nil {
		panic("Failed to auto migrate.")
	}

	return db
}


// func (db *gorm.DB) CreateUser(user models.User) {
// 	db.Create(&user)
// }

// func (db *gorm.DB) AddFollower(userID, followerID string) {
// 	var followed models.User
// 	if err := db.First(&followed, "id = ?", userID).Error; err != nil {
// 		panic("User being followed not found")
// 	}

// 	var following models.User
// 	if err := db.First(&following, "id = ?", followerID).Error; err != nil {
// 		panic("Following user not found")
// 	}

// 	if err := db.Model(&followed).Association("Followers").Append(&following); err != nil {
// 		panic("Error adding follower to user")
// 	}
// 	fmt.Printf("Added follower %v to user %v\n", followerID, userID)
// }

// func (db *gorm.DB) AddFollowers(userID string, followerIDs ...string) {
// 	var followed models.User
// 	if err := db.First(&followed, "id = ?", userID).Error; err != nil {
// 		panic("User being followed not found")
// 	}

// 	followers := make([]models.User, len(followerIDs))
// 	for i, followerID := range followerIDs {
// 		var follower models.User
// 		if err := db.First(&follower, "id = ?", followerID).Error; err != nil {
// 			panic("Following user not found: " + followerID)
// 		}
// 		followers[i] = follower
// 	}

// 	if err := db.Model(&followed).Association("Followers").Append(followers); err != nil {
// 		panic("Error adding followers to user")
// 	}
// 	fmt.Printf("Added followers %v to user %v\n", followerIDs, userID)
// }

// func (db *gorm.DB) PrintFollowers(userID string) {
// 	var user models.User
// 	db.First(&user, "id = ?", userID)
// 	var userFollowers []models.User
// 	db.Model(&user).Association("Followers").Find(&userFollowers)

// 	followerBytes, err := json.MarshalIndent(userFollowers, "", "\t")
// 	if err != nil {
// 		panic("Error marshalling userFollowers")
// 	}
// 	fmt.Printf("User's followers: %v\n", string(followerBytes))
// }

// func (db *gorm.DB) CreateSong(song models.Song) {
// 	db.Create(&song)
// }
