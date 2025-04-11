package controllers

import (
    "net/http"
    "strconv"

    "github.com/labstack/echo/v4"
    "github.com/Blato122/E-biznes-2024.25/ex4/models"
)

// replace with GORM later
var products []models.Product
var idCounter int = 1

// GetProducts returns all products
func GetProducts(c echo.Context) error {
    return c.JSON(http.StatusOK, products)
}

// GetProduct returns a specific product by ID
func GetProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }

    for _, product := range products {
        if product.ID == id {
            return c.JSON(http.StatusOK, product)
        }
    }

    return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
}

// CreateProduct creates a new product
func CreateProduct(c echo.Context) error {
    product := new(models.Product)
    if err := c.Bind(product); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    product.ID = idCounter
    idCounter++
    products = append(products, *product)

    return c.JSON(http.StatusCreated, product)
}

// UpdateProduct updates an existing product
func UpdateProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }

    product := new(models.Product)
    if err := c.Bind(product); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
    }

    for i, p := range products {
        if p.ID == id {
            product.ID = id
            products[i] = *product
            return c.JSON(http.StatusOK, product)
        }
    }

    return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
}

// DeleteProduct deletes a product
func DeleteProduct(c echo.Context) error {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ID"})
    }

    for i, product := range products {
        if product.ID == id {
            // Remove the product from the slice
            products = append(products[:i], products[i+1:]...)
            return c.JSON(http.StatusOK, map[string]string{"message": "Product deleted"})
        }
    }

    return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
}