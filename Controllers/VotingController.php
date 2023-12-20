<?php

// Obtener los datos del cuerpo de la solicitud POST en formato JSON
$jsonData = file_get_contents('php://input');

// Decodificar los datos JSON a un array asociativo
$dataArray = json_decode($jsonData, true);

// $dataArray ahora es un array asociativo con los datos recibidos
print_r($dataArray);
?>
