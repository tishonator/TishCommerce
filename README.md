# TishCommerce - Database-Free eCommerce Solution  

**TishCommerce** is a **database-free, self-hosted eCommerce solution** built with **Next.js 15, TypeScript, Tailwind CSS, and Redux**. It’s optimized for **small stores** with up to **200 products**, making it ideal for **independent developers and small business owners** who want to sell online **without monthly SaaS fees** like Shopify, Snipcart, or Medusa.


## Live Demo
https://tishcommerce.vercel.app/

## Sceenshot
![TishCommerce Screenshot](https://tishonator.github.io/tishcommerce.png)

## Features  
- **No Database Required** – Products are stored in JSON files.  
- **Fast & Lightweight** – Built with Next.js and optimized for performance.  
- **Cart & Checkout** – LocalStorage cart with Stripe, PayPal (Standard + Express Checkout), and Cash on Delivery.
- **PayPal Express Checkout** – Available directly from the cart page and product details page for a faster checkout experience.
- **Newsletter Integration (MailChimp)** – Capture leads via a newsletter signup connected to your MailChimp list.
- **Contact Form with Google reCAPTCHA v3** – Protects your inbox from spam while collecting user inquiries.
- **Order Processing via Email (Resend)** – Uses Resend to send order notifications to admins and customers. 
- **SEO Optimized** – Fast, indexable product pages.  
- **Deploy Anywhere** – Works on Vercel, or any static hosting.  

---

## Why Choose TishCommerce?  
- **Zero Cost** – 100% Free & Open-Source  
- **No Vendor Lock-in** – Self-host your store, full control over your data  
- **Ideal for Developers** – Modify, extend, or integrate with any service

---

## Tech Stack  
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Redux  
- **Storage**: JSON-based file system (No DB required)  
- **Payments**:
  - **Stripe Payment Element** – Embedded card payments using the official Stripe Elements integration.
  - **PayPal Standard Checkout** – Classic checkout flow after form completion.
  - **PayPal Express Checkout** – Instant checkout available directly from cart and product pages.  
- **Hosting**: Vercel, or any static hosting  

---

## Getting Started  

### Clone the Repository
```sh
git clone https://github.com/tishonator/TishCommerce.git
cd TishCommerce
```

### Install Dependencies
```sh
npm install
```

### Configuration

**/configs/products.json** - Contains all the product data for your store. Each product includes fields like:
- ID, Title, Slug, ShortDescription, LongDescription
- RegularPrice, SalePrice, Currency, FeatureImageURL
- ProductImageGallery, Category, SubscriptionType, etc.

This file is the source of truth for product listings shown on the site and is fully editable without a database. You can manage physical or digital products here.

**/configs/locale.en.json** - Manages all localized content for your store’s interface including:
- UI labels (buttons, messages)
- Navigation menu items
- Footer and contact info
- Social media links
- Homepage and About page content

Use this to customize language, structure, and brand messaging across your storefront.

**/configs/checkout.json** - Defines all settings related to the checkout experience:
- Shipping Methods: Names, prices, and currencies
- Available Countries: Separate lists for shipping and billing countries
- Payment Methods: Includes Stripe, PayPal, and Cash on Delivery with enable/disable flags

This file allows you to customize your checkout options without any backend logic. It’s perfect for adjusting your business model or enabling/disabling services easily.

**/.env.local** – Stores sensitive environment variables and runtime configuration for your store:

- **Newsletter (Mailchimp)**  
  - `MAILCHIMP_API_KEY` – Your Mailchimp API key  
  - `MAILCHIMP_AUDIENCE_ID` – ID of your Mailchimp Audience/List  
  - `MAILCHIMP_SERVER_PREFIX` – Server prefix from your Mailchimp account (e.g., `us19`, `us8`)

- **Google reCAPTCHA v3**  
  - `RECAPTCHA_SECRET_KEY` – Server-side reCAPTCHA key  
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` – Client-side reCAPTCHA key  

- **Email Notifications (Resend)**  
  - `RESEND_API_KEY` – Resend API key for sending transactional emails  
  - `RESEND_FROM_EMAIL` – Verified sender email address  

- **Admin**  
  - `ADMIN_EMAIL` – Email address where new order notifications are sent

- **Payment (PayPal)**
  - `PAYPAL_USE_SANDBOX` – true to use PayPal sandbox (for testing), false for live transactions
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` – PayPal Client ID (sandbox or live, depending on the flag)
  - `PAYPAL_CLIENT_SECRET` – PayPal Client Secret (used server-side to capture/verify orders)

- **Payment (Stripe Payment Element)**
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key used to initialize Stripe.js and the Stripe Payment Element on the client side
  - `STRIPE_SECRET_KEY` – Stripe secret key used on the server side to create PaymentIntents
  - `STRIPE_WEBHOOK_SECRET` – Secret used to verify Stripe webhook events (e.g., payment success/failure notifications)

Note: Never commit this file to Git or public repositories.

When deploying to Vercel, add these as Environment Variables in your project’s Settings → Environment Variables panel.



### Code and TypeScript Validation
```sh
npm run lint
```

```sh
npx tsc --noEmit
```

### Run the Development Server
```sh
npm run dev
```

Then open http://localhost:3000 in your browser.


### How It Works
- **Product Listings** – All product data is stored in a flat products.json file. No database or backend is needed for product management.
- **Cart & Checkout** – Users add products to a cart, which is managed entirely in the browser using LocalStorage. During checkout, users enter shipping/billing info and select a payment method.
- **Payment Processing**
  - **PayPal**: Supports Express Checkout directly from the Cart and Product pages using the PayPal JavaScript SDK.
  - **Stripe:** Uses Stripe Payment Element to securely accept card and alternative payments inside the checkout page.
  - **Cash on Delivery**: Allows customers to place orders without upfront payment.
- **Order Confirmation & Email** – After payment, orders are stored in localStorage and a summary page is shown. A confirmation email is sent to both the customer and store admin via the Resend API.

### Release Notes

##### Release 1.0.0: MVP (28-March-2025)

- JSON-based product listings
- Cart stored in LocalStorage
- Checkout with Cash on Delivery, PayPal, Stripe
- Orders sent via email


### License
TishCommerce is released under the MIT License.
