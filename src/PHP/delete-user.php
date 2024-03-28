<?php
session_start();

if (!isset($_SESSION["pseudo"])) {
    header("Access-Control-Allow-Origin: *");
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $mysqli = mysqli_connect("127.0.0.1", "root", "", "badminton");
    if (!$mysqli) {
        die("Erreur de connexion à la base de données: " . mysqli_connect_error());
    }

    $query = "DELETE FROM adherents WHERE idAdh = ?";

    if ($stmt = mysqli_prepare($mysqli, $query)) {
        mysqli_stmt_bind_param($stmt, "i", $id);

        if (mysqli_stmt_execute($stmt)) {
            echo "L'utilisateur avec l'ID $id a été supprimé avec succès.";
        } else {
            echo "Erreur lors de la suppression de l'utilisateur: " . mysqli_error($mysqli);
        }

        mysqli_stmt_close($stmt);
    } else {
        echo "Erreur de préparation de la requête: " . mysqli_error($mysqli);
    }

    mysqli_close($mysqli);
} else {
    echo "ID de l'utilisateur non spécifié.";
}

?>
