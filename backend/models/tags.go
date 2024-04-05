package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Tag struct {
	gorm.Model
	ID    uuid.UUID `gorm:"primarykey;type:varchar(36);default:(uuid())"`
	Name  string    `gorm:"not null"`
	Songs []*Song   `gorm:"many2many:song_tags"`
}
