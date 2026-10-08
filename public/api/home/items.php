<?php
/**
 * CRUD API for Uburu Home Items.
 * GET    /api/home/items.php?category=...
 * POST   /api/home/items.php
 * PUT    /api/home/items.php
 * DELETE /api/home/items.php?id=...
 */

require_once __DIR__ . '/db.php';
set_cors_headers();

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ----------------------------------------------------
// 1. GET: Fetch items
// ----------------------------------------------------
if ($method === 'GET') {
    $categorySlug = $_GET['category'] ?? '';
    $itemId = $_GET['id'] ?? '';

    try {
        if ($itemId !== '') {
            $stmt = $db->prepare("SELECT * FROM `home_items` WHERE `id` = ?");
            $stmt->execute([$itemId]);
            $item = $stmt->fetch();
            if (!$item) {
                api_response(404, ['success' => false, 'error' => 'Item not found']);
            }
            api_response(200, ['success' => true, 'item' => $item]);
        }

        if ($categorySlug !== '') {
            $stmt = $db->prepare("SELECT * FROM `home_items` WHERE `category_slug` = ? ORDER BY `created_at` DESC");
            $stmt->execute([$categorySlug]);
            $items = $stmt->fetchAll();
        } else {
            $stmt = $db->query("SELECT * FROM `home_items` ORDER BY `created_at` DESC");
            $items = $stmt->fetchAll();
        }

        api_response(200, ['success' => true, 'items' => $items]);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => $e->getMessage()]);
    }
}

// ----------------------------------------------------
// 2. POST: Add new item to a category
// ----------------------------------------------------
if ($method === 'POST') {
    $input = get_json_input();

    $categorySlug = trim($input['categorySlug'] ?? '');
    $name         = trim($input['name'] ?? '');
    $price        = (float)($input['price'] ?? 0);
    $image        = trim($input['image'] ?? '');

    if ($categorySlug === '' || $name === '' || $price <= 0 || $image === '') {
        api_response(400, [
            'success' => false,
            'error'   => 'Missing required fields: categorySlug, name, price, and image are required.',
        ]);
    }

    $id = !empty($input['id']) ? trim($input['id']) : 'item-' . time() . '-' . substr(md5(uniqid()), 0, 6);
    $originalPrice = isset($input['originalPrice']) && $input['originalPrice'] !== '' ? (float)$input['originalPrice'] : null;
    $discountPercent = isset($input['discountPercent']) ? (int)$input['discountPercent'] : null;
    $currency = trim($input['currency'] ?? 'KES');
    $brand = trim($input['brand'] ?? 'Uburu Brand');
    $tag = trim($input['tag'] ?? 'Store');
    $type = in_array($input['type'] ?? '', ['product', 'service'], true) ? $input['type'] : 'product';
    $inStock = isset($input['inStock']) ? (int)(bool)$input['inStock'] : 1;
    $stockLocation = trim($input['stockLocation'] ?? 'NBO | KBU');
    $description = trim($input['description'] ?? '');
    $features = !empty($input['features']) && is_array($input['features']) ? json_encode($input['features']) : null;
    $rating = (float)($input['rating'] ?? 5.0);
    $reviewCount = (int)($input['reviewCount'] ?? 1);

    try {
        $stmt = $db->prepare("
            INSERT INTO `home_items`
            (`id`, `category_slug`, `name`, `price`, `original_price`, `discount_percent`, `currency`, `brand`, `tag`, `image`, `type`, `in_stock`, `stock_location`, `description`, `features`, `rating`, `review_count`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            `name` = VALUES(`name`),
            `price` = VALUES(`price`),
            `original_price` = VALUES(`original_price`),
            `discount_percent` = VALUES(`discount_percent`),
            `brand` = VALUES(`brand`),
            `tag` = VALUES(`tag`),
            `image` = VALUES(`image`),
            `type` = VALUES(`type`),
            `in_stock` = VALUES(`in_stock`),
            `stock_location` = VALUES(`stock_location`),
            `description` = VALUES(`description`),
            `features` = VALUES(`features`)
        ");

        $stmt->execute([
            $id, $categorySlug, $name, $price, $originalPrice, $discountPercent,
            $currency, $brand, $tag, $image, $type, $inStock,
            $stockLocation, $description, $features, $rating, $reviewCount
        ]);

        api_response(201, [
            'success' => true,
            'message' => 'Item saved successfully',
            'id'      => $id,
        ]);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
}

// ----------------------------------------------------
// 3. DELETE: Remove item
// ----------------------------------------------------
if ($method === 'DELETE') {
    $itemId = $_GET['id'] ?? '';
    if ($itemId === '') {
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $itemId = $input['id'] ?? '';
    }

    if ($itemId === '') {
        api_response(400, ['success' => false, 'error' => 'Item ID is required for deletion']);
    }

    try {
        $stmt = $db->prepare("DELETE FROM `home_items` WHERE `id` = ?");
        $stmt->execute([$itemId]);
        api_response(200, ['success' => true, 'message' => 'Item deleted successfully']);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => $e->getMessage()]);
    }
}

api_response(405, ['success' => false, 'error' => 'Method not allowed']);
