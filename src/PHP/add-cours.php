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

    if (!empty($values->datetime) && !empty($values->nomCours)) {
        $datetime = $values->datetime;
        $nomCours = $values->nomCours;
        $idProfesseur = $values->idProfesseur;

        $mysqli = new mysqli("127.0.0.1", "root", "", "badminton");
        if ($mysqli->connect_error) {
            echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
            exit;
        }

        $coursRequest = $mysqli->prepare('INSERT INTO cours (nomCours, idProfesseur, datetime) VALUES (?, ?, ?)');
        $coursRequest->bind_param('sis', $nomCours, $idProfesseur, $datetime);
        $coursRequest->execute();

        if ($coursRequest->affected_rows > 0) {
            echo json_encode(array("status" => "done", "message" => "New cours created successfully"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Failed to create new cours"));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing nom du cours or date du cours"));
}
?>
