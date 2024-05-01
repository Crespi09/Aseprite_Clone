<?php
class File{
	private $conn;
	private $table_name = "files";

	// proprietà di un user
    public $email_user;
    public $nome;
    public $n_frame;
    public $file_colori;
    public $pixel_size;
    public $created_at;
    public $updated_at;
    
	// costruttore
	public function __construct($db){
		$this->conn = $db;
	}

	// READ user
    // 'a' è un alias che viene utilizzato al posto del nome della tabella in questo caso users
	function read(){
		// select all
		$query = "SELECT
                        a.email_user, a.nome, a.n_frame, a.file_colori, a.pixel_size, a.created_at, a.updated_at
                    FROM
                   " . $this->table_name . " a ";
		$stmt = $this->conn->prepare($query);
		// execute query
		$stmt->execute();
		return $stmt;
	}

    // CREATE file
    function create() {
        
        //controllo se esiste già un file con quel nome e stesso frameNumber appartenente a uno specifico user
        // $query_check_file = "SELECT id FROM " . $this->table_name . " WHERE nome = :nome_file && id_user = :id_user";
        
        // $stmt_check_file = $this->conn->prepare($query_check_file);
        // $this->nome = htmlspecialchars(strip_tags($this->nome));
        // $this->id_user = htmlspecialchars(strip_tags($this->id_user));

        // $stmt_check_file->bindParam(":nome_file", $this->nome);
        // $stmt_check_file->bindParam(":id_user", $this->id_user);
        // $stmt_check_file->execu                                                                                                            te();

        // email esiste già
        // if ($stmt_check_file->rowCount() > 0) {
        //     return false;
        // }
    
        //email non esiste -> registrazione
        $createdAt = date("Y-m-d");
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    email_user = :email_user,
                    nome = :nome,
                    n_frame = :n_frame,
                    file_colori = :file_colori,
                    pixel_size = :pixel_size,
                    created_at = :created_at,
                    updated_at = :updated_at";
    

        $stmt = $this->conn->prepare($query);
    
        //sanitificazione dati
        $this->email_user = htmlspecialchars(strip_tags($this->email_user));
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->n_frame = htmlspecialchars(strip_tags($this->n_frame));
        $this->file_colori = htmlspecialchars(strip_tags($this->file_colori));
        $this->pixel_size = htmlspecialchars(strip_tags($this->pixel_size));
    
        //bind dei parametri
        $stmt->bindParam(":email_user", $this->email_user);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":n_frame", $this->n_frame);
        $stmt->bindParam(":file_colori", $this->file_colori);
        $stmt->bindParam(":pixel_size",  $this->pixel_size);
        $stmt->bindParam(":created_at", $createdAt);
        $stmt->bindParam(":updated_at", $createdAt);

        if ($stmt->execute()) {
            return true;
        } 
        return false; 
    }


    // funzione che va a prendere a raggruppare in base al nome e poi prende quello con il 'n_frame' più alto tra 
    // i campi dello con lo stesso 'nome'
    function getFileByEmail(){

        $query = "SELECT nome, MAX(n_frame) AS n_frame, file_colori, pixel_size, created_at, updated_at 
          FROM " . $this->table_name . "
          WHERE email_user = :email
          GROUP BY nome";

        // $query = "SELECT nome, n_frame, file_colori, pixel_size, created_at, updated_at
        // FROM " . $this->table_name . "
        // WHERE email_user = :email";


        $stmt = $this->conn->prepare($query);
        $this->email_user = htmlspecialchars(strip_tags($this->email_user));
        $stmt->bindParam(":email", $this->email_user);

		$stmt->execute();
		return $stmt;
    }

    function getFramesByFileName(){
        $query = "SELECT nome, n_frame, file_colori
        FROM ".$this->table_name . "
        WHERE email_user = :email AND nome = :nome";

        $stmt = $this->conn->prepare($query);
        $this->email_user = htmlspecialchars(strip_tags($this->email_user));
        $this->nome = htmlspecialchars(strip_tags($this->nome));

        $stmt->bindParam(":email", $this->email_user);
        $stmt->bindParam(":nome", $this->nome);

		$stmt->execute();
		return $stmt;

    }
}
    
?>