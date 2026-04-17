# Peaceful Taste Web

Customer-facing storefront for Peaceful Taste built with Vite, React, Express, and tRPC.

## What changed

- made local scripts Windows-friendly with `cross-env`
- switched the default site theme to light to match the brand palette
- connected the services quote form to the inquiry API
- added a Vercel-ready API entrypoint at [`api/[...route].ts`](./api/[...route].ts)
- added [`vercel.json`](./vercel.json) and [`.env.example`](./.env.example)
- moved the client production build output to `public/`, which matches Vercel's static asset handling
- cleaned up SEO metadata to use `VITE_SITE_URL` instead of the old `manus.space` domain

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
pnpm start
```

## Environment variables

Copy [`.env.example`](./.env.example) to `.env` and fill in the values you need.

The repo also includes safe defaults for:

- [`.env.production`](./.env.production) with `https://peacefultaste.vercel.app`
- [`.env.development`](./.env.development) with `http://localhost:3000`

Important variables:

- `VITE_SITE_URL`: your deployed site URL, for example `https://peacefultaste.vercel.app`
- `JWT_SECRET`: required for auth/session handling
- `DATABASE_URL`: required if you want Drizzle-backed persistence
- `PAYSTACK_API_KEY`: required if you enable Paystack flows
- `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`: optional, used for owner notifications

## Deploying to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the package manager as `pnpm`.
3. Set the required environment variables from `.env.example`.
4. Deploy.

The repo now includes:

- an `api/[...route].ts` Express entrypoint that Vercel can run
- `public/` as the client build output
- SPA rewrites for non-API routes
