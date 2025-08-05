<?php
// API Router for RestNTravel
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove base path if needed
$path = str_replace('/api', '', $path);

// Clean up the path
$path = trim($path, '/');

try {
    // Route to appropriate API file
    if (strpos($path, 'auth') === 0) {
        include 'auth.php';
    } elseif (strpos($path, 'products') === 0) {
        include 'products.php';
    } elseif (strpos($path, 'orders') === 0) {
        include 'orders.php';
    } elseif (strpos($path, 'testimonials') === 0) {
        include 'testimonials.php';
    } elseif (strpos($path, 'contact') === 0) {
        include 'contact.php';
    } elseif (strpos($path, 'admin') === 0) {
        include 'admin.php';
    } elseif (strpos($path, 'test-db') === 0) {
        include 'test-db.php';
    } elseif (strpos($path, 'simple-test') === 0) {
        include 'simple-test.php';
    } elseif (strpos($path, 'test-connection') === 0) {
        include 'test-connection.php';
    } else {
        // Health check endpoint
        if ($path == 'health' || $path == '') {
            echo json_encode([
                'status' => 'OK',
                'timestamp' => date('c'),
                'environment' => 'production',
                'message' => 'RestNTravel API is running',
                'endpoints' => [
                    'health' => '/api/health',
                    'auth' => '/api/auth',
                    'products' => '/api/products',
                    'orders' => '/api/orders',
                    'testimonials' => '/api/testimonials',
                    'contact' => '/api/contact',
                    'admin' => '/api/admin'
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'API endpoint not found: ' . $path,
                'available_endpoints' => [
                    'health' => '/api/health',
                    'auth' => '/api/auth',
                    'products' => '/api/products',
                    'orders' => '/api/orders',
                    'testimonials' => '/api/testimonials',
                    'contact' => '/api/contact',
                    'admin' => '/api/admin'
                ]
            ]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ]);
}
?> 