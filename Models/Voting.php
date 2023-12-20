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
}
