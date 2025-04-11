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
    
    err = DB.AutoMigrate(&models.Product{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    var count int64
    DB.Model(&models.Product{}).Count(&count)
    if count == 0 {
        products := []models.Product{
            {Name: "Laptop", Description: "High performance laptop", Price: 999.99},
            {Name: "Smartphone", Description: "Latest smartphone model", Price: 699.99},
            {Name: "Headphones", Description: "Noise cancelling headphones", Price: 199.99},
        }
        
        for _, product := range products {
            DB.Create(&product)
        }
    }
}