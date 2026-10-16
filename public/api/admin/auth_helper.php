<?php
/**
 * Authentication and Token Verification Utilities for Uburu Admin.
 */

// Find and load admin_config.php across candidate paths
function load_admin_config(): array
{
    $candidates = [
        dirname(__DIR__, 3) . '/admin_config.php',
        dirname(__DIR__, 2) . '/admin_config.php',
        dirname(__DIR__, 1) . '/admin_config.php',
        __DIR__ . '/admin_config.php',
    ];

    foreach ($candidates as $path) {
        if (file_exists($path)) {
            $conf = require $path;
            if (is_array($conf)) return $conf;
        }
    }

    // Default fallback
    return [
        'username'      => getenv('ADMIN_USER') ?: 'admin',
        'password_hash' => getenv('ADMIN_PASSWORD_HASH') ?: '$2y$12$Gow7Ep2fWKuB/DNLq7b1z.GVHEG6o85yqTqDLpjV45VwC3IboEQqC',
        'jwt_secret'    => getenv('ADMIN_JWT_SECRET') ?: 'uburu_secret_jwt_admin_key_2026_default_replace_in_prod',
        'token_ttl'     => 604800,
    ];
}

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Generate a signed admin token (HS256)
 */
function generate_admin_token(string $username, string $role = 'Super Admin'): string
{
    $config = load_admin_config();
    $secret = $config['jwt_secret'] ?? 'uburu_secret_jwt_admin_key_2026_default_replace_in_prod';
    $ttl = (int)($config['token_ttl'] ?? 604800);

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'sub'  => $username,
        'role' => $role,
        'iat'  => time(),
        'exp'  => time() + $ttl,
    ]);

    $base64Header = base64url_encode($header);
    $base64Payload = base64url_encode($payload);
    $signature = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", $secret, true);
    $base64Signature = base64url_encode($signature);

    return "{$base64Header}.{$base64Payload}.{$base64Signature}";
}

/**
 * Verify signed admin token and check expiry
 */
function verify_admin_token(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$base64Header, $base64Payload, $base64Signature] = $parts;
    $config = load_admin_config();
    $secret = $config['jwt_secret'] ?? 'uburu_secret_jwt_admin_key_2026_default_replace_in_prod';

    $expectedSignature = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", $secret, true);
    $actualSignature = base64url_decode($base64Signature);

    if (!hash_equals($expectedSignature, $actualSignature)) {
        return null;
    }

    $payload = json_decode(base64url_decode($base64Payload), true);
    if (!is_array($payload)) {
        return null;
    }

    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

/**
 * Extract bearer token from HTTP Authorization header
 */
function get_bearer_token(): ?string
{
    $authHeader = null;
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }

    if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return trim($matches[1]);
    }

    return null;
}

/**
 * Enforce authentication on protected admin endpoints.
 * Returns payload array on success or exits with 401 JSON.
 */
function require_admin_auth(): array
{
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => 'Unauthorized: Missing Authorization Bearer token.',
        ]);
        exit;
    }

    $payload = verify_admin_token($token);
    if (!$payload) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => 'Unauthorized: Invalid or expired admin token.',
        ]);
        exit;
    }

    return $payload;
}
