package models

type Product struct {
    ID          uint    `json:"id" gorm:"primaryKey"`
    Name        string  `json:"name"`
    Description string  `json:"description"`
    Price       float64 `json:"price"`
    CategoryID  uint    `json:"category_id"`
    Category    Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}