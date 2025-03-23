# TishCommerce - Database-Free eCommerce Solution  

TishCommerce is a **database-free, self-hosted eCommerce solution** built with **Next.js 15, TypeScript, Tailwind CSS, and Redux**. It is designed for developers and small business owners who want to sell products online **without paying monthly SaaS fees** like Shopify, Snipcart, or Medusa.

## Live Demo
https://tishcommerce.vercel.app/

## Sceenshot
![TishCommerce Screenshot](https://tishonator.github.io/tishcommerce.png)

## Features  
**No Database Required** – Products are stored in JSON files.  
**Fast & Lightweight** – Built with Next.js and optimized for performance.  
**Cart & Checkout** – LocalStorage cart + Stripe/PayPal checkout. 
**Order Processing via Email** – No database, just simple email notifications.
**SEO Optimized** – Fast, indexable product pages.  
**Deploy Anywhere** – Works on Vercel, or any static hosting.  

---

## Why Choose TishCommerce?  
**Zero Cost** – 100% Free & Open-Source  
**No Vendor Lock-in** – Self-host your store, full control over your data  
**Ideal for Developers** – Modify, extend, or integrate with any service

---

## Tech Stack  
**Frontend**: Next.js 15, TypeScript, Tailwind CSS, Redux  
**Storage**: JSON-based file system (No DB required)  
**Payments**: Stripe API, PayPal API  
**Hosting**: Vercel, or any static hosting  

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

**/products.json** - update with your products data.

**/locales/en.json** - update text labels, contact details, menu items, social links, etc.

**/.env.local** – define environment-specific settings such as email delivery, payment integrations, and admin access. This file is used for secrets and flags that control your store’s backend behavior. Do not commit it to version control. If deploying to Vercel, define these environment variables in your project’s Settings → Environment Variables section.

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
Product Listings – Products are stored in a simple products.json file.  
Cart & Checkout – Users add items to cart (stored in LocalStorage).  
Payment Processing – Integrated with PayPal & Stripe APIs.  
Order Confirmation – Orders are emailed to the store owner.  

### Release Notes

##### Release 1.0.0: MVP (30-April-2025)

- JSON-based product listings
- Cart stored in LocalStorage
- Checkout with PayPal/Stripe
- Orders sent via email
- Basic JSON Admin Panel


### License
TishCommerce is released under the MIT License.
