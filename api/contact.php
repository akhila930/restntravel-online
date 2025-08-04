<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and message are required']);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'] ?? 'Not provided';
$subject = $data['subject'] ?? 'General Inquiry';
$message = $data['message'];

$to = 'sales@restntravel.shop';
$emailSubject = "Contact Form: {$subject} - {$name}";

$emailMessage = "
<html>
<head>
    <title>Contact Form - RestNTravel</title>
</head>
<body>
    <h2>📧 New Contact Form Submission - RestNTravel</h2>
    
    <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
        <h3>👤 Contact Information</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Date:</strong> " . date('Y-m-d H:i:s') . "</p>
    </div>

    <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;'>
        <h3>💬 Message</h3>
        <div style='background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #16a34a;'>
            <p style='margin: 0; line-height: 1.6;'>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
    </div>

    <div style='background: #16a34a; color: white; padding: 20px; border-radius: 8px; text-align: center;'>
        <h3>📞 Next Steps</h3>
        <p>1. Review the customer inquiry</p>
        <p>2. Respond to the customer within 24 hours</p>
        <p>3. Follow up if needed</p>
    </div>

    <div style='text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;'>
        <p>This email was sent automatically from RestNTravel Contact Form</p>
        <p>Domain: restntravel.shop</p>
    </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: RestNTravel Contact <sales@restntravel.shop>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";

if (mail($to, $emailSubject, $emailMessage, $headers)) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again.'
    ]);
}
?> 