<?php 

class Dashboard {	

	private $shopify = null;
	private $rHeader = null;
	
	public function __construct( Communicator $shfy, RequestHeader $rheader ) {
		$this->shopify = $shfy;
		$this->rHeader = $rheader;
	}
	
	public function GetDashboard() {
		
		$status = array( "status"=>"any" );
		
		$order_count = $this->shopify->call("GET", "orders/count.json", $status);
		$collection_count = $this->shopify->call("GET", "custom_collections/count.json", $status);
		$customer_count = $this->shopify->call("GET", "customers/count.json", $status);
		$product_count = $this->shopify->call("GET", "products/count.json", $status);
	
		return new dashboard_pack($order_count, $customer_count, $collection_count, $product_count);		
		
	}
	
}

class dashboard_pack {
	
	public $order_count;
	public $customer_count;
	public $collection_count;
	public $product_count;

	public function __construct( $order, $customer, $collection, $product ) {
		
		$this->order_count = $order;
		$this->customer_count = $customer;
		$this->collection_count = $collection;
		$this->product_count = $product;
		
	}
}

?>