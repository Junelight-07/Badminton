<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestData = json_decode(file_get_contents('php://input'), true);

if (empty($requestData['nomAdh']) || empty($requestData['prenomAdh']) || empty($requestData['adresseAdh']) || empty($requestData['villeAdh']) || empty($requestData['cpAdh']) || empty($requestData['niveauAdh']) || empty($requestData['typeAdh'])) {
    echo json_encode(array("status" => "error", "message" => "Erreur dans la saisie"));
    exit;
}

$nom = $requestData['nomAdh'];
$prenom = $requestData['prenomAdh'];
$adresse = $requestData['adresseAdh'];
$ville = $requestData['villeAdh'];
$cp = $requestData['cpAdh'];
$nivAdh = $requestData['niveauAdh'];
$typeAdh = $requestData['typeAdh'];

$mysqli = mysqli_connect("127.0.0.1", "root", "root", "badminton");

if (!$mysqli) {
    echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . mysqli_connect_error()));
    exit;
}

$query = "INSERT INTO adherents(idAdh, nomAdh, prenomAdh, adresseAdh, villeAdh, cpAdh, niveauAdh, typeAdh) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)";

if ($stmt = mysqli_prepare($mysqli, $query)) {
    mysqli_stmt_bind_param($stmt, "ssssiss", $nom, $prenom, $adresse, $ville, $cp, $nivAdh, $typeAdh);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error", "message" => "Erreur lors de l'ajout de l'utilisateur"));
    }

    mysqli_stmt_close($stmt);
} else {
    echo json_encode(array("status" => "error", "message" => "Erreur de préparation de la requête"));
}

mysqli_close($mysqli);
?>
