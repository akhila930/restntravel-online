<?php
header('Content-Type: application/json');

// Test database connection with different configurations
$configs = [
    [
        'name' => 'Current Config',
        'host' => 'localhost',
        'dbname' => 'u897731037_restntravel_db',
        'username' => 'u897731037_restntravel_us',
        'password' => 'Sales@8912'
    ],
    [
        'name' => 'Alternative Host',
        'host' => '127.0.0.1',
        'dbname' => 'u897731037_restntravel_db',
        'username' => 'u897731037_restntravel_us',
        'password' => 'Sales@8912'
    ]
];

$results = [];

foreach ($configs as $config) {
    try {
        $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8";
        $pdo = new PDO($dsn, $config['username'], $config['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Test a simple query
        $stmt = $pdo->query("SELECT 1 as test");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $results[] = [
            'config' => $config['name'],
            'status' => 'success',
            'message' => 'Database connected successfully',
            'test_query' => $result['test']
        ];
        
    } catch (PDOException $e) {
        $results[] = [
            'config' => $config['name'],
            'status' => 'error',
            'message' => $e->getMessage(),
            'code' => $e->getCode()
        ];
    }
}

echo json_encode([
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => $_SERVER['SERVER_NAME'],
    'php_version' => PHP_VERSION,
    'pdo_drivers' => PDO::getAvailableDrivers(),
    'results' => $results
], JSON_PRETTY_PRINT);
?> 