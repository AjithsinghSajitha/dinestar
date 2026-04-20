# DineStar CMS Auth Proxy

Tiny GitHub OAuth proxy for Decap CMS. Two serverless functions:

- `/api/auth` — kicks off the GitHub OAuth flow
- `/api/callback` — receives the OAuth code, exchanges it for an access token, posts it back to Decap

## Required environment variables (set in Vercel)

- `OAUTH_CLIENT_ID` — from your GitHub OAuth App
- `OAUTH_CLIENT_SECRET` — from your GitHub OAuth App

## Notes

- Requests `public_repo,user:email` scopes (sufficient for editing a public repo)
- No state, no database, no logs — purely stateless OAuth handshake
