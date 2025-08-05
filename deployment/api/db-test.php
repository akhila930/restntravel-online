<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

echo json_encode([
    'status' => 'testing',
    'message' => 'Database test started',
    'time' => date('Y-m-d H:i:s')
]);

try {
    // Test database connection
    require_once 'config/database.php';
    $database = new Database();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database class loaded successfully',
        'connection_test' => $database->testConnection() ? 'connected' : 'failed'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
?> 