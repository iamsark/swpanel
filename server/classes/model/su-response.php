<?php 

class Response {
	public $status;
	public $message;
	public $page;
	public $count;
	public $data;
	
	public function __construct( $_status, $_msg, $_page, $_count, $_data ) {
		$this->status = $_status;
		$this->message = $_msg;
		$this->page = $_page;
		$this->count = $_count;
		$this->data = $_data;
	}
	
	public function getStatus() {
		return $this->status;
	}
	
	public function setStatus( $_status ) {
		$this->status = $_status;
	}
	
	public function getMessage() {
		return $this->message;
	}
	
	public function setMessage( $_msg ) {
		$this->message = $_msg;
	}
	
	public function getPage() {
		return $this->page;
	}
	
	public function setPage( $_page ) {
		$this->page = $_page;
	}
	
	public function getCount() {
		return $this->count;
	}
	
	public function setCount( $_count ) {
		$this->count = $_count;
	}
	
	public function getData() {
		return $this->data;
	}
	
	public function setData( $_data ) {
		$this->data = $_data;
	}
}

?>