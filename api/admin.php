<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
$path = str_replace('/api/admin', '', $path);

switch ($method) {
    case 'GET':
        if ($path == '/dashboard' || $path == '/dashboard/') {
            handleGetDashboard($db);
        } elseif ($path == '/users' || $path == '/users/') {
            handleGetAllUsers($db);
        } elseif (preg_match('/^\/users\/(\d+)\/?$/', $path, $matches)) {
            handleGetUser($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    
    case 'PUT':
        if (preg_match('/^\/users\/(\d+)\/?$/', $path, $matches)) {
            handleUpdateUser($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
        }
        break;
    
    case 'DELETE':
        if (preg_match('/^\/users\/(\d+)\/?$/', $path, $matches)) {
            handleDeleteUser($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User ID required']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleGetDashboard($db) {
    try {
        // Get total users
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
        $stmt->execute();
        $userCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get total orders
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM orders");
        $stmt->execute();
        $orderCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get total revenue
        $stmt = $db->prepare("SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled'");
        $stmt->execute();
        $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
        
        // Get total products
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM products");
        $stmt->execute();
        $productCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get total testimonials
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM testimonials");
        $stmt->execute();
        $testimonialCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get recent orders
        $stmt = $db->prepare("
            SELECT o.*, u.name as user_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC 
            LIMIT 5
        ");
        $stmt->execute();
        $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'stats' => [
                'totalUsers' => (int)$userCount,
                'totalOrders' => (int)$orderCount,
                'totalRevenue' => (float)$revenue,
                'totalProducts' => (int)$productCount,
                'totalTestimonials' => (int)$testimonialCount
            ],
            'recentOrders' => $recentOrders
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load dashboard data']);
    }
}

function handleGetAllUsers($db) {
    try {
        $stmt = $db->prepare("
            SELECT id, name, email, role, phone, address, city, state, pin_code, created_at
            FROM users 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'users' => $users
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load users']);
    }
}

function handleGetUser($db, $id) {
    try {
        $stmt = $db->prepare("
            SELECT id, name, email, role, phone, address, city, state, pin_code, created_at
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load user']);
    }
}

function handleUpdateUser($db, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $role = $data['role'] ?? null;
        $phone = $data['phone'] ?? null;
        $address = $data['address'] ?? null;
        $city = $data['city'] ?? null;
        $state = $data['state'] ?? null;
        $pin_code = $data['pin_code'] ?? null;
        
        $stmt = $db->prepare("
            UPDATE users 
            SET name = ?, email = ?, role = ?, phone = ?, address = ?, 
                city = ?, state = ?, pin_code = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$name, $email, $role, $phone, $address, $city, $state, $pin_code, $id]);
        
        $stmt = $db->prepare("
            SELECT id, name, email, role, phone, address, city, state, pin_code, created_at 
            FROM users WHERE id = ?
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
}

function handleDeleteUser($db, $id) {
    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'User not found']);
            return;
        }
        
        // Check if user has orders
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM orders WHERE user_id = ?");
        $stmt->execute([$id]);
        $orderCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        if ($orderCount > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot delete user with existing orders']);
            return;
        }
        
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
    }
}
?> 