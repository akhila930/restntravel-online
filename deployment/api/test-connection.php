<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo json_encode([
    'status' => 'success',
    'message' => 'PHP is working',
    'php_version' => PHP_VERSION,
    'time' => date('Y-m-d H:i:s')
]);
?> 