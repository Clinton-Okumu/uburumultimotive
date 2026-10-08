<?php
/**
 * Image Upload Endpoint for Uburu Home on cPanel.
 * Supports both Multipart File Upload (`$_FILES['image']`)
 * and Base64 Data URL payload (`{"image": "data:image/png;base64,..."}`).
 * Saves files to `/public/uploads/` or `/uploads/` and returns public URL.
 */

require_once __DIR__ . '/db.php';
set_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    api_response(405, ['success' => false, 'error' => 'Method not allowed']);
}

// Determine uploads directory
$uploadDir = dirname(__DIR__, 2) . '/uploads';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

if (!is_writable($uploadDir)) {
    api_response(500, [
        'success' => false,
        'error'   => 'Uploads directory is not writable. Please set 755 or 777 permissions on /uploads folder.',
    ]);
}

$allowedMimes = [
    'image/jpeg'    => 'jpg',
    'image/jpg'     => 'jpg',
    'image/png'     => 'png',
    'image/webp'    => 'webp',
    'image/gif'     => 'gif',
    'image/svg+xml' => 'svg',
];

// ----------------------------------------------------
// Mode 1: Multipart File Upload
// ----------------------------------------------------
$file = $_FILES['image'] ?? ($_FILES['file'] ?? null);

if ($file && is_array($file) && ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
    if ($file['size'] > 12 * 1024 * 1024) {
        api_response(400, ['success' => false, 'error' => 'File too large. Maximum size is 12MB.']);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    if (!isset($allowedMimes[$mime])) {
        api_response(400, ['success' => false, 'error' => 'Invalid image format. Allowed: JPG, PNG, WebP, GIF, SVG.']);
    }

    $ext = $allowedMimes[$mime];
    $safeName = 'uburu-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $safeName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $publicUrl = '/uploads/' . $safeName;
        api_response(200, [
            'success'  => true,
            'url'      => $publicUrl,
            'filename' => $safeName,
        ]);
    } else {
        api_response(500, ['success' => false, 'error' => 'Failed to save uploaded image file']);
    }
}

// ----------------------------------------------------
// Mode 2: Base64 JSON Payload
// ----------------------------------------------------
$raw = file_get_contents('php://input');
$json = json_decode($raw ?: '', true);

if (is_array($json) && !empty($json['image']) && str_starts_with($json['image'], 'data:image/')) {
    $dataUri = $json['image'];
    if (preg_match('/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/', $dataUri, $matches)) {
        $mime = $matches[1];
        $base64Data = $matches[2];
        $decoded = base64_decode($base64Data);

        if ($decoded === false) {
            api_response(400, ['success' => false, 'error' => 'Corrupt base64 image data']);
        }

        $ext = $allowedMimes[$mime] ?? 'webp';
        $safeName = 'uburu-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
        $targetPath = $uploadDir . '/' . $safeName;

        if (file_put_contents($targetPath, $decoded) !== false) {
            $publicUrl = '/uploads/' . $safeName;
            api_response(200, [
                'success'  => true,
                'url'      => $publicUrl,
                'filename' => $safeName,
            ]);
        }
    }
}

api_response(400, [
    'success' => false,
    'error'   => 'No valid image provided via multipart form or base64 data.',
]);
