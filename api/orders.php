<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];
$path = parse_url($path, PHP_URL_PATH);
$path = str_replace('/api/orders', '', $path);

switch ($method) {
    case 'GET':
        if ($path == '/admin' || $path == '/admin/') {
            handleGetAllOrders($db);
        } elseif (preg_match('/^\/user\/(\d+)\/?$/', $path, $matches)) {
            handleGetUserOrders($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    
    case 'POST':
        handleCreateOrder($db);
        break;
    
    case 'PUT':
        if (preg_match('/^\/(\d+)\/status\/?$/', $path, $matches)) {
            handleUpdateOrderStatus($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function generateOrderNumber() {
    $timestamp = time();
    $random = strtoupper(substr(md5(rand()), 0, 5));
    return "REST{$timestamp}{$random}";
}

function sendOrderEmail($orderData) {
    $to = 'sales@restntravel.shop';
    $subject = "New Order #{$orderData['orderNumber']} - ₹{$orderData['totalAmount']}";
    
    $message = "
    <html>
    <head>
        <title>New Order - RestNTravel</title>
    </head>
    <body>
        <h2>🛍️ New Order Received - RestNTravel</h2>
        
        <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <h3>📋 Order Details</h3>
            <p><strong>Order Number:</strong> {$orderData['orderNumber']}</p>
            <p><strong>Total Amount:</strong> ₹{$orderData['totalAmount']}</p>
            <p><strong>Date:</strong> " . date('Y-m-d H:i:s') . "</p>
        </div>

        <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <h3>👤 Customer Information</h3>
            <p><strong>Name:</strong> {$orderData['customerName']}</p>
            <p><strong>Email:</strong> {$orderData['customerEmail']}</p>
            <p><strong>Phone:</strong> " . ($orderData['customerPhone'] ?? 'Not provided') . "</p>
            <p><strong>Address:</strong> {$orderData['shippingAddress']}, {$orderData['shippingCity']}, {$orderData['shippingState']} - {$orderData['shippingPinCode']}</p>
        </div>

        <div style='background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;'>
            <h3>🚚 Next Steps</h3>
            <p>1. Confirm the order with the customer</p>
            <p>2. Process the order for delivery</p>
            <p>3. Update order status in the system</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: RestNTravel Orders <sales@restntravel.shop>" . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

function handleCreateOrder($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['billingInfo']) || !isset($data['items']) || !isset($data['total'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required order information']);
        return;
    }
    
    $user = $data['user'] ?? null;
    $billingInfo = $data['billingInfo'];
    $items = $data['items'];
    $total = $data['total'];
    $paymentMethod = $data['paymentMethod'] ?? 'Cash on Delivery';
    
    $orderNumber = generateOrderNumber();
    
    try {
        $stmt = $db->prepare("
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                total_amount, shipping_address, shipping_city, shipping_state, 
                shipping_pin_code, payment_method, items_summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $itemsSummary = implode(', ', array_map(function($item) {
            return "{$item['name']} ({$item['quantity']})";
        }, $items));
        
        $stmt->execute([
            $orderNumber,
            $user['id'] ?? null,
            $billingInfo['name'],
            $billingInfo['email'],
            $billingInfo['phone'] ?? null,
            $total,
            $billingInfo['street'],
            $billingInfo['city'],
            $billingInfo['state'],
            $billingInfo['pinCode'],
            $paymentMethod,
            $itemsSummary
        ]);
        
        $orderId = $db->lastInsertId();
        
        // Send order email
        sendOrderEmail([
            'orderNumber' => $orderNumber,
            'customerName' => $billingInfo['name'],
            'customerEmail' => $billingInfo['email'],
            'customerPhone' => $billingInfo['phone'] ?? null,
            'shippingAddress' => $billingInfo['street'],
            'shippingCity' => $billingInfo['city'],
            'shippingState' => $billingInfo['state'],
            'shippingPinCode' => $billingInfo['pinCode'],
            'totalAmount' => $total,
            'items' => $items
        ]);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Order placed successfully',
            'orderNumber' => $orderNumber,
            'orderId' => $orderId
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create order. Please try again.']);
    }
}

function handleGetAllOrders($db) {
    try {
        $stmt = $db->prepare("
            SELECT o.*, u.name as user_name, u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        ");
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load orders']);
    }
}

function handleGetUserOrders($db, $userId) {
    try {
        $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'orders' => $orders
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load orders']);
    }
}

function handleUpdateOrderStatus($db, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status is required']);
        return;
    }
    
    try {
        $stmt = $db->prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->execute([$data['status'], $id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Order status updated successfully'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
    }
}
?> 