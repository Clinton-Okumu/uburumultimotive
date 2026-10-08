<?php
/**
 * Database connection & helper utilities for Uburu Home API on cPanel.
 */

// Set CORS headers so frontend can communicate smoothly
function set_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Send structured JSON response
function api_response(int $status, array $data): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Read input JSON payload
function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    if (!is_array($decoded)) {
        api_response(400, ['success' => false, 'error' => 'Invalid JSON payload']);
    }
    return $decoded;
}

// Locate db_config.php
function load_db_config(): array
{
    $candidates = [
        dirname(__DIR__, 3) . '/db_config.php',
        dirname(__DIR__, 2) . '/db_config.php',
        dirname(__DIR__, 1) . '/db_config.php',
        __DIR__ . '/db_config.php',
    ];

    foreach ($candidates as $path) {
        if (file_exists($path)) {
            $conf = require $path;
            if (is_array($conf)) return $conf;
        }
    }

    // Default fallback
    return [
        'host'     => getenv('DB_HOST') ?: 'localhost',
        'dbname'   => getenv('DB_NAME') ?: 'uburuhome',
        'username' => getenv('DB_USER') ?: 'root',
        'password' => getenv('DB_PASS') ?: '',
        'charset'  => 'utf8mb4',
        'port'     => 3306,
    ];
}

// Create singleton PDO connection
function get_db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = load_db_config();
    $host    = $config['host'] ?? 'localhost';
    $dbname  = $config['dbname'] ?? 'uburuhome';
    $user    = $config['username'] ?? 'root';
    $pass    = $config['password'] ?? '';
    $charset = $config['charset'] ?? 'utf8mb4';
    $port    = $config['port'] ?? 3306;

    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset={$charset}";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        api_response(500, [
            'success' => false,
            'error'   => 'Database connection failed: ' . $e->getMessage(),
        ]);
    }
}
