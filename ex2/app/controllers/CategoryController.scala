package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Category

@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {
  
  // GET /category - Get all categories
  def getAll() = Action {
    Ok(Json.toJson(Category.getAll()))
  }
  
  // GET /category/:id - Get category by id
  def get(id: Long) = Action {
    Category.getById(id) match {
      case Some(category) => Ok(Json.toJson(category))
      case None => NotFound(Json.obj("message" -> s"Category with id $id not found"))
    }
  }
  
  // POST /category - Add a new category
  def add() = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Category] match {
      case JsSuccess(category, _) =>
        val newCategory = Category.add(category)
        Created(Json.toJson(newCategory))
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // PUT /category/:id - Update a category
  def update(id: Long) = Action(parse.json[JsValue]) { implicit request: Request[JsValue] =>
    request.body.validate[Category] match {
      case JsSuccess(category, _) =>
        Category.update(id, category) match {
          case Some(updatedCategory) => Ok(Json.toJson(updatedCategory))
          case None => NotFound(Json.obj("message" -> s"Category with id $id not found"))
        }
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> JsError.toJson(errors)))
    }
  }
  
  // DELETE /category/:id - Delete a category
  def delete(id: Long) = Action {
    if (Category.delete(id)) {
      NoContent // 204 No Content
    } else {
      NotFound(Json.obj("message" -> s"Category with id $id not found"))
    }
  }
}