package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Cart

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {
  
  // GET /cart - Get all cart items
  def getAll() = Action {
    Ok(Json.toJson(Cart.getAll()))
  }
  
  // GET /cart/:id - Get cart item by id
  def get(id: Long) = Action {
    Cart.getById(id) match {
      case Some(cart) => Ok(Json.toJson(cart))
      case None => NotFound(Json.obj("message" -> s"Cart item with id $id not found"))
    }
  }
  
  // POST /cart - Add a new cart item
  def add() = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Cart] match {
      case JsSuccess(cart, _) =>
        val newCart = Cart.add(cart)
        Created(Json.toJson(newCart))
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // PUT /cart/:id - Update a cart item
  def update(id: Long) = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Cart] match {
      case JsSuccess(cart, _) =>
        Cart.update(id, cart) match {
          case Some(updatedCart) => Ok(Json.toJson(updatedCart))
          case None => NotFound(Json.obj("message" -> s"Cart item with id $id not found"))
        }
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // DELETE /cart/:id - Delete a cart item
  def delete(id: Long) = Action {
    if (Cart.delete(id)) {
      NoContent // 204 No Content
    } else {
      NotFound(Json.obj("message" -> s"Cart item with id $id not found"))
    }
  }
}