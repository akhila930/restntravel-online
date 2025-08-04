<?php
// API Router for RestNTravel
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove base path if needed
$path = str_replace('/api', '', $path);

// Route to appropriate API file
if (strpos($path, '/auth') === 0) {
    include 'auth.php';
} elseif (strpos($path, '/products') === 0) {
    include 'products.php';
} elseif (strpos($path, '/orders') === 0) {
    include 'orders.php';
} elseif (strpos($path, '/testimonials') === 0) {
    include 'testimonials.php';
} elseif (strpos($path, '/contact') === 0) {
    include 'contact.php';
} elseif (strpos($path, '/admin') === 0) {
    include 'admin.php';
} else {
    // Health check endpoint
    if ($path == '/health' || $path == '/health/') {
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'OK',
            'timestamp' => date('c'),
            'environment' => 'production',
            'message' => 'RestNTravel API is running'
        ]);
    } else {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'API endpoint not found'
        ]);
    }
}
?> 