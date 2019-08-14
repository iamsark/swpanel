<?php

/** 
 * @author : Saravana kumar K
 * @purpose : This model is used to fetch data like product search, vendors, product types and tags.
 * 			  Using shopify's api there is no direct and efficient method to fetch above data.
 *            so we are going on the other way ( getting data from shop itself ) * 
 * 
 */

class Shop {
	
	private $shopify = null;
	private $shop_base = null;	
	
	
	public function __construct( Communicator $shofy, $shop ) {
		$this->shopify = $shofy;
		$this->shop_base = $shop;
	}
	
	public function GetVendors() {
		
		$url = "http://". $this->shop_base ."/search?view=sw_panel_vendors";		
		return $this->shopify->shop_call( $url );			
		
	}
	
	public function GetProductTypes() {

		$url = "http://". $this->shop_base ."/search?view=sw_panel_product_types";
		return $this->shopify->shop_call( $url );
		
	}
	
	public function GetTags() {

		$url = "http://". $this->shop_base ."/search?view=sw_panel_tags";
		return $this->shopify->shop_call( $url );
		
	}
	
	public function GetSearch( $search ) {
		
		$url = "http://". $this->shop_base ."/search?view=sw_panel&type=product&q=". $search;
		return $this->shopify->shop_call( $url );
		
	}
}

?>