<?php

require_once '../Models/Voting.php';

// Crea una instancia del controlador y poder llamar al método requerido.
$controller = new Voting();

// Maneja acciones según la solicitud
$action = $_GET['action'] ?? '';

// Hace la consulta 
echo $controller->helpers($action);

