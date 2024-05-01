<?php
// headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/user.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

$user->email = $data->email;
$user->password = $data->password;

if ($user->login()) {
    // Genera il token di accesso
    // $tokenId = base64_encode(random_bytes(32));
    // $accessToken = [
    //     "iat" => time(),
    //     "exp" => time() + (60 * 60), // Scadenza in 1 ora
    //     "tokenId" => $tokenId
    // ];
    http_response_code(200);
    echo json_encode(array("message" => "Login effettuato correttamente.", "accessToken" => $accessToken));
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Credenziali non valide."));
}


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>