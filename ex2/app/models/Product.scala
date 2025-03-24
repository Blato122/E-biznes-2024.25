package models

import play.api.libs.json._

case class Product(id: Long, name: String, price: Double, description: String)

object Product {
  implicit val productFormat: OFormat[Product] = Json.format[Product]

  private var products = List(
    Product(1, "Laptop", 999.99, "A powerful laptop"),
    Product(2, "Phone", 499.99, "Latest smartphone"),
    Product(3, "Headphones", 99.99, "Wireless headphones")
  )
  
  def getAll(): List[Product] = products
  
  def getById(id: Long): Option[Product] = products.find(_.id == id)
  
  def add(product: Product): Product = {
    val maxId = if (products.isEmpty) 0 else products.map(_.id).max
    val newProduct = product.copy(id = maxId + 1)
    products = products :+ newProduct
    newProduct
  }
  
  def update(id: Long, product: Product): Option[Product] = {
    products.find(_.id == id) match {
      case Some(_) =>
        // Replace the product with the updated one
        products = products.filterNot(_.id == id)
        val updatedProduct = product.copy(id = id)
        products = products :+ updatedProduct
        Some(updatedProduct)
      case None => None
    }
  }
  
  def delete(id: Long): Boolean = {
    val originalSize = products.size
    products = products.filterNot(_.id == id)
    products.size < originalSize
  }
}