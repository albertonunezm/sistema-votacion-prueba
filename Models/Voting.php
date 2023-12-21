<?php

class Voting
{
    // Variable para almacenar la conexión con la base de datos
    private $db;

    public function __construct()
    {
        // Variables de conexión a la base de datos
        $host = 'db';
        $port = 3306;
        $dbname = 'votify_system';
        $username = 'votify_user';
        $password = 'votify_password';

        // Intenta la conexión a la base de datos
        $this->db = new mysqli($host, $username, $password, $dbname, $port);

        // Verifica si hay errores en la conexión
        if ($this->db->connect_error) {
            die("Error al conectar a la base de datos: " . $this->db->connect_error);
        }
    }

    public function processVote($userData)
    {
        // Valida si el RUT ya emitió un voto
        $rutVoted = $this->checkIfRutVoted($userData['rut']);

        if ($rutVoted) {
            // RUT ya emitió un voto, muestra mensaje y alert
            return json_encode(['status' => 'error', 'message' => 'Ya has emitido un voto.']);
        } 

        // Si el RUT no ha emitido un voto, realiza inserción en la base de datos.
        try {
            $this->insertVote($userData);
            return json_encode(['status' => 'success', 'message' => 'Voto registrado con éxito.']);
        } catch (Exception $e) {
            // Captura el mensaje de error y detalles de MySQL
            $errorMessage = $e->getMessage();
            $errorDetails = $this->db->error;
    
            // Muestra el mensaje de error y detalles en la consola del navegador
            echo 'Error al procesar el voto: ' . $errorMessage;
            echo 'Detalles de MySQL: ' . var_export($errorDetails, true);
    
            // Retorna un mensaje de error con detalles
            return json_encode(['status' => 'error', 'message' => 'Error al registrar el voto. Detalles: ' . $errorMessage]);
        }
    }

    private function checkIfRutVoted($rut)
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) AS count FROM votes WHERE rut = ?");
        $stmt->bind_param("s", $rut);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc()['count'];

        return $count > 0; // Retorna true si el RUT ya emitió un voto, false en caso contrario
    }

    private function insertVote($userData)
    {
        $stmt = $this->db->prepare("INSERT INTO votes (fullname, alias, rut, options, region_id, comuna_id, candidate_id) VALUES (?, ?, ?, ?, ?, ?, ?)");

        // Convierte el array de opciones a JSON
        $optionsJson = json_encode($userData['options']);

        // Enlaza los parámetros a la consulta preparada
        $stmt->bind_param("ssssiss", $userData['fullname'], $userData['alias'], $userData['rut'], $optionsJson, $userData['region'], $userData['comuna'], $userData['candidate']);

        if ($stmt->execute()) {
            return true; // Inserción exitosa
        } else {
            // En caso de error, imprime el mensaje de error y los detalles
            echo 'Error al ejecutar la consulta: ' . $stmt->error;
            echo 'Detalles: ' . var_export($stmt->error_list, true);

            return false; // Error en la inserción
        }
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
