package controllers

import (
    "net/http"
    "strconv"

    "github.com/labstack/echo/v4"
    "github.com/Blato122/E-biznes-2024.25/ex4/database"
    "github.com/Blato122/E-biznes-2024.25/ex4/models"
)

// Returns all categories
func GetCategories(c echo.Context) error {
    var categories []models.Category
    result := database.DB.Find(&categories)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusOK, categories)
}

// Returns a specific category by ID
func GetCategory(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    var category models.Category
    result := database.DB.First(&category, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Category not found"})
    }
    
    return c.JSON(http.StatusOK, category)
}

// Returns all products in a specific category
func GetCategoryProducts(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    var category models.Category
    result := database.DB.Preload("Products").First(&category, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Category not found"})
    }
    
    return c.JSON(http.StatusOK, category.Products)
}

// Creates a new category
func CreateCategory(c echo.Context) error {
    category := new(models.Category)
    if err := c.Bind(category); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    result := database.DB.Create(&category)
    if result.Error != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
    }
    
    return c.JSON(http.StatusCreated, category)
}

// Updates an existing category
func UpdateCategory(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if category exists
    var existingCategory models.Category
    result := database.DB.First(&existingCategory, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Category not found"})
    }
    
    updatedCategory := new(models.Category)
    if err := c.Bind(updatedCategory); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }
    
    // Update the category
    updatedCategory.ID = uint(id)
    database.DB.Save(updatedCategory)
    
    return c.JSON(http.StatusOK, updatedCategory)
}

// Deletes a category
func DeleteCategory(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }
    
    // Check if category exists
    var category models.Category
    result := database.DB.First(&category, id)
    if result.Error != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"error": "Category not found"})
    }
    
    // Delete the category
    database.DB.Delete(&category)
    
    return c.JSON(http.StatusOK, map[string]string{"message": "Category deleted"})
}