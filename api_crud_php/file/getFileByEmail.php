<?php
// headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/file.php';

$database = new Database();
$db = $database->getConnection();

$file = new File($db);

$data = json_decode(file_get_contents("php://input"));

$file->email_user = $data->email;

$stmt = $file->getFileByEmail();
$num = $stmt->rowCount();

if($num > 0){
    // array di files
    $files_arr = array();
    $files_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $file_item = array(
            "nome" => $nome,
            "nFrame" => $n_frame,
            "file_colori" => $file_colori,
            "pixel_size" => $pixel_size,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
        );
        array_push($files_arr["records"], $file_item);
    }
        
    http_response_code(200);
    echo json_encode($files_arr);
} else {
    http_response_code(401);
    array("message" => "Errore caricamente dati File");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>
