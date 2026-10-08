<?php
/**
 * CRUD API for Uburu Home Categories.
 * GET    /api/home/categories.php
 * POST   /api/home/categories.php
 * DELETE /api/home/categories.php?slug=...
 */

require_once __DIR__ . '/db.php';
set_cors_headers();

$db = get_db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ----------------------------------------------------
// 1. GET: Fetch categories
// ----------------------------------------------------
if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM `home_categories` ORDER BY `name` ASC");
        $categories = $stmt->fetchAll();
        api_response(200, ['success' => true, 'categories' => $categories]);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => $e->getMessage()]);
    }
}

// ----------------------------------------------------
// 2. POST: Create or Update category
// ----------------------------------------------------
if ($method === 'POST') {
    $input = get_json_input();

    $name = trim($input['name'] ?? '');
    $slug = trim($input['slug'] ?? '');
    $highlightImage = trim($input['highlightImage'] ?? '');

    if ($name === '' || $slug === '' || $highlightImage === '') {
        api_response(400, [
            'success' => false,
            'error'   => 'Missing required fields: name, slug, and highlightImage are required.',
        ]);
    }

    $id = !empty($input['id']) ? trim($input['id']) : $slug;
    $shortName = trim($input['shortName'] ?? $name);
    $tagline = trim($input['tagline'] ?? '');
    $description = trim($input['description'] ?? '');
    $type = in_array($input['type'] ?? '', ['product', 'service'], true) ? $input['type'] : 'product';
    $iconName = trim($input['iconName'] ?? 'ShoppingCart');
    $accentColor = trim($input['accentColor'] ?? 'from-amber-500 to-yellow-400');

    try {
        $stmt = $db->prepare("
            INSERT INTO `home_categories`
            (`id`, `slug`, `name`, `short_name`, `tagline`, `description`, `type`, `icon_name`, `accent_color`, `highlight_image`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            `name` = VALUES(`name`),
            `short_name` = VALUES(`short_name`),
            `tagline` = VALUES(`tagline`),
            `description` = VALUES(`description`),
            `type` = VALUES(`type`),
            `icon_name` = VALUES(`icon_name`),
            `accent_color` = VALUES(`accent_color`),
            `highlight_image` = VALUES(`highlight_image`)
        ");

        $stmt->execute([
            $id, $slug, $name, $shortName, $tagline, $description,
            $type, $iconName, $accentColor, $highlightImage
        ]);

        api_response(201, [
            'success' => true,
            'message' => 'Category saved successfully',
            'slug'    => $slug,
        ]);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
}

// ----------------------------------------------------
// 3. DELETE: Remove category
// ----------------------------------------------------
if ($method === 'DELETE') {
    $slug = $_GET['slug'] ?? '';
    if ($slug === '') {
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $slug = $input['slug'] ?? '';
    }

    if ($slug === '') {
        api_response(400, ['success' => false, 'error' => 'Category slug is required for deletion']);
    }

    try {
        $stmt = $db->prepare("DELETE FROM `home_categories` WHERE `slug` = ?");
        $stmt->execute([$slug]);
        api_response(200, ['success' => true, 'message' => 'Category deleted successfully']);
    } catch (Exception $e) {
        api_response(500, ['success' => false, 'error' => $e->getMessage()]);
    }
}

api_response(405, ['success' => false, 'error' => 'Method not allowed']);
