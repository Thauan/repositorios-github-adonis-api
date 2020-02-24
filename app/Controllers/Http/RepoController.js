"use strict"

const User = use("App/Models/User")

class RepoController {
  async repos({ response, auth }) {
    try {
      // const token = request.cookie("token")

      // if (token) {
      //   request.request.headers["authorization"] = `Bearer ${token}`
      // }

      response.json({ message: "teste" })
    } catch (error) {
      response.json(
        "Você não esta logado, por isso não pode visualizar estes repositorios!"
      )
    }
  }
}

module.exports = RepoController
