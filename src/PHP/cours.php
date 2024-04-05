<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET");

$mysqli = new mysqli("127.0.0.1", "root", "", "badminton");

if ($mysqli->connect_error) {
    die("Erreur de connexion à la base de données: " . $mysqli->connect_error);
}

$query = "SELECT cours.idCours, cours.nomCours, professeurs.nomProfesseur, professeurs.prenomProfesseur, cours.datetime,
          GROUP_CONCAT(CONCAT(adherents.prenomAdh, ' ', adherents.nomAdh) SEPARATOR ', ') as registeredMembers
          FROM cours
          INNER JOIN professeurs ON cours.idProfesseur = professeurs.idProfesseur
          LEFT JOIN reservation ON cours.idCours = reservation.idCours
          LEFT JOIN adherents ON reservation.idAdh = adherents.idAdh
          GROUP BY cours.idCours";
$result = $mysqli->query($query);

if ($result) {
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $row['registeredMembers'] = explode(', ', $row['registeredMembers']);
        $courses[] = $row;
    }

    echo json_encode($courses);
} else {
    echo json_encode(array("error" => "Erreur lors de la récupération des données des cours"));
}

$mysqli->close();
?>
