package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Tag struct {
	gorm.Model
	ID    uuid.UUID `gorm:"primaryKey;type:varchar(36);"`
	Name  string    `gorm:"not null; unique"`
}

func (tag *Tag) BeforeCreate(db *gorm.DB) error {
	id, err := uuid.NewV7()
	if err != nil {
		return err
	}
	tag.ID = id
	return nil
}
