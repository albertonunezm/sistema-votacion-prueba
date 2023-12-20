<?php

class Voting
{
    // Variable para almacenar la conexión con la base de datos
    private $db;

    public function __construct()
    {
        // Variables de conexión a la base de datos
        $host = 'localhost';
        $port = 3306;
        $dbname = 'votify_system';
        $username = 'root';
        $password = '';

        // Intenta la conexión a la base de datos
        $this->db = new mysqli($host, $username, $password, $dbname, $port);

        // Verifica si hay errores en la conexión
        if ($this->db->connect_error) {
            die("Error al conectar a la base de datos: " . $this->db->connect_error);
        }
    }

    public function processVote($userData)
    {

    }

    public function helpers($action)
    {
        switch ($action) {
            case 'getRegions':
                // Obtener regiones desde la base de datos
                $regions = [];
                $result = $this->db->query("SELECT id, name FROM regions");
                while ($row = $result->fetch_assoc()) {
                    $regions[] = $row;
                }
                echo json_encode($regions);
                break;
        
            case 'getComunas':
                // Obtener comunas según la región desde la base de datos
                $regionId = $_GET['region_id'] ?? '';
                $communes = [];
                $result = $this->db->query("SELECT id, name FROM comunas WHERE region_id = $regionId");
                while ($row = $result->fetch_assoc()) {
                    $communes[] = $row;
                }
                echo json_encode($communes);
                break;
        
            case 'getCandidates':
                // Obtener candidatos desde la base de datos
                $candidates = [];
                $result = $this->db->query("SELECT id, name FROM candidates");
                while ($row = $result->fetch_assoc()) {
                    $candidates[] = $row;
                }
                echo json_encode($candidates);
                break;
        
            default:
                echo '¡Acción invalida!';
        }
    }
}
