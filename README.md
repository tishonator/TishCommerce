# TishCommerce - Database-Free eCommerce Solution  

**TishCommerce** is a **database-free, self-hosted eCommerce solution** built with **Next.js 16, TypeScript, Tailwind CSS, and Redux**. It's optimized for **small stores** with up to **200 products**, making it ideal for **independent developers and small business owners** who want to sell online **without monthly SaaS fees** like Shopify, Snipcart, or Medusa.


## Live Demo
https://tishcommerce.vercel.app/

## Sceenshot
![TishCommerce Screenshot](https://tishonator.github.io/tishcommerce.png)

## Features
- **No Database Required** – Products are stored in JSON files.
- **Fast & Lightweight** – Built with Next.js and optimized for performance.
- **Cart & Checkout** – LocalStorage cart with Stripe, PayPal (Standard + Express Checkout), and Cash on Delivery.
- **PayPal Express Checkout** – Available directly from the cart page and product details page for a faster checkout experience.
- **Secure Digital Downloads** – Sell digital products (themes, plugins, ebooks) with payment-verified download links that only appear after successful Stripe/PayPal payment.
- **Free Products Support** – Offer free downloads with direct download buttons, perfect for freemium models or lead magnets.
- **Product Demos** – Add demo URLs to let customers preview themes, plugins, or products before purchasing.
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
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Redux
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
- **DownloadURL** (optional) - For digital products, add a Google Drive public link. Download URLs are automatically hidden from public APIs and only shown to customers after payment verification with Stripe/PayPal. For free products (price = 0), downloads are directly accessible.
- **DemoURL** (optional) - Add a live demo URL for products. A blue "DEMO" button will appear on both listing and detail pages, opening in a new tab.

This file is the source of truth for product listings shown on the site and is fully editable without a database. You can manage physical products, digital products, and free products here.

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

### Build for Production
Before running the production server or deploying, you need to build your app:

```sh
npm run build
```

This creates an optimized production build in the `.next` directory.

### Run the Production Server
After building, start the production server:

```sh
npm run start
```

The production build is optimized for performance and should be used for deployment.

**Note:** Always run `npm run build` before `npm run start`. If you get an error about missing `.next` directory, it means you need to build first.

### How It Works
- **Product Listings** – All product data is stored in a flat products.json file. No database or backend is needed for product management.
- **Cart & Checkout** – Users add products to a cart, which is managed entirely in the browser using LocalStorage. During checkout, users enter shipping/billing info and select a payment method.
- **Payment Processing**
  - **PayPal**: Supports Express Checkout directly from the Cart and Product pages using the PayPal JavaScript SDK.
  - **Stripe:** Uses Stripe Payment Element to securely accept card and alternative payments inside the checkout page.
  - **Cash on Delivery**: Allows customers to place orders without upfront payment.
- **Secure Digital Downloads** – For digital products, download URLs (stored in products.json) are never exposed via public APIs. After successful payment, the system verifies the transaction with Stripe/PayPal APIs and only then displays download links on the order confirmation page and in the customer email.
- **Order Confirmation & Email** – After payment, orders are stored in localStorage and a summary page is shown. A confirmation email is sent to both the customer and store admin via the Resend API.

### Release Notes

##### Release 1.1.0: Digital Products & Bug Fixes (30-Dec-2025)

**New Features:**
- **Secure Digital Downloads** – Implemented payment-verified download system for selling digital products (WordPress themes, plugins, ebooks)
  - Download URLs stored in products.json but never exposed via public APIs
  - Payment verification with Stripe/PayPal APIs before showing download links
  - Download links displayed on order confirmation page and in customer emails
- **Free Products Support** – Products with price = 0 are now fully supported
  - Display "FREE" badge instead of price
  - Direct download button for free products with DownloadURL
  - No cart or payment buttons shown for free products
- **Demo URLs** – Added DemoURL field for products
  - Blue "DEMO" button displayed on both listing and detail pages
  - Opens demo in new tab for users to preview before purchasing
  - Works for both free and paid products
- **Product URL Structure** – Changed from `/products/[slug]` to `/product/[slug]` for cleaner URLs
- **Environment Configuration** – Added comprehensive .env.local template with all required variables

**Critical Bug Fixes:**
- Fixed Stripe payment intent not storing product IDs (downloads wouldn't work)
- Fixed PayPal orders not including product SKUs (downloads wouldn't work)
- Fixed download endpoint incorrectly extracting product IDs from Stripe metadata
- Fixed Stripe orders never being placed on server (no emails were sent)
- Fixed download endpoint to properly verify payments before returning URLs

**Improvements:**
- Upgraded all npm packages to latest versions (Next.js 16.1, React 19.2, Stripe 20.1, PayPal 9.1)
- Added detailed email debugging logs for troubleshooting
- Updated all internal product links to use new URL structure
- Enhanced product type definitions with DownloadURL and DemoURL fields
- Improved button layouts for different product types (free/paid, with/without demo)

**Developer Notes:**
- Product downloads require payment verification via Stripe/PayPal APIs
- Free products bypass payment and offer direct downloads
- DownloadURL field is automatically filtered from public API responses
- All purchase-related buttons hidden for free products

##### Release 1.0.0: MVP (28-March-2025)

- JSON-based product listings
- Cart stored in LocalStorage
- Checkout with Cash on Delivery, PayPal, Stripe
- Orders sent via email


### License
TishCommerce is released under the MIT License.


### Support My Work
I built TishCommerce as a free and open-source eCommerce solution to help small businesses and developers sell online without paying monthly SaaS fees.
Maintaining and improving this project takes a lot of time and effort. If you find it helpful, please consider supporting my work:

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=S88TKD55YVK7S)


Your support helps me keep this project alive and improve it further.
Thank you! ❤️
