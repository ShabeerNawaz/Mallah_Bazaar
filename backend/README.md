# Mallah Bazaar — Backend API

Node.js + Express + MongoDB backend for the Mallah Bazaar e-commerce site.
Handles products, orders, user authentication, and Stripe payments.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   You'll need:
   - A MongoDB connection string (free tier at https://www.mongodb.com/cloud/atlas)
   - A Stripe secret key and webhook secret (https://dashboard.stripe.com/apikeys)
   - A JWT secret (any long random string)

3. (Optional) Seed the database with an admin user and sample products:
   ```bash
   npm run seed
   ```
   This creates an admin login: `admin@mallahbazaar.com` / `admin123`
   **Change this password immediately in production.**

4. Run the server:
   ```bash
   npm run dev     # with auto-restart (nodemon)
   npm start        # production
   ```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a new account |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/me` | Logged-in user | Get current user profile |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products (supports `?cat=` and `?search=`) |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Logged-in user | Create order from cart items |
| GET | `/api/orders/mine` | Logged-in user | Get your own orders |
| GET | `/api/orders` | Admin | Get all orders |
| GET | `/api/orders/:id` | Owner or admin | Get single order |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create-intent` | Logged-in user | Create Stripe PaymentIntent for an order |
| POST | `/api/payments/webhook` | Stripe only | Receives payment confirmation events |

## Authentication

Protected routes require a header:
```
Authorization: Bearer <token>
```
The token is returned from `/api/auth/register` or `/api/auth/login`.

## Email Notifications

Admin (`2017ayaz1985@gmail.com`) gets automatically emailed for:
- New order placed
- Order status changed (e.g. shipped, delivered)
- Payment succeeded / failed
- New user signup
- Product stock dropping to 5 units or below

Customers also get a simple order confirmation email.

**Setup (using Gmail to send):**
1. Turn on 2-Step Verification on the Gmail account you want to send FROM:
   https://myaccount.google.com/security
2. Create an App Password: https://myaccount.google.com/apppasswords
   (choose "Mail" as the app) — this gives you a 16-character password
3. In `.env`, set:
   ```
   EMAIL_USER=your_sending_gmail@gmail.com
   EMAIL_PASS=the_16_char_app_password
   ADMIN_EMAIL=2017ayaz1985@gmail.com
   ```
   `EMAIL_USER` can be the same address as `ADMIN_EMAIL` if you want one Gmail
   account to both send and receive — that's the simplest setup.

Emails are sent "fire and forget" — if sending fails (bad credentials, Gmail
rate limit, etc.) it's logged to the console but never blocks the actual
order/payment/signup from completing.

## Connecting Stripe Webhooks Locally

Use the Stripe CLI to forward events to your local server during development:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
This prints a webhook signing secret — put it in `.env` as `STRIPE_WEBHOOK_SECRET`.

## Deploying

This is a standard Express app, so it works on any Node host:
- **Railway** or **Render** — connect the repo, set the env vars, done
- **Vercel** — would need conversion to serverless functions (different structure); Railway/Render is simpler for a full Express app like this

Make sure to set the production `CLIENT_URL` to your deployed frontend's URL (for CORS),
and use a MongoDB Atlas cluster (not localhost) since your host won't have local Mongo.

## Frontend Integration

Example fetch call from your React app:
```js
const res = await fetch("http://localhost:5000/api/products");
const products = await res.json();
```

For protected requests, include the JWT:
```js
const res = await fetch("http://localhost:5000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ items: [{ productId: "...", qty: 2 }] }),
});
```
