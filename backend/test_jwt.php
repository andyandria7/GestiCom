<?php
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Test JWT token generation and validation
$secret = 'mySuperSecretKey1234';

// Create a test payload
$payload = [
    'user_id' => 123,
    'user' => [
        'user_id' => 123,
        'email' => 'test@example.com',
        'first_name' => 'Test',
        'last_name' => 'User'
    ],
    'iat' => time(),
    'exp' => time() + 3600,
];

// Generate token
$token = JWT::encode($payload, $secret, 'HS256');
echo "Generated Token: " . $token . "\n\n";

// Validate token
try {
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));
    echo "Token validation successful!\n";
    echo "User ID: " . $decoded->user_id . "\n";
    echo "Email: " . $decoded->user->email . "\n";
    echo "Expires at: " . date('Y-m-d H:i:s', $decoded->exp) . "\n";
    
    // Check expiration
    if ($decoded->exp < time()) {
        echo "Token is expired!\n";
    } else {
        echo "Token is valid and not expired.\n";
    }
    
} catch (Exception $e) {
    echo "Token validation failed: " . $e->getMessage() . "\n";
}

// Test expired token
echo "\n--- Testing Expired Token ---\n";
$expiredPayload = [
    'user_id' => 123,
    'user' => [
        'user_id' => 123,
        'email' => 'test@example.com'
    ],
    'iat' => time() - 7200,
    'exp' => time() - 3600, // Expired 1 hour ago
];

$expiredToken = JWT::encode($expiredPayload, $secret, 'HS256');
echo "Expired Token: " . $expiredToken . "\n";

try {
    $decoded = JWT::decode($expiredToken, new Key($secret, 'HS256'));
    if ($decoded->exp < time()) {
        echo "Token is expired (as expected)!\n";
    }
} catch (Exception $e) {
    echo "Token validation failed (as expected): " . $e->getMessage() . "\n";
}