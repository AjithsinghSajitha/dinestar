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
<p id="status">Authentication ${status}. You can close this window.</p>
<script>
(function () {
  if (!window.opener) {
    document.getElementById("status").textContent =
      "Error: this page must be opened by Decap CMS as a popup.";
    return;
  }

  var MESSAGE = ${JSON.stringify(message)};
  var sent = false;

  function sendAuth(origin) {
    if (sent) return;
    sent = true;
    try {
      window.opener.postMessage(MESSAGE, origin);
    } catch (e) {
      console.error("postMessage failed:", e);
    }
    // Give Decap a moment to receive, then close the popup.
    setTimeout(function () { window.close(); }, 1000);
  }

  function receiveMessage(e) {
    // Decap echoes back "authorizing:github" once it's listening.
    sendAuth(e.origin);
  }

  window.addEventListener("message", receiveMessage, false);

  // Repeatedly announce ourselves until Decap responds (handles race).
  var attempts = 0;
  var poller = setInterval(function () {
    if (sent || attempts >= 20) { clearInterval(poller); return; }
    try {
      window.opener.postMessage("authorizing:github", "*");
    } catch (e) {
      clearInterval(poller);
    }
    attempts++;
  }, 250);

  // Last-resort fallback: if Decap never echoed, send anyway after 5s.
  setTimeout(function () {
    if (!sent) {
      console.warn("No handshake response from Decap; sending token with wildcard origin.");
      sendAuth("*");
    }
  }, 5000);
})();
</script>
</body>
</html>`);
}
