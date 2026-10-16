<?php
/**
 * GET/POST /api/therapy/config.php
 * Handles global persistence for Uburu Therapy services and pricing configuration.
 */

require_once dirname(__DIR__) . '/admin/auth_helper.php';

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$storageFile = __DIR__ . '/therapy_config.json';

// GET: Return saved configuration
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($storageFile)) {
        $content = file_get_contents($storageFile);
        $data = json_decode($content, true);
        if (is_array($data)) {
            echo json_encode([
                'success' => true,
                'services' => $data['services'] ?? [],
                'pricing' => $data['pricing'] ?? [],
                'updated_at' => $data['updated_at'] ?? null,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
    }

    echo json_encode([
        'success' => true,
        'services' => null,
        'pricing' => null,
        'message' => 'Using default configuration'
    ]);
    exit;
}

// POST: Save configuration (Admin only)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin_auth();
    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    // Load existing if available to support partial updates
    $existing = [];
    if (file_exists($storageFile)) {
        $content = file_get_contents($storageFile);
        $existing = json_decode($content, true) ?: [];
    }

    $services = isset($payload['services']) && is_array($payload['services'])
        ? $payload['services']
        : ($existing['services'] ?? []);

    $pricing = isset($payload['pricing']) && is_array($payload['pricing'])
        ? $payload['pricing']
        : ($existing['pricing'] ?? []);

    $toSave = [
        'services' => $services,
        'pricing' => $pricing,
        'updated_at' => date('c'),
    ];

    $saved = @file_put_contents($storageFile, json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

    if ($saved === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to write configuration to server storage']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Therapy configuration saved successfully',
        'updated_at' => $toSave['updated_at'],
        'servicesCount' => count($services),
        'pricingCount' => count($pricing),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
