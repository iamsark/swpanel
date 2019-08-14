<?php 

/**
 * @author : Saravana Kumar K
 * @todo : This model is used to create, update, delete, add products to, remove products from colections.
 * 
 */

class Collection {
	
	private $shopify = null;
	private $rHeader = null;
	
	public function __construct( Communicator $shfy, RequestHeader $rheader ) {
		$this->shopify = $shfy;
		$this->rHeader = $rheader;
	}
	
	public function ListCollections() {
		
		$param = array();
		$param["page"]=$this->rHeader->getPage();
		$param["status"]="any";
		$param["limit"]=250;
		
		if( $this->rHeader->getType() == "LIST" ) {
			$res = $this->shopify->call("GET", "custom_collections.json", $param);
		}else if( $this->rHeader->getType() == "SINGLE" ) {
			$res = $this->shopify->call("GET", "custom_collections/". $this->rHeader->getValue() .".json" );
		}else if( $this->rHeader->getType() == "QUERY" ) {
			$res = $this->shopify->call("GET", "custom_collections.json?". $this->rHeader->getQuery() ."=". $this->rHeader->getValue(), $param );
		}else if( $this->rHeader->getType() == "COUNT" ) {
			$res = $this->shopify->call("GET", "custom_collections/count.json");
		}
		
		return $res;		
	}
	
	public function GetCount() {
	
		if( $this->rHeader->getType() == "LIST" ) {
			$query = "custom_collections/count.json";
		}else if( $this->rHeader->getType() == "QUERY" ) {
			$query = "custom_collections/count.json?". $this->rHeader->getQuery() ."=". $this->rHeader->getValue();
		}else {
			return 0;
		}
	
		return $this->shopify->call( "GET", $query );
	
	}
	
	public function NewCollection() {
		$collection = array(
			"custom_collection"=>array(
				"title"=>$this->rHeader->getData()->{'title'},
				"handle"=>$this->rHeader->getData()->{'handle'},
				"published"=>$this->rHeader->getData()->{'published'},
				"body_html"=>$this->rHeader->getData()->{'body_html'},
				"image"=>array(
					"attachment"=>$this->rHeader->getData()->{'image'}
				)
			)
		);
		
		return $this->shopify->call("POST", "custom_collections.json", $collection);		
	}
	
	public function UpdateCollection() {
		$collection = null;
		
		if( $this->rHeader->getData()->{'image'} != "" && $this->rHeader->getData()->{'image'} != null ) {
			$collection = array(
					"custom_collection"=>array(
							"title"=>$this->rHeader->getData()->{'title'},
							"handle"=>$this->rHeader->getData()->{'handle'},
							"published"=>$this->rHeader->getData()->{'published'},
							"body_html"=>$this->rHeader->getData()->{'body_html'},
							"image"=>array(
									"attachment"=>$this->rHeader->getData()->{'image'}
							)
					)
			);
		}else {
			$collection = array(
					"custom_collection"=>array(
							"title"=>$this->rHeader->getData()->{'title'},
							"handle"=>$this->rHeader->getData()->{'handle'},
							"published"=>$this->rHeader->getData()->{'published'},
							"body_html"=>$this->rHeader->getData()->{'body_html'}
					)
			);
		}
				
		return $this->shopify->call("PUT", "custom_collections/". $this->rHeader->getData()->{'collection_id'} .".json", $collection);		
	}
	
	public function AddProduct() {
		$collect = array(
				"collect"=>array(
						"product_id"=>$this->rHeader->getData()->{'product_id'},
						"collection_id"=>$this->rHeader->getData()->{'collection_id'}
				)
		);	
		return $this->shopify->call("POST", "collects.json", $collect );		
	}
	
	public function RemoveProduct() {
		$res = $this->shopify->call( "GET", "collects.json?product_id=".$this->rHeader->getData()->{'product_id'} );
		$collectID = null;
		
		foreach ( $res['collects'] as $collect ) {
			if( $collect["collection_id"] == $this->rHeader->getData()->{'collection_id'} ) {
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
	
	public function RemoveCollection() {
		return $this->shopify->call( "DELETE", "custom_collections/". $this->rHeader->getData()->{'collection_id'} .".json" );
	}
	
}

?>