<?php

require_once __DIR__ . '/_mail.php';

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function require_post_json(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_response(405, ['error' => 'Method not allowed']);
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    if (!is_array($data)) {
        json_response(400, ['error' => 'Invalid JSON payload']);
    }
    return $data;
}

function load_mail_config(): array
{
    $defaultConfigPath = dirname(__DIR__, 3) . '/mail_config.php';
    $configPath = getenv('MAIL_CONFIG_PATH') ?: $defaultConfigPath;

    if (!file_exists($configPath)) {
        json_response(500, ['error' => 'Server configuration missing']);
    }

    $config = require $configPath;
    if (!is_array($config)) {
        json_response(500, ['error' => 'Invalid mail configuration']);
    }
    return $config;
}

function client_ip(): string
{
    $candidates = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'REMOTE_ADDR',
    ];

    foreach ($candidates as $key) {
        $value = trim((string)($_SERVER[$key] ?? ''));
        if (!$value) {
            continue;
        }
        // X-Forwarded-For can be a list.
        $parts = array_map('trim', explode(',', $value));
        $ip = $parts[0] ?? '';
        if ($ip && filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }

    return '0.0.0.0';
}

function enforce_rate_limit(array $mailConfig, string $bucket): void
{
    $rate = is_array($mailConfig['rate_limit'] ?? null) ? $mailConfig['rate_limit'] : [];
    $windowSeconds = (int)($rate['window_seconds'] ?? 300);
    $maxRequests = (int)($rate['max_requests'] ?? 5);
    if ($windowSeconds <= 0 || $maxRequests <= 0) {
        return;
    }

    $ip = client_ip();
    $key = 'uburu_forms_' . $bucket . '_' . preg_replace('/[^a-zA-Z0-9_.-]/', '_', $ip);
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $key . '.json';
    $now = time();

    $state = ['window_start' => $now, 'count' => 0];
    if (file_exists($path)) {
        $raw = file_get_contents($path);
        $decoded = $raw ? json_decode($raw, true) : null;
        if (is_array($decoded) && isset($decoded['window_start'], $decoded['count'])) {
            $state = $decoded;
        }
    }

    $windowStart = (int)($state['window_start'] ?? $now);
    $count = (int)($state['count'] ?? 0);

    if (($now - $windowStart) >= $windowSeconds) {
        $windowStart = $now;
        $count = 0;
    }

    $count++;
    file_put_contents($path, json_encode(['window_start' => $windowStart, 'count' => $count]));

    if ($count > $maxRequests) {
        json_response(429, ['error' => 'Too many requests. Please try again later.']);
    }
}

function honeypot_check(array $payload): void
{
    // Bots often fill hidden fields.
    $trap = trim((string)($payload['company'] ?? ''));
    if ($trap !== '') {
        json_response(200, ['ok' => true]);
    }
}

function require_string(array $payload, string $key, int $maxLen = 5000): string
{
    $value = trim((string)($payload[$key] ?? ''));
    if ($value === '') {
        json_response(400, ['error' => 'Missing ' . $key]);
    }
    if (strlen($value) > $maxLen) {
        json_response(400, ['error' => $key . ' is too long']);
    }
    return $value;
}

function optional_string(array $payload, string $key, int $maxLen = 5000): string
{
    $value = trim((string)($payload[$key] ?? ''));
    if ($value !== '' && strlen($value) > $maxLen) {
        json_response(400, ['error' => $key . ' is too long']);
    }
    return $value;
}

function require_email(array $payload, string $key = 'email'): string
{
    $email = require_string($payload, $key, 320);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(400, ['error' => 'Invalid email']);
    }
    return $email;
}

function config_recipient(array $mailConfig, string $formKey): string
{
    $to = is_array($mailConfig['to'] ?? null) ? $mailConfig['to'] : [];
    $recipient = (string)($to[$formKey] ?? ($to['default'] ?? ''));
    if (!$recipient || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        json_response(500, ['error' => 'Recipient email is not configured']);
    }
    return $recipient;
}

function config_from(array $mailConfig): array
{
    $from = is_array($mailConfig['from'] ?? null) ? $mailConfig['from'] : [];
    $email = trim((string)($from['email'] ?? ''));
    $name = trim((string)($from['name'] ?? ''));
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(500, ['error' => 'From email is not configured']);
    }
    return ['email' => $email, 'name' => $name ?: $email];
}

function send_form_email(array $mailConfig, array $message): void
{
    $result = send_email($mailConfig, $message);
    if (!($result['ok'] ?? false)) {
        json_response(502, ['error' => (string)($result['error'] ?? 'Unable to send email')]);
    }
    json_response(200, ['ok' => true]);
}
