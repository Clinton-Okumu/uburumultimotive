<?php
/**
 * GET/POST /api/village/config.php
 * Handles persistence for Uburu Village experiences, events, and safari packages.
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

$storageFile = __DIR__ . '/village_config.json';

// GET: Return saved configuration
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($storageFile)) {
        $content = file_get_contents($storageFile);
        $data = json_decode($content, true);
        if (is_array($data)) {
            echo json_encode([
                'success'    => true,
                'events'     => $data['events'] ?? [],
                'camps'      => $data['camps'] ?? [],
                'updated_at' => $data['updated_at'] ?? null,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
    }

    echo json_encode([
        'success' => true,
        'events'  => null,
        'camps'   => null,
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

    $existing = [];
    if (file_exists($storageFile)) {
        $content = file_get_contents($storageFile);
        $existing = json_decode($content, true) ?: [];
    }

    $events = isset($payload['events']) && is_array($payload['events'])
        ? $payload['events']
        : ($existing['events'] ?? []);

    $camps = isset($payload['camps']) && is_array($payload['camps'])
        ? $payload['camps']
        : ($existing['camps'] ?? []);

    $toSave = [
        'events'     => $events,
        'camps'      => $camps,
        'updated_at' => date('c'),
    ];

    $saved = @file_put_contents(
        $storageFile,
        json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );

    if ($saved === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to write village configuration to server storage']);
        exit;
    }

    echo json_encode([
        'success'     => true,
        'message'     => 'Uburu Village configuration saved successfully',
        'updated_at'  => $toSave['updated_at'],
        'eventsCount' => count($events),
        'campsCount'  => count($camps),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
