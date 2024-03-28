<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$requestData = json_decode(file_get_contents('php://input'));

if (!empty($requestData->values)) {
    $values = $requestData->values;

    if (!empty($values->username) && !empty($values->password)) {
        $username = $values->username;
        $password = $values->password;

        $nomAdh = $values->nomAdh;
        $prenomAdh = $values->prenomAdh;
        $adresseAdh = $values->adresseAdh;
        $villeAdh = $values->villeAdh;
        $cpAdh = $values->cpAdh;
        $niveauAdh = $values->niveauAdh;
        $typeAdh = $values->typeAdh;

        $mysqli = new mysqli("127.0.0.1", "root", "root", "badminton");

        if ($mysqli->connect_error) {
            echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
            exit;
        }
        $adhRequest = $mysqli->prepare('INSERT INTO adherents (nomAdh, prenomAdh, adresseAdh, villeAdh, cpAdh, niveauAdh, typeAdh) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $adhRequest->bind_param('sssssss', $nomAdh, $prenomAdh, $adresseAdh, $villeAdh, $cpAdh, $niveauAdh, $typeAdh);
        $adhRequest->execute();

        $usernameExists = $mysqli->prepare('SELECT username FROM users WHERE username = ?');
        $usernameExists->bind_param('s', $username);
        $usernameExists->execute();
        $result = $usernameExists->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(array("status" => "error", "message" => "Username already exists"));
        } else {
            $userRequest = $mysqli->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            $userRequest->bind_param('ss', $username, $password);
            $userRequest->execute();

            if ($userRequest->affected_rows > 0) {
                echo json_encode(array("status" => "done", "message" => "New username created successfully"));
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Invalid credentials']);
            }
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing username or password"));
}
?>
