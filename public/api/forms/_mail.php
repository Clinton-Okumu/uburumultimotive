<?php

function send_email(array $mailConfig, array $message): array
{
    $mode = strtolower((string)($mailConfig['mode'] ?? 'smtp'));
    if ($mode !== 'smtp' && $mode !== 'mail') {
        $mode = 'smtp';
    }

    if ($mode === 'mail') {
        return send_email_via_mail($mailConfig, $message);
    }

    $smtp = is_array($mailConfig['smtp'] ?? null) ? $mailConfig['smtp'] : [];
    return send_email_via_smtp($smtp, $message);
}

function send_email_via_mail(array $mailConfig, array $message): array
{
    $fromEmail = (string)($message['from_email'] ?? '');
    $fromName = (string)($message['from_name'] ?? '');
    $toEmail = (string)($message['to_email'] ?? '');
    $subject = (string)($message['subject'] ?? '');
    $body = (string)($message['body'] ?? '');
    $replyTo = (string)($message['reply_to'] ?? '');

    $headers = [];
    $headers[] = 'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000';
    $headers[] = 'Message-ID: ' . smtp_message_id();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    if ($fromEmail) {
        $headers[] = 'From: ' . ($fromName ? sprintf('%s <%s>', $fromName, $fromEmail) : $fromEmail);
    }
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $ok = @mail($toEmail, $subject, $body, implode("\r\n", $headers));
    if (!$ok) {
        return ['ok' => false, 'error' => 'Unable to send email'];
    }
    return ['ok' => true, 'error' => null];
}

function send_email_via_smtp(array $smtp, array $message): array
{
    $host = (string)($smtp['host'] ?? '');
    $port = (int)($smtp['port'] ?? 587);
    $secure = strtolower((string)($smtp['secure'] ?? 'tls'));
    $username = (string)($smtp['username'] ?? '');
    $password = (string)($smtp['password'] ?? '');

    if (!$host || !$port || !$username || !$password) {
        return ['ok' => false, 'error' => 'SMTP is not configured'];
    }

    $fromEmail = (string)($message['from_email'] ?? '');
    $fromName = (string)($message['from_name'] ?? '');
    $toEmail = (string)($message['to_email'] ?? '');
    $subject = (string)($message['subject'] ?? '');
    $body = (string)($message['body'] ?? '');
    $replyTo = (string)($message['reply_to'] ?? '');

    $connectHost = $host;
    if ($secure === 'ssl') {
        $connectHost = 'ssl://' . $host;
    }

    $fp = @stream_socket_client(
        $connectHost . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT
    );

    if (!$fp) {
        return ['ok' => false, 'error' => 'SMTP connection failed: ' . ($errstr ?: $errno)];
    }

    stream_set_timeout($fp, 20);

    $greeting = smtp_read($fp);
    if (!smtp_is_ok($greeting, [220])) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP greeting failed', $greeting)];
    }

    $ehlo = smtp_command($fp, 'EHLO ' . smtp_helo_name(), [250]);
    if (!$ehlo['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP EHLO failed', (string)($ehlo['response'] ?? ''))];
    }

    if ($secure === 'tls') {
        $starttls = smtp_command($fp, 'STARTTLS', [220]);
        if (!$starttls['ok']) {
            fclose($fp);
            return ['ok' => false, 'error' => smtp_error('SMTP STARTTLS failed', (string)($starttls['response'] ?? ''))];
        }

        $cryptoOk = @stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        if ($cryptoOk !== true) {
            fclose($fp);
            return ['ok' => false, 'error' => 'SMTP TLS negotiation failed'];
        }

        $ehlo2 = smtp_command($fp, 'EHLO ' . smtp_helo_name(), [250]);
        if (!$ehlo2['ok']) {
            fclose($fp);
            return ['ok' => false, 'error' => smtp_error('SMTP EHLO after TLS failed', (string)($ehlo2['response'] ?? ''))];
        }
    }

    // AUTH LOGIN
    $auth = smtp_command($fp, 'AUTH LOGIN', [334]);
    if (!$auth['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP AUTH failed', (string)($auth['response'] ?? ''))];
    }

    $userResp = smtp_command($fp, base64_encode($username), [334]);
    if (!$userResp['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP AUTH username rejected', (string)($userResp['response'] ?? ''))];
    }

    $passResp = smtp_command($fp, base64_encode($password), [235]);
    if (!$passResp['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP AUTH password rejected', (string)($passResp['response'] ?? ''))];
    }

    $mailFrom = smtp_command($fp, 'MAIL FROM:<' . $fromEmail . '>', [250]);
    if (!$mailFrom['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP MAIL FROM failed', (string)($mailFrom['response'] ?? ''))];
    }

    $rcptTo = smtp_command($fp, 'RCPT TO:<' . $toEmail . '>', [250, 251]);
    if (!$rcptTo['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP RCPT TO failed', (string)($rcptTo['response'] ?? ''))];
    }

    $data = smtp_command($fp, 'DATA', [354]);
    if (!$data['ok']) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP DATA failed', (string)($data['response'] ?? ''))];
    }

    $headers = [];
    $headers[] = 'From: ' . ($fromName ? sprintf('%s <%s>', $fromName, $fromEmail) : $fromEmail);
    $headers[] = 'To: ' . $toEmail;
    $headers[] = 'Subject: ' . smtp_encode_subject($subject);
    $headers[] = 'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000';
    $headers[] = 'Message-ID: ' . smtp_message_id();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    $payload = implode("\r\n", $headers) . "\r\n\r\n" . smtp_normalize_body($body);
    // End DATA with <CRLF>.<CRLF>
    fwrite($fp, $payload . "\r\n.\r\n");
    $dataDone = smtp_read($fp);
    if (!smtp_is_ok($dataDone, [250])) {
        fclose($fp);
        return ['ok' => false, 'error' => smtp_error('SMTP message rejected', $dataDone)];
    }

    smtp_command($fp, 'QUIT', [221]);
    fclose($fp);
    return ['ok' => true, 'error' => null];
}

function smtp_error(string $label, string $response): string
{
    $summary = smtp_summarize_response($response);
    if ($summary !== '') {
        error_log('[forms][smtp] ' . $label . ': ' . $summary);
    } else {
        error_log('[forms][smtp] ' . $label);
    }

    if (smtp_debug_enabled() && $summary !== '') {
        return $label . ': ' . $summary;
    }
    return $label;
}

function smtp_debug_enabled(): bool
{
    $v = strtolower(trim((string)(getenv('MAIL_DEBUG') ?: '')));
    return in_array($v, ['1', 'true', 'yes', 'on'], true);
}

function smtp_summarize_response(string $response): string
{
    $response = trim($response);
    if ($response === '') {
        return '';
    }
    $response = preg_replace('/\s+/', ' ', $response);
    if ($response === null) {
        $response = '';
    }
    if (strlen($response) > 300) {
        $response = substr($response, 0, 300) . '...';
    }
    return $response;
}

function smtp_command($fp, string $command, array $okCodes): array
{
    fwrite($fp, $command . "\r\n");
    $resp = smtp_read($fp);
    return ['ok' => smtp_is_ok($resp, $okCodes), 'response' => $resp];
}

function smtp_read($fp): string
{
    $out = '';
    while (!feof($fp)) {
        $line = fgets($fp, 8192);
        if ($line === false) {
            break;
        }
        $out .= $line;
        // Multi-line responses have a hyphen after the code.
        if (preg_match('/^\d{3} /', $line)) {
            break;
        }
    }
    return $out;
}

function smtp_is_ok(string $response, array $codes): bool
{
    if (!preg_match('/^(\d{3})/m', $response, $m)) {
        return false;
    }
    $code = (int)$m[1];
    return in_array($code, $codes, true);
}

function smtp_helo_name(): string
{
    $host = gethostname();
    return $host ? $host : 'localhost';
}

function smtp_message_id(): string
{
    $host = smtp_helo_name();
    $host = preg_replace('/[^A-Za-z0-9.-]/', '', $host);
    if ($host === null || $host === '') {
        $host = 'localhost';
    }

    $rand = '';
    if (function_exists('random_bytes')) {
        try {
            $rand = bin2hex(random_bytes(16));
        } catch (Throwable $e) {
            $rand = '';
        }
    }
    if ($rand === '') {
        $rand = str_replace('.', '', uniqid('', true));
    }

    return '<' . $rand . '.' . time() . '@' . $host . '>';
}

function smtp_encode_subject(string $subject): string
{
    // RFC 2047 for non-ASCII; keep ASCII plain.
    if ($subject === '' || preg_match('/^[\x20-\x7E]+$/', $subject)) {
        return $subject;
    }
    return '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

function smtp_normalize_body(string $body): string
{
    $body = str_replace(["\r\n", "\r"], "\n", $body);
    $body = str_replace("\n", "\r\n", $body);
    // Dot-stuffing
    $body = preg_replace('/\r\n\./', "\r\n..", $body);
    if ($body === null) {
        $body = '';
    }
    return $body;
}
