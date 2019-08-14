<?php

require_once ( dirname(dirname(dirname(__FILE__))) ."/config/db-config.php" );

class DALQueryResult {
	public $_results = array();

	public function __construct(){}

	public function __set($var,$val){
		$this->_results[$var] = $val;
	}

	public function __get($var){
		if (isset($this->_results[$var])){
			return $this->_results[$var];
		}
		else{
			return null;
		}
	}
}

class DAL {
	
	public $connection = null;
	
	public function __construct() {}
  
  	public function dbconnect() {  		
  		try {
  			$this->connection = new PDO("mysql:host=".EDB_HOST.";dbname=".EDB_DB, EDB_USER, EDB_PASSWORD);
  			$this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  		}catch ( PDOException $e ) {
  			die('Connection failed: ' . $e->getMessage());
  		}  		
  	} 	

  	/** 
  	 * @param string $sql
  	 * @param array  $val
  	 * @return number|resource|boolean|NULL|multitype:DALQueryResult
  	 */  	 
  	public function query( $sql, $val ) { 		
  		
  		$this->dbconnect();
  		$stmt = null;
  		$res = null;
  		
  		try {
  			$stmt = $this->connection->prepare( $sql );
  			$res = $stmt->execute( $val );
  		}catch ( PDOException $e ) {
  			error_log( 'Database error : '. $e->getMessage() );
  			return false;
  		}  		

  		if( strpos($sql,'INSERT') !== false ) {
  			return $this->connection->lastInsertId();
  		} else if( strpos($sql,'UPDATE') !== false ) {
  			return $res;
  		} else if( strpos($sql,'DELETE') !== false ) {
  			return $res;
  		} 

  		$stmt->setFetchMode(PDO::FETCH_ASSOC);
  		/* check the last executed select query yields any result */ 
  		if( $stmt->columnCount() == 0 ) {
  			return array();
  		}	
  		
  		$results = array();		
  		while ($row = $stmt->fetch()) {  	
  			$result = new DALQueryResult();  	
  			foreach ($row as $k=>$v){
  				$result->$k = $v;
  			}  	
  			$results[] = $result;
  		}
  		
  		return $results;
  	}  
  	
  	public function bulk_queries( $stmt ) {
  		$res = null;
  		
  		try {  			
  			$res = $stmt->execute();
  		}catch ( PDOException $e ) {
  			error_log( 'Database error : '. $e->getMessage() );
  			return false;
  		}
  		 		
  		return $res;  		
  	}
}
?>