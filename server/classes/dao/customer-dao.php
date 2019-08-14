<?php 
/**
 * @author : Saravana Kumar K
 * 
 */

require_once(dirname(dirname(__FILE__)) . '/model/shopify/customers.php');

class CustomerDAO {

	private $shopify = null;
	private $rHeader = null;
	private $session = null;
	
	public function __construct( Communicator $shofy, RequestHeader $rheader, suSession $sess ) {
		$this->shopify = $shofy;
		$this->rHeader = $rheader;
		$this->session = $sess;
	}
	
	public function ListCustomers() {
	
		$customerObj = new Customer( $this->shopify, $this->rHeader );
		$res = $customerObj->ListCustomer();

		if( $this->rHeader->getQuery() != "group_meta" ) {
			$count = $customerObj->GetCount();
		}else {
			$count = 0;
		}		
		
		return json_encode( new Response(true, "Success.!", $this->rHeader->getPage(), $count, $res) );
	
	}
}

?>