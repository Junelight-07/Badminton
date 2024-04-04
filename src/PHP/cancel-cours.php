<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json; charset=UTF-8");

$mysqli = mysqli_connect("127.0.0.1", "root", "", "badminton");

$idCours = $_GET['idCours'];
$idAdh = $_GET['idAdh'];

if (!empty($idCours) && !empty($idAdh)) {
    $query = "DELETE FROM reservation WHERE idCours = ? AND idAdh = ?";
    $stmt = mysqli_prepare($mysqli, $query);
    mysqli_stmt_bind_param($stmt, "ii", $idCours, $idAdh);

    if (mysqli_stmt_execute($stmt)) {
        http_response_code(200);
        echo json_encode(array("status" => "success", "message" => "Désinscription au cours réussie"));
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
