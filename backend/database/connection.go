package database

import (
	"backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectDB() (db *gorm.DB) {
	dsn := "root:example@(mysql_db)/tbd?parseTime=true" // TODO: get credentials from env
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
