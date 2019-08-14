<?php 
/**
 * @author : Saravana Kumar K
 * @todo   : Used to create, update, delete, add collection to and remove collection from products.
 * 
 */

class Product {

	private $shopify = null;
	private $rHeader = null;
	
	public function __construct( Communicator $shfy, RequestHeader $rheader ) {
		$this->shopify = $shfy;
		$this->rHeader = $rheader;
	}

	public function ListProducts() {
				
		$param = array();
		$param["page"]=$this->rHeader->getPage();
		$param["status"]="any";
		$param["limit"]=200;
		
		if( $this->rHeader->getType() == "LIST" ) {
			$res = $this->shopify->call( "GET", "products.json", $param);
		}else if( $this->rHeader->getType() == "SINGLE" ) {
			$res = $this->shopify->call("GET", "products/". $this->rHeader->getValue() .".json" );
		}else if( $this->rHeader->getType() == "QUERY" ) {
			$param[ $this->rHeader->getQuery() ] = $this->rHeader->getValue();
			$res = $this->shopify->call("GET", "products.json", $param );
		}else if( $this->rHeader->getType() == "COUNT" ) {
			$res = $this->shopify->call("GET", "products/count.json");
		}
		return $res;
	}
	
	public function GetCount() {
		
		if( $this->rHeader->getType() == "LIST" ) {
			$query = "products/count.json";
		}else if( $this->rHeader->getType() == "QUERY" ) {
			$query = "products/count.json?". $this->rHeader->getQuery() ."=". str_replace(' ', '+', $this->rHeader->getValue());
		}else {
			return 0;
		}
		
		return $this->shopify->call( "GET", $query );
		
	}
	
	public function NewProduct() {
		$product = array(
			"product"=>array(
				"title"=>$this->rHeader->getData()->{'payload'}->{'title'},
				"body_html"=>$this->rHeader->getData()->{'payload'}->{'body_html'},
				"vendor"=>$this->rHeader->getData()->{'payload'}->{'vendor'},
				"product_type"=>$this->rHeader->getData()->{'payload'}->{'product_type'},
				"tags"=>$this->rHeader->getData()->{'payload'}->{'tags'},
				"published"=>$this->rHeader->getData()->{'payload'}->{'published'},
				"images"=>array(
					array(
						"attachment"=>$this->rHeader->getData()->{'payload'}->{'image'}
					)						
				),
				"variants"=>array(
					array(						
						"option1"=>"Default Title",
						"price"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'price'},
						"compare_at_price"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'compare_at_price'},
						"grams"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'grams'},
						"sku"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'sku'},
						"barcode"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'barcode'},
						"inventory_management"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'inventory_management'},
						"requires_shipping"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'requires_shipping'},
						"taxable"=>$this->rHeader->getData()->{'payload'}->{'variant'}->{'taxable'}
					)
				)
			)
		);
		
		return $this->shopify->call( "POST", "products.json", $product );		
	}
	
	public function UpdateProduct() {
		$product = array(
			"product"=>array(
				"title"=>$this->rHeader->getData()->{'payload'}->{'title'},
				"body_html"=>$this->rHeader->getData()->{'payload'}->{'body_html'},
				"vendor"=>$this->rHeader->getData()->{'payload'}->{'vendor'},
				"handle"=>$this->rHeader->getData()->{'payload'}->{'handle'},
				"product_type"=>$this->rHeader->getData()->{'payload'}->{'product_type'},
				"published"=>$this->rHeader->getData()->{'payload'}->{'published'},
				"tags"=>$this->rHeader->getData()->{'payload'}->{'tags'}
			)
		);
		
		return $this->shopify->call( "PUT", "products/".$this->rHeader->getData()->{'product_id'}.".json", $product );
	}
	
	public function RemoveProduct() {
		return $this->shopify->call( "DELETE", "products/".$this->rHeader->getData()->{'product_id'}.".json" );
	}
	
	public function AddVariant() {
		
		$variant = array(			
			"variant"=>array(
				"title"=>$this->rHeader->getData()->{'payload'}->{'title'},
				"option1"=>$this->rHeader->getData()->{'payload'}->{'title'},					
				"price"=>$this->rHeader->getData()->{'payload'}->{'price'},
				"compare_at_price"=>$this->rHeader->getData()->{'payload'}->{'compare_at_price'},
				"grams"=>$this->rHeader->getData()->{'payload'}->{'grams'},
				"sku"=>$this->rHeader->getData()->{'payload'}->{'sku'},
				"barcode"=>$this->rHeader->getData()->{'payload'}->{'barcode'},													
				"inventory_management"=>$this->rHeader->getData()->{'payload'}->{'inventory_management'},								
				"requires_shipping"=>$this->rHeader->getData()->{'payload'}->{'requires_shipping'},					
				"taxable"=>$this->rHeader->getData()->{'payload'}->{'taxable'}			
			)				
		);
		
		return $this->shopify->call( "POST", "products/".$this->rHeader->getData()->{'product_id'}."/variants.json", $variant );
		
	}
	
	public function UpdateVariant() {

		$variant = array(
			"variant"=>array(
				"id"=>$this->rHeader->getValue(),
				"title"=>$this->rHeader->getData()->{'payload'}->{'title'},
				"option1"=>$this->rHeader->getData()->{'payload'}->{'title'},
				"price"=>$this->rHeader->getData()->{'payload'}->{'price'},
				"compare_at_price"=>$this->rHeader->getData()->{'payload'}->{'compare_at_price'},
				"grams"=>$this->rHeader->getData()->{'payload'}->{'grams'},
				"sku"=>$this->rHeader->getData()->{'payload'}->{'sku'},
				"barcode"=>$this->rHeader->getData()->{'payload'}->{'barcode'},
				"inventory_management"=>$this->rHeader->getData()->{'payload'}->{'inventory_management'},
				"inventory_policy"=>$this->rHeader->getData()->{'payload'}->{'inventory_policy'},
				"inventory_quantity"=>$this->rHeader->getData()->{'payload'}->{'inventory_quantity'},
				"requires_shipping"=>$this->rHeader->getData()->{'payload'}->{'requires_shipping'},
				"taxable"=>$this->rHeader->getData()->{'payload'}->{'taxable'}				
			)
		);
		
		return $this->shopify->call( "PUT", "variants/".$this->rHeader->getData()->{'subop_id'}.".json", $variant );
		
	}
	
	public function UpdateInventory() {
		
		$inventory = array(			
			"variant"=>array(
				"id"=>$this->rHeader->getData()->{'variant_id'},
				"inventory_quantity"=>$this->rHeader->getData()->{'inventory_quantity'}
			)				
		);
		
		return $this->shopify->call( "PUT", "variants/".$this->rHeader->getData()->{'variant_id'}.".json", $inventory );
		
	}
	
	public function RemoveVariant() {
		return $this->shopify->call( "DELETE", "products/".$this->rHeader->getData()->{'product_id'}."/variants/".$this->rHeader->getData()->{'subop_id'}.".json" );
	}
	
	public function AddImage() {
		
		$image = array(
			
			"image"=>array(
				"attachment"=>$this->rHeader->getData()->{'payload'}->{'image'},
				"filename"=>$this->rHeader->getData()->{'payload'}->{'filename'}
			)		
				
		);
		
		return $this->shopify->call( "POST", "products/".$this->rHeader->getData()->{'product_id'}."/images.json", $image );
		
	}
	
	public function RemoveImage() {
		
		return $this->shopify->call( "DELETE", "products/".$this->rHeader->getData()->{'product_id'}."/images/".$this->rHeader->getData()->{'subop_id'}.".json" );
		
	}
	
	public function AddCollection() {
		$collect = array(
				"collect"=>array(
						"product_id"=>$this->rHeader->getData()->{'product_id'},
						"collection_id"=>$this->rHeader->getData()->{'subop_id'}
				)
		);
		return $this->shopify->call("POST", "collects.json", $collect );
	}
	
	public function RemoveCollection() {
		$res = $this->shopify->call( "GET", "collects.json?product_id=".$this->rHeader->getData()->{'product_id'} );
		$collectID = null;
			
		foreach ( $res['collects'] as $collect ) {
			if( $collect["collection_id"] == $this->rHeader->getData()->{'subop_id'} ) {
				$collectID = $collect["id"];
				break;
			}
		}
			
		if( $collectID != null ) {
			return $this->shopify->call( "DELETE", "collects/". $collectID .".json" );
		}else {
			return false;
		}
	}	
	
	public function AddOption() {
	
	}
	
	public function RemoveOption() {
	
	}
	
}

?>