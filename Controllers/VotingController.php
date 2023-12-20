<?php

require_once '../Models/Voting.php';

// Crea una instancia del controlador y poder llamar al método requerido.
$controller = new Voting();

// Obtener los datos del cuerpo de la solicitud POST en formato JSON
$jsonData = file_get_contents('php://input');

// Decodificar los datos JSON a un array asociativo
$dataArray = json_decode($jsonData, true);

echo $controller->processVote($dataArray);

