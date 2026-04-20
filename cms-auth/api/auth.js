module.exports = function handler(req, res) {
  const provider = req.query.provider;
  if (provider !== "github") {
    return res.status(400).send("Unsupported provider: " + provider);
  }
  const host = req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "https";
  const callbackUrl = `${proto}://${host}/api/callback`;
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: callbackUrl,
    scope: "public_repo,user:email",
    state: Math.random().toString(36).substring(2),
  });
  res.writeHead(302, {
    Location: `https://github.com/login/oauth/authorize?${params}`,
  });
  res.end();
};
