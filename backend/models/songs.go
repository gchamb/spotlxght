package models

import (
	"time"

	"gorm.io/gorm"

	"github.com/google/uuid"
)

type Song struct {
	gorm.Model
	ID          uuid.UUID `gorm:"primarykey;type:varchar(36);default:(uuid())"`
	UserID      uuid.UUID
	Name        string
	Cover       string
	AzureBlobID string
	FileType    string
	UploadedAt  time.Time
	IsPublic    bool
	Tags        []*Tag  `gorm:"many2many:song_tags"`
	Votes       []*User `gorm:"many2many:song_votes"`
}
