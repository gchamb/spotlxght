package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Song struct {
	gorm.Model
	ID string `gorm:"primaryKey"`
	UserID string 
	Name string
	Cover string
	AzureBlobID string
	FileType string
	UploadedAt *time.Time
	IsPublic bool
	Tags []Tag `gorm:"many2many:song_tags"`
	Votes []User `gorm:"many2many:song_votes"`
}

type Tag struct {
	gorm.Model
	ID string `gorm:"primaryKey"`
	Name string `gorm:"not null"`
}


func (song *Song) BeforeCreate(db *gorm.DB) error {
	song.ID = uuid.New().String()
	return nil
}
func (tag *Tag) BeforeCreate(db *gorm.DB) error {
	tag.ID = uuid.New().String()
	return nil
}