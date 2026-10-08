import { homeCategories as initialCategories, type HomeCategory, type HomeCategoryItem } from '../../data/homeCategories';

export const HOME_ADMIN_STORAGE_KEY = 'uburu_home_admin_catalog_v1';
export const HOME_CATALOG_EVENT = 'uburu_home_catalog_updated';

/**
 * Loads the categories from localStorage or initializes from the default code catalog.
 */
export const getStoredCategories = (): HomeCategory[] => {
    if (typeof window === 'undefined') return initialCategories;

    try {
        const raw = localStorage.getItem(HOME_ADMIN_STORAGE_KEY);
        if (!raw) {
            // First time: initialize storage with the default categories
            localStorage.setItem(HOME_ADMIN_STORAGE_KEY, JSON.stringify(initialCategories));
            return initialCategories;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch (e) {
        console.error('Failed to parse stored home catalog:', e);
    }

    return initialCategories;
};

/**
 * Saves categories to localStorage and notifies active listeners.
 */
export const saveCategories = (categories: HomeCategory[]): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(HOME_ADMIN_STORAGE_KEY, JSON.stringify(categories));
        window.dispatchEvent(new CustomEvent(HOME_CATALOG_EVENT, { detail: categories }));
    } catch (e) {
        console.error('Failed to save home catalog to localStorage:', e);
    }
};

/**
 * Fetches the latest live catalog from MySQL backend (/api/home/catalog.php).
 * Automatically updates localStorage and active UI components.
 */
export const syncCatalogFromDatabase = async (): Promise<HomeCategory[]> => {
    try {
        const res = await fetch('/api/home/catalog.php');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        if (data && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            saveCategories(data.categories);
            return data.categories;
        }
    } catch {
        // Fall back to local storage if API is offline or not configured yet
    }
    return getStoredCategories();
};

/**
 * Uploads an image file to the cPanel host (/api/home/upload.php).
 * Returns the public URL of the uploaded image (e.g. /uploads/uburu-123.webp).
 */
export const uploadImageToServer = async (file: File | string): Promise<string> => {
    try {
        if (typeof file === 'string' && file.startsWith('data:image/')) {
            // Base64 payload
            const res = await fetch('/api/home/upload.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: file }),
            });
            const data = await res.json();
            if (data && data.success && data.url) {
                return data.url;
            }
        } else if (file instanceof File) {
            // Multipart FormData
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('/api/home/upload.php', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data && data.success && data.url) {
                return data.url;
            }
        }
    } catch (e) {
        console.warn('Image upload endpoint unavailable, falling back to local data URL:', e);
    }

    // Fallback: return as-is (e.g. Base64 or existing URL)
    return typeof file === 'string' ? file : URL.createObjectURL(file);
};

/**
 * Adds a new item to a specific category and syncs to MySQL database.
 */
export const addItemToCategory = (
    categorySlug: string,
    newItem: Omit<HomeCategoryItem, 'id' | 'categorySlug'> & { id?: string }
): { success: boolean; item: HomeCategoryItem } => {
    const categories = getStoredCategories();
    const catIndex = categories.findIndex(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase() || c.id.toLowerCase() === categorySlug.toLowerCase()
    );

    if (catIndex === -1) {
        throw new Error(`Category "${categorySlug}" not found`);
    }

    const itemId = newItem.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullItem: HomeCategoryItem = {
        ...newItem,
        id: itemId,
        categorySlug: categories[catIndex].slug,
        currency: newItem.currency || 'KES',
        inStock: newItem.inStock !== undefined ? newItem.inStock : true,
    };

    categories[catIndex].items = [fullItem, ...(categories[catIndex].items || [])];
    saveCategories(categories);

    // Asynchronously sync with MySQL
    fetch('/api/home/items.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullItem),
    }).catch(() => {
        // Ignored; local storage already updated
    });

    return { success: true, item: fullItem };
};

/**
 * Updates an existing item inside a category and syncs to MySQL.
 */
export const updateItemInCategory = (
    categorySlug: string,
    itemId: string,
    updates: Partial<HomeCategoryItem>
): boolean => {
    const categories = getStoredCategories();
    const catIndex = categories.findIndex(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase() || c.id.toLowerCase() === categorySlug.toLowerCase()
    );

    if (catIndex === -1) return false;

    const itemIndex = categories[catIndex].items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return false;

    const updatedItem = {
        ...categories[catIndex].items[itemIndex],
        ...updates,
    };
    categories[catIndex].items[itemIndex] = updatedItem;
    saveCategories(categories);

    fetch('/api/home/items.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
    }).catch(() => {});

    return true;
};

/**
 * Deletes an item from a category and syncs to MySQL.
 */
export const deleteItemFromCategory = (categorySlug: string, itemId: string): boolean => {
    const categories = getStoredCategories();
    const catIndex = categories.findIndex(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase() || c.id.toLowerCase() === categorySlug.toLowerCase()
    );

    if (catIndex === -1) return false;

    categories[catIndex].items = categories[catIndex].items.filter((i) => i.id !== itemId);
    saveCategories(categories);

    fetch(`/api/home/items.php?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
    }).catch(() => {});

    return true;
};

/**
 * Creates a brand new category and syncs to MySQL.
 */
export const createCategory = (
    categoryData: Omit<HomeCategory, 'items'> & { items?: HomeCategoryItem[] }
): HomeCategory => {
    const categories = getStoredCategories();
    const slug = categoryData.slug.toLowerCase().trim().replace(/\s+/g, '-');

    if (categories.some((c) => c.slug === slug || c.id === categoryData.id)) {
        throw new Error(`A category with slug or ID "${slug}" already exists`);
    }

    const newCat: HomeCategory = {
        ...categoryData,
        slug,
        items: categoryData.items || [],
    };

    const updated = [...categories, newCat];
    saveCategories(updated);

    fetch('/api/home/categories.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
    }).catch(() => {});

    return newCat;
};

/**
 * Deletes a category by slug or id and syncs to MySQL.
 */
export const deleteCategory = (categorySlug: string): boolean => {
    const categories = getStoredCategories();
    const filtered = categories.filter(
        (c) => c.slug.toLowerCase() !== categorySlug.toLowerCase() && c.id.toLowerCase() !== categorySlug.toLowerCase()
    );

    if (filtered.length === categories.length) return false;

    saveCategories(filtered);

    fetch(`/api/home/categories.php?slug=${encodeURIComponent(categorySlug)}`, {
        method: 'DELETE',
    }).catch(() => {});

    return true;
};

/**
 * Resets the catalog to factory default.
 */
export const resetCatalogToDefault = (): HomeCategory[] => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(HOME_ADMIN_STORAGE_KEY);
        localStorage.setItem(HOME_ADMIN_STORAGE_KEY, JSON.stringify(initialCategories));
        window.dispatchEvent(new CustomEvent(HOME_CATALOG_EVENT, { detail: initialCategories }));
    }
    return initialCategories;
};
