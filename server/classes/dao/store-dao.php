<?php 

require_once(dirname(dirname(__FILE__)) . '/model/su-store.php');
require_once(dirname(dirname(__FILE__)) . '/model/shopify/shop.php');

/**
 * @author 	: Saravana Kumar K
 * @todo   	: Data Access Object for User Management ( Store of econsole )
 *           Store can be created or updated, but cannot be deleted.
 *           They can only be disabled.
 */

class StoreDAO {

	private $shopify = null;
	private $rHeader = null;
	private $shopBase = null;
	
	public function __construct( Communicator $shofy, RequestHeader $rheader, $shop ) {		
		$this->shopify = $shofy;
		$this->rHeader = $rheader;
		$this->shopBase = $shop;
	}
		
	/**
	 * 
	 * @param string $op
	 * @return string
	 * 
	 * @todo   : Used to create a new store or to update existing store.
	 * 			 If $op == "NEW" record will be inserted
	 * 			 If $op == "UPDATE" record will be updated
	 */
	public function NewStore( $op ) {
		
		$suStoreObj = new suStore();
		$suStoreHandler = new suStoreHandler();
	
		if( $op == "UPDATE" ) {
			$suStoreObj->setId( $this->rHeader->getData()->{'id'} );
		}
		$suStoreObj->setName( $this->rHeader->getData()->{'name'} );
		$suStoreObj->setDisplayName( $this->rHeader->getData()->{'display_name'} );
		$suStoreObj->setStoreUrl( $this->rHeader->getData()->{'store_url'} );
		$suStoreObj->setApiKey( $this->rHeader->getData()->{'apikey'} );
		$suStoreObj->setSecret( $this->rHeader->getData()->{'secret'} );
		$suStoreObj->setEmail( $this->rHeader->getData()->{'email'} );
		$suStoreObj->setOpened( $this->rHeader->getData()->{'opened'} );
		$suStoreObj->setActive( $this->rHeader->getData()->{'active'} );
	
		return json_encode( $suStoreHandler->AddStore( $eStoreObj, $op ) );
		
	}
	
	public function ListStores() {
		
		$suStoreHandler = new suStoreHandler();
		
		if( $this->rHeader->getType() == "LIST" ) {
			$res = $suStoreHandler->ListStore();
		} else if( $this->rHeader->getType() == "SINGLE" ) {
			$res = $suStoreHandler->ListStore( $this->rHeader->getQuery(), $this->rHeader->getValue() );
		} else if( $this->rHeader->getType() == "QUERY" ) {
			/* probably used only in gateway context ( need to list stores whichever uses particular gateway ) */
			$res = array();//$suStoreHandler->ListStoreForGateway( $this->rHeader->getValue() );
		}
		
		return json_encode( $res );
				
	}
			
	public function DoSearch() {
		
		$shopHandler = new Shop( $this->shopify, $this->shopBase );
		$res = $shopHandler->GetSearch( $this->rHeader->getData()->{'search'} );
		return json_encode( new Response(true, "Success.!", 0, 0, $res) );
		
	}
	
	public function ListVendors() {
		
		$shopHandler = new Shop( $this->shopify, $this->shopBase );
		$res = $shopHandler->GetVendors();		
		return json_encode( new Response(true, "Success.!", 0, 0, $res) );
		
	}
	
	public function ListProductTypes() {
		
		$shopHandler = new Shop( $this->shopify, $this->shopBase );
		$res = $shopHandler->GetProductTypes();	
		return json_encode( new Response(true, "Success.!", 0, 0, $res) );
		
	}
	
	public function ListTags() {
		
		$shopHandler = new Shop( $this->shopify, $this->shopBase );
		$res = $shopHandler->GetTags();
		return json_encode( new Response(true, "Success.!", 0, 0, $res) );
		
	}
		
}

?>