const Env = use("Env")

module.exports = {
  ally: {
    // Configuration for github
    github: {
      clientId: Env.get("GITHUB_CLIENT_ID"),
      clientSecret: Env.get("GITHUB_CLIENT_SECRET"),
      redirectUri: `${Env.get("APP_URL")}/github/callback`
    }
  }
}
