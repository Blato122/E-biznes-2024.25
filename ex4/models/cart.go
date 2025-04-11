package models

type CartItem struct {
    ID        uint    `json:"id" gorm:"primaryKey"`
    ProductID uint    `json:"product_id"`
    Product   Product `json:"product" gorm:"foreignKey:ProductID"`
    Quantity  int     `json:"quantity"`
    UserID    uint    `json:"user_id"` // To identify which user's cart this is
}