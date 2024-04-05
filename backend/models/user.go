package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID         uuid.UUID `gorm:"primarykey;type:varchar(36);default:(uuid())"`
	Email      string    `gorm:"unique; not null"`
	Password   string
	Username   string
	ProfilePic string
	Songs      []Song
	Likes      []*Song `gorm:"many2many:song_votes"`
	Dislikes   []*Song `gorm:"many2many:song_votes"`
	Followers  []*User `gorm:"many2many:user_followers;constraint:OnDelete:CASCADE;"`
}
