package models

import (
	// "time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID         string `gorm:"primaryKey"`
	Email      string `gorm:"unique; not null"`
	Password   string
	Username   string
	ProfilePic string
	Songs      []Song
	Follow     []User 	`gorm:"many2many:user_follows;ForeignKey:ID; References:ID""`
	Votes      []Song   `gorm:"many2many:song_votes;"`
	// User           User   `gorm:"ForeignKey:OrganizationID,UserName;References:OrganizationID,Name"`
}

// type Follow struct {
// 	FollowingUserID string `gorm:"primaryKey;"`
// 	FollowedUserID  string `gorm:"primaryKey;"`
// 	CreatedAt       *time.Time
// }


func (user *User) BeforeCreate(db *gorm.DB) error {
	user.ID = uuid.New().String()
	return nil
}

