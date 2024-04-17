<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$mysqli = mysqli_connect("127.0.0.1", "root", "", "badminton");

$data = json_decode(file_get_contents("php://input"), true);

$idCours = $data['idCours'];
$idAdh = $data['idAdh'];

if (!empty($idCours) && !empty($idAdh)) {
    $query = "DELETE FROM reservation WHERE idCours = ? AND idAdh = ?";
    $stmt = mysqli_prepare($mysqli, $query);
    mysqli_stmt_bind_param($stmt, "ii", $idCours, $idAdh);

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(200);
        echo json_encode(array("status" => "success", "message" => "Désinscription au cours réussie. Nous sommes tristes de vous voir partir, inscrivez-vous à un autre cours vite!"));
    } else {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Erreur lors de la désinscription du cours"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Données insuffisantes fournies"));
}
mysqli_stmt_close($stmt);
mysqli_close($mysqli);
?>
