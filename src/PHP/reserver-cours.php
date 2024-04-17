<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $requestData = json_decode(file_get_contents('php://input'), true);

    if (empty($requestData['idCours']) || empty($requestData['idAdh'])) {
        echo json_encode(array("status" => "error", "message" => "Missing data"));
        exit;
    }

    $idCours = $requestData['idCours'];
    $idAdh = $requestData['idAdh'];

    $mysqli = mysqli_connect("127.0.0.1", "root", "", "badminton");

    if (!$mysqli) {
        echo json_encode(array("status" => "error", "message" => "Database connection error: " . mysqli_connect_error()));
        exit;
    }

    $checkReservationQuery = "SELECT * FROM reservation WHERE idCours = ? AND idAdh = ?";
    $checkReservationStmt = mysqli_prepare($mysqli, $checkReservationQuery);
    mysqli_stmt_bind_param($checkReservationStmt, "ii", $idCours, $idAdh);
    mysqli_stmt_execute($checkReservationStmt);
    $checkReservationResult = mysqli_stmt_get_result($checkReservationStmt);

    if (mysqli_num_rows($checkReservationResult) > 0) {
        echo json_encode(array("status" => "error", "message" => "Vous êtes déjà inscrit à ce cours"));
        exit;
    }

    $insertQuery = "INSERT INTO reservation(idReservation, idCours, idAdh) VALUES (NULL, ?, ?)";
    $insertStmt = mysqli_prepare($mysqli, $insertQuery);
    mysqli_stmt_bind_param($insertStmt, "ii", $idCours, $idAdh);

    if (mysqli_stmt_execute($insertStmt)) {
        echo json_encode(array("status" => "success", "message" => "Félicitations, vous avez réservé le cours avec succès"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Erreur lors de la réservation du cours"));
    }

    mysqli_stmt_close($checkReservationStmt);
    mysqli_stmt_close($insertStmt);
    mysqli_close($mysqli);
}
?>
