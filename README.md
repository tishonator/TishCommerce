# TishCommerce - Database-Free eCommerce Solution  

TishCommerce is a **database-free, self-hosted eCommerce solution** built with **Next.js 15, TypeScript, Tailwind CSS, and Redux**. It is designed for developers and small business owners who want to sell products online **without paying monthly SaaS fees** like Shopify, Snipcart, or Medusa.

## Live Demo
https://tishcommerce.vercel.app/

## Sceenshot
![TishCommerce Screenshot](https://tishonator.github.io/tishcommerce.png)

## Features  
- **No Database Required** – Products are stored in JSON files.  
- **Fast & Lightweight** – Built with Next.js and optimized for performance.  
- **Cart & Checkout** – LocalStorage cart + Stripe, PayPal, and Cash on Delivery checkout. 
- **Newsletter Integration (MailChimp)** – Capture leads via a newsletter signup connected to your MailChimp list.
- **Contact Form with Google reCAPTCHA v3** – Protects your inbox from spam while collecting user inquiries.
- **Order Processing via Email** – No database, just simple email notifications.
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
- **Payments**: Stripe API, PayPal API  
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

**/products.json** - Contains all the product data for your store. Each product includes fields like:
- ID, Title, Slug, ShortDescription, LongDescription
- RegularPrice, SalePrice, Currency, FeatureImageURL
- ProductImageGallery, Category, SubscriptionType, etc.

This file is the source of truth for product listings shown on the site and is fully editable without a database. You can manage physical or digital products here.

**/locales/en.json** - Manages all localized content for your store’s interface including:
- UI labels (buttons, messages)
- Navigation menu items
- Footer and contact info
- Social media links
- Homepage and About page content

Use this to customize language, structure, and brand messaging across your storefront.

**/checkout.json** - Defines all settings related to the checkout experience:
- Shipping Methods: Names, prices, and currencies
- Available Countries: Separate lists for shipping and billing countries
- Payment Methods: Includes Stripe, PayPal, and Cash on Delivery with enable/disable flags

This file allows you to customize your checkout options without any backend logic. It’s perfect for adjusting your business model or enabling/disabling services easily.

**/.env.local** - Stores sensitive environment variables and runtime configuration like:
- Email service API keys (e.g. Resend, SendGrid, SMTP)
- Payment gateways (e.g. Stripe secret key, PayPal client ID)
- Admin passwords, reCAPTCHA keys, feature flags

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
- Product Listings – Products are stored in a simple products.json file.  
- Cart & Checkout – Users add items to cart (stored in LocalStorage).  
- Payment Processing – Integrated with PayPal & Stripe APIs.  
- Order Confirmation – Orders are emailed to the store owner.  

### Release Notes

##### Release 1.0.0: MVP (30-April-2025)

- JSON-based product listings
- Cart stored in LocalStorage
- Checkout with Cash on Delivery, PayPal, Stripe
- Orders sent via email
- Basic JSON Admin Panel


### License
TishCommerce is released under the MIT License.
