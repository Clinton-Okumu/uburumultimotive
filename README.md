# Uburu Multimove - Homeless Shelter NGO

"Touching one homeless person at a time"

A modern, responsive website for Uburu Multimove, a non-profit organization supporting homeless individuals through shelter, meals, and community outreach.

## Features

- Home page with hero, causes, testimonials, and volunteer call-to-action
- About page with mission and impact information
- Causes, gallery, blog, and contact pages
- Donations flow (DPO hosted payment page)
- Responsive UI built with Tailwind CSS

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router

## Local development

1. Clone and install:

```bash
git clone <repository-url>
cd uburumultimove
npm install
```

2. Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173

## Deployment (Truehost shared hosting)

This project is a Vite SPA plus a small set of PHP endpoints used for DPO payments.

1. Build:

```bash
npm run build
```

2. Upload frontend:

- Upload `dist/` to `public_html/`

3. Upload payment endpoints:

- Upload `public/api/dpo/create-token.php` to `public_html/api/dpo/create-token.php`
- Upload `public/api/dpo/verify-token.php` to `public_html/api/dpo/verify-token.php`

4. Ensure rewrites do not break the API:

- Upload `.htaccess` to `public_html/`
- Confirm it includes an API bypass rule (this repo uses `RewriteRule ^api/ - [L]`)

5. Configure DPO server-side settings (recommended outside `public_html`):

- Copy `dpo_config.example.php` to a secure path, for example:
  - `/home/<user>/dpo_config.php`
- Set the hosting environment variable:

```text
DPO_CONFIG_PATH=/home/<user>/dpo_config.php
```

- Set `redirect_url` and `back_url` in your config to your live domain, for example:

```text
https://yourdomain.com/donate/return
```

Notes:

- `dpo_config.php` contains secrets and should not be committed.
- The donation form supports these currencies (must be enabled on your DPO account): `KES`, `USD`, `EUR`, `GBP`.

## Available scripts

- `npm run dev` - Start development server
- `npm run build` - Typecheck and build production assets
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project structure

```text
src/
  assets/
  components/
  pages/
  main.tsx
public/
  api/
    dpo/
      create-token.php
      verify-token.php
```
