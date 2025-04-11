package database

import (
    "log"

    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "github.com/Blato122/E-biznes-2024.25/ex4/models"
)

var DB *gorm.DB

func Init() {
    var err error
    
    DB, err = gorm.Open(sqlite.Open("products.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    
    // Auto-migrate both Product and CartItem models
    err = DB.AutoMigrate(&models.Product{}, &models.CartItem{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    var productCount int64
    DB.Model(&models.Product{}).Count(&productCount)
    if productCount == 0 {
        products := []models.Product{
            {Name: "PC", Description: "High performance GPU", Price: 4999.99},
            {Name: "Smartphone", Description: "Latest smartphone model", Price: 899.99},
            {Name: "Smartwatch", Description: "Easily track your workouts", Price: 199.99},
        }
        
        for _, product := range products {
            DB.Create(&product)
        }
    }
}