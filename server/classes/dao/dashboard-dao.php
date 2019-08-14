<?php 
/**
 * @author : Saravana Kumar K
 * 
 */

require_once(dirname(dirname(__FILE__)) . '/model/shopify/dashboard.php');

class DashboardDAO {

	private $shopify = null;
	private $rHeader = null;
	private $session = null;
	
	public function __construct( Communicator $shofy, RequestHeader $rheader, suSession $sess ) {
		$this->shopify = $shofy;
		$this->rHeader = $rheader;
		$this->session = $sess;
	}
	
	public function GetDashboard() {
		
		$dashObj = new Dashboard( $this->shopify, $this->rHeader );
		$res =  $dashObj->GetDashboard();	
	
		return json_encode( new Response(true, "Success.!", 0, 0, $res) );
	}
}

?>