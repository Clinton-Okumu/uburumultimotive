import { homeProducts, ebookProducts, villageEvents, type StorefrontItem } from "../data/storefrontCatalog";
import { homeCategories } from "../data/homeCategories";

export const HOME_CART_STORAGE_KEY = "uburu_home_cart";
export const VILLAGE_CART_STORAGE_KEY = "uburu_village_cart";
export const HOME_OPTIONS_STORAGE_KEY = "uburu_home_item_options";

/**
 * Returns a complete map of all valid Uburu Home products (including sub-items and ebook collections).
 */
export const getAllValidHomeProductsMap = (): Map<string, StorefrontItem> => {
  const map = new Map<string, StorefrontItem>();

  // Add default home products
  homeProducts.forEach((p) => map.set(p.id, p));

  // Add ebook sub-products
  ebookProducts.forEach((p) => map.set(p.id, p));

  // Add category products and their folder sub-items
  homeCategories.forEach((category) => {
    category.items.forEach((item) => {
      map.set(item.id, item);
      if (item.folderItems && Array.isArray(item.folderItems)) {
        item.folderItems.forEach((subItem) => map.set(subItem.id, subItem));
      }
    });
  });

  return map;
};

/**
 * Returns a complete map of all valid Uburu Village events/packages.
 */
export const getAllValidVillageEventsMap = (): Map<string, StorefrontItem> => {
  const map = new Map<string, StorefrontItem>();
  villageEvents.forEach((event) => map.set(event.id, event));
  return map;
};

/**
 * Reads and automatically SANITIZES the Uburu Home cart from localStorage.
 * If stale/deleted product IDs are found, they are pruned from localStorage immediately.
 */
export const getSanitizedHomeCart = (): Record<string, number> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(HOME_CART_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      window.localStorage.removeItem(HOME_CART_STORAGE_KEY);
      return {};
    }

    const validProductsMap = getAllValidHomeProductsMap();
    const sanitized: Record<string, number> = {};
    let hasStaleKeys = false;

    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value === "number" && value > 0 && validProductsMap.has(key)) {
        sanitized[key] = Math.min(99, Math.trunc(value));
      } else {
        hasStaleKeys = true;
      }
    });

    // Auto-heal localStorage if stale keys were present
    if (hasStaleKeys) {
      if (Object.keys(sanitized).length === 0) {
        window.localStorage.removeItem(HOME_CART_STORAGE_KEY);
      } else {
        window.localStorage.setItem(HOME_CART_STORAGE_KEY, JSON.stringify(sanitized));
      }
    }

    return sanitized;
  } catch {
    return {};
  }
};

/**
 * Reads and automatically SANITIZES the Uburu Village cart from localStorage.
 */
export const getSanitizedVillageCart = (): Record<string, number> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(VILLAGE_CART_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      window.localStorage.removeItem(VILLAGE_CART_STORAGE_KEY);
      return {};
    }

    const validEventsMap = getAllValidVillageEventsMap();
    const sanitized: Record<string, number> = {};
    let hasStaleKeys = false;

    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value === "number" && value > 0 && validEventsMap.has(key)) {
        sanitized[key] = Math.min(99, Math.trunc(value));
      } else {
        hasStaleKeys = true;
      }
    });

    if (hasStaleKeys) {
      if (Object.keys(sanitized).length === 0) {
        window.localStorage.removeItem(VILLAGE_CART_STORAGE_KEY);
      } else {
        window.localStorage.setItem(VILLAGE_CART_STORAGE_KEY, JSON.stringify(sanitized));
      }
    }

    return sanitized;
  } catch {
    return {};
  }
};

/**
 * Returns the exact count of valid items in the Home Cart.
 */
export const getHomeCartCount = (): number => {
  const cart = getSanitizedHomeCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
};

/**
 * Returns the exact count of valid items in the Village Cart.
 */
export const getVillageCartCount = (): number => {
  const cart = getSanitizedVillageCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
};

/**
 * Returns the combined valid tray count.
 */
export const getTotalTrayCount = (): number => {
  return getHomeCartCount() + getVillageCartCount();
};

/**
 * Returns the combined valid tray total price (in KES).
 */
export const getHomeCartTotalAmount = (): number => {
  const cart = getSanitizedHomeCart();
  const validProductsMap = getAllValidHomeProductsMap();
  let total = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    const product = validProductsMap.get(id);
    if (product) {
      total += product.price * qty;
    }
  });

  return total;
};
