<?php

require_once __DIR__ . '/_helpers.php';

$payload = require_post_json();
honeypot_check($payload);

$mailConfig = load_mail_config();
enforce_rate_limit($mailConfig, 'therapy');

$fullName = require_string($payload, 'fullName', 160);
$email = require_email($payload, 'email');
$phone = require_string($payload, 'phone', 50);
$gender = require_string($payload, 'gender', 20);
$country = require_string($payload, 'country', 80);
$age = require_string($payload, 'age', 20);
$assistanceType = require_string($payload, 'assistanceType', 100);
$assistanceOther = optional_string($payload, 'assistanceOther', 200);
$practitionerGender = require_string($payload, 'practitionerGender', 30);
$financialStatus = require_string($payload, 'financialStatus', 20);
$alcoholFrequency = require_string($payload, 'alcoholFrequency', 30);
$religion = require_string($payload, 'religion', 30);
$priorTherapy = require_string($payload, 'priorTherapy', 10);
$assistanceReason = require_string($payload, 'assistanceReason', 200);
$assistanceReasonOther = optional_string($payload, 'assistanceReasonOther', 200);
$medication = require_string($payload, 'medication', 10);

$from = config_from($mailConfig);
$toEmail = config_recipient($mailConfig, 'therapy');

$subject = 'New therapy request';
$bodyLines = [
    'Type: Therapy Request',
    'Name: ' . $fullName,
    'Email: ' . $email,
    'Phone: ' . $phone,
    'Gender: ' . $gender,
    'Country: ' . $country,
    'Age: ' . $age,
    'Assistance type: ' . $assistanceType,
    'Practitioner gender preference: ' . $practitionerGender,
    'Financial status: ' . $financialStatus,
    'Alcohol frequency: ' . $alcoholFrequency,
    'Religion: ' . $religion,
    'Prior therapy: ' . $priorTherapy,
    'Reason: ' . $assistanceReason,
    'Currently taking medication: ' . $medication,
    'IP: ' . client_ip(),
];
if ($assistanceOther !== '') {
    $bodyLines[] = 'Assistance other: ' . $assistanceOther;
}
if ($assistanceReasonOther !== '') {
    $bodyLines[] = 'Reason other: ' . $assistanceReasonOther;
}

send_form_email($mailConfig, [
    'to_email' => $toEmail,
    'from_email' => $from['email'],
    'from_name' => $from['name'],
    'reply_to' => $email,
    'subject' => $subject,
    'body' => implode("\n", $bodyLines),
]);
