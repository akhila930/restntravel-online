<?php
// API Router for RestNTravel
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    } elseif ($path === 'health') {
        echo json_encode(['status' => 'success', 'message' => 'API is healthy']);
    } elseif ($path === 'simple-test') {
        include 'simple-test.php';
    } elseif ($path === 'test-connection') {
        include 'test-connection.php';
    } elseif ($path === 'debug') {
        include 'debug.php';
    } elseif ($path === 'db-test') {
        include 'db-test.php';
    } elseif ($path === 'direct-test.php') { // Direct access for testing
        include 'direct-test.php';
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'API endpoint not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
}
?> 