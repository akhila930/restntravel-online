<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Test basic PHP functionality
    $response = [
        'status' => 'success',
        'message' => 'PHP API is working',
        'php_version' => PHP_VERSION,
        'server_time' => date('Y-m-d H:i:s'),
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'request_uri' => $_SERVER['REQUEST_URI']
    ];

    // Test database connection
    require_once 'config/database.php';
    $database = new Database();
    
    if ($database->testConnection()) {
        $response['database'] = 'connected';
    } else {
        $response['database'] = 'failed';
    }

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?> 