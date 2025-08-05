<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'success',
    'message' => 'Direct PHP access is working',
    'php_version' => PHP_VERSION,
    'server_time' => date('Y-m-d H:i:s'),
    'file' => __FILE__,
    'directory' => __DIR__
]);
?> 