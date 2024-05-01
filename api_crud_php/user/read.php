<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");



include_once '../config/database.php';
include_once '../models/user.php';

//connessione db
$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// query products
$stmt = $user->read();
$num = $stmt->rowCount();

// se vengono trovati utenti nel database
if ($num > 0) {
    // array di utenti
    $users_arr = array();
    $users_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $user_item = array(
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "password" => $password,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
        );
        array_push($users_arr["records"], $user_item);
    }
    echo json_encode($users_arr);
} else {
    echo json_encode(
        array("message" => "Nessun Utente Trovato.")
    );
}
