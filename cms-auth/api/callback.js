module.exports = async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Missing OAuth code parameter");
  }

  let data;
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });
    data = await tokenRes.json();
  } catch (err) {
    return sendResultPage(res, "error", { message: "Token exchange failed: " + err.message });
  }

  if (data.error || !data.access_token) {
    const msg = data.error_description || data.error || "GitHub did not return an access token";
    return sendResultPage(res, "error", { message: msg });
  }

  return sendResultPage(res, "success", { token: data.access_token, provider: "github" });
};

function sendResultPage(res, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
<body>
<p>Authentication ${status}. You can close this window.</p>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`);
}
