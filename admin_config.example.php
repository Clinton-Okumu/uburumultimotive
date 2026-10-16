<?php
/**
 * Administrator Authentication Configuration for Uburu Admin Panel.
 * Copy this file to admin_config.php on your server and set secure credentials.
 */

return [
    // Admin username
    'username' => getenv('ADMIN_USER') ?: 'admin',

    // Bcrypt/Argon2 password hash.
    // Generated via password_hash('YourSecurePassword', PASSWORD_DEFAULT)
    // Default hash below corresponds to '1234' (CHANGE THIS IN PRODUCTION!)
    'password_hash' => getenv('ADMIN_PASSWORD_HASH') ?: '$2y$12$Gow7Ep2fWKuB/DNLq7b1z.GVHEG6o85yqTqDLpjV45VwC3IboEQqC',

    // Secret signing key for JWT HMAC tokens (minimum 32 characters recommended)
    'jwt_secret' => getenv('ADMIN_JWT_SECRET') ?: 'uburu_secret_jwt_admin_key_2026_default_replace_in_prod',

    // Token time-to-live in seconds (7 days default: 604800)
    'token_ttl' => 604800,
];
