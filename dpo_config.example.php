<?php

return [
    'company_token' => 'DPO_LIVE_COMPANY_TOKEN',
    'api_endpoint' => 'https://secure.3gdirectpay.com/API/v6/',
    'pay_url' => 'https://secure.3gdirectpay.com/payv3.php?ID=',
    'redirect_url' => 'https://uburumultimovehs.org/donate/return',
    'back_url' => 'https://uburumultimovehs.org/donate/return',
    'purchase_redirect_url' => 'https://uburumultimovehs.org/purchase/return',
    'purchase_back_url' => 'https://uburumultimovehs.org/purchase/return',
    'service_type' => '100026',
    'default_currency' => 'KES',
    'allowed_currencies' => ['KES', 'USD'],
    'min_amount' => 10,
    'max_amount' => 1000000,
    'service_description' => 'Donation',
    'purchase_descriptions' => [
        'uburu_village' => 'Uburu Village Tickets',
        'uburu_home' => 'Uburu Home Purchase',
    ],
    'formspree_purchase_url' => 'https://formspree.io/f/xpqjaolz',
    'company_ref_prefix' => 'DON',
    'storage_path' => '/home/USERNAME/dpo_donations.json',
];
