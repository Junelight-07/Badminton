<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, origin");

$requestData = json_decode(file_get_contents('php://input'));

if (!empty($requestData->username) && !empty($requestData->password)) {
    $username = $requestData->username;
    $password = $requestData->password;

    $mysqli = new mysqli("127.0.0.1", "root", "root", "badminton");

    if ($mysqli->connect_error) {
        echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
        exit;
    }

    $stmt = $mysqli->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && $password == $user['password']) {
        $token = ($username === 'admin') ? 'admin-token' : bin2hex(openssl_random_pseudo_bytes(16));
        echo json_encode(['token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
        echo json_encode(['message' => $password]);
        echo json_encode(['message' => $user]);
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing username or password"));
}
?>
