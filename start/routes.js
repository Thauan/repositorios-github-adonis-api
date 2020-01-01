"use strict"

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route")

Route.post("/users", "UserController.create")
Route.post("/auth", "SessionController.create")

Route.get("auth/:provider", "AuthController.redirectToProvider")
Route.get("github/callback", "AuthController.callback")
