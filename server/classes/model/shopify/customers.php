<?php 

/**
 * @author : Saravana Kumar K
 * @todo   : Used to list customers
 * 
 */

class Customer {

	private $shopify = null;
	private $rHeader = null;
	
	public function __construct( Communicator $shfy, RequestHeader $rheader ){
		$this->shopify = $shfy;
		$this->rHeader = $rheader;
	}
	
	public function ListCustomer() {	
		
		$page = array();
		$param["page"]=$this->rHeader->getPage();
		$param["limit"]=250;
		
		if( $this->rHeader->getType() == "LIST" ) {
						
			$res = $this->shopify->call( "GET", "customers.json", $param );
			
		}else if( $this->rHeader->getType() == "SINGLE" ) {
						
			$res = $this->shopify->call("GET", "customers/". $this->rHeader->getValue() .".json" );
			
		}else if( $this->rHeader->getType() == "QUERY" ) {
						
			$url = "customers.json";
			
			if( $this->rHeader->getQuery() == "all" ) {				
				$url = "customers.json";				
			}else if( $this->rHeader->getQuery() == "group" ) {				
				$url = "customer_saved_searches/".$this->rHeader->getValue()."/customers.json";						
			}else if( $this->rHeader->getQuery() == "group_meta" ) {				
				$url = "customer_saved_searches.json";				
			}
			
			$res = $this->shopify->call( "GET", $url, $param );
			
		}	
		
		return $res;	
			
	}
	
	public function GetCount() {
		$param = array();
		
		if( $this->rHeader->getType() == "LIST" ) {
			$query = "customers/count.json";
		}else if( $this->rHeader->getType() == "QUERY" ) {				
			
			if( $this->rHeader->getQuery() == "all" ) {
				$query = "customers/count.json";
			}else if( $this->rHeader->getQuery() == "group" ) {
				$query = "customer_saved_searches/". $this->rHeader->getValue() ."/customers/count.json";				
			}		
			
		}else {
			return 0;
		}
		
		return $this->shopify->call( "GET", $query, $param );	
		
	}
}

?>