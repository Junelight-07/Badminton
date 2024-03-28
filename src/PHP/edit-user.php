<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $mysqli = mysqli_connect("127.0.0.1", "root", "", "badminton");
    if (!$mysqli) {
        die("Erreur de connexion à la base de données: " . mysqli_connect_error());
    }

    $requestData = json_decode(file_get_contents('php://input'), true);

    $nom = $requestData['nomAdh'];
    $prenom = $requestData['prenomAdh'];
    $adresse = $requestData['adresseAdh'];
    $ville = $requestData['villeAdh'];
    $cp = $requestData['cpAdh'];
    $niveau = $requestData['niveauAdh'];
    $type = $requestData['typeAdh'];

    $query = "UPDATE adherents SET nomAdh = ?, prenomAdh = ?, adresseAdh = ?, VilleAdh = ?, cpAdh = ?, NiveauAdh = ?, TypeAdh = ? WHERE idAdh = ?";

    if ($stmt = mysqli_prepare($mysqli, $query)) {
        mysqli_stmt_bind_param($stmt, "sssssssi", $nom, $prenom, $adresse, $ville, $cp, $niveau, $type, $id);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(array("status" => "success"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Erreur lors de la mise à jour de l'utilisateur"));
        }

        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(array("status" => "error", "message" => "Erreur de préparation de la requête"));
    }

    mysqli_close($mysqli);
} else {
    echo json_encode(array("status" => "error", "message" => "ID de l'utilisateur non spécifié"));
}
?>
