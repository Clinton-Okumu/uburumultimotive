<?php
/**
 * GET/POST /api/admin/verify.php
 * Verifies validity of currently stored admin session token.
 */

require_once dirname(__DIR__) . '/home/db.php';
require_once __DIR__ . '/auth_helper.php';

set_cors_headers();

// Validate token
$payload = require_admin_auth();

api_response(200, [
    'success' => true,
    'user'    => [
        'username' => $payload['sub'] ?? 'admin',
        'role'     => $payload['role'] ?? 'Super Admin',
        'name'     => 'Uburu Admin',
    ],
]);
