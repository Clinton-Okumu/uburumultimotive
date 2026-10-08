<?php
/**
 * GET /api/home/catalog.php
 * Fetches the entire Uburu Home catalog with categories and nested items.
 */

require_once __DIR__ . '/db.php';
set_cors_headers();

$db = get_db();

try {
    // 1. Fetch categories
    $catStmt = $db->query("SELECT * FROM `home_categories` ORDER BY `name` ASC");
    $categories = $catStmt->fetchAll();

    // 2. Fetch items
    $itemStmt = $db->query("SELECT * FROM `home_items` ORDER BY `created_at` DESC");
    $rawItems = $itemStmt->fetchAll();

    // Group items by category_slug
    $itemsByCategory = [];
    foreach ($rawItems as $row) {
        $slug = $row['category_slug'];
        if (!isset($itemsByCategory[$slug])) {
            $itemsByCategory[$slug] = [];
        }

        // Format item object matching HomeCategoryItem in TypeScript
        $features = null;
        if (!empty($row['features'])) {
            $features = is_string($row['features']) ? json_decode($row['features'], true) : $row['features'];
        }

        $itemsByCategory[$slug][] = [
            'id'              => $row['id'],
            'categorySlug'    => $row['category_slug'],
            'name'            => $row['name'],
            'price'           => (float)$row['price'],
            'originalPrice'   => $row['original_price'] !== null ? (float)$row['original_price'] : null,
            'discountPercent' => $row['discount_percent'] !== null ? (int)$row['discount_percent'] : null,
            'currency'        => $row['currency'] ?? 'KES',
            'brand'           => $row['brand'] ?? 'Uburu Brand',
            'tag'             => $row['tag'] ?? 'Store',
            'image'           => $row['image'],
            'type'            => $row['type'] ?? 'product',
            'inStock'         => (bool)$row['in_stock'],
            'stockLocation'   => $row['stock_location'] ?? 'NBO | KBU',
            'description'     => $row['description'] ?? '',
            'features'        => is_array($features) ? $features : null,
            'rating'          => (float)($row['rating'] ?? 5.0),
            'reviewCount'     => (int)($row['review_count'] ?? 1),
        ];
    }

    // Nest items inside each category
    $catalog = [];
    foreach ($categories as $cat) {
        $slug = $cat['slug'];
        $catalog[] = [
            'id'             => $cat['id'],
            'slug'           => $cat['slug'],
            'name'           => $cat['name'],
            'shortName'      => $cat['short_name'],
            'tagline'        => $cat['tagline'] ?? '',
            'description'    => $cat['description'] ?? '',
            'type'           => $cat['type'] ?? 'product',
            'iconName'       => $cat['icon_name'] ?? 'ShoppingCart',
            'accentColor'    => $cat['accent_color'] ?? 'from-amber-500 to-yellow-400',
            'highlightImage' => $cat['highlight_image'],
            'items'          => $itemsByCategory[$slug] ?? [],
        ];
    }

    api_response(200, [
        'success'    => true,
        'categories' => $catalog,
        'totalItems' => count($rawItems),
    ]);
} catch (Exception $e) {
    api_response(500, [
        'success' => false,
        'error'   => 'Failed to load catalog: ' . $e->getMessage(),
    ]);
}
