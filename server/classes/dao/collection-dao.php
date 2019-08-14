<?php 
/**
 * @author : Saravana Kumar K
 * 
 */

require_once(dirname(dirname(__FILE__)) . '/model/shopify/collections.php');

class CollectionDAO {

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
	
	public function ListCollections() {
	
		$collectionObj = new Collection( $this->shopify, $this->rHeader );
		$res = $collectionObj->ListCollections();
		$count = $collectionObj->GetCount();
		
		return json_encode( new Response(true, "Success.!", $this->rHeader->getPage(), $count, $res) );
	
	}
	
	/**
	 * TYPE == "MAIN" then we got a request to add a collection
	 * TYPE == "SUB" now we got a request to add a product to a collection
	 * */
	public function NewCollections() {
	
		$collectionObj = new Collection( $this->shopify, $this->rHeader );
	
		if( $this->rHeader->getType() == "MAIN" ) {
				
			$res = $collectionObj->NewCollection();
			$this->logger->LogIt( "collection", true, "Created a collection : ".$this->rHeader->getData()->{'title'} ."." );
			return json_encode( new Response(true, "'".$this->rHeader->getData()->{'title'}."' created successfully.!", 0, 0, $res) );
				
		}else {
				
			$res = $collectionObj->AddProduct();			
			return json_encode( new Response(true, "Updated Successfully.!", 0, 0, $res) );
				
		}
	}
	
	public function UpdateCollections() {
	
		$collectionObj = new Collection( $this->shopify, $this->rHeader );
		$res = $collectionObj->UpdateCollection();
		$this->logger->LogIt( "collection", true, "Updated a collection : ".$this->rHeader->getData()->{'title'} ."." );
		return json_encode( new Response(true, $this->rHeader->getData()->{'title'}." Updated Successfully.!", 0, 0, $res) );
	
	}
	
	/**
	 * TYPE == "MAIN" then we got a request to delete a collection
	 * TYPE == "SUB" now we got a request to delete a product from a collection
	 * */
	public function DeleteCollections() {
	
		$collectionObj = new Collection( $this->shopify, $this->rHeader );
		if( $this->rHeader->getType() == "MAIN" ) {
	
			$res = $collectionObj->RemoveCollection();
			$this->logger->LogIt( "collection", true, "Deleted a collection : ". $this->rHeader->getData()->{'collection_title'} ."." );
			return json_encode( new Response(true, "Removed Successfully.!", 0, 0, $res) );
				
		} else {
				
			$res = $collectionObj->RemoveProduct();
			if( $res ) {
				return json_encode( new Response(true, "Removed Successfully.!", 0, 0, $res) );
			}else {
				return json_encode( new Response(false, "Operation Failed.!", 0, 0, null) );
			}
				
		}
	
	}
	
}

?>