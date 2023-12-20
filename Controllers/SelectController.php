<?php

require_once '../Models/Voting.php';

// Crear una instancia del controlador y llamar al método para procesar el voto
$controller = new Voting();

// Maneja acciones según la solicitud
$action = $_GET['action'] ?? '';

// Hace la consulta 
echo $controller->helpers($action);

