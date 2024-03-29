<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET");

// Connexion à la base de données
$mysqli = new mysqli("127.0.0.1", "root", "", "badminton");

if ($mysqli->connect_error) {
    die("Erreur de connexion à la base de données: " . $mysqli->connect_error);
}

$query = "SELECT cours.idCours, cours.nomCours, professeurs.nomProfesseur, professeurs.prenomProfesseur, cours.datetime 
          FROM cours 
          INNER JOIN professeurs ON cours.idProfesseur = professeurs.idProfesseur";
$result = $mysqli->query($query);

if ($result) {
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }

    echo json_encode($courses);
} else {
    echo json_encode(array("error" => "Erreur lors de la récupération des données des cours"));
}

$mysqli->close();
?>
