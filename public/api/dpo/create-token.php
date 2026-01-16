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

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$amount = $payload['amount'] ?? null;
$currency = strtoupper($payload['currency'] ?? ($config['default_currency'] ?? 'KES'));
$customer = is_array($payload['customer'] ?? null) ? $payload['customer'] : [];
$customerName = trim((string)($customer['name'] ?? ''));
$customerEmail = trim((string)($customer['email'] ?? ''));
$customerPhone = trim((string)($customer['phone'] ?? ''));

if (!is_numeric($amount)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

if (empty($config['company_token'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing company token configuration']);
    exit;
}

$amount = (float)$amount;
$minAmount = (float)($config['min_amount'] ?? 1);
$maxAmount = (float)($config['max_amount'] ?? 10000000);
if ($amount < $minAmount || $amount > $maxAmount) {
    http_response_code(400);
    echo json_encode(['error' => 'Amount out of range']);
    exit;
}

$allowedCurrencies = $config['allowed_currencies'] ?? ['KES'];
if (!in_array($currency, $allowedCurrencies, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported currency']);
    exit;
}

$storagePath = $config['storage_path'] ?? null;
[$storeHandle, $storeData] = open_store($storagePath);
$companyRef = generate_company_ref($config['company_ref_prefix'] ?? 'DON', $storeData);

$amountFormatted = number_format($amount, 2, '.', '');
$serviceDate = date('Y/m/d H:i');

$redirectUrl = trim((string)($config['redirect_url'] ?? ''));
$backUrl = trim((string)($config['back_url'] ?? ''));
if (!$redirectUrl || !$backUrl) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing redirect or back URL configuration']);
    close_store($storeHandle);
    exit;
}

if (!filter_var($redirectUrl, FILTER_VALIDATE_URL) || !filter_var($backUrl, FILTER_VALIDATE_URL)) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid redirect or back URL configuration']);
    close_store($storeHandle);
    exit;
}

$serviceType = preg_replace('/[^0-9]/', '', (string)($config['service_type'] ?? ''));
if (!$serviceType) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid service type configuration']);
    close_store($storeHandle);
    exit;
}

$serviceDescription = trim((string)($config['service_description'] ?? 'Donation')) ?: 'Donation';

$xml = <<<XML
<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>{$config['company_token']}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>{$amountFormatted}</PaymentAmount>
    <PaymentCurrency>{$currency}</PaymentCurrency>
    <CompanyRef>{$companyRef}</CompanyRef>
    <RedirectURL>{$redirectUrl}</RedirectURL>
    <BackURL>{$backUrl}</BackURL>
    <CompanyRefUnique>1</CompanyRefUnique>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>{$serviceType}</ServiceType>
      <ServiceDescription>{$serviceDescription}</ServiceDescription>
      <ServiceDate>{$serviceDate}</ServiceDate>
    </Service>
  </Services>
</API3G>
XML;

$apiEndpoint = trim((string)($config['api_endpoint'] ?? ''));
if (!$apiEndpoint) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing API endpoint configuration']);
    close_store($storeHandle);
    exit;
}

$response = curl_xml($apiEndpoint, $xml, 1);
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
if ($result !== '000') {
    http_response_code(400);
    echo json_encode(['error' => (string)$xmlResp->ResultExplanation]);
    close_store($storeHandle);
    exit;
}

$transactionToken = (string)$xmlResp->TransToken;

if ($storeHandle) {
    $storeData['donations'][$companyRef] = [
        'companyRef' => $companyRef,
        'transToken' => $transactionToken,
        'amount' => $amountFormatted,
        'currency' => $currency,
        'status' => 'CREATED',
        'customer' => [
            'name' => $customerName,
            'email' => $customerEmail,
            'phone' => $customerPhone,
        ],
        'createdAt' => date('c'),
        'updatedAt' => date('c'),
    ];
    save_store($storeHandle, $storagePath, $storeData);
}

$payUrl = trim((string)($config['pay_url'] ?? ''));
if (!$payUrl) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing pay URL configuration']);
    close_store($storeHandle);
    exit;
}

echo json_encode([
    'transactionToken' => $transactionToken,
    'paymentUrl' => $payUrl . urlencode($transactionToken),
    'companyRef' => $companyRef,
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

function generate_company_ref(string $prefix, array $storeData): string
{
    for ($i = 0; $i < 5; $i++) {
        $candidate = sprintf(
            '%s-%s-%s',
            $prefix,
            date('YmdHis'),
            bin2hex(random_bytes(3))
        );
        if (!isset($storeData['donations'][$candidate])) {
            return $candidate;
        }
    }

    return sprintf('%s-%s', $prefix, bin2hex(random_bytes(6)));
}
