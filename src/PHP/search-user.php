<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_GET['search'])) {
    $searchQuery = $_GET['search'];

    $mysqli = new mysqli("127.0.0.1", "root", "root", "badminton");

    if ($mysqli->connect_error) {
        die("Erreur de connexion à la base de données: " . $mysqli->connect_error);
    }

    $query = "SELECT * FROM adherents WHERE nomAdh LIKE '%$searchQuery%' OR prenomAdh LIKE '%$searchQuery%' OR typeAdh LIKE '%$searchQuery%'";

    $result = $mysqli->query($query);

    if ($result->num_rows > 0) {
        $users = array();

        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        $mysqli->close();

        echo json_encode(array("status" => "success", "users" => $users));
    } else {
        echo json_encode(array("status" => "error", "message" => "Aucun utilisateur trouvé."));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Aucune requête de recherche spécifiée."));
}
?>
