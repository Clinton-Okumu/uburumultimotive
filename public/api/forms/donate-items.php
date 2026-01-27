<?php

require_once __DIR__ . '/_helpers.php';

$payload = require_post_json();
honeypot_check($payload);

$mailConfig = load_mail_config();
enforce_rate_limit($mailConfig, 'donate_items');

$firstName = require_string($payload, 'firstName', 100);
$lastName = require_string($payload, 'lastName', 100);
$email = require_email($payload, 'email');
$category = require_string($payload, 'category', 20);
$deliveryMethod = require_string($payload, 'deliveryMethod', 20);

if (!in_array($category, ['food', 'clothing'], true)) {
    json_response(400, ['error' => 'Invalid category']);
}
if (!in_array($deliveryMethod, ['pickup', 'delivery'], true)) {
    json_response(400, ['error' => 'Invalid delivery method']);
}

$from = config_from($mailConfig);
$toEmail = config_recipient($mailConfig, 'donate_items');

$subject = 'New items donation submission';
$body = implode("\n", [
    'Type: Donate Items',
    'Name: ' . $firstName . ' ' . $lastName,
    'Email: ' . $email,
    'Category: ' . $category,
    'Delivery method: ' . $deliveryMethod,
    'IP: ' . client_ip(),
]);

send_form_email($mailConfig, [
    'to_email' => $toEmail,
    'from_email' => $from['email'],
    'from_name' => $from['name'],
    'reply_to' => $email,
    'subject' => $subject,
    'body' => $body,
]);
