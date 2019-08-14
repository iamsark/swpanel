<?php 

class Context {
	public $userid;
	public $username;	
	public $user_display_name;
	public $user_status;
	public $store;
	public $store_email;
	public $store_display_name;
	public $store_url;
	public $access_code;
	public $store_status;
	
	public function __construct( $_user, $_uname, $u_dname, $_ustatus, $_store, $_email, $_store_dname, $_store_url, $_access_code, $_sstatus ) {
		$this->userid = $_user;
		$this->username = $_uname;
		$this->user_display_name = $u_dname;
		$this->user_status = $_ustatus;
		$this->store = $_store;
		$this->store_email = $_email;
		$this->store_display_name = $_store_dname;
		$this->store_url = $_store_url;
		$this->access_code = $_access_code;
		$this->store_status = $_sstatus;		
	}
	
	public function getUserId() {
		return $this->userid;
	}
	
	public function getUserName() {
		return $this->username;
	}
	
	public function getUserDisplayName() {
		return $this->user_display_name;
	}
	
	public function getUserStatus() {
		return $this->user_status;
	}
	
	public function getStore() {
		return $this->store;
	}
	
	public function getStoreEmail() {
		return $this->store_email;
	}
	
	public function getStoreDisplayName() {
		return $this->store_display_name;
	}
	
	public function getStoreUrl() {
		return $this->store_url;
	}
	
	public function getAccessKey() {
		return $this->access_code;
	}
	
	public function getStoreStatus() {
		return $this->store_status;
	}
}

?>