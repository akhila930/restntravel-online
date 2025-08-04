<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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
$path = str_replace('/api/auth', '', $path);

switch ($method) {
    case 'POST':
        if ($path == '/login' || $path == '/login/') {
            handleLogin($db);
        } elseif ($path == '/signup' || $path == '/signup/') {
            handleSignup($db);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    
    case 'GET':
        if ($path == '/profile' || $path == '/profile/') {
            handleGetProfile($db);
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

function handleLogin($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    $email = $data['email'];
    $password = $data['password'];
    
    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() == 0) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            return;
        }
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            return;
        }
        
        // Generate JWT-like token (simple implementation)
        $token = base64_encode(json_encode([
            'userId' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + (7 * 24 * 60 * 60) // 7 days
        ]));
        
        // Return user data (without password)
        $userData = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'city' => $user['city'],
            'state' => $user['state'],
            'pin_code' => $user['pin_code']
        ];
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => $userData,
            'token' => $token
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Login failed. Please try again.']);
    }
}

function handleSignup($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
        return;
    }
    
    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];
    $phone = $data['phone'] ?? null;
    $address = $data['address'] ?? null;
    $city = $data['city'] ?? null;
    $state = $data['state'] ?? null;
    $pin_code = $data['pin_code'] ?? null;
    
    try {
        // Check if user already exists
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'User with this email already exists']);
            return;
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $db->prepare("
            INSERT INTO users (name, email, password, phone, address, city, state, pin_code, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'customer')
        ");
        $stmt->execute([$name, $email, $hashedPassword, $phone, $address, $city, $state, $pin_code]);
        
        $userId = $db->lastInsertId();
        
        // Generate token
        $token = base64_encode(json_encode([
            'userId' => $userId,
            'email' => $email,
            'role' => 'customer',
            'exp' => time() + (7 * 24 * 60 * 60)
        ]));
        
        // Return user data
        $userData = [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'customer',
            'phone' => $phone,
            'address' => $address,
            'city' => $city,
            'state' => $state,
            'pin_code' => $pin_code
        ];
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $userData,
            'token' => $token
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    }
}

function handleGetProfile($db) {
    $headers = getallheaders();
    $token = null;
    
    if (isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        return;
    }
    
    try {
        $tokenData = json_decode(base64_decode($token), true);
        
        if (!$tokenData || !isset($tokenData['userId']) || $tokenData['exp'] < time()) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid token']);
            return;
        }
        
        $stmt = $db->prepare("
            SELECT id, name, email, role, phone, address, city, state, pin_code, created_at 
            FROM users WHERE id = ?
        ");
        $stmt->execute([$tokenData['userId']]);
        
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
        
    } catch(Exception $e) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
    }
}
?> 