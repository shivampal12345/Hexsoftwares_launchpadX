# LaunchPadX

LaunchPadX is a full-stack equity crowdfunding demo platform built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, MongoDB/Mongoose, TanStack Query, and Stripe server APIs.

## Features

- Marketing homepage with campaign discovery, categories, testimonials, and newsletter signup
- Campaign browser with search, filters, saved bookmarks, and detail pages
- Authenticated investor/founder flows with HTTP-only JWT cookies
- Founder campaign submission flow with admin review status
- Admin dashboard for users, startups, and investment records
- MongoDB-backed API routes with request validation
- SEO metadata, sitemap, robots.txt, dark mode, and production build support

## Requirements

- Node.js 20+
- MongoDB database
- Stripe account for hosted Checkout payments and webhook delivery

## Environment Variables

Copy `.env.example` to `.env.local` for local development and set the same values in your deployment platform.

```env
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=30d
NEXT_PUBLIC_SITE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_NAME=
```

Use a long random `JWT_SECRET` in production. The app intentionally fails in production if `MONGODB_URI` or `JWT_SECRET` is missing.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Seed Data

```bash
npm run seed
```

The seed script creates demo founders, investors, startups, investments, and an admin user from the `ADMIN_*` variables.

## Verification

```bash
npm run lint
npm run build
```

Both commands should pass before deployment.

## Deployment Notes

- Set all required environment variables on Vercel, Render, Railway, or your chosen host.
- Use MongoDB Atlas or another replica-set MongoDB deployment. MongoDB transactions are required for Stripe webhook investment recording.
- Set strong production secrets in `.env` or your deployment platform's secret manager, especially `JWT_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and admin credentials.
- Run `npm run build` during deployment and `npm start` for a Node server target.
- Public registration can create investor or founder accounts only; admin accounts should be seeded or promoted from the admin dashboard.
- The investment modal redirects to Stripe Checkout. LaunchPadX does not collect card details.
- Configure the real Stripe webhook for `checkout.session.completed` pointing to `/api/stripe/webhook`. Completed investments and raised totals are recorded by the webhook after Stripe confirms payment.
- Test checkout end-to-end in Stripe test mode, including webhook delivery and investment totals, before switching to live keys.

## API Endpoints

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/startups` | Public | List active campaigns |
| GET | `/api/startups/[id]` | Public | Get one campaign |
| POST | `/api/startups` | Founder/Admin | Create a draft startup |
| POST | `/api/campaigns` | Authenticated | Submit a campaign proposal |
| POST | `/api/investments` | Authenticated | Disabled for direct writes; use Stripe Checkout |
| GET | `/api/investments` | Authenticated | List current user's investments |
| POST | `/api/create-checkout-session` | Authenticated | Create a Stripe Checkout session |
| POST | `/api/create-payment-intent` | Authenticated | Create a Stripe payment intent for future custom Elements flows |
| POST | `/api/stripe/webhook` | Stripe | Confirm Checkout payments and record investments |
| GET | `/api/stats` | Public | Platform statistics |
| GET | `/api/dashboard` | Public | Founder dashboard summary |
| POST | `/api/newsletter` | Public | Newsletter subscription |
| GET/PUT | `/api/admin/users` | Admin | Manage users |
| GET/PUT | `/api/admin/startups` | Admin | Manage startup statuses |
| GET | `/api/admin/investments` | Admin | View investments |

## Project Structure

```text
src/
  app/          Pages and API route handlers
  components/   UI, layout, home sections, modals, providers
  constants/    Demo and seed data
  hooks/        TanStack Query hooks
  lib/          Auth, database, Stripe, utilities, query keys
  models/       Mongoose models
  types/        Shared TypeScript interfaces
```

## License

Private academic / portfolio project.
