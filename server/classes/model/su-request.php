<?php
class RequestHeader {
	private $iireRequest;
  	private $iireTable;
  	private $iireType;
  	private $iireQuery;
  	private $iireValue;
  	private $iirePage;
  	private $iireData;  	
  	
	public function __construct($jsonstr){		
		$temp = json_decode( $jsonstr );

		$this->iireRequest = isset( $temp->REQ_TYPE ) ? $temp->REQ_TYPE : "";
		$this->iireTable = isset( $temp->TABLE ) ? $temp->TABLE : "";		
		$this->iireType = isset( $temp->TYPE ) ? $temp->TYPE : "";
		$this->iireQuery = isset( $temp->QUERY ) ? $temp->QUERY : "";
		$this->iireValue = isset( $temp->VALUE ) ? $temp->VALUE : "";		
		$this->iirePage = isset( $temp->PAGE ) ? $temp->PAGE : "";
		$this->iireData = isset( $temp->{'DATA'} ) ? $temp->{'DATA'} : "";
 	}
 	
 	public function getRequest() {
 		return $this->iireRequest;
 	}
 	
	public function getTable() {
 		return $this->iireTable;
 	}
 	
 	public function getType() {
 		return $this->iireType;
 	}
 	
 	public function getQuery() {
 		return $this->iireQuery;
 	}
 	
 	public function getValue() {
 		return $this->iireValue;
 	}
 	
	public function getPage() {
 		return $this->iirePage;
 	}
 	
	public function getData() {
 		return $this->iireData;
 	} 	
}
?>