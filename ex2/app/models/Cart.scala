package models

import play.api.libs.json._

case class Cart(id: Long, userId: Long, productId: Long, quantity: Int)

object Cart {
  implicit val cartFormat: OFormat[Cart] = Json.format[Cart]

  private var carts = List(
    Cart(1, 101, 1, 2),  // User 101 has 2 laptops (product 1)
    Cart(2, 101, 3, 1),  // User 101 has 1 headphones (product 3)
    Cart(3, 102, 2, 1)   // User 102 has 1 phone (product 2)
  )
  
  def getAll(): List[Cart] = carts
  
  def getById(id: Long): Option[Cart] = carts.find(_.id == id)
  
  def add(cart: Cart): Cart = {
    val maxId = if (carts.isEmpty) 0 else carts.map(_.id).max
    val newCart = cart.copy(id = maxId + 1)
    carts = carts :+ newCart
    newCart
  }
  
  def update(id: Long, cart: Cart): Option[Cart] = {
    carts.find(_.id == id) match {
      case Some(_) =>
        // Replace the product with the updated one
        carts = carts.filterNot(_.id == id)
        val updatedCart = cart.copy(id = id)
        carts = carts :+ updatedCart
        Some(updatedCart)
      case None => None
    }
  }
  
  def delete(id: Long): Boolean = {
    val originalSize = carts.size
    carts = carts.filterNot(_.id == id)
    carts.size < originalSize
  }
}