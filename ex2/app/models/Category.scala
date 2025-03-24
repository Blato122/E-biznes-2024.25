package models

import play.api.libs.json._

case class Category(id: Long, name: String, description: String)

object Category {
  implicit val categoryFormat: OFormat[Category] = Json.format[Category]

  private var categories = List(
    Category(1, "Electronics", "Electronic devices and accessories"),
    Category(2, "Clothing", "Apparel and fashion items"),
    Category(3, "Books", "Books and publications")
  )
  
  def getAll(): List[Category] = categories
  
  def getById(id: Long): Option[Category] = categories.find(_.id == id)
  
  def add(category: Category): Category = {
    val maxId = if (categories.isEmpty) 0 else categories.map(_.id).max
    val newCategory = category.copy(id = maxId + 1)
    categories = categories :+ newCategory
    newCategory
  }
  
  def update(id: Long, category: Category): Option[Category] = {
    categories.find(_.id == id) match {
      case Some(_) =>
        // Replace the product with the updated one
        categories = categories.filterNot(_.id == id)
        val updatedCategory = category.copy(id = id)
        categories = categories :+ updatedCategory
        Some(updatedCategory)
      case None => None
    }
  }
  
  def delete(id: Long): Boolean = {
    val originalSize = categories.size
    categories = categories.filterNot(_.id == id)
    categories.size < originalSize
  }
}