<?php
//headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once '../config/database.php';
include_once '../models/user.php';
 
$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

// // Debug: Mostra i dati ricevuti dal frontend
// var_dump($data);


$user->name = $data->name;
$user->email = $data->email;
$user->password = $data->password;

// if(
//     !empty($data->name) &&
//     !empty($data->email) &&
//     !empty($data->password)
// ){

 
    if($user->create()){
        http_response_code(201);
        echo json_encode(array("message" => "User creato correttamente."));
    }
    else{
        //503 servizio non disponibile
        http_response_code(503);
        echo json_encode(array("message" => "Impossibile creare lo User."));
    }
// }
// else{
//     //400 bad request
//     http_response_code(400);
//     echo json_encode(array("message" => "Impossibile creare lo User i dati sono incompleti."));
// }
?>