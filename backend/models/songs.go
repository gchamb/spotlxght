package models

import (
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
	FileType    string // TODO: Add enum or many to many table
	IsPublic    bool
	Tags        []*Tag  `gorm:"many2many:song_tags"`
	Votes       []*User `gorm:"many2many:song_votes"`
}

func (song *Song) BeforeCreate(db *gorm.DB) error {
	id, err := uuid.NewV7()
	if err != nil {
		return err
	}
	song.ID = id
	return nil
}
