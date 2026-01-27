<?php

require_once __DIR__ . '/_helpers.php';

$payload = require_post_json();
honeypot_check($payload);

$mailConfig = load_mail_config();
enforce_rate_limit($mailConfig, 'therapy');

$fullName = require_string($payload, 'fullName', 160);
$email = require_email($payload, 'email');
$phone = require_string($payload, 'phone', 50);
$age = require_string($payload, 'age', 20);
$therapyType = require_string($payload, 'therapyType', 50);
$preferredMode = require_string($payload, 'preferredMode', 50);
$preferredTime = require_string($payload, 'preferredTime', 50);
$message = optional_string($payload, 'message', 5000);

$from = config_from($mailConfig);
$toEmail = config_recipient($mailConfig, 'therapy');

$subject = 'New therapy request';
$bodyLines = [
    'Type: Therapy Request',
    'Name: ' . $fullName,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Age: ' . $age,
    'Therapy type: ' . $therapyType,
    'Preferred mode: ' . $preferredMode,
    'Preferred time: ' . $preferredTime,
    'IP: ' . client_ip(),
];
if ($message !== '') {
    $bodyLines[] = '';
    $bodyLines[] = $message;
}

send_form_email($mailConfig, [
    'to_email' => $toEmail,
    'from_email' => $from['email'],
    'from_name' => $from['name'],
    'reply_to' => $email,
    'subject' => $subject,
    'body' => implode("\n", $bodyLines),
]);
