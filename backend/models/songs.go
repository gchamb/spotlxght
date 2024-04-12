package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Song struct {
	gorm.Model
	ID          uuid.UUID `gorm:"primaryKey"`
	UserID      uuid.UUID `gorm:"not null;uniqueIndex:idx_user_id_name"`
	Name        string    `gorm:"not null;uniqueIndex:idx_user_id_name"`
	Cover       string
	AzureBlobID string
	IsPublic    bool
	User 		User	  `gorm:"foreignKey:UserID;references:ID"`
}

type SongTag struct {
	SongID uuid.UUID `gorm:"primaryKey"`
	TagID  uuid.UUID `gorm:"primaryKey"`
	Song   Song      `gorm:"foreignKey:SongID;references:ID"`
	Tag    Tag       `gorm:"foreignKey:TagID;references:ID"`
}

type SongVote struct {
	SongID    uuid.UUID `gorm:"primaryKey"`
	UserID    uuid.UUID `gorm:"primaryKey"`
	IsLiked   bool
	Song      Song `gorm:"foreignKey:SongID;references:ID"`
	User      User `gorm:"foreignKey:UserID;references:ID"`
	CreatedAt time.Time
}

func (song *Song) BeforeCreate(db *gorm.DB) error {
	id, err := uuid.NewV7()
	if err != nil {
		return err
	}
	song.ID = id
	return nil
}
