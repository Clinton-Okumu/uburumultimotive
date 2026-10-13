import { useState, useEffect } from 'react';
import {
    getStoredCategories,
    syncCatalogFromDatabase,
    HOME_CATALOG_EVENT,
} from '../admin/data/homeAdminStorage';
import type { HomeCategory } from '../data/homeCategories';

/**
 * Hook providing reactive live categories for the storefront.
 * Automatically synchronizes with Admin updates, localStorage, and MySQL backend.
 */
export const useHomeCategories = (): HomeCategory[] => {
    const [categories, setCategories] = useState<HomeCategory[]>(() => getStoredCategories());

    useEffect(() => {
        // Asynchronously check for database sync
        syncCatalogFromDatabase().then((cats) => {
            if (cats && Array.isArray(cats) && cats.length > 0) {
                setCategories(cats);
            }
        });

        // Listen for internal admin modifications
        const handleCatalogUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<HomeCategory[]>;
            if (customEvent.detail && Array.isArray(customEvent.detail)) {
                setCategories(customEvent.detail);
            } else {
                setCategories(getStoredCategories());
            }
        };

        // Listen for multi-tab storage modifications
        const handleStorageEvent = (e: StorageEvent) => {
            if (e.key === 'uburu_home_admin_catalog_v1' || !e.key) {
                setCategories(getStoredCategories());
            }
        };

        window.addEventListener(HOME_CATALOG_EVENT, handleCatalogUpdate);
        window.addEventListener('storage', handleStorageEvent);

        return () => {
            window.removeEventListener(HOME_CATALOG_EVENT, handleCatalogUpdate);
            window.removeEventListener('storage', handleStorageEvent);
        };
    }, []);

    return categories;
};

export default useHomeCategories;
