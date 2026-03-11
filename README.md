# Tools Marketplace (React + Supabase)

A starter e-commerce marketplace for construction and power tools.

## ✅ Features
- React + TypeScript + Vite
- Supabase Auth (email/password, session persistence, password reset)
- Product listing + product details
- Shopping cart (localStorage persistence)
- Checkout flow + order summary
- Protected routes (account, checkout)

## 🚀 Get started
1. Copy `.env.example` to `.env`.
2. Fill in your Supabase project values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Install dependencies:

```bash
npm install
```

4. Run the dev server:

```bash
npm run dev
```

## 🧱 Supabase schema (recommended)
Create the following tables in Supabase for the UI to work properly:

### products
- `id` (uuid, primary key)
- `name` (text)
- `slug` (text, unique)
- `description` (text)
- `price` (numeric)
- `image_url` (text)
- `created_at` (timestamp, default now())

### subscriptions
- `id` (uuid, primary key)
- `user_id` (uuid, references `auth.users(id)`)
- `plan` (text, default `free`)
- `status` (text, default `active`)
- `stripe_customer_id` (text)
- `stripe_subscription_id` (text)
- `current_period_end` (timestamp)
- `created_at` (timestamp, default now())

### projects (example user-scoped table)
- `id` (uuid, primary key)
- `user_id` (uuid, references `auth.users(id)`)
- `title` (text)
- `created_at` (timestamp, default now())

> You can extend the schema with orders, order_items, categories, and stock tracking.

## 📌 Notes
- Checkout currently does not persist orders to the database. You can extend it by adding `orders` and `order_items` tables and saving the order during the checkout flow.
- This starter uses simple styling; you can replace it with Tailwind, CSS modules, or a component library.
