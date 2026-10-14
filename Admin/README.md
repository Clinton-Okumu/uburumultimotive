# Uburu Admin Management Suite

The unified admin suite administers **Uburu Home** (store categories & items), **Uburu Therapy** (mental health pathways & multi-session pricing), and **Uburu Village** (eco-cultural tours, retreats & events).

## Overview & Architecture
- **Completely Isolated Layout**: Runs on its own standalone layout (`AdminLayout.tsx`) without public website headers, footers, or customer cart drawers.
- **Brand Consistency**: Adheres to Uburu's deep navy/slate dark theme (`#141b2d`), vibrant amber/yellow highlights (`amber-400` / `yellow-400`), clean typography, and high-density metric cards.
- **Persistent Storage & Server Sync**:
  - **Uburu Home**: Synchronized via `homeAdminStorage.ts` with MySQL endpoints (`/api/home/*.php`).
  - **Uburu Therapy**: Synchronized via `therapyAdminStorage.ts` with server JSON storage (`/api/therapy/config.php`).
  - **Uburu Village**: Synchronized via `villageAdminStorage.ts` with server JSON storage (`/api/village/events.php`).
  - Real-time client updates driven by custom DOM events (`uburu_home_catalog_updated`, `uburu_therapy_config_updated`, `uburu_village_events_updated`) and cross-tab `storage` listeners.

## Sidebar Navigation
- **UBURU HOME (Storefront)**:
  - **Overview** (`/admin`): Department counts, total items, stock status, and recently added products.
  - **Categories** (`/admin/categories`): Visual grid of departments with banner photography, items count, direct "Add Item" action, and store preview.
  - **Catalog Items** (`/admin/items`): Searchable catalog filtered by department pills, stock availability, price, and delete actions.
  - **Add Item** (`/admin/add-item`): Rich form with photo upload, pricing, discount, stock, brand, and feature bullets.
  - **Add Category** (`/admin/add-category`): Create new store department with highlight artwork, slug, tagline, and department type.
- **UBURU THERAPY (Clinical & Wellbeing)**:
  - **Overview** (`/admin/therapy`): Active services count, pricing package matrix, and card previews.
  - **Pathways & Services** (`/admin/therapy/services`): Customize titles, badges, descriptions, icons, and visibility toggles.
  - **Pricing & Plans** (`/admin/therapy/pricing`): Multi-tier session packages, modality assignment (Online vs In-Person), KES and USD rates.
- **UBURU VILLAGE (Experiences & Travel)**:
  - **Overview** (`/admin/village`): Total events, active/published status, featured status, starting rates, and live preview.
  - **Manage Events** (`/admin/village/events`): Search, filter (active/inactive/featured), quick inline editor, toggle visibility, and deletion.
  - **Add Event** (`/admin/village/add-event`): Create safari/retreat events with photo upload or curated sample assets, pricing, venue location, schedule dates, capacity limits, and key highlights.

## Quick Links
- Admin Dashboard: `http://localhost:5173/admin`
- Village Dashboard: `http://localhost:5173/admin/village`
- Manage Village Events: `http://localhost:5173/admin/village/events`
- Add Village Event: `http://localhost:5173/admin/village/add-event`
- Therapy Dashboard: `http://localhost:5173/admin/therapy`
- Public Village: `http://localhost:5173/get/village`
