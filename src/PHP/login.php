<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require '../../php-jwt-main/src/JWT.php';

use Firebase\JWT\JWT;

$requestData = json_decode(file_get_contents('php://input'));

if (!empty($requestData->username) && !empty($requestData->password)) {
    $username = $requestData->username;
    $password = $requestData->password;

    $mysqli = new mysqli("127.0.0.1", "root", "", "badminton");

    if ($mysqli->connect_error) {
        echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
        exit;
    }

    $stmt = $mysqli->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $key = "badminton-super-key";
        $payload = array(
            "idUser" => $user['idUser'],
            "idAdh" => $user['idAdh'],
            "type" => $user['type'],
            "exp" => time() + (60 * 60) // expires in 1 hour
        );

        $jwt = JWT::encode($payload, $key, 'HS256');
        echo json_encode(array("token" => $jwt));
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing username or password"));
}
?>
