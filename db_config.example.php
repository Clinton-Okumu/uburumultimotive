<?php
/**
 * Database configuration for Uburu Multimove / Uburu Home MySQL Database on cPanel.
 * Copy this file to `db_config.php` and fill in your cPanel database credentials.
 */

return [
    'host'     => 'localhost',
    'dbname'   => 'cpaneluser_uburuhome', // e.g., your_cpanel_username_uburuhome
    'username' => 'cpaneluser_dbuser',    // e.g., your_cpanel_username_dbuser
    'password' => 'YourStrongPasswordHere',
    'charset'  => 'utf8mb4',
    'port'     => 3306,
];
