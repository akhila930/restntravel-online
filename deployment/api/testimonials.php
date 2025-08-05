<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
$path = str_replace('/api/testimonials', '', $path);

switch ($method) {
    case 'GET':
        if ($path == '/admin' || $path == '/admin/') {
            handleGetAllTestimonials($db);
        } else {
            handleGetActiveTestimonials($db);
        }
        break;
    
    case 'POST':
        handleCreateTestimonial($db);
        break;
    
    case 'PUT':
        if (preg_match('/^\/(\d+)\/?$/', $path, $matches)) {
            handleUpdateTestimonial($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial ID required']);
        }
        break;
    
    case 'DELETE':
        if (preg_match('/^\/(\d+)\/?$/', $path, $matches)) {
            handleDeleteTestimonial($db, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial ID required']);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function handleGetActiveTestimonials($db) {
    try {
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY created_at DESC");
        $stmt->execute();
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'testimonials' => $testimonials
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load testimonials']);
    }
}

function handleGetAllTestimonials($db) {
    try {
        $stmt = $db->prepare("SELECT * FROM testimonials ORDER BY created_at DESC");
        $stmt->execute();
        $testimonials = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'testimonials' => $testimonials
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to load testimonials']);
    }
}

function handleCreateTestimonial($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['rating']) || !isset($data['comment'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, rating, and comment are required']);
        return;
    }
    
    $name = $data['name'];
    $rating = $data['rating'];
    $comment = $data['comment'];
    $image = $data['image'] ?? null;
    $video = $data['video'] ?? null;
    $product = $data['product'] ?? null;
    $is_active = $data['is_active'] ?? true;
    
    try {
        $stmt = $db->prepare("
            INSERT INTO testimonials (name, rating, comment, image, video, product, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $rating, $comment, $image, $video, $product, $is_active]);
        
        $testimonialId = $db->lastInsertId();
        
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$testimonialId]);
        $testimonial = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial added successfully',
            'testimonial' => $testimonial
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to add testimonial']);
    }
}

function handleUpdateTestimonial($db, $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found']);
            return;
        }
        
        $name = $data['name'] ?? null;
        $rating = $data['rating'] ?? null;
        $comment = $data['comment'] ?? null;
        $image = $data['image'] ?? null;
        $video = $data['video'] ?? null;
        $product = $data['product'] ?? null;
        $is_active = $data['is_active'] ?? null;
        
        $stmt = $db->prepare("
            UPDATE testimonials 
            SET name = ?, rating = ?, comment = ?, image = ?, video = ?, 
                product = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([$name, $rating, $comment, $image, $video, $product, $is_active, $id]);
        
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        $testimonial = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial updated successfully',
            'testimonial' => $testimonial
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update testimonial']);
    }
}

function handleDeleteTestimonial($db, $id) {
    try {
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found']);
            return;
        }
        
        $stmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial deleted successfully'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to delete testimonial']);
    }
}
?> 