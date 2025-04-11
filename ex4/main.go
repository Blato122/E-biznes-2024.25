package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "github.com/Blato122/E-biznes-2024.25/ex4/controllers"
)

func main() {
    e := echo.New()

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    e.GET("/products", controllers.GetProducts)
    e.GET("/products/:id", controllers.GetProduct)
    e.POST("/products", controllers.CreateProduct)
    e.PUT("/products/:id", controllers.UpdateProduct)
    e.DELETE("/products/:id", controllers.DeleteProduct)

    e.Logger.Fatal(e.Start(":8080"))
}