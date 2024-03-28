<?php
session_start();
if (!isset($_SESSION["pseudo"])) {
    header("Access-Control-Allow-Origin: *");
}

$base = mysqli_connect("127.0.0.1", "root", "", "badminton");
mysqli_set_charset($base, "utf8");

$requete = "select * from adherents";
$resultat = mysqli_query($base, $requete);
$adherents = array();

if ($resultat) {
    while ($row = mysqli_fetch_assoc($resultat)) {
        array_push($adherents, $row);
    }
}

mysqli_close($base);

// Return the results as JSON
echo json_encode($adherents); ?>
