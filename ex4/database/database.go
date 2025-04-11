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
    
    // Auto-migrate models
    err = DB.AutoMigrate(&models.Category{}, &models.Product{}, &models.CartItem{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    
    var categoryCount int64
    DB.Model(&models.Category{}).Count(&categoryCount)
    if categoryCount == 0 {
        categories := []models.Category{
            {Name: "Electronics", Description: "Electronic devices and gadgets"},
            {Name: "Home", Description: "Home goods and furniture"},
        }
        
        for _, category := range categories {
            DB.Create(&category)
        }
    }
    
    var productCount int64
    DB.Model(&models.Product{}).Count(&productCount)
    if productCount == 0 {
        products := []models.Product{
            {Name: "PC", Description: "High performance GPU", Price: 4999.99, CategoryID: 1},
            {Name: "Smartphone", Description: "Latest smartphone model", Price: 899.99, CategoryID: 1},
            {Name: "Smartwatch", Description: "Easily track your workouts", Price: 199.99, CategoryID: 1},
            {Name: "Wardrobe", Description: "A beautiful, old wardrobe", Price: 1999.99, CategoryID: 2},
            {Name: "Desk lamp", Description: "Adjustable LED desk lamp", Price: 49.99, CategoryID: 2},
        }
        
        for _, product := range products {
            DB.Create(&product)
        }
    }
}