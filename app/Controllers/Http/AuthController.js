"use strict"

const User = use("App/Models/User")

class AuthController {
  async redirectToProvider({ ally, params }) {
    await ally
      .driver(params.provider)
      .stateless()
      .scope(["birthday", "repos"])
      .redirect()
  }

  async handleProviderCallback({ params, ally, auth, response }) {
    const provider = params.provider
    try {
      const userData = await ally.driver(params.provider).getUser()

      const authUser = await User.query()
        .where({
          provider: provider,
          provider_id: userData.getId()
        })
        .first()
      if (!(authUser === null)) {
        await auth.generate(authUser)
        return response.json(authUser)
      }

      const user = new User()
      user.name = userData.getName()
      user.username = userData.getNickname()
      user.email = userData.getEmail()
      user.provider_id = userData.getId()
      user.avatar = userData.getAvatar()
      user.provider = provider
      await user.tokens().create({
        token: userData.getAccessToken(),
        user_id: user.id,
        type: "bearer"
      })
      await user.save()

      await auth.generate(user)
      return response.json("usuario criado" + user)
    } catch (e) {
      console.log(e)
      response.redirect("/auth/" + provider)
    }
  }

  async logout({ auth, response }) {
    await auth.logout()
    response.redirect("/")
  }
}
module.exports = AuthController
