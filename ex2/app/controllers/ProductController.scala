package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {
  
  // GET /product - Get all products
  def getAll() = Action {
    Ok(Json.toJson(Product.getAll()))
  }
  
  // GET /product/:id - Get product by id
  def get(id: Long) = Action {
    Product.getById(id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("message" -> s"Product with id $id not found"))
    }
  }
  
  // POST /product - Add a new product
  def add() = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Product] match {
      case JsSuccess(product, _) =>
        val newProduct = Product.add(product)
        Created(Json.toJson(newProduct))
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // PUT /product/:id - Update a product
  def update(id: Long) = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Product] match {
      case JsSuccess(product, _) =>
        Product.update(id, product) match {
          case Some(updatedProduct) => Ok(Json.toJson(updatedProduct))
          case None => NotFound(Json.obj("message" -> s"Product with id $id not found"))
        }
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // DELETE /product/:id - Delete a product
  def delete(id: Long) = Action {
    if (Product.delete(id)) {
      NoContent // 204 No Content
    } else {
      NotFound(Json.obj("message" -> s"Product with id $id not found"))
    }
  }
}