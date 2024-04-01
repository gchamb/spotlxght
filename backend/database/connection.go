package database

import (
	"backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectDB() (db *gorm.DB) {
	dsn := "root:password@(mysql_db)/tbd"
	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: dsn,
		DefaultStringSize: 255,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		
	})

	if err != nil {
		panic("failed to connect database")
	}

	// create tables if not created 
	err = db.AutoMigrate(&models.User{})

	if err != nil {
		panic("failed to auto migrate")
	}


	return db
}
