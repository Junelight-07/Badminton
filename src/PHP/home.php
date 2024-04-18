<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: GET");

$mysqli = new mysqli("127.0.0.1", "root", "", "badminton");

if ($mysqli->connect_error) {
    die(json_encode(array("status" => "error", "message" => "Erreur de connexion à la base de données: " . $mysqli->connect_error)));
}

$sql_comments = "SELECT COUNT(*) as total_comments FROM commenter";
$result_comments = $mysqli->query($sql_comments);

$sql_avg_rating = "SELECT AVG(note) as avg_rating FROM commenter";
$result_avg_rating = $mysqli->query($sql_avg_rating);

$sql_members = "SELECT COUNT(*) as total_members FROM adherents";
$result_members = $mysqli->query($sql_members);

if ($result_comments && $result_avg_rating && $result_members) {
    $row_comments = $result_comments->fetch_assoc();
    $row_avg_rating = $result_avg_rating->fetch_assoc();
    $row_members = $result_members->fetch_assoc();

    $data = array(
        'status' => 'done',
        'total_comments' => $row_comments['total_comments'],
        'avg_rating' => $row_avg_rating['avg_rating'],
        'total_members' => $row_members['total_members']
    );
} else {
    $data = array(
        'status' => 'error',
        'message' => 'Erreur lors de la récupération des données'
    );
}

$mysqli->close();

echo json_encode($data);
?>
