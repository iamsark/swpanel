<?php

/**
 * @author : Saravana Kumar K
 * @todo   : Model class for User Management
 *           has two classes.
 *           eUser 			- represent a single record of User.
 *           eUserHandler   - manage data base interaction
 *           TABLE : iire_users
 *
 */

require_once(dirname(dirname(__FILE__)) . '/db/dal.php');

class suUser {
	public $id;
	public $store;
	public $user_name;
	public $display_name;
	public $password;	
	public $active;
	
	public function __construct() {}
	
	public function setRow(DALQueryResult $result){
		$this->id = $result->id;
		$this->user_name = $result->user_name;
		$this->display_name = $result->display_name;
		$this->password = $result->password;
		$this->email = $result->email;
		$this->store = $result->store;
		$this->active = $result->active;
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function setId($id) {
		$this->id = $id;
	}
	
	public function getStore() {
		return $this->store;
	}
	
	public function setStore($sto) {
		$this->store = $sto;
	}
	
	public function getUserName() {
		return $this->user_name;
	}
	
	public function setUserName($name) {
		$this->user_name = $name;
	}
	
	public function getDisplayName() {
		return $this->display_name;
	}
	
	public function setDisplayName($dname) {
		$this->display_name = $dname;
	}
	
	public function getPassword(){
		return $this->password;
	}
	
	public function setPassword($password){
		$this->password = $password;
	}
	
	public function getActive() {
		return $this->active;
	}
	
	public function setActive($act) {
		$this->active = $act;
	}
}

class suUserHandler {
	private $dal = null;
	
	public function __construct() {
		$this->dal = new DAL();
	}
	
	public function AddUser( suUser $userObj, $operation ) {		
		$sql = null;
		$val = array();
		
		if( !$this->ValidateUser($userObj) && $operation == "NEW" ) {
			return new Response( false, "<strong>".$userObj->getUserName()."</strong> User Already Exist.!", 0, 0, null );
		}
		
		if($operation == "NEW") {			
			$sql = "INSERT INTO su_users ( store, user_name, display_name, password, active ) VALUES ( :store, :user_name, :display_name, :password, :active )";
			$val = array(
					":store" => $userObj->getStore(),
					":user_name" => $userObj->getUserName(),
					":display_name" => $userObj->getDisplayName(),
					":password" => $userObj->getPassword(),								
					":active" => $userObj->getActive()				
			);
		}else {			
			$sql = "UPDATE su_users SET display_name=?, password=?, active=? WHERE id=?";
			$val = array(				
					$userObj->getDisplayName(),
					$userObj->getPassword(),					
					$userObj->getActive(),
					$userObj->getId()
			);
		}	
		
		$res = $this->dal->query( $sql, $val );
		if($res == null || $res == false) {
			return new Response( false, "Internal Error.!", 0, 0, null );
		}
		
		if($operation == "NEW") {		
			$record = $this->ListUsers( "id", $res );
			return new Response( true, "<strong>".$userObj->getDisplayName()."</strong> Created Successfully.!", 0, 0, $record->getData() );			
		}		
		$record = $this->ListUsers( "id", $userObj->getId() );
		return new Response( true, "<strong>".$userObj->getDisplayName()."</strong> Updated Successfully.!", 0, 0, $record->getData() );	
	}
	
	/**
	 * 
	 * @param $sFlaQ ( true = give us store name, fasle = dont change give id itself )
	 * @return Response
	 * @todo	: Advised to use ListUser() instead.
	 */
	public function AllUser( $sFlaQ = true ) {
		$sql = "SELECT id, user_name, display_name, password, store, active FROM su_users";
		$val = array();
		
		$results = $this->dal->query( $sql, $val );
		
		if( is_array( $results ) ) {		
			$multi_row = array();
			foreach ($results as $result){
				$temp_row = new suUser();
				$temp_row-> setRow( $result );					
				$multi_row[] = $temp_row;
			}			
			return new Response( true, "Success.!", 0, 0, $multi_row );
		}
		
		return new Response(false, "Internal Error.!", 0, 0, null);		
	}
	
	public function ListUsers( $key = null, $value = null ) {		
		$val = array();
		
		if( $key == null ) {
			$sql = "SELECT id, user_name, display_name, password, store, active FROM su_users";
		} else {
			$sql = "SELECT id, user_name, display_name, password, store, active FROM su_users WHERE {$key}=?";
			$val = array( $value );
		}	
		
		$results = $this->dal->query( $sql, $val );
		
		if( is_array( $results ) ) {			
			$multi_row = array();
			foreach ($results as $result){
				$temp_row = new suUser();
				$temp_row-> setRow($result);
				/* single function used for SINGLE as well as QUERY request */
				if( $key == "id" ) {
					$multi_row = $temp_row;
				}else {
					$multi_row[] = $temp_row;
				}
					
			}			
			return new Response( true, "Success.!", 0, 0, $multi_row );
		}		
		return new Response(false, "Internal Error.!", 0, 0, null);		
	}
	
	public function ValidateUser( suUser $userObj ) {		
		$sql = "SELECT id, user_name FROM su_users WHERE user_name=:user_name";
		$val = array( 
			":user_name" => $userObj->getUserName()
		);
		
		$results = $this->dal->query($sql, $val);		
		if( count($results) > 0 ) {
			return false;
		}
		return true;		
	}

}
?>