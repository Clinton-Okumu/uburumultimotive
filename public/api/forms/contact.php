<?php

require_once __DIR__ . '/_helpers.php';

$payload = require_post_json();
honeypot_check($payload);

$mailConfig = load_mail_config();
enforce_rate_limit($mailConfig, 'contact');

$firstName = require_string($payload, 'firstName', 100);
$lastName = require_string($payload, 'lastName', 100);
$email = require_email($payload, 'email');
$message = require_string($payload, 'message', 5000);

$from = config_from($mailConfig);
$toEmail = config_recipient($mailConfig, 'contact');

$subject = 'New contact message';
$body = implode("\n", [
    'Type: Contact',
    'Name: ' . $firstName . ' ' . $lastName,
    'Email: ' . $email,
    'IP: ' . client_ip(),
    '',
    $message,
]);

send_form_email($mailConfig, [
    'to_email' => $toEmail,
    'from_email' => $from['email'],
    'from_name' => $from['name'],
    'reply_to' => $email,
    'subject' => $subject,
    'body' => $body,
]);
