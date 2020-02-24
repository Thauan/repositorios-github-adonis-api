"use strict"

const User = use("App/Models/User")

class AuthController {
  async redirectToProvider({ ally, params }) {
    await ally
      .driver(params.provider)
      .stateless()
      // .scope(["birthday", "repos"])
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
        .with("tokens")
        .first()

      if (!(authUser === null)) {
        const accessToken = auth.generate(authUser)

        await authUser.tokens().update({
          token: userData.getAccessToken(),
          updated_at: Date.now()
        })

        return response.json({ user: authUser, token: accessToken })
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

      // await auth.generate(user)

      const accessToken = await auth.generate(user)

      return response.json({ user: user, token: accessToken })
    } catch (e) {
      console.log(e)
      response.redirect("/auth/" + provider)
    }
  }

  async logout({ auth, response }) {
    await auth.logout()
    response.json("deslogado com sucesso")
  }
}
module.exports = AuthController
