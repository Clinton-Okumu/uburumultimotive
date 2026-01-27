<?php

return [
    // Delivery mode: 'smtp' (recommended) or 'mail' (fallback).
    'mode' => 'smtp',

    // SMTP settings (used when mode = 'smtp').
    'smtp' => [
        'host' => 'smtp.yourdomain.com',
        'port' => 587,
        'secure' => 'tls', // 'tls' or 'ssl'
        'username' => 'no-reply@yourdomain.com',
        'password' => 'YOUR_SMTP_PASSWORD',
    ],

    // From identity shown to recipients.
    'from' => [
        'email' => 'no-reply@yourdomain.com',
        'name' => 'Uburu Multimove',
    ],

    // Recipients.
    // You can set a single catch-all inbox via 'default', or override per form.
    'to' => [
        'default' => 'uburumultimove@gmail.com',
        'contact' => 'uburumultimove@gmail.com',
        'volunteer' => 'uburumultimove@gmail.com',
        'donate_items' => 'uburumultimove@gmail.com',
        'therapy' => 'therapy@uburumultimove.org',
    ],

    // Basic abuse protection.
    'rate_limit' => [
        'window_seconds' => 300,
        'max_requests' => 5,
    ],
];
