# Uburu Home Store Admin Panel

The admin panel is exclusively dedicated to administering **Uburu Home**: managing store departments/categories, uploading images, and adding products & services.

## Overview & Architecture
- **Completely Isolated Layout**: Runs on its own standalone layout (`AdminLayout.tsx`) without public website headers, footers, or customer cart drawers.
- **Brand Consistency**: Adheres to Uburu's deep navy/slate dark theme (`#141b2d`), vibrant amber/yellow highlights (`amber-400` / `yellow-400`), clean typography, and high-density metric cards.
- **Persistent Catalog Storage**: Items and categories added by the admin are saved to `localStorage` via [`homeAdminStorage.ts`](../src/admin/data/homeAdminStorage.ts) and instantly propagate to the catalog.

## Sidebar Navigation
- **UBURU HOME**:
  - **Overview** (`/admin`): Department counts, total items, density distribution charts, and recently added products.
  - **Categories** (`/admin/categories`): Visual grid of departments with banner photography, items count, direct "Add Item" action, and store preview.
  - **Catalog Items** (`/admin/items`): Searchable catalog filtered by department pills, stock availability, price, and delete actions.
  - **Add Item** (`/admin/add-item`): Rich form with photo upload (local file to Base64 or URL or sample asset), pricing, discount, stock, brand, and feature bullets.
  - **Add Category** (`/admin/add-category`): Create new store department with highlight artwork, slug, tagline, and department type.
- **SALES & INQUIRIES**:
  - **Orders & Inquiries** (`/admin/orders`): Monitor customer cart inquiries, orders, and delivery addresses.
- **SYSTEM**:
  - **Store Settings** (`/admin/settings`): Delivery fees, contact numbers, and factory reset option.

## Quick Links
- Admin Dashboard: `http://localhost:5173/admin`
- Direct Add Item: `http://localhost:5173/admin/add-item`
- Categories Management: `http://localhost:5173/admin/categories`
- Catalog Items: `http://localhost:5173/admin/items`
- Public Uburu Home: `http://localhost:5173/get/home`
