<?php

require_once __DIR__ . '/_helpers.php';

$payload = require_post_json();
honeypot_check($payload);

$mailConfig = load_mail_config();
enforce_rate_limit($mailConfig, 'volunteer');

$firstName = require_string($payload, 'firstName', 100);
$lastName = require_string($payload, 'lastName', 100);
$email = require_email($payload, 'email');
$phone = require_string($payload, 'phone', 50);
$location = require_string($payload, 'location', 120);
$availability = require_string($payload, 'availability', 60);
$frequency = require_string($payload, 'frequency', 60);
$message = optional_string($payload, 'message', 5000);

$interests = $payload['interests'] ?? [];
if (!is_array($interests)) {
    $interests = [$interests];
}
$interests = array_values(array_filter(array_map('trim', array_map('strval', $interests))));

$from = config_from($mailConfig);
$toEmail = config_recipient($mailConfig, 'volunteer');

$subject = 'New volunteer submission';
$bodyLines = [
    'Type: Volunteer',
    'Name: ' . $firstName . ' ' . $lastName,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Location: ' . $location,
    'Availability: ' . $availability,
    'Commitment: ' . $frequency,
    'Interests: ' . ($interests ? implode(', ', $interests) : '-'),
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
