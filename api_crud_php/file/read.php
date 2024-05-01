<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/file.php';

//connessione db
$database = new Database();
$db = $database->getConnection();

$file = new File($db);

// query file
$stmt = $file->read();
$num = $stmt->rowCount();

// se vengono trovati utenti nel database
if ($num > 0) {
    // array di utenti
    $files_arr = array();
    $files_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $file_item = array(
            "email_user" => $email_user,
            "nome" => $nome,
            "n_frame" => $n_frame,
            "file_colori" => $file_colori,
            "pixel_size" => $pixel_size,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
        );
        array_push($files_arr["records"], $file_item);
    }
    echo json_encode($files_arr);
} else {
    echo json_encode(
        array("message" => "Nessun File Trovato.")
    );
}
