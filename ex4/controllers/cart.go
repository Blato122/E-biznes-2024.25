package controllers

import (
    "net/http"
    "strconv"

    "github.com/labstack/echo/v4"
    "github.com/Blato122/E-biznes-2024.25/ex4/database"
    "github.com/Blato122/E-biznes-2024.25/ex4/models"
)

// Returns all cart items for a user
func GetCartItems(c echo.Context) error {
    userID, err := strconv.Atoi(c.QueryParam("user_id"))
    if err != nil || userID <= 0 {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Valid user_id is required"})
    }
    
    var cartItems []models.CartItem
    // Preload the Product relation for each cart item
    result := database.DB.Preload("Product").Where("user_id = ?", userID).Find(&cartItems)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusOK, cartItems)
}

// Returns a specific cart item
func GetCartItem(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    var cartItem models.CartItem
    result := database.DB.Preload("Product").First(&cartItem, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Cart item not found"})
    }
    
    return c.JSON(http.StatusOK, cartItem)
}

// Adds a product to the user's cart
func AddToCart(c echo.Context) error {
    cartItem := new(models.CartItem)
    if err := c.Bind(cartItem); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    // Validate that the product exists
    var product models.Product
    if result := database.DB.First(&product, cartItem.ProductID); result.Error != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Product not found"})
    }
    
    // Check if the item is already in the cart
    var existingItem models.CartItem
    result := database.DB.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).First(&existingItem)
    
    if result.Error == nil {
        // Item already exists, update quantity
        existingItem.Quantity += cartItem.Quantity
        database.DB.Save(&existingItem)
        return c.JSON(http.StatusOK, existingItem)
    }
    
    // Item doesn't exist, create new cart item
    if cartItem.Quantity <= 0 {
        cartItem.Quantity = 1 // Set default quantity
    }
    
    result = database.DB.Create(&cartItem)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusCreated, cartItem)
}

// Updates the quantity of a cart item
func UpdateCartItem(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if cart item exists
    var existingItem models.CartItem
    result := database.DB.First(&existingItem, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Cart item not found"})
    }
    
    updatedItem := new(models.CartItem)
    if err := c.Bind(updatedItem); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    // Only update quantity
    existingItem.Quantity = updatedItem.Quantity
    database.DB.Save(&existingItem)
    
    return c.JSON(http.StatusOK, existingItem)
}

// Removes an item from the cart
func RemoveFromCart(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if cart item exists
    var cartItem models.CartItem
    result := database.DB.First(&cartItem, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Cart item not found"})
    }
    
    // Delete the cart item
    database.DB.Delete(&cartItem)
    
    return c.JSON(http.StatusOK, map[string]string{"message": "Item removed from cart"})
}