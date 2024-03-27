<?php
if (!isset($_SESSION["pseudo"])) {
    header("Access-Control-Allow-Origin: *");
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $mysqli = mysqli_connect("127.0.0.1", "root", "root", "badminton");

    if (!$mysqli) {
        echo json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données"));
        exit;
    }

    $query = "SELECT * FROM adherent WHERE idAdh = ?";

    if ($stmt = mysqli_prepare($mysqli, $query)) {
        mysqli_stmt_bind_param($stmt, "i", $id);

        if (mysqli_stmt_execute($stmt)) {
            $result = mysqli_stmt_get_result($stmt);

            if (mysqli_num_rows($result) > 0) {
                $userData = mysqli_fetch_assoc($result);

                mysqli_stmt_close($stmt);

                mysqli_close($mysqli);

                echo json_encode(array("status" => "success", "user" => $userData));
            } else {
                echo json_encode(array("status" => "error", "message" => "Aucun utilisateur trouvé avec cet ID"));
            }
        } else {
            echo json_encode(array("status" => "error", "message" => "Erreur lors de l'exécution de la requête"));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Erreur de préparation de la requête"));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "ID de l'utilisateur non spécifié"));
}

?>
