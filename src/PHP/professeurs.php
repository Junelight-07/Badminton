<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Connexion à la base de données
$mysqli = new mysqli("127.0.0.1", "root", "", "badminton");

// Vérification de la connexion
if ($mysqli->connect_error) {
    echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error));
    exit;
}

// Requête pour récupérer la liste des professeurs
$result = $mysqli->query("SELECT * FROM professeurs");

// Vérification si la requête a abouti
if ($result) {
    $professeurs = array();

    // Parcourir les résultats et les stocker dans un tableau
    while ($row = $result->fetch_assoc()) {
        $professeurs[] = $row;
    }

    // Retourner le tableau des professeurs
    echo json_encode(array("status" => "success", "professeurs" => $professeurs));
} else {
    echo json_encode(array("status" => "error", "message" => "Erreur lors de la récupération des professeurs"));
}

// Fermer la connexion à la base de données
$mysqli->close();
?>
