package models

import (
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
	Votes      []Song   `gorm:"many2many:song_votes;constraint:OnDelete:CASCADE;"`
	// user_id => followed, follow_id => follower
	Followers  []*User `gorm:"many2many:user_followers;constraint:OnDelete:CASCADE;"`
}

type Follow struct {
	UserID string
	FollowerID string
}

func (user *User) BeforeCreate(db *gorm.DB) error {
	user.ID = uuid.New().String()
	return nil
}

