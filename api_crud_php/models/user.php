<?php
class User{
	private $conn;
	private $table_name = "users";

	// proprietà di un user
    public $id;
	public $name;
	public $email;
    public $validationEmail;
	public $password;
    public $created_at;
    public $updated_at;
    public $token;
    
	// costruttore
	public function __construct($db){
		$this->conn = $db;
	}

	// READ user
    // 'a' è un alias che viene utilizzato al posto del nome della tabella in questo caso users
	function read(){
		// select all
		$query = "SELECT
                        a.id, a.name, a.email, a.password, a.created_at, a.updated_at
                    FROM
                   " . $this->table_name . " a ";
		$stmt = $this->conn->prepare($query);
		// execute query
		$stmt->execute();
		return $stmt;
	}

    // CREATE user
    function create() {
        
        //controllo se la mail esiste già
        $query_check_email = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $stmt_check_email = $this->conn->prepare($query_check_email);
        $this->email = htmlspecialchars(strip_tags($this->email));
        
        $stmt_check_email->bindParam(":email", $this->email);
        $stmt_check_email->execute();

        //email esiste già
        if ($stmt_check_email->rowCount() > 0) {
            return false;
        }
    
        //email non esiste -> registrazione
        $createdAt = date("Y-m-d");
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name= :name,
                    email= :email,
                    password= :password,
                    created_at = :created_at,
                    updated_at = :updated_at";
    

        $stmt = $this->conn->prepare($query);
    
        //sanitificazione dati
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));
    
        //bind dei parametri
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":created_at", $createdAt);
        $stmt->bindParam(":updated_at", $createdAt);

        if ($stmt->execute()) {
            return true;
        } 
        return false; 
    }
    
    

    function update(){
 
        $updatedAt = date("Y-m-d H:i:s"); // Formato: YYYY-MM-DD HH:MM:SS

        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    name = :name,
                    email = :email,
                    updated_at = :updated_at
                WHERE
                    email = :validationEmail";
     
        $stmt = $this->conn->prepare($query);
     
        $this->validationEmail = htmlspecialchars(strip_tags($this->validationEmail));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
     
        // binding
        $stmt->bindParam(":validationEmail", $this->validationEmail);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":updated_at", $updatedAt);

        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    // DELETE user
    function delete(){
 
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
     
     
        $stmt = $this->conn->prepare($query);
     
        $this->id = htmlspecialchars(strip_tags($this->id));
     
     
        $stmt->bindParam(1, $this->id);
     
        // execute query
        if($stmt->execute()){
            return true;
        }
     
        return false;
         
    }

    //login function
    function login() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email AND password = :password";
        $stmt = $this->conn->prepare($query);
    
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));
    
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
    
        $stmt->execute();
    
        if ($stmt->rowCount() > 0) {
            return true; // Le credenziali sono corrette
        } else {
            return false; // Le credenziali non sono corrette
        }
    }

    //getUser by email
    function getUser(){
        $query = "SELECT name, email, created_at FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);

        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);

		$stmt->execute();
		return $stmt;
    }

    function updateUser(){
 

    }

}
?>