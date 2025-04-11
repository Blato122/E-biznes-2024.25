package database

import (
    "gorm.io/gorm"
)

// Returns a scope that filters products by category ID
func ProductsByCategory(categoryID uint) func(db *gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        return db.Where("category_id = ?", categoryID)
    }
}

// Returns a scope that orders products by creation date, newest first
func NewProducts() func(db *gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        return db.Order("id desc")
    }
}

// Returns a scope that filters products by price range
func PriceRange(min, max float64) func(db *gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        return db.Where("price BETWEEN ? AND ?", min, max)
    }
}

// Returns a scope that paginates results
func Paginate(page, pageSize int) func(db *gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        offset := (page - 1) * pageSize
        return db.Offset(offset).Limit(pageSize)
    }
}