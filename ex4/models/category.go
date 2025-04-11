package models

type Category struct {
    ID          uint      `json:"id" gorm:"primaryKey"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    Products    []Product `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}