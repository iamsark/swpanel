<?php 
/**
 * @author : Saravana Kumar K
 * 
 */

require_once(dirname(dirname(__FILE__)) . '/model/shopify/orders.php');

class OrderDAO {

	private $shopify = null;
	private $rHeader = null;
	private $session = null;
	private $logger = null;
	
	public function __construct( Communicator $shofy, RequestHeader $rheader, suSession $sess, Logger $log ) {
		$this->shopify = $shofy;
		$this->rHeader = $rheader;
		$this->session = $sess;
		$this->logger = $log;
	}
	
	public function ListOrders() {
	
		$orderObj = new Order( $this->shopify, $this->rHeader );
		$res = $orderObj->ListOrder();
		$count = $orderObj->GetCount();		
		
		return json_encode( new Response(true, "Success.!", $this->rHeader->getPage(), $count, $res) );
	}
	
	public function UpdateOrder() {
	
		$orderObj = new Order( $this->shopify, $this->rHeader );
	
		if( $this->rHeader->getType() == "MARK_AS_PAYMENT" ) {
	
			$res = $orderObj->MarkAsPayment();
			$this->logger->LogIt( "order", true, "Marked this order as payment received : ".$this->rHeader->getData()->{'order_id'} ."." );
			return json_encode( new Response(true, "Payment Status Updated Successfully.!", 0, 0, $res) );
				
		} else if( $this->rHeader->getType() == "REFUND" ) {
				
			$res = $orderObj->Refund();
			$this->logger->LogIt( "order", true, "Refunded this order : ".$this->rHeader->getData()->{'order_id'} ."." );
			return json_encode( new Response(true, "Refunded Successfully.!", 0, 0, $res) );
				
		} else if( $this->rHeader->getType() == "FULFILL" ) {
				
			$res = $orderObj->Fulfill();
			$this->logger->LogIt( "order", true, "Fulfilled this order : ".$this->rHeader->getData()->{'order_id'} ."." );
			return json_encode( new Response(true, "Fulfillment Status Updated Successfully.!", 0, 0, $res) );
				
		} else if( $this->rHeader->getType() == "CANCEL" ) {
				
			$res = $orderObj->Cancel();
			$this->logger->LogIt( "order", true, "Canceled this order : ".$this->rHeader->getData()->{'order_id'} ."." );
			return json_encode( new Response(true, "Canceled Successfully.!", 0, 0, $res) );
				
		}
	}
}

?>