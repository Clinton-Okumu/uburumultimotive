<?php
/**
 * POST /api/admin/login.php
 * Authenticates admin credentials and returns a signed JWT bearer token.
 */

require_once dirname(__DIR__) . '/home/db.php';
require_once __DIR__ . '/auth_helper.php';

set_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    api_response(405, ['success' => false, 'error' => 'Method not allowed. Use POST.']);
}

$input = get_json_input();
$username = trim($input['username'] ?? '');
$password = (string)($input['password'] ?? '');

if ($username === '' || $password === '') {
    api_response(400, [
        'success' => false,
        'error'   => 'Username and password are required.',
    ]);
}

$config = load_admin_config();
$expectedUser = $config['username'] ?? 'admin';
$passwordHash = $config['password_hash'] ?? '';

// Check username (case-insensitive for convenience, case-sensitive if desired)
if (strcasecmp($username, $expectedUser) !== 0) {
    api_response(401, [
        'success' => false,
        'error'   => 'Invalid credentials. Please verify your username and password.',
    ]);
}

// Verify password against hash
if (!password_verify($password, $passwordHash)) {
    api_response(401, [
        'success' => false,
        'error'   => 'Invalid credentials. Please verify your username and password.',
    ]);
}

// Generate token
$token = generate_admin_token($expectedUser, 'Super Admin');

api_response(200, [
    'success' => true,
    'token'   => $token,
    'user'    => [
        'username'   => $expectedUser,
        'name'       => 'Uburu Admin',
        'role'       => 'Super Admin',
        'loggedInAt' => time() * 1000,
    ],
]);
