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
- `FLW_PUBLIC_KEY` and `FLW_SECRET_KEY`: required for Flutterwave hosted checkout
- `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`: optional, used for owner notifications

## Flutterwave hosted checkout

The storefront supports Flutterwave Standard Checkout through the existing order flow.

How it works:

1. Customer creates an order in `/checkout`
2. Customer clicks the Flutterwave checkout button
3. The backend creates a hosted Flutterwave checkout session with a signed `tx_ref`
4. Flutterwave redirects back to `/payment-status`
5. The backend verifies `transaction_id` and `tx_ref` before showing success
6. Verified payments update the admin workbook and dashboard automatically

Required environment variables:

- `FLW_PUBLIC_KEY`
- `FLW_SECRET_KEY`
- `VITE_SITE_URL`

Testing safely:

1. Add your Flutterwave test keys in Vercel for the `peacefultaste` project
2. Redeploy
3. Create an order through `/checkout`
4. Use Flutterwave hosted checkout
5. Confirm the return page shows success only after backend verification

Switching to live mode:

1. Replace only the Flutterwave test keys with live Flutterwave keys
2. Keep the same code and redirect flow
3. Confirm `VITE_SITE_URL` matches your production domain
4. Run one small live transaction before depending on it fully

## Deploying to Vercel

1. Import the GitHub repository into Vercel.
2. Keep the package manager as `pnpm`.
3. Set the required environment variables from `.env.example`.
4. Deploy.

The repo now includes:

- an `api/[...route].ts` Express entrypoint that Vercel can run
- `public/` as the client build output
- SPA rewrites for non-API routes
