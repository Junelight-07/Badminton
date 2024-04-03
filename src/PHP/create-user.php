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
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $type = "adhérent";

        $nomAdh = $values->nomAdh;
        $prenomAdh = $values->prenomAdh;
        $adresseAdh = $values->adresseAdh;
        $villeAdh = $values->villeAdh;
        $cpAdh = $values->cpAdh;
        $niveauAdh = $values->niveauAdh;
        $dateAdh = $values->dateAdh;
        $typeAdh = $values->typeAdh;
        $dateAdhesionAdh = $values->dateAdhesionAdh;

        $mysqli = new mysqli("127.0.0.1", "root", "", "badminton");
        if ($mysqli->connect_error) {
            echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
            exit;
        }

        $adhRequest = $mysqli->prepare('INSERT INTO adherents (nomAdh, prenomAdh, adresseAdh, villeAdh, cpAdh, niveauAdh, typeAdh, dateAdh, dateAdhesionAdh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $adhRequest->bind_param('sssssssss', $nomAdh, $prenomAdh, $adresseAdh, $villeAdh, $cpAdh, $niveauAdh, $typeAdh, $dateAdh, $dateAdhesionAdh);
        $adhRequest->execute();

        $adherentId = $mysqli->insert_id;

        $userRequest = $mysqli->prepare('INSERT INTO users (username, password, idAdh, type) VALUES (?, ?, ?, ?)');
        $userRequest->bind_param('ssis', $username, $hashedPassword, $adherentId, $type);
        $userRequest->execute();

        if ($userRequest->affected_rows > 0) {
            echo json_encode(array("status" => "done", "message" => "New username and adherent created successfully"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Failed to create new username or associate adherent with user"));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing username or password"));
}
?>
