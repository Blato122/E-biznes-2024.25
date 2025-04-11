package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "github.com/Blato122/E-biznes-2024.25/ex4/controllers"
    "github.com/Blato122/E-biznes-2024.25/ex4/database"
)

func main() {
    database.Init()
    
    e := echo.New()

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    // Product routes
    e.GET("/products", controllers.GetProducts)
    e.GET("/products/:id", controllers.GetProduct)
    e.POST("/products", controllers.CreateProduct)
    e.PUT("/products/:id", controllers.UpdateProduct)
    e.DELETE("/products/:id", controllers.DeleteProduct)

    // Category routes
    e.GET("/categories", controllers.GetCategories)
    e.GET("/categories/:id", controllers.GetCategory)
    e.GET("/categories/:id/products", controllers.GetCategoryProducts)
    e.POST("/categories", controllers.CreateCategory)
    e.PUT("/categories/:id", controllers.UpdateCategory)
    e.DELETE("/categories/:id", controllers.DeleteCategory)

    // Cart routes
    e.GET("/cart", controllers.GetCartItems)
    e.GET("/cart/:id", controllers.GetCartItem)
    e.POST("/cart", controllers.AddToCart)
    e.PUT("/cart/:id", controllers.UpdateCartItem)
    e.DELETE("/cart/:id", controllers.RemoveFromCart)

    e.Logger.Fatal(e.Start(":8080"))
}