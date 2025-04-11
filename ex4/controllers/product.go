package controllers

import (
    "net/http"
    "strconv"

    "github.com/labstack/echo/v4"
    "github.com/Blato122/E-biznes-2024.25/ex4/database"
    "github.com/Blato122/E-biznes-2024.25/ex4/models"
)

// GetProducts returns all products
func GetProducts(c echo.Context) error {
    var products []models.Product
    result := database.DB.Find(&products)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusOK, products)
}

// GetProduct returns a specific product by ID
func GetProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    var product models.Product
    result := database.DB.First(&product, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
    }
    
    return c.JSON(http.StatusOK, product)
}

// CreateProduct creates a new product
func CreateProduct(c echo.Context) error {
    product := new(models.Product)
    if err := c.Bind(product); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    result := database.DB.Create(&product)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusCreated, product)
}

// UpdateProduct updates an existing product
func UpdateProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if product exists
    var existingProduct models.Product
    result := database.DB.First(&existingProduct, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
    }
    
    updatedProduct := new(models.Product)
    if err := c.Bind(updatedProduct); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    // Update the product
    updatedProduct.ID = uint(id)
    database.DB.Save(updatedProduct)
    
    return c.JSON(http.StatusOK, updatedProduct)
}

// DeleteProduct deletes a product
func DeleteProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if product exists
    var product models.Product
    result := database.DB.First(&product, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
    }
    
    // Delete the product
    database.DB.Delete(&product)
    
    return c.JSON(http.StatusOK, map[string]string{"message": "Product deleted"})
}