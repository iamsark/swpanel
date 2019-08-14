<?php 

/**
 * @author : Saravana Kumar K
 * @todo   : Model class for Store Management
 *           has two classes.
 *           eStore			- represent a single record of Store.
 *           eStoreHandler  - manage data base interaction
 *           TABLE : iire_stores
 *
 */

require_once(dirname(dirname(__FILE__)) . '/db/dal.php');

Class suStore {
	public $id;
	public $name;
	public $display_name;
	public $owner_name;
	public $store_url;
	public $email;
	public $access_token;
	public $opened;
	public $active;
	
	public function __construct() {}
	
	public function setRow(DALQueryResult $result) {
		$this->id = $result->id;
		$this->name = $result->name;
		$this->display_name = $result->display_name;
		$this->owner_name = $result->owner_name;
		$this->store_url = $result->store_url;
		$this->email = $result->email;
		$this->access_token = $result->access_token;
		$this->opened = $result->opened;
		$this->active = $result->active;
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function setId( $_id ) {
		$this->id = $_id;
	}
	
	public function getName() {
		return $this->name;
	}
	
	public function setName( $_name ) {
		$this->name = $_name;
	}
	
	public function getDisplayName() {
		return $this->display_name;
	}
	
	public function setDisplayName( $display_name ) {
		$this->display_name = $display_name;
	}
	
	public function getOwnerName() {
		return $this->owner_name;
	}
	
	public function setOwnerName( $owner_name ) {
		$this->owner_name = $owner_name;
	}
	
	public function getStoreUrl() {
		return $this->store_url;
	}
	
	public function setStoreUrl( $_url ) {
		$this->store_url = $_url;
	}
	
	public function getEmail() {
		return $this->email;
	}
	
	public function setEmail( $email ) {
		$this->email = $email;
	}
	
	public function getAccessCode() {
		return $this->access_token;
	}
	
	public function setAccessCode( $_acode ) {
		$this->access_token = $_acode;
	}
	
	public function getOpened() {
		return $this->opened;
	}
	
	public function setOpened( $_op ) {
		$this->opened = $_op;
	}
	
	public function getActive() {
		return $this->active;
	}
	
	public function setActive( $_active ) {
		$this->active = $_active;
	}
} 

class suStoreHandler {
	private $dal = null;
	
	public function __construct() {
		$this->dal = new DAL();
	}
	
	public function AddStore(suStore $storeObj, $operation) {
		$sql = null;		
		$val = array();
		
		if( !$this->ValidateStore( $storeObj ) && $operation == "NEW" ) {
			return new Response( false, "<strong>".$storeObj->getDisplayName()."</strong> Store Already Exist.!", 0, 0, null );
		}
		
		if($operation == "NEW") {
			$sql = "INSERT INTO su_stores ( name, display_name, owner_name, store_url, email, access_token, opened, active ) VALUES ( :name, :display_name, :owner_name, :store_url, :email, :access_token, :opened, :active )";
			$val = array(
					":name" => $storeObj->getName(),
					":display_name" => $storeObj->getDisplayName(),
					":owner_name" => $storeObj->getOwnerName(),
					":store_url" => $storeObj->getStoreUrl(),
					":email" => $storeObj->getEmail(),
					":access_token" => $storeObj->getAccessCode(),
					":opened" => $storeObj->getOpened(),
					":active" => $storeObj->getActive()
			);
		}else {
			$sql = "UPDATE su_stores SET active=? WHERE id=?";
			$val = array(					
					$storeObj->getActive(),
					$storeObj->getId()
			);
		}
		
		$res = $this->dal->query( $sql, $val );
		if( $res == null || $res == false ) {
			return new Response( false, "Internal Error.!", 0, 0, null );
		}
		
		if($operation == "NEW") {
			$record = $this->ListStore( "id", $res );
			return new Response( true, "<strong>".$storeObj->getDisplayName()."</strong> Created Successfully.!", 0, 0, $record->getData() );
		}
		
		$record = $this->ListStore( "id", $storeObj->getId() );
		return new Response( true, "<strong>".$storeObj->getDisplayName()."</strong> Updated Successfully.!", 0, 0, $record->getData() );
	}
	
	public function ListStore( $key = null, $value = null ) {	
		$val = array();
		
		if( $key == null ) {
			$sql = "SELECT id, name, display_name, owner_name, store_url, email, access_token, opened, active FROM su_stores";
		} else {
			$sql = "SELECT id, name, display_name, owner_name, store_url, email, access_token, opened, active FROM su_stores WHERE {$key}=?";
			$val = array( $value );
		}	
		
		$results = $this->dal->query( $sql, $val );
		
		if( is_array( $results ) ) {			
			$multi_row = array();
			foreach ($results as $result){
				$temp_row = new suStore();
				$temp_row-> setRow($result);
				/* single function used for SINGLE as well as QUERY request */
				if(  $key == "id" || $key == "name" || $key == "store_url" ) {
					$multi_row = $temp_row;
				}else {
					$multi_row[] = $temp_row;
				}
					
			}			
			return new Response( true, "Success.!", 0, 0, $multi_row );
		}		
		return new Response(false, "Internal Error.!", 0, 0, null);	
	}
	
	public function ValidateStore( suStore $storeObj ) {
		$stores = $this->ListStore();
		$flaQ = true;
	
		foreach ($stores->getData() as $store) {
			if( $store->getName() == $storeObj->getName() || $store->getEmail() == $storeObj->getEmail() ) {
				$flaQ = false;
				break;
			}
		}		
		return $flaQ;
	}
}

?>