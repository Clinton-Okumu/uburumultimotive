<?php
/**
 * GET/POST /api/village/events.php
 * Handles global persistence for Uburu Village events configuration on cPanel/PHP host.
 */

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

$storageFile = __DIR__ . '/village_events.json';

// GET: Return saved village events
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($storageFile)) {
        $content = file_get_contents($storageFile);
        $data = json_decode($content, true);
        if (is_array($data)) {
            echo json_encode([
                'success' => true,
                'events' => $data['events'] ?? [],
                'updated_at' => $data['updated_at'] ?? null,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
    }

    echo json_encode([
        'success' => true,
        'events' => null,
        'message' => 'Using default configuration'
    ]);
    exit;
}

// POST: Save village events
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../admin/auth_helper.php';
    require_admin_auth();

    $rawInput = file_get_contents('php://input');
    $payload = json_decode($rawInput, true);

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
        exit;
    }

    // Support either direct array payload or object with 'events' key
    $events = isset($payload['events']) && is_array($payload['events'])
        ? $payload['events']
        : (is_array($payload) && array_is_list($payload) ? $payload : []);

    $toSave = [
        'events' => $events,
        'updated_at' => date('c'),
    ];

    $saved = @file_put_contents($storageFile, json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

    if ($saved === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to write village events to server storage']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Village events saved successfully',
        'updated_at' => $toSave['updated_at'],
        'eventsCount' => count($events),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
