<?php
//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once '../config/database.php';
include_once '../models/file.php';
 
$database = new Database();
$db = $database->getConnection();

$file = new File($db);

$data = json_decode(file_get_contents("php://input"));

$file->email_user = $data->email_user;
$file->nome = $data->nome;
$file->n_frame = $data->n_frame;
$file->file_colori = $data->file_colori;
$file->pixel_size = $data->pixel_size;

// if(
//     !empty($data->name) &&
//     !empty($data->email) &&
//     !empty($data->password)
// ){

 
    if($file->create()){
        http_response_code(201);
        echo json_encode(array("message" => "File creato correttamente."));
    }
    else{
        //503 servizio non disponibile
        http_response_code(503);
        echo json_encode(array("message" => "Impossibile creare il FIle."));
    }
// }
// else{
//     //400 bad request
//     http_response_code(400);
//     echo json_encode(array("message" => "Impossibile creare lo User i dati sono incompleti."));
// }
?>