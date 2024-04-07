package database

import (
	"backend/models"

	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)


func ConnectDB() (*gorm.DB) {
	var dsn string
	if dsn = os.Getenv("MYSQL_CONNECTION_STRING"); dsn == "" {
		panic("MySQL connection string hasn't been provided.")
	}
	
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