<?php 

/**
 * @author : Saravana Kumar K
 * @todo   : Used to list and update order status
 * 
 */

class Order {
	
	private $shopify = null;
	private $rHeader = null;
	
	public function __construct( Communicator $shfy, RequestHeader $rheader ){
		$this->shopify = $shfy;
		$this->rHeader = $rheader;
	}
	
	/* Used by CheckOut DAO for placing new orders */
	public function NewOrder() {
		
		//$order = $this->rHeader->getData();
		$order = array( "order"=>array() );		
		$order["order"]["send_receipt"] = true;
		$order["order"]["inventory_behaviour"] = "decrement_obeying_policy";		
		$order["order"]["financial_status"] = "paid";		
		$order["order"]["customer"] = $this->rHeader->getData()->{'customer'};
		$order["order"]["email"] = $this->rHeader->getData()->{'email'};
		$order["order"]["billing_address"] = $this->rHeader->getData()->{'billing_address'};
		$order["order"]["shipping_address"] = $this->rHeader->getData()->{'shipping_address'};	
		$order["order"]["line_items"] = $this->rHeader->getData()->{'line_items'};		
		
		$res = $this->shopify->call("POST", "orders.json", $order );
		
		if( $res == "ERROR" ) {
			return false;
		} else if( $res == "CALL LIMIT EXCEED" ) {
			return false;
		}
		
		return $res; 
		
	}
	
	/* Used by CheckOut DAO for updating or cancelling orders */
	public function UpdateOrder( $_order_id, $cusID, $gateway, $txnNo, $op ) {

		if( $op == "UPDATE" ) {			
			/* we are requested to updated order status ( probably payment status PENDING -> PAID ) */			
			$order = array(
				"order"=>array(		
					"id"=>$_order_id,
					"customer"=>array(
						"id"=>$cusID
					),				
					"note"=>"Customer made payment successfully through '".$gateway."' gateway and the Transaction Id is : '".$txnNo."'"										
				)
			);			
			//return $this->shopify->call( "POST", "orders/". $_order_id ."/transactions.json", $order );
			return $this->shopify->call( "PUT", "orders/". $_order_id .".json", $order );			
		} else if( $op == "CANCEL" ) {			
			/* we are requested to cancel the order for given order_id */
			$options = array(							
					"disable_gift_cards"=>true,
					"reason"=>"Customer's payment transcation failed.!",					
					"email"=>true,
					"restock"=>true
			);		
			
			return $this->shopify->call( "POST", "orders/". $_order_id ."/cancel.json", $options );			
		} else {
			return $this->shopify->call( "DELETE", "orders/". $_order_id .".json" );
		}
				
	}
	
	public function ListOrder() {	
		$param = array();
		$param["page"]=$this->rHeader->getPage();
		$param["status"]="any";
		$param["limit"]=250;
		
		if( $this->rHeader->getType() == "LIST" ) {
						
			$res = $this->shopify->call( "GET", "orders.json", $param );
			
		}else if( $this->rHeader->getType() == "SINGLE" ) {
			
			$res = $this->shopify->call("GET", "orders/". $this->rHeader->getValue() .".json" );
			
		}else if( $this->rHeader->getType() == "QUERY" ) {
						
			$param[ $this->rHeader->getQuery() ] = $this->rHeader->getValue();			
			$res = $this->shopify->call( "GET", "orders.json", $param );
			
		}else if( $this->rHeader->getType() == "COUNT" ) {
			
			$res = $this->shopify->call("GET", "orders/count.json");
			
		}		
		return $res;
	}
	
	public function GetCount() {
	
		if( $this->rHeader->getType() == "LIST" ) {
			$query = "orders/count.json";
		}else if( $this->rHeader->getType() == "QUERY" ) {
			$query = "orders/count.json?". $this->rHeader->getQuery() ."=". $this->rHeader->getValue();
		}else {
			return 0;
		}
	
		return $this->shopify->call( "GET", $query );
	
	}
	
	public function MarkAsPayment() {
		$order = array(
				"transaction"=>array(
					"kind"=>"capture"
				)
		);		
		return $this->shopify->call( "POST", "orders/". $this->rHeader->getData()->{'order_id'} ."/transactions.json", $order );
	}
	
	public function Fulfill() {
		return $this->shopify->call("POST", "orders/". $this->rHeader->getData()->{'order_id'} ."/fulfillments.json", $this->rHeader->getData()->{'order'} );		
	}
	
	public function Refund() {
		$order = array(
			"transaction"=>array(
				"kind"=>"refund"
			)
		);			
		return $this->shopify->call( "POST", "orders/". $this->rHeader->getData()->{'order_id'} ."/transactions.json", $order );		
	}
	
	public function Cancel() {
		return $this->shopify->call("POST", "orders/". $this->rHeader->getData()->{'order_id'} ."/cancel.json");		
	}
	
}

?>