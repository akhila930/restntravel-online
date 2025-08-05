<?php
header('Content-Type: application/json');

echo json_encode([
    'status' => 'debug',
    'message' => 'Debug file is working',
    'request_uri' => $_SERVER['REQUEST_URI'],
    'script_name' => $_SERVER['SCRIPT_NAME'],
    'php_self' => $_SERVER['PHP_SELF'],
    'query_string' => $_SERVER['QUERY_STRING'] ?? 'none',
    'method' => $_SERVER['REQUEST_METHOD'],
    'time' => date('Y-m-d H:i:s'),
    'file_exists' => [
        'index.php' => file_exists('index.php'),
        'simple-test.php' => file_exists('simple-test.php'),
        'test-connection.php' => file_exists('test-connection.php'),
        'debug.php' => file_exists('debug.php')
    ]
]);
?> 