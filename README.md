# Uburu Multimove - Digital Platform & Management System

> *"Touching one homeless person at a time"*

A modern full-stack web platform built for **Uburu Multimove**, integrating charitable outreach, an e-commerce catalog (**Uburu Home**), cultural experiences (**Uburu Village**), a dedicated mental health and wellness booking engine (**Uburu Therapy**), an authenticated Admin Management Suite, and automated CI/CD deployment pipelines.

---

## 🌟 Platform Overview & Core Modules

### 1. 🏠 Uburu Home (E-Commerce Storefront)
- **Dynamic Marketplace**: Categorized shopping experience supporting apparel, merchandise, books, and lifestyle items.
- **Cart & Checkout**: Persistent cart storage, delivery county calculation, pickup selection, and promo code support.
- **Database Catalog**: Live synchronized catalog backed by MySQL (`/api/home/catalog.php`) with fallback local caching.

### 2. 🧠 Uburu Therapy (Mental Health & Holistic Wellness)
- **Support Pathways**:
  - **Individual Therapy**: 1-to-1 virtual & physical counseling sessions.
  - **Couples Counseling**: Relationship rebuilding and mediation.
  - **Support Groups**: Group healing circles.
  - **Life Coaching**: Personal growth and goal alignment roadmaps.
  - **Medical Consultation**: Specialist psychiatric and holistic medical consultations.
- **Dynamic Session Packages**: Fully configurable session tiers (1, 4, 6, 8, 10 sessions) with dual-currency support (KES & USD).
- **Public Pricing**: Live rates synchronization across marketing pages (`/pricing`) and booking forms (`/get/therapy`).

### 3. 🦒 Uburu Village (Experiences & Travel)
- Cultural and therapeutic experiences (e.g., Maasai Mara packages, community outreach events).
- Dynamic booking checkout and ticket generation.

### 4. 🔐 Admin Management Panel (`/admin`)
- **Authentication**: Protected admin session gate (`/admin/login`) with persistent session tokens and secure route guards.
- **Uburu Home Management**:
  - Add, edit, and organize product categories.
  - Create and manage store items, stock status, pricing, and image uploads.
- **Uburu Therapy Management**:
  - **Therapy Dashboard** (`/admin/therapy`): Key metrics, live card previews, base rate breakdown.
  - **Services Configurator** (`/admin/therapy/services`): Live visual editor for pathway badges, descriptions, icons, and visibility toggles.
  - **Pricing Manager** (`/admin/therapy/pricing`): Multi-tier session packages, modality assignment (Online / In-Person), KES and USD pricing, and highlighted/popular badges.
  - **Global Server Sync**: Changes made in Admin automatically persist to the server backend (`/api/therapy/config.php`) so all visitors and payment flows update in real time.

---

## 💳 Payment Gateway Architecture

All transactions (Donations, Store purchases, Event tickets, and Therapy bookings) run through **Direct Pay Online (DPO Group)**:

1. **Token Generation (`/api/dpo/create-token.php`)**:
   - Dynamic pricing calculated in the React client is passed in the JSON payload.
   - The backend creates a secure DPO payment token matching the exact amount and currency (`KES` / `USD`).
2. **Gateway Redirection**:
   - Customers complete payment via M-Pesa, Card, or mobile wallets on DPO's secure portal.
3. **Payment Verification (`/api/dpo/verify-token.php`)**:
   - Automatic return handling and receipt generation (`/donate/return` and `/purchase/return`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, React Router v7.
- **Backend API**: PHP 8.x endpoints for MySQL catalog management, DPO payment gateway integration, form processing, and therapy configuration persistence.
- **Database**: MySQL (for Uburu Home catalog and items) + server-side JSON storage.
- **CI/CD & Hosting**: GitHub Actions, FTPS deployment via `SamKirkland/FTP-Deploy-Action`, Apache/cPanel (Truehost Cloud).

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 20+ (recommended: Node 22)
- npm or pnpm

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Clinton-Okumu/uburumultimotive.git
   cd uburumultimotive
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run build
   ```

---

## 🔄 Automated CI/CD Deployment (GitHub Actions to cPanel)

The repository features an automated deployment pipeline in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Every push to `main` automatically runs typechecks, compiles production assets, verifies `.htaccess` and `/api/` endpoints, and deploys modified files over secure FTPS to cPanel.

### GitHub Environment Secrets Configuration

In your GitHub repository, navigate to **Settings &rarr; Environments &rarr; Production** and configure the following secrets:

| Secret Name | Value / Description | Example |
| :--- | :--- | :--- |
| **`FTP_SERVER`** | Truehost server hostname matching the SSL certificate | `gra108.truehost.cloud` |
| **`FTP_USERNAME`** | Full cPanel FTP account username | `deploy@uburumultimovehs.org` |
| **`FTP_PASSWORD`** | Password created for this FTP account in cPanel | *(Your secure password)* |
| **`FTP_SERVER_DIR`** | Target directory on the server (when FTP root is `public_html`) | `/` |
| **`FTP_PORT`** | Optional (defaults to 21) | `21` |

### Setting up the FTP Account in cPanel
1. In cPanel, navigate to **FTP Accounts &rarr; Add FTP Account**.
2. **Log In**: `deploy` (yielding `deploy@uburumultimovehs.org`).
3. **Directory**: `/home/uburumul/public_html` *(points directly to the web root)*.
4. **Quota**: `Unlimited`.
5. Click **Create FTP Account**.

---

## 📁 Repository Structure

```text
uburumultimotive/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated build & FTPS cPanel deployment
├── public/
│   ├── .htaccess                 # Apache SPA rewrite and API passthrough
│   └── api/
│       ├── dpo/
│       │   ├── create-token.php  # DPO payment token generation
│       │   └── verify-token.php  # Payment callback verification
│       ├── forms/                # Contact, Volunteer, & Donation PHP mailers
│       ├── home/                 # MySQL endpoints for categories, items, and image upload
│       │   ├── catalog.php
│       │   ├── categories.php
│       │   ├── items.php
│       │   └── upload.php
│       └── therapy/
│           └── config.php        # Global server persistence for therapy pathways & pricing
├── src/
│   ├── admin/                    # Authenticated Admin Panel
│   │   ├── auth/                 # AdminAuthContext & AdminProtectedRoute
│   │   ├── components/           # AdminSidebar, AdminHeader, AdminLayout
│   │   ├── data/                 # homeAdminStorage.ts & therapyAdminStorage.ts
│   │   └── pages/                # AdminDashboard, Categories, Items, Therapy Config
│   ├── components/
│   │   ├── Layout/               # Public Navbar, Footer, Mobile Navigation
│   │   ├── TherapyComponents/    # Dynamic booking forms (Therapy, Coaching, Medical)
│   │   ├── UburuHomeComponents/  # Storefront categories, grid, rails, showcase
│   │   └── shared/               # Reusable buttons, cards, modals
│   ├── data/                     # Fallback initial catalogs and definitions
│   ├── hooks/                    # useHomeCategories, useStorefrontCheckout
│   ├── pages/                    # Public pages (Home, Therapy, Pricing, Checkout, etc.)
│   ├── App.tsx                   # Central router & startup data synchronization
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📜 Available NPM Scripts

- `npm run dev` &mdash; Starts the local Vite development server with Hot Module Replacement (HMR).
- `npm run build` &mdash; Runs strict TypeScript compilation (`tsc -b`) followed by Vite production bundling.
- `npm run preview` &mdash; Runs a local preview server for testing production build artifacts.
- `npm run lint` &mdash; Runs ESLint against the entire codebase.

---

## 🛡️ License

This project is proprietary and maintained for **Uburu Multimove**. All rights reserved.
