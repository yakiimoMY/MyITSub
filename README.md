# IT Support Portal – Subscription Status Dashboard

A customer-facing dashboard that lets end-users check the status of their IT service subscriptions at a glance, with a one-tap WhatsApp chat button for immediate support.

## Features

- **Subscription overview** – see all IT services (antivirus, internet, remote support, cloud backup, email) with their current status: Active, Expiring Soon, or Expired.
- **Summary counters** – quick totals at the top for Active / Expiring / Expired services.
- **Renewal dates & days remaining** – each service card shows exactly when it renews and how many days are left (or overdue).
- **WhatsApp chat button** – a floating button that opens a pre-filled WhatsApp conversation with the support team.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (React 19) |
| Routing | TanStack Router v1 (file-based) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Deployment | Netlify |

## Getting Started

```bash
npm install
npm run dev        # dev server on http://localhost:3000
npm run build      # production build
```

## Configuration

### WhatsApp Number

Open `src/routes/index.tsx` and update the constant near the top:

```ts
const WHATSAPP_NUMBER = '60123456789'  // ← replace with your WhatsApp Business number
```

### Cloudflare Deployment

This repo includes a Cloudflare Wrangler config at `wrangler.toml` to deploy the built app as a Cloudflare Workers Site.

1. Install Wrangler locally:

```bash
npm install -D wrangler
```

2. Set your Cloudflare account ID in `wrangler.toml`:

```toml
account_id = "YOUR_ACCOUNT_ID"
```

3. Build and publish:

```bash
npm run deploy:cloudflare
```

4. During local development with Cloudflare Workers:

```bash
npm run dev:cloudflare
```

If you want to deploy through Cloudflare Pages instead, publish the `dist/client` folder as the site output directory.

Use digits only with the country code (e.g. `601XXXXXXXX` for Malaysia).

### Subscription Data

Subscription records are currently defined as a static array (`services`) in `src/routes/index.tsx`. Replace this with a real API call or Netlify Function as your backend grows.
