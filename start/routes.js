"use strict"

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route")

Route.post("/users", "UserController.create")
Route.post("/auth", "SessionController.create")

Route.get("/repos", "RepoController.repos").middleware(["auth"])

Route.get("auth/:provider", "AuthController.redirectToProvider")
Route.get(":provider/callback", "AuthController.handleProviderCallback")
