# AGENTS.md

This document describes the project architecture for AI agents and developers working in this codebase.

## Project Overview

An IT support customer portal built with TanStack Start on Netlify. Customers can view their IT service subscription statuses and contact support via WhatsApp.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
public/               Static assets (favicon, logos)
src/
  routes/
    __root.tsx        Root HTML shell, global head tags, page title
    index.tsx         Main subscription dashboard page (/)
  styles.css          Global Tailwind CSS import + base font rules
  router.tsx          TanStack Router setup
netlify.toml          Build + dev server config (port 8888 → 3000)
vite.config.ts        Vite plugins: TanStack Start, Netlify, Tailwind
tsconfig.json         Strict TS, @/* alias → src/*
package.json          Dependencies and scripts
```

## Key Files

### `src/routes/index.tsx`

The entire dashboard lives here. Key exports / constants:

- `WHATSAPP_NUMBER` – WhatsApp Business phone (digits + country code). **Must be updated** before production.
- `WHATSAPP_MESSAGE` – URL-encoded default message sent when the chat button is tapped.
- `services` array – static subscription data. Replace with a server function / API route call when real data is available.
- `statusConfig` – maps `'active' | 'expiring' | 'expired'` to colours, labels, and icons.
- `ServiceCard` component – renders one subscription row.
- `WhatsAppButton` – floating fixed-position CTA that opens a `wa.me` deep link.

## Conventions

- **Routing**: file-based via TanStack Router. Add pages as `src/routes/<name>.tsx`.
- **Styling**: Tailwind utility classes only; no custom CSS beyond the `styles.css` base layer.
- **Icons**: Lucide React — import only what you use.
- **TypeScript**: strict mode, `@/` alias for `src/`.
- **Data persistence**: use Netlify Blobs or Netlify Functions for any server-side data. Never use in-memory stores or local JSON files for persistent data.

## Non-Obvious Decisions

- The subscription data is static for the MVP. The `Service` interface and `services` array in `index.tsx` are the contracts to implement against when wiring up a real data source.
- `daysLeft` is negative for expired services; the UI renders `Math.abs(daysLeft)` with an "overdue" label.
- The WhatsApp deep link uses the `wa.me/<number>?text=<encoded>` format, which works for both mobile WhatsApp and WhatsApp Web.

## Development Commands

```bash
npm run dev     # Vite dev server on :3000 (use Netlify CLI on :8888 for full Netlify features)
npm run build   # Production build → dist/client
```
