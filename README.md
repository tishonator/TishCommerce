# TishCommerce - Database-Free eCommerce for Virtual Products

**TishCommerce** is a **database-free, self-hosted eCommerce solution for selling virtual products** (digital downloads, WordPress themes, plugins, ebooks, software, etc.) built with **Next.js 16, TypeScript, Tailwind CSS, and Redux**. It's optimized for **small stores** with up to **200 products**, making it ideal for **independent developers and small business owners** who want to sell digital products online **without monthly SaaS fees** like Shopify, Snipcart, or Medusa.


## Live Demo
https://tishcommerce.vercel.app/

## Sceenshot
![TishCommerce Screenshot](https://tishonator.github.io/tishcommerce.png)

## Features
- **Virtual Products Only** – Designed specifically for selling digital downloads (themes, plugins, ebooks, software, courses).
- **No Database Required** – Products are stored in JSON files.
- **Fast & Lightweight** – Built with Next.js and optimized for performance.
- **Dynamic Category Pages** – Automatic category pages at `/products/{category-slug}` with SEO-friendly URLs (e.g., "WordPress Themes" → `/products/wordpress-themes`).
- **Payment Methods** – Stripe (credit/debit cards) and PayPal (Standard + Express Checkout) for secure online payments.
- **PayPal Express Checkout** – Available directly from the cart page and product details page for a faster checkout experience.
- **Secure Digital Downloads** – Payment-verified download links that only appear after successful Stripe/PayPal payment.
- **Free Products Support** – Offer free downloads with direct download buttons, perfect for freemium models or lead magnets.
- **Product Demos** – Add demo URLs to let customers preview themes, plugins, or products before purchasing.
- **Newsletter Integration (MailChimp)** – Capture leads via a newsletter signup connected to your MailChimp list.
- **Contact Form with Google reCAPTCHA v3** – Protects your inbox from spam while collecting user inquiries.
- **Order Processing via Email (Resend)** – Uses Resend to send order notifications to admins and customers.
- **SEO Optimized** – Fast, indexable product pages with automatic static generation.
- **Deploy Anywhere** – Works on Vercel, Cloudflare Pages, Netlify, or any static hosting.  

---

## Why Choose TishCommerce?  
- **Zero Cost** – 100% Free & Open-Source  
- **No Vendor Lock-in** – Self-host your store, full control over your data  
- **Ideal for Developers** – Modify, extend, or integrate with any service

---

## Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Redux
- **Storage**: JSON-based file system (No DB required)
- **Payment Methods**:
  - **Stripe Payment Element** – Secure credit/debit card payments with support for multiple payment methods.
  - **PayPal Standard Checkout** – Traditional PayPal checkout flow after form completion.
  - **PayPal Express Checkout** – One-click checkout available directly from cart and product pages.
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
- ProductImageGallery, Category
- **DownloadURL** (optional) - Add a Google Drive public link or direct download URL. Download URLs are automatically hidden from public APIs and only shown to customers after payment verification with Stripe/PayPal. For free products (price = 0), downloads are directly accessible.
- **DemoURL** (optional) - Add a live demo URL for products. A blue "DEMO" button will appear on both listing and detail pages, opening in a new tab.

This file is the source of truth for product listings shown on the site and is fully editable without a database. Perfect for managing WordPress themes, plugins, ebooks, digital assets, and other virtual products.

**/configs/locale.en.json** - Manages all localized content for your store’s interface including:
- UI labels (buttons, messages)
- Navigation menu items
- Footer and contact info
- Social media links
- Homepage and About page content

Use this to customize language, structure, and brand messaging across your storefront.

**/configs/checkout.json** - Defines all settings related to the checkout experience:
- Payment Methods: Includes Stripe and PayPal with enable/disable flags

This file allows you to customize your checkout options without any backend logic. Perfect for enabling/disabling payment methods.

**/configs/homepage.json** - Controls which sections are displayed on your homepage:
- **Banner**: Show/hide the hero banner section
- **Recent Products**: Show/hide recent products section and configure how many products to display (default: 3)
- **Brand Story**: Show/hide the brand story/about section
- **Testimonials**: Show/hide customer testimonials section
- **Newsletter**: Show/hide newsletter signup section
- **Brands/Partners**: Show/hide brands/partners section

This file allows you to customize your homepage layout without touching code. Simply set `"enabled": false` to hide any section, or adjust `"count"` for recent products.

Example:
```json
{
  "banner": { "enabled": true },
  "recentProducts": { "enabled": true, "count": 6 },
  "brandStory": { "enabled": false },
  "testimonials": { "enabled": true },
  "newsletter": { "enabled": true },
  "brands": { "enabled": false }
}
```

**/configs/products-listing.json** - Controls the products listing page settings:
- **Page Size**: Configure how many products to display per page (default: 18)

This file allows you to customize the pagination behavior on the products listing page without modifying code.

Example:
```json
{
  "pageSize": 18
}
```

To show 12 products per page instead, simply change the value to `12`.

**/configs/documentation-pages.json** - Defines all documentation pages displayed at `/documentation`:
- **Dynamic Routing**: Each page becomes accessible at `/documentation/{slug}` (e.g., `/documentation/getting-started`)
- **Content Management**: All page content, titles, descriptions managed in JSON
- **Order Control**: Set display order with the `order` field
- **Markdown Support**: Write content using markdown syntax (headings, lists, links, code blocks, bold, italic)

This file lets you create and manage a complete documentation system without touching any application code.

Example page structure:
```json
[
  {
    "slug": "getting-started",
    "title": "Getting Started",
    "description": "Learn how to set up and run TishCommerce",
    "order": 1,
    "content": "# Getting Started\n\nWelcome to TishCommerce!..."
  }
]
```

Each documentation page includes:
- Automatic breadcrumb navigation back to documentation index
- Previous/Next page navigation at the bottom
- Sidebar showing all documentation pages
- Full markdown rendering (headings, code blocks, lists, links)
- SEO-optimized metadata (title, description)

---

## Config-Only Customization Philosophy

**TishCommerce is designed so you NEVER need to modify application code.** All customization happens through JSON configuration files in the `/configs` folder.

### Why Config-Only?

When you use TishCommerce, the entire application codebase (components, pages, utilities, APIs) remains **unchanged**. You only edit JSON files to customize your store. This approach provides:

1. **Zero Coding Required** – Edit JSON files, no programming knowledge needed
2. **Safe Updates** – Pull latest TishCommerce updates without merge conflicts
3. **Easy Backups** – Just backup the `/configs` folder to save all customizations
4. **Version Control Friendly** – Track configuration changes without code noise
5. **Fast Customization** – Change content, products, settings instantly
6. **No Breaking Changes** – Application updates won't affect your custom content

### Configuration Files Overview

All store customization happens in these files:

- **`configs/products.json`** – Your entire product catalog (add, edit, remove products)
- **`configs/locale.en.json`** – All text content, labels, contact info, navigation, pages
- **`configs/checkout.json`** – Payment method settings (enable/disable Stripe, PayPal)
- **`configs/homepage.json`** – Control which homepage sections appear and how many products to show
- **`configs/products-listing.json`** – Set page size for products listing page (default: 18 products per page)
- **`configs/documentation-pages.json`** – Create and manage documentation pages with markdown content

### How It Works

Instead of editing React components or TypeScript files, you simply:

1. **Add Products**: Edit `configs/products.json` → Products appear instantly
2. **Customize Text**: Edit `configs/locale.en.json` → All UI text updates
3. **Toggle Features**: Edit `configs/homepage.json` → Sections show/hide
4. **Create Docs**: Edit `configs/documentation-pages.json` → New pages available

**Example:** Want to hide the newsletter section and show 6 recent products?

```json
// configs/homepage.json
{
  "recentProducts": { "enabled": true, "count": 6 },
  "newsletter": { "enabled": false }
}
```

**That's it!** No code changes, no rebuilding, no complexity.

### Benefits for Store Owners

- **Non-technical users** can manage the entire store
- **Developers** can update the app without affecting store content
- **Agencies** can deliver the same codebase to multiple clients
- **Updates** are just a `git pull` away without breaking customizations

This is what makes TishCommerce perfect for small businesses and developers who want full control without complexity.

---

**/.env.local** – Stores sensitive environment variables and runtime configuration for your store:

- **Newsletter (Mailchimp)**  
  - `MAILCHIMP_API_KEY` – Your Mailchimp API key  
  - `MAILCHIMP_AUDIENCE_ID` – ID of your Mailchimp Audience/List  
  - `MAILCHIMP_SERVER_PREFIX` – Server prefix from your Mailchimp account (e.g., `us19`, `us8`)

- **Google reCAPTCHA v3**  
  - `RECAPTCHA_SECRET_KEY` – Server-side reCAPTCHA key  
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` – Client-side reCAPTCHA key  

- **Email Notifications (Gmail SMTP)**
  - `GMAIL_USER` – Your Gmail address (used for sending all emails AND receiving admin notifications)
  - `GMAIL_APP_PASSWORD` – Gmail App Password (NOT your regular password - see setup guide below)

- **Payment (PayPal)**
  - `PAYPAL_USE_SANDBOX` – true to use PayPal sandbox (for testing), false for live transactions
  - `NEXT_PUBLIC_PAYPAL_CLIENT_ID` – PayPal Client ID (sandbox or live, depending on the flag)
  - `PAYPAL_CLIENT_SECRET` – PayPal Client Secret (used server-side to capture/verify orders)

- **Payment (Stripe Payment Element)**
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key used to initialize Stripe.js and the Stripe Payment Element on the client side
  - `STRIPE_SECRET_KEY` – Stripe secret key used on the server side to create PaymentIntents
  - `STRIPE_WEBHOOK_SECRET` – Secret used to verify Stripe webhook events (e.g., payment success/failure notifications)

Note: Never commit this file to Git or public repositories.

When deploying to Vercel, add these as Environment Variables in your project's Settings → Environment Variables panel.

---

### Stripe Webhook Setup (Required for Production)

**IMPORTANT:** Stripe payments are confirmed via webhooks, NOT client-side redirects. Without proper webhook setup, order confirmation emails will NOT be sent.

#### How Stripe Payment Verification Works
TishCommerce uses a dual-verification system for maximum reliability:

1. **Immediate Verification (Primary):**
   - When user lands on order confirmation page, payment is verified with Stripe API
   - If payment succeeded, order emails are sent immediately
   - Download links displayed instantly
   - Provides best user experience with immediate confirmation

2. **Webhook Backup (Fallback):**
   - Stripe webhook also listens for `payment_intent.succeeded` events
   - If user closes browser before landing on confirmation page, webhook still fires
   - Webhook checks if emails already sent (to prevent duplicates)
   - Ensures no orders are lost even if user navigation is interrupted

This dual approach gives you:
- ✅ Immediate email delivery when users complete checkout normally
- ✅ Backup processing via webhook if users close browser early
- ✅ No duplicate emails (system detects and prevents duplicates)
- ✅ Maximum reliability for order processing

#### Local Development Setup (Using Stripe CLI)

1. **Install Stripe CLI:**
   ```sh
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (with Scoop)
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe:**
   ```sh
   stripe login
   ```

3. **Forward webhooks to your local server:**
   ```sh
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```

4. **Copy the webhook signing secret:**
   - The CLI will output a webhook secret starting with `whsec_`
   - Add it to your `.env.local`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_xxx...
     ```

5. **Test a payment:**
   - Use test card: `4242 4242 4242 4242`
   - Check your terminal to see webhook events
   - Verify emails are sent

#### Production Deployment Setup (Vercel/Netlify/etc.)

1. **Deploy your app** to your hosting platform

2. **Create webhook endpoint in Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen to:
     - `payment_intent.succeeded` (Required)
     - `payment_intent.payment_failed` (Optional)
   - Click "Add endpoint"

3. **Copy the webhook signing secret:**
   - Click on your newly created webhook
   - Click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_`)

4. **Add to your environment variables:**
   - **Vercel:** Project Settings → Environment Variables
   - **Netlify:** Site Settings → Build & Deploy → Environment
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_xxx...`

5. **Redeploy your app** to apply the environment variable

6. **Test the webhook:**
   - In Stripe Dashboard, go to your webhook
   - Click "Send test webhook"
   - Select `payment_intent.succeeded`
   - Check your application logs to verify it received the event

#### Troubleshooting Webhooks

**Emails not being sent?**
- Check Stripe Dashboard → Webhooks → Your endpoint
- Look for failed webhook attempts (Stripe retries automatically)
- Check your application logs for webhook errors
- Verify `STRIPE_WEBHOOK_SECRET` is correctly set

**Webhook signature verification failing?**
- Ensure `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
- For production, use the live mode secret (not test mode)
- Redeploy after changing environment variables

**How to verify webhooks are working:**
- Stripe Dashboard → Webhooks → Your endpoint shows successful deliveries
- Application logs show: `✅ Payment succeeded: pi_xxx`
- Customers receive confirmation emails with download links

---

### Gmail SMTP Setup (For All Emails)

TishCommerce uses **one Gmail account** for all email functionality:
- ✉️ Sends order confirmation emails to customers
- ✉️ Receives admin order notifications (in the same Gmail inbox)
- ✉️ Receives contact form submissions (in the same Gmail inbox)

This is 100% free and allows sending to any email address (up to 500 emails/day).

#### Why Gmail App Password?

Gmail requires an **App Password** instead of your regular password for security. This is a 16-character password that Google generates specifically for apps.

#### How to Get Gmail App Password

**Step 1: Enable 2-Step Verification (Required)**

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the steps to enable it (if not already enabled)

**Step 2: Generate App Password**

1. After enabling 2-Step Verification, go to: https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. Under "App passwords", you'll see:
   - **Select app**: Choose "Mail" or "Other (Custom name)" and enter "TishCommerce"
   - **Select device**: Choose "Other (Custom name)" and enter "TishCommerce"
4. Click **Generate**
5. Google will show you a 16-character password like: `abcd efgh ijkl mnop`
6. **Copy this password** - you won't be able to see it again!

**Step 3: Add to .env.local**

```env
GMAIL_USER=yourname@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

**That's it!** Just 2 environment variables.

**Important Notes:**
- Use the App Password, NOT your regular Gmail password
- You can keep the spaces in the App Password or remove them (both work)
- `GMAIL_USER` is used for:
  - **Sending** all emails (customer orders, admin notifications, contact forms)
  - **Receiving** admin notifications and contact form submissions (in your Gmail inbox)
- Customer order confirmations are sent TO customers, admin notifications are sent TO yourself
- Gmail allows 500 emails per day on free accounts (more than enough for most stores)

**Email Flow:**
1. **Customer places order** → Customer receives email with download links
2. **Customer places order** → You receive admin notification in your Gmail
3. **Customer submits contact form** → You receive contact form in your Gmail

**Troubleshooting:**

If emails aren't sending:
1. Make sure 2-Step Verification is enabled
2. Make sure you're using an App Password, not your regular password
3. Check the server console for error messages
4. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correctly set in `.env.local`
5. Restart your dev server after changing environment variables

---

### TypeScript Validation
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

---

## Deployment

TishCommerce is fully compatible with **Vercel**, **Cloudflare Pages**, and **Netlify**. All configuration files are bundled at build time, eliminating file system dependencies and ensuring seamless deployment across all platforms.

### Deploy to Vercel (Recommended)

Vercel offers the best Next.js hosting experience with zero configuration:

#### Option 1: Deploy via Vercel CLI

```sh
# Install Vercel CLI globally
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts to link your project
# Vercel will auto-detect Next.js and configure everything
```

#### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel auto-detects Next.js settings
5. Add environment variables in Project Settings → Environment Variables:
   ```
   GMAIL_USER
   GMAIL_APP_PASSWORD
   MAILCHIMP_API_KEY
   MAILCHIMP_AUDIENCE_ID
   MAILCHIMP_SERVER_PREFIX
   RECAPTCHA_SECRET_KEY
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY
   NEXT_PUBLIC_PAYPAL_CLIENT_ID
   PAYPAL_CLIENT_SECRET
   PAYPAL_USE_SANDBOX
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   ```
6. Click "Deploy"

**Build Command:** `npm run build` or `npm run build:vercel`
**Output Directory:** `.next` (auto-detected)
**Install Command:** `npm install` (auto-detected)

---

### Deploy to Cloudflare Workers

Cloudflare Workers offers global edge deployment with excellent performance using the **OpenNext adapter** (the official recommended approach):

#### Prerequisites

OpenNext Cloudflare adapter is already installed in TishCommerce. The project is configured to work with Cloudflare Workers runtime.

#### Option 1: Deploy via CLI

```sh
# Login to Cloudflare (one-time setup)
npx wrangler login

# Deploy to Cloudflare Workers
npm run deploy:cloudflare
```

This single command:
1. Builds your Next.js app with OpenNext
2. Deploys to Cloudflare Workers automatically

#### Option 2: Preview Locally Before Deploy

```sh
# Build and preview locally on Cloudflare Workers runtime
npm run preview:cloudflare

# Open http://localhost:8787 to test
# When ready, deploy with:
npm run deploy:cloudflare
```

#### Option 3: Deploy via GitHub Integration (Pages)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Framework preset:** None (or Next.js)
   - **Build command:** `npm run build:cloudflare`
   - **Build output directory:** `.open-next/worker`
   - **Root directory:** `/` (leave empty)
6. Add environment variables in Settings → Environment Variables
   (same variables as Vercel list above)
7. Click "Save and Deploy"

**Important Notes:**
- Uses **OpenNext** (`@opennextjs/cloudflare`) - the official recommended adapter for Cloudflare
- Replaced deprecated `@cloudflare/next-on-pages` package
- All config files are bundled at build time (no runtime file system access needed)
- Supports Node.js runtime with full Cloudflare Workers compatibility
- Environment variables work the same way as Vercel

**Build Output:**
- OpenNext generates output in `.open-next/` directory
- Add `.open-next` to `.gitignore` (already configured)

**Learn More:**
- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Cloudflare Blog: Deploying Next.js with OpenNext](https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/)

---

### Deploy to Netlify

Netlify provides continuous deployment with automatic HTTPS:

#### Option 1: Deploy via Netlify CLI

```sh
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
netlify deploy --prod

# Follow the prompts
```

#### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Choose your Git provider and select your repository
5. Configure build settings:
   - **Build command:** `npm run build:netlify`
   - **Publish directory:** `.next`
   - **Functions directory:** Leave empty (handled by Essential Next.js plugin)
6. Netlify will automatically detect Next.js and apply the Essential Next.js plugin
7. Add environment variables in Site Settings → Environment Variables
   (same variables as Vercel list above)
8. Click "Deploy site"

**Build Command:** `npm run build:netlify` or `npm run build`
**Publish Directory:** `.next`
**Next.js Plugin:** Automatically applied (Essential Next.js)

**Important Notes:**
- Netlify's Essential Next.js plugin handles Next.js features automatically
- All config files are bundled at build time
- No additional configuration needed

---

### Environment Variables for All Platforms

All three platforms require the same environment variables. Add these in your deployment platform's settings:

**Required for Email (Gmail SMTP):**
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

**Required for Newsletter (MailChimp):**
```
MAILCHIMP_API_KEY=your-api-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
MAILCHIMP_SERVER_PREFIX=us19
```

**Required for Contact Form (Google reCAPTCHA v3):**
```
RECAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
```

**Required for PayPal:**
```
PAYPAL_USE_SANDBOX=false
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-secret
```

**Required for Stripe:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep sensitive keys (like `STRIPE_SECRET_KEY`, `GMAIL_APP_PASSWORD`) without this prefix.

---

### Post-Deployment Checklist

After deploying to any platform:

1. **Configure Stripe Webhook:**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select event: `payment_intent.succeeded`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

2. **Test Payment Processing:**
   - Place a test order with Stripe test card: `4242 4242 4242 4242`
   - Verify order confirmation email is received
   - Check that download links work

3. **Verify Email Sending:**
   - Test contact form submission
   - Confirm emails arrive in your Gmail inbox

4. **Check Product Images:**
   - Verify all product images load correctly
   - Ensure lightbox functionality works

5. **Test Category Pages:**
   - Visit `/products` and click on category filters
   - Verify category URLs like `/products/wordpress-themes` work

6. **Review Documentation:**
   - Check `/documentation` page loads
   - Test navigation between doc pages

---

### Build Commands Reference

```sh
# Local development
npm run dev

# Build for Vercel (standard Next.js build)
npm run build:vercel

# Build for Cloudflare Workers (using OpenNext)
npm run build:cloudflare

# Preview Cloudflare Workers locally
npm run preview:cloudflare

# Deploy to Cloudflare Workers
npm run deploy:cloudflare

# Build for Netlify (standard Next.js build)
npm run build:netlify

# Generic build (works for Vercel and Netlify)
npm run build
```

---

### Troubleshooting Deployment

**Build fails with "Cannot find module" errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that all config files exist in `/configs` folder
- Verify `tsconfig.json` is properly configured

**Images not loading:**
- Check that image paths in JSON configs are correct
- Verify images exist in `/public` directory
- Use absolute paths starting with `/` (e.g., `/images/product.jpg`)

**Environment variables not working:**
- Ensure variables are set in deployment platform dashboard
- Redeploy after adding new environment variables
- Check that `NEXT_PUBLIC_` prefix is used for client-side variables

**Stripe webhook not working:**
- Verify webhook URL is correct in Stripe Dashboard
- Check `STRIPE_WEBHOOK_SECRET` matches the one in Stripe
- Review deployment logs for webhook errors
- Test webhook using "Send test webhook" in Stripe Dashboard

**Emails not sending:**
- Verify Gmail App Password is correct (not regular Gmail password)
- Ensure 2-Factor Authentication is enabled on Gmail account
- Check SMTP credentials are correctly set in environment variables
- Review deployment logs for email sending errors

---

### How It Works
- **Product Listings** – All product data is stored in a flat products.json file. No database or backend is needed for product management.
- **Dynamic Category Pages** – Category pages are automatically generated at build time based on product categories:
  - Each unique category in products.json gets its own page at `/products/{category-slug}`
  - Category names are converted to SEO-friendly slugs: "WordPress Themes" → `/products/wordpress-themes`
  - Uppercase letters converted to lowercase, spaces replaced with hyphens
  - All category pages are statically generated for maximum performance
  - Examples: "Forms" → `/products/forms`, "eCommerce Plugins" → `/products/ecommerce-plugins`
- **Cart & Checkout** – Users add products to a cart, which is managed entirely in the browser using LocalStorage. During checkout, users enter billing info (name and email only) and select a payment method.
- **Payment Processing & Verification**
  - **PayPal**: Supports Express Checkout directly from the Cart and Product pages using the PayPal JavaScript SDK. Order emails are sent immediately after PayPal payment capture.
  - **Stripe:** Uses Stripe Payment Element to securely accept card and alternative payments. When user lands on order confirmation page, payment is verified with Stripe API, emails are sent immediately, and download links displayed. Stripe webhook provides backup processing if user closes browser early (no duplicate emails).
- **Secure Digital Downloads** – After payment verification, download URLs (from products.json) are displayed on the order confirmation page and included in confirmation emails. Free products (price = 0) offer direct downloads without payment.
- **Order Confirmation & Email** – For Stripe: Payment verified via API on confirmation page, emails sent immediately, webhook provides backup. For PayPal: Emails sent immediately after payment capture. All emails include direct download links.

### Release Notes

##### Release 1.2.2: Gmail SMTP Integration (01-Jan-2026)

**Email Service Migration:**
- **Switched from Resend to Gmail SMTP** – No more email service restrictions or domain verification requirements
  - Free tier allows 500 emails/day (sufficient for most stores)
  - Send to any email address without domain verification
  - Uses Gmail App Password for secure authentication
  - Customer emails prioritized (sent first with download links)
  - Admin emails sent 2 seconds later to respect rate limits
- **Rate Limit Handling** – Added 2-second delay between customer and admin emails to prevent Gmail SMTP rate limiting
- **Simplified Setup** – No third-party email service signup required, just use your Gmail account
- **Removed ADMIN_EMAIL** – Simplified configuration to use only `GMAIL_USER` for both sending and receiving
- **Updated Documentation** – Added comprehensive Gmail App Password setup guide with troubleshooting steps

**Technical Improvements:**
- Replaced Resend SDK with nodemailer for Gmail SMTP
- Sequential email sending: customer first (priority), admin second (with delay)
- Enhanced email logging for debugging
- Simplified from 3 email variables to just 2: `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Admin notifications now sent to the same Gmail account that sends emails

##### Release 1.2.1: Stripe Webhook Implementation & Simplified Checkout (31-Dec-2025)

**Critical Fix - Dual Payment Verification:**
- **Stripe Payment Verification with Backup** – Implemented dual-verification system for maximum reliability
  - **Primary:** Payment verified via Stripe API when user lands on order confirmation page, emails sent immediately
  - **Backup:** Stripe webhook (`payment_intent.succeeded`) processes orders if user closes browser before landing on confirmation page
  - Duplicate email prevention: System marks emails as sent in PaymentIntent metadata
  - Complete order data (billing info, cart items, order ID) stored in PaymentIntent metadata
  - Best user experience: Immediate email delivery + webhook backup for reliability
  - Added comprehensive webhook setup documentation for local development and production
  - **IMPORTANT:** Stripe webhook setup is REQUIRED for production deployments

**Checkout Simplification:**
- **Minimal Customer Information** – Checkout now only requires 3 fields for virtual products:
  - First Name, Last Name, Email
  - Removed: Country, State, City, Address, Postal Code, Phone
- **Email Validation** – Real-time client-side email validation with error messages
- **Download Link Notice** – Added informational text below email field: "Download links will be sent to this email address after payment confirmation"

**Direct Download Links:**
- **Removed Download API Endpoint** – Download URLs no longer verified via `/api/download`
- **Direct Downloads** – Product download links (from products.json) displayed immediately on order confirmation page after payment
- **Email Downloads** – Customer and admin emails now include direct download links for all purchased products
- **Simplified Flow** – No intermediate verification step, faster checkout experience

**Technical Improvements:**
- Updated `create-payment-intent` to store complete order data in Stripe metadata
- Updated webhook handler to process orders and send emails on payment success
- Updated PayPal Express Checkout buttons to use simplified billing form
- Enhanced validation in `/api/checkout/placeorder` with detailed error logging
- Removed shipping-related code from all PayPal integration components

**Migration Notes:**
- Stripe webhook must be configured for order emails to work
- See "Stripe Webhook Setup" section in README for detailed instructions
- Existing orders in localStorage remain compatible

##### Release 1.2.0: Virtual Products Only (30-Dec-2025)

**Breaking Changes:**
- **Removed Physical Product Support** – TishCommerce is now designed exclusively for virtual/digital products
  - Removed all shipping functionality (shipping methods, shipping forms, shipping calculations)
  - Removed shipping address collection from checkout
  - Simplified checkout to only collect billing information
  - Updated order emails to remove shipping details
- **Payment Methods** – Supports Stripe and PayPal for secure online payments:
  - **Stripe** - Credit/debit card payments via Stripe Payment Element
  - **PayPal Standard Checkout** - Traditional PayPal checkout flow
  - **PayPal Express Checkout** - Quick checkout available from cart and product pages
- **Removed Subscription Product Fields** – Cleaned up Product type to remove SubscriptionEnabled, SubscriptionType, and SaleSubscriptionType

**Product Data Updates:**
- Updated products.json with realistic virtual product examples (WordPress themes, plugins, ebooks, bundles)
- Added mix of free and paid products demonstrating all features
- Removed old book and subscription product examples

**Architecture Improvements:**
- Simplified checkout flow by removing shipping-related state management
- Reduced API payload sizes by eliminating shipping data from PayPal/Stripe requests
- Cleaner validation logic focused on billing and payment only
- Updated all utility functions and email templates for virtual products

**Why This Change?**
TishCommerce is now laser-focused on what it does best: selling digital downloads without complexity. If you need to sell physical products with shipping, consider using Release 1.1.0 or other eCommerce platforms designed for that purpose.

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
- Checkout with PayPal and Stripe payment methods
- Orders sent via email


### License
TishCommerce is released under the MIT License.


### Support My Work
I built TishCommerce as a free and open-source eCommerce solution to help small businesses and developers sell online without paying monthly SaaS fees.
Maintaining and improving this project takes a lot of time and effort. If you find it helpful, please consider supporting my work:

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?hosted_button_id=S88TKD55YVK7S)


Your support helps me keep this project alive and improve it further.
Thank you! ❤️
