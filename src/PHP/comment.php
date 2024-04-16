<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$requestData = json_decode(file_get_contents('php://input'), true);

if (!empty($requestData['values'])) {
    $values = $requestData['values'];

    if (!empty($values['idAdh']) && !empty($values['idCours']) && !empty($values['comment']) && !empty($values['rating'])) {
        $idAdh = $values['idAdh'];
        $idCours = $values['idCours'];
        $commentaire = $values['comment'];
        $note = $values['rating'];
        $dateCommentaire = $values['dateCommentaire'];

        $mysqli = new mysqli("127.0.0.1", "root", "", "badminton");
        if ($mysqli->connect_error) {
            echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
            exit;
        }

        $stmt = $mysqli->prepare("SELECT * FROM commenter WHERE idAdh = ? AND idCours = ?");
        $stmt->bind_param("ii", $idAdh, $idCours);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(array("status" => "error", "message" => "User has already commented"));
            exit;
        }

        $stmt = $mysqli->prepare("INSERT INTO commenter (idAdh, idCours, commentaire, note, dateCommentaire) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisis", $idAdh, $idCours, $commentaire, $note, $dateCommentaire);

        if ($stmt->execute()) {
            echo json_encode(array("status" => "done", "message" => "Votre commentaire a bien été enregistré. Merci pour votre temps"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Failed to create new comment"));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing comment data"));
}
?>
