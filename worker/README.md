# gritmade-subscribe

Cloudflare Worker that proxies newsletter signups from the static site to
Beehiiv, keeping the API key off the client. GitHub Pages can't run server code,
so this Worker is the "server" the signup form POSTs to.

## Deploy

1. Authenticate Wrangler (one-time): `npx wrangler login`
2. Put your publication ID in `wrangler.toml` → `[vars] BEEHIIV_PUBLICATION_ID`.
3. Add your API key as a secret (never committed):
   `npx wrangler secret put BEEHIIV_API_KEY`
4. Deploy: `npx wrangler deploy`
5. Copy the printed URL (`https://gritmade-subscribe.<your-subdomain>.workers.dev`)
   into `SUBSCRIBE_ENDPOINT` in `src/components/Newsletter.astro`.

## Test locally

`npx wrangler dev`, then submit the form (or POST an `email` field) against the
local URL it prints.
