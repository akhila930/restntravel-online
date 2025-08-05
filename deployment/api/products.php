<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
$path = str_replace('/api/products', '', $path);

switch ($method) {
    case 'GET':
        if ($path == '/admin' || $path == '/admin/') {
            handleGetAllProducts($db);
        } elseif (preg_match('/^\/(\d+)\/?$/', $path, $matches)) {
            handleGetProduct($db, $matches[1]);
        } else {
            handleGetActiveProducts($db);
        }
        break;
    
    case 'POST':
        handleCreateProduct($db);
        break;
    
    case 'PUT':
        if (preg_match('/^\/(\d+)\/?$/', $path, $matches)) {
            handleUpdateProduct($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
        }
        break;
    
    case 'DELETE':
        if (preg_match('/^\/(\d+)\/?$/', $path, $matches)) {
            handleDeleteProduct($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product ID required']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleGetActiveProducts($db) {
    try {
        $stmt = $db->prepare("SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'products' => $products
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load products']);
    }
}

function handleGetAllProducts($db) {
    try {
        $stmt = $db->prepare("SELECT * FROM products ORDER BY created_at DESC");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'products' => $products
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load products']);
    }
}

function handleGetProduct($db, $id) {
    try {
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ? AND is_active = TRUE");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            return;
        }
        
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'product' => $product
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load product']);
    }
}

function handleCreateProduct($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['category']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, category, and price are required']);
        return;
    }
    
    $name = $data['name'];
    $category = $data['category'];
    $price = $data['price'];
    $image = $data['image'] ?? null;
    $description = $data['description'] ?? null;
    $delivery_charges = $data['delivery_charges'] ?? 0;
    
    try {
        $stmt = $db->prepare("
            INSERT INTO products (name, category, price, image, description, delivery_charges)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $category, $price, $image, $description, $delivery_charges]);
        
        $productId = $db->lastInsertId();
        
        // Get the created product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully',
            'product' => $product
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add product']);
    }
}

function handleUpdateProduct($db, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        // Check if product exists
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            return;
        }
        
        $name = $data['name'] ?? null;
        $category = $data['category'] ?? null;
        $price = $data['price'] ?? null;
        $image = $data['image'] ?? null;
        $description = $data['description'] ?? null;
        $is_active = $data['is_active'] ?? null;
        $delivery_charges = $data['delivery_charges'] ?? null;
        
        $stmt = $db->prepare("
            UPDATE products 
            SET name = ?, category = ?, price = ?, image = ?, description = ?, 
                is_active = ?, delivery_charges = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$name, $category, $price, $image, $description, $is_active, $delivery_charges, $id]);
        
        // Get updated product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update product']);
    }
}

function handleDeleteProduct($db, $id) {
    try {
        // Check if product exists
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            return;
        }
        
        // Delete product
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete product']);
    }
}
?> 