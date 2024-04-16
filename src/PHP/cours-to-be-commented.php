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

$requestData = json_decode(file_get_contents('php://input'));
$idAdh = $requestData->idAdh;

try {
    $mysqli = new mysqli("127.0.0.1", "root", "", "badminton");
    if ($mysqli->connect_error) {
        echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
        exit;
    }

    $stmt = $mysqli->prepare("
    SELECT c.*
    FROM cours c
    JOIN reservation i ON c.idCours = i.idCours
    LEFT JOIN commenter com ON c.idCours = com.idCours AND com.idAdh = ?
    WHERE i.idAdh = ? AND c.datetime <= DATE_SUB(NOW(), INTERVAL 1 HOUR) AND com.idCours IS NULL
");

    // Bind parameters
    $stmt->bind_param("ii", $idAdh, $idAdh);
    $stmt->execute();
    $result = $stmt->get_result();

    $courses = array();
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }

    if (empty($courses)) {
        echo json_encode(array("status" => "done"));
    } else {
        echo json_encode(array("status" => "done", "courses" => $courses));
    }
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Une erreur est survenue lors du traitement de la requête"));
}
?>
