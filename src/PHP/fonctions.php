<?php

function escape($valeur)
{
    return htmlspecialchars($valeur, ENT_QUOTES, 'UTF-8', False);
}

function getBDD()
{
    return new PDO("mysql:host=localhost;dbname=badminton;charset=utf8", "root", "root", array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}

?>
