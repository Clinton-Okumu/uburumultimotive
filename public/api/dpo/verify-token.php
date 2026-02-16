<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$defaultConfigPath = dirname(__DIR__, 3) . '/dpo_config.php';
$configPath = getenv('DPO_CONFIG_PATH') ?: $defaultConfigPath;
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration missing']);
    exit;
}

$config = require $configPath;

$formspreeUrl = trim((string)($config['formspree_purchase_url'] ?? ''));

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$transactionToken = trim((string)($payload['transactionToken'] ?? ''));
$companyRef = trim((string)($payload['companyRef'] ?? ''));

$storagePath = $config['storage_path'] ?? null;
[$storeHandle, $storeData] = open_store($storagePath);

if (!$transactionToken && $companyRef) {
    $transactionToken = find_token_by_ref($storeData, $companyRef);
}

if (!$transactionToken) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing transactionToken']);
    close_store($storeHandle);
    exit;
}

if (empty($config['company_token'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing company token configuration']);
    close_store($storeHandle);
    exit;
}

$xml = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>{$config['company_token']}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>{$transactionToken}</TransactionToken>
</API3G>
XML;

$apiEndpoint = trim((string)($config['api_endpoint'] ?? ''));
if (!$apiEndpoint) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing API endpoint configuration']);
    close_store($storeHandle);
    exit;
}

$response = curl_xml($apiEndpoint, $xml, 2);
if ($response['error']) {
    http_response_code(502);
    echo json_encode(['error' => $response['error']]);
    close_store($storeHandle);
    exit;
}

$xmlResp = parse_xml($response['body']);
if (!$xmlResp) {
    http_response_code(502);
    $payload = ['error' => 'Invalid response from payment gateway'];
    if (getenv('DPO_DEBUG')) {
        $payload['debug'] = [
            'status' => $response['status'],
            'body' => substr((string)$response['body'], 0, 1000),
        ];
    }
    echo json_encode($payload);
    close_store($storeHandle);
    exit;
}

$result = (string)$xmlResp->Result;
$status = match ($result) {
    '000' => 'PAID',
    '900' => 'PENDING',
    '901' => 'DECLINED',
    '903' => 'EXPIRED',
    default => 'UNKNOWN',
};

$resolvedCompanyRef = (string)($xmlResp->CompanyRef ?? '');
if (!$resolvedCompanyRef) {
    $resolvedCompanyRef = $companyRef ?: find_ref_by_token($storeData, $transactionToken);
}

$recordContext = '';
$recordMeta = [];
$recordAmount = '';
$recordCurrency = '';
$recordCustomer = [];

if ($storeHandle) {
    $refKey = $resolvedCompanyRef ?: find_ref_by_token($storeData, $transactionToken);
    if ($refKey && isset($storeData['donations'][$refKey])) {
        $record = $storeData['donations'][$refKey];
        $previousStatus = (string)($record['status'] ?? '');
        $record['status'] = $status;
        $record['updatedAt'] = date('c');
        $record['lastResult'] = $result;

        [$record] = send_purchase_formspree_if_needed(
            $record,
            $formspreeUrl,
            $status,
            $previousStatus,
            $resolvedCompanyRef ?: $refKey
        );

        $storeData['donations'][$refKey] = $record;
        $recordContext = (string)($record['context'] ?? '');
        $recordMeta = is_array($record['meta'] ?? null) ? $record['meta'] : [];
        $recordAmount = (string)($record['amount'] ?? '');
        $recordCurrency = (string)($record['currency'] ?? '');
        $recordCustomer = is_array($record['customer'] ?? null) ? $record['customer'] : [];

        save_store($storeHandle, $storagePath, $storeData);
    } else {
        close_store($storeHandle);
    }
} else {
    close_store($storeHandle);
}

$contextValue = $recordContext !== ''
    ? $recordContext
    : (string)($recordMeta['context'] ?? '');
$itemName = trim((string)($recordMeta['itemName'] ?? ''));
$quantity = (int)($recordMeta['quantity'] ?? 0);
$amountValue = $recordAmount !== '' ? $recordAmount : (string)($recordMeta['totalAmount'] ?? '');
$currencyValue = $recordCurrency !== ''
    ? $recordCurrency
    : (string)($recordMeta['currency'] ?? '');

echo json_encode([
    'status' => $status,
    'result' => $result,
    'message' => (string)$xmlResp->ResultExplanation,
    'companyRef' => $resolvedCompanyRef ?: null,
    'context' => $contextValue !== '' ? $contextValue : null,
    'itemName' => $itemName !== '' ? $itemName : null,
    'quantity' => $quantity > 0 ? $quantity : null,
    'amount' => $amountValue !== '' ? $amountValue : null,
    'currency' => $currencyValue !== '' ? $currencyValue : null,
]);

function curl_xml(string $url, string $xml, int $retries = 0): array
{
    $attempts = 0;
    do {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $xml,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/xml', 'Accept: text/xml'],
            CURLOPT_USERAGENT => 'Mozilla/5.0 (X11; Linux x86_64) DPO-Integration/1.0',
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 30,
        ]);
        $body = curl_exec($ch);
        $status = $body !== false ? (int)curl_getinfo($ch, CURLINFO_HTTP_CODE) : 0;
        $error = curl_error($ch);
        curl_close($ch);

        if (!$error && $body) {
            return ['error' => null, 'body' => $body, 'status' => $status];
        }

        $attempts++;
    } while ($attempts <= $retries);

    return [
        'error' => $error ?: 'Empty response from payment gateway',
        'body' => $body,
        'status' => $status ?? 0,
    ];
}

function parse_xml(string $xml): ?SimpleXMLElement
{
    libxml_use_internal_errors(true);
    $parsed = simplexml_load_string($xml);
    libxml_clear_errors();
    return $parsed ?: null;
}

function open_store(?string $path): array
{
    if (!$path) {
        return [null, ['donations' => []]];
    }

    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }

    $handle = fopen($path, 'c+');
    if (!$handle) {
        return [null, ['donations' => []]];
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return [null, ['donations' => []]];
    }

    $contents = stream_get_contents($handle);
    $data = $contents ? json_decode($contents, true) : [];
    if (!is_array($data)) {
        $data = [];
    }
    if (!isset($data['donations']) || !is_array($data['donations'])) {
        $data['donations'] = [];
    }

    return [$handle, $data];
}

function save_store($handle, string $path, array $data): void
{
    if (!$handle) {
        return;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function close_store($handle): void
{
    if ($handle) {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function find_token_by_ref(array $storeData, string $companyRef): string
{
    return (string)($storeData['donations'][$companyRef]['transToken'] ?? '');
}

function find_ref_by_token(array $storeData, string $token): string
{
    foreach ($storeData['donations'] as $ref => $record) {
        if (($record['transToken'] ?? '') === $token) {
            return $ref;
        }
    }

    return '';
}

function is_valid_email(string $email): bool
{
    return $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL);
}

function format_amount_value($value): string
{
    if ($value === null) {
        return '';
    }
    $value = is_string($value) ? trim($value) : $value;
    if ($value === '') {
        return '';
    }
    if (is_numeric($value)) {
        return number_format((float)$value, 2, '.', ',');
    }
    return (string)$value;
}

function post_formspree(string $url, array $payload): bool
{
    if (!$url) {
        return false;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 20,
    ]);
    $body = curl_exec($ch);
    $status = $body !== false ? (int)curl_getinfo($ch, CURLINFO_HTTP_CODE) : 0;
    $error = curl_error($ch);
    curl_close($ch);

    if ($error || $status < 200 || $status >= 300) {
        return false;
    }

    return true;
}

function send_purchase_formspree_if_needed(
    array $record,
    string $formspreeUrl,
    string $status,
    string $previousStatus,
    string $companyRef
): array {
    if ($status !== 'PAID') {
        return [$record];
    }

    $context = strtolower((string)($record['context'] ?? ''));
    if (!in_array($context, ['uburu_village', 'uburu_home'], true)) {
        return [$record];
    }

    if ($formspreeUrl === '') {
        return [$record];
    }

    $emailSent = is_array($record['emailSent'] ?? null) ? $record['emailSent'] : [];
    if ($previousStatus === 'PAID' && !empty($emailSent['formspree'])) {
        return [$record];
    }

    $customer = is_array($record['customer'] ?? null) ? $record['customer'] : [];
    $buyerName = trim((string)($customer['name'] ?? ''));
    $buyerEmail = trim((string)($customer['email'] ?? ''));

    $meta = is_array($record['meta'] ?? null) ? $record['meta'] : [];
    $itemName = trim((string)($meta['itemName'] ?? ''));
    $quantity = (int)($meta['quantity'] ?? 1);
    $unitPrice = $meta['unitPrice'] ?? '';
    $amountValue = $record['amount'] ?? ($meta['totalAmount'] ?? '');
    $currency = (string)($record['currency'] ?? ($meta['currency'] ?? 'KES'));

    $contextLabel = $context === 'uburu_home' ? 'Uburu Home' : 'Uburu Village';
    $amountText = trim($currency . ' ' . format_amount_value($amountValue));
    $unitPriceText = format_amount_value($unitPrice);
    if ($unitPriceText !== '') {
        $unitPriceText = $currency . ' ' . $unitPriceText;
    }

    $payload = [
        '_subject' => 'Payment confirmed: ' . $contextLabel,
        'email' => is_valid_email($buyerEmail) ? $buyerEmail : 'no-reply@uburumultimovehs.org',
        '_replyto' => is_valid_email($buyerEmail) ? $buyerEmail : '',
        'fullName' => $buyerName,
        'context' => $contextLabel,
        'itemName' => $itemName,
        'quantity' => $quantity > 0 ? (string)$quantity : '',
        'unitPrice' => $unitPriceText,
        'total' => $amountText,
        'companyRef' => $companyRef,
        'buyerEmail' => $buyerEmail,
        'sendBuyerReceipt' => 'yes',
    ];

    $ok = post_formspree($formspreeUrl, $payload);
    if ($ok) {
        $emailSent['formspree'] = date('c');
        $record['emailSent'] = $emailSent;
    }

    return [$record];
}
