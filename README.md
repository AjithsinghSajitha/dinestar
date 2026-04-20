# DineStar

Static marketing site for DineStar palm leaf dinnerware, built with Jekyll
and edited via Decap CMS. Deployed on GitHub Pages.

- Live site: https://ajithsinghsajitha.github.io/dinestar/
- CMS: https://ajithsinghsajitha.github.io/dinestar/admin/

## Repo layout

```
_config.yml         site settings, nav menu, exclusions
_layouts/           page wrappers (default.html)
_includes/          reusable fragments (head, nav, footer)
_data/              editable content (products, services, brochure, home)
admin/              Decap CMS entry point and config
assets/images/      logo and uploaded media
cms-auth/           tiny GitHub OAuth proxy (deployed separately to Vercel)
*.html              one file per page; each pulls layout + data
```

## Editing content

Non-technical edits go through the CMS at `/admin/`. Log in with a GitHub
account that has write access to this repo. Saves create draft pull
requests; merging the PR publishes the change.

For direct edits, modify the YAML in `_data/` or the HTML in the page
files and open a pull request.

## Local preview

Requires Ruby. From the repo root:

```
bundle install
bundle exec jekyll serve
```

The site will be available at http://localhost:4000/dinestar/.

## OAuth proxy (cms-auth/)

The CMS uses GitHub OAuth, which needs a tiny token-exchange endpoint.
That code lives in `cms-auth/` and is deployed as its own Vercel project
(set Root Directory to `cms-auth` when importing). Two env vars are
required: `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` from the
corresponding GitHub OAuth App.
