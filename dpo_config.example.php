<?php

return [
    'company_token' => 'DPO_TEST_COMPANY_TOKEN',
    'api_endpoint' => 'https://secure.3gdirectpay.com/API/v6/',
    'pay_url' => 'https://secure.3gdirectpay.com/payv3.php?ID=',
    'redirect_url' => 'https://uburumultimovehs.org/donate/return',
    'back_url' => 'https://uburumultimovehs.org/donate/return',
    'service_type' => '85325',
    'default_currency' => 'KES',
    'allowed_currencies' => ['KES'],
    'min_amount' => 10,
    'max_amount' => 1000000,
    'service_description' => 'Donation',
    'company_ref_prefix' => 'DON',
    'storage_path' => '/home/USERNAME/dpo_donations.json',
];
