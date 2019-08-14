<?php 
/**
 * @author : Saravana Kumar K
 */

require_once(dirname(dirname(__FILE__)) . '/model/shopify/products.php');

class ProductDAO {

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
	
	public function ListProducts() {
	
		$productObj = new Product( $this->shopify, $this->rHeader );
		$res = $productObj->ListProducts();
		$count = $productObj->GetCount();
		
		return json_encode( new Response(true, "Success.!", $this->rHeader->getPage(), $count, $res) );
	
	}
	
	public function NewProducts() {
		$productObj = new Product( $this->shopify, $this->rHeader );
		
		if( $this->rHeader->getQuery() == "PRODUCT" ) {
			$res = $productObj->NewProduct();	
			$this->logger->LogIt( "product", true, "Created a product : ".$this->rHeader->getData()->{'payload'}->{'title'} ."." );
			return json_encode( new Response( true, "Product Created Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "VARIANT" ) {
			$res = $productObj->AddVariant();
			$this->logger->LogIt( "product", true, "Created a variant : ".$this->rHeader->getData()->{'payload'}->{'title'} ."." );
			return json_encode( new Response( true, "Variant Created Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "IMAGE" ) {
			$res = $productObj->AddImage();			
			return json_encode( new Response( true, "Image Added Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "COLLECTION" ) {
			$res = $productObj->AddCollection();
			return json_encode( new Response( true, "Collection Added Successfully.!", 0, 0, $res ) );
		}
	}
	
	public function UpdateProducts() {
		$productObj = new Product( $this->shopify, $this->rHeader );
		
		if( $this->rHeader->getQuery() == "PRODUCT" ) {
			$res = $productObj->UpdateProduct();
			$this->logger->LogIt( "product", true, "Updated a product : ".$this->rHeader->getData()->{'payload'}->{'title'} ."." );
			return json_encode( new Response( true, "Product Updated Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "VARIANT" ) {
			$res = $productObj->UpdateVariant();
			$this->logger->LogIt( "product", true, "Updated a variant : ".$this->rHeader->getData()->{'payload'}->{'title'} ."." );
			return json_encode( new Response( true, "Variant Updated Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "INVENTORY" ) {
			$res = $productObj->UpdateInventory();
			return json_encode( new Response( true, "Inventory Updated Successfully.!", 0, 0, $res ) );
		}
	}
	
	public function DeleteProducts() {
		$productObj = new Product( $this->shopify, $this->rHeader );
		
		if( $this->rHeader->getQuery() == "PRODUCT" ) {
			$res = $productObj->RemoveProduct(); 
			$this->logger->LogIt( "product", true, "Deleted a product : ".$this->rHeader->getData()->{'product_title'} ."." );
			return json_encode( new Response( true, "Product Removed Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "VARIANT" ) {
			$res = $productObj->RemoveVariant();
			return json_encode( new Response( true, "Variant Removed Successfully.!", 0, 0, $res ) );
		} else if( $this->rHeader->getQuery() == "IMAGE" ) {
			$res = $productObj->RemoveImage();
			return json_encode( new Response( true, "Image Removed Successfully.!", 0, 0, $res ) );
		} else if ( $this->rHeader->getQuery() == "COLLECTION" ) {
			$res = $productObj->RemoveCollection();
			return json_encode( new Response( true, "Collection Removed Successfully.!", 0, 0, $res ) );
		}
	}
}

?>