<?php 

/**
 * @author : Saravana Kumar K
 * @todo	: Handle all request coming from econsole application.  
 * @todo   	: dispatch incoming request to appropriate dao objects.
 *   
 */

require_once(dirname(dirname(__FILE__)) . '/dao/store-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/preference-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/user-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/dashboard-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/order-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/customer-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/collection-dao.php');
require_once(dirname(dirname(__FILE__)) . '/dao/product-dao.php');
require_once(dirname(dirname(__FILE__)) . '/model/shopify/shopify.php');

class suDispatcher {	

	private $session = null;
	private $shopify = null;
	private $rHeader = null;
	private $context = null;
	private $logger = null;
	private $daoObj = null;
	private $res = null;
	/* used by checkout object */
	private $storeObj = null;
	
	public function __construct( suSession $sess, RequestHeader $rheader ) {
		$this->session = $sess;
		$this->rHeader = $rheader;
			
		$this->context = unserialize( $this->session->get("SUSER") );
		$this->logger = new Logger( $this->context->getStore(), $this->context->getUserDisplayName(), $this->rHeader );
				
		if( $this->context ) {
			$this->shopify = new Communicator( $this->getStoreAdminUrl(), $this->context->getAccessKey() );
		}
	}
	
	public function Dispatch() {
		
		if( $this->rHeader->getTable() == "stores" ) {
		
			$this->daoObj = new StoreDAO( $this->shopify, $this->rHeader, $this->context->getStore() );
			
			if( $this->rHeader->getRequest() == "POST" ) {
				$this->res = $this->daoObj->NewStore( "NEW" );
			}else if( $this->rHeader->getRequest() == "PUT" ) {
				$this->res = $this->daoObj->NewStore( "UPDATE" );
			}else if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListStores();
			}
			
			return $this->res;
		
		} else if( $this->rHeader->getTable() == "su_preferences" ) {
			
			$this->daoObj = new PrefereneceDAO( $this->rHeader );
			
			if( $this->rHeader->getRequest() == "PUT" ) {
				$this->res = $this->daoObj->UpdatePreference();
			}else if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->GetPreferences();
			}
			
			return $this->res;
			
		} else if( $this->rHeader->getTable() == "users" ) {
		
			$this->daoObj = new UserDAO( $this->rHeader );
			
			if( $this->rHeader->getRequest() == "POST" ) {
				$this->res = $this->daoObj->NewUser( "NEW" );
			}else if( $this->rHeader->getRequest() == "PUT" ) {
				/* check if it is for password update */
				if( $this->rHeader->getType() == "CREDENTIAL" ) {
					$this->res = $this->daoObj->UpdateCredential( $this->context );
				}else {
					$this->res = $this->daoObj->NewUser( "UPDATE" );
				}				
				
			}else if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListUsers();
			}
			
			return $this->res;
		
		} else if( $this->rHeader->getTable() == "dashboard" ) {
			
			$this->daoObj = new DashboardDAO( $this->shopify, $this->rHeader, $this->session );
			return $this->daoObj->GetDashboard();
		
		} else if( $this->rHeader->getTable() == "orders" ) {
		
			$this->daoObj = new OrderDAO( $this->shopify, $this->rHeader, $this->session, $this->logger );
			
			if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListOrders();
			}else if( $this->rHeader->getRequest() == "PUT" ) {
				$this->res = $this->daoObj->UpdateOrder();
			}
			
			return $this->res;
		
		} else if( $this->rHeader->getTable() == "customers" ) {
			
			$this->daoObj = new CustomerDAO( $this->shopify, $this->rHeader, $this->session );
			
			if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListCustomers();
			}
			
			return $this->res;
			
		} else if( $this->rHeader->getTable() == "collections" ) {
			
			$this->daoObj = new CollectionDAO( $this->shopify, $this->rHeader, $this->session, $this->logger );
			
			if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListCollections();
			}else if( $this->rHeader->getRequest() == "POST" ) {
				$this->res = $this->daoObj->NewCollections();
			}else if( $this->rHeader->getRequest() == "PUT" ) {
				$this->res = $this->daoObj->UpdateCollections();
			}else if( $this->rHeader->getRequest() == "DELETE" ) {
				$this->res = $this->daoObj->DeleteCollections();
			}
			
			return $this->res;
			
		} else if( $this->rHeader->getTable() == "products" || $this->rHeader->getTable() == "inventory" ) {
			
			$this->daoObj = new ProductDAO( $this->shopify, $this->rHeader, $this->session, $this->logger );
			
			if( $this->rHeader->getRequest() == "GET" ) {
				$this->res = $this->daoObj->ListProducts();
			}else if( $this->rHeader->getRequest() == "POST" ) {
				$this->res = $this->daoObj->NewProducts();
			}else if( $this->rHeader->getRequest() == "PUT" ) {
				$this->res = $this->daoObj->UpdateProducts();
			}else if( $this->rHeader->getRequest() == "DELETE" ) {
				$this->res = $this->daoObj->DeleteProducts();
			}
			
			return $this->res;
			
		} else if( $this->rHeader->getTable() == "search" ){
			
			$this->daoObj = new StoreDAO( $this->shopify, $this->rHeader, $this->context->getStore() );
			return $this->daoObj->DoSearch();
			
		} else if( $this->rHeader->getTable() == "vendors" ) {
			
			$this->daoObj = new StoreDAO( $this->shopify, $this->rHeader, $this->context->getStore() );
			return $this->daoObj->ListVendors();
			
		} else if( $this->rHeader->getTable() == "product_types" ) {
			
			$this->daoObj = new StoreDAO( $this->shopify, $this->rHeader, $this->context->getStore() );
			return $this->daoObj->ListProductTypes();
		
		} else if( $this->rHeader->getTable() == "tags" ) {
			
			$this->daoObj = new StoreDAO( $this->shopify, $this->rHeader, $this->context->getStore() );
			return $this->daoObj->ListTags();
			
		} else if( $this->rHeader->getTable() == "activity" ) {
						
			return $this->logger->ReadActivity();
			
		} else {
			return json_encode( new Response( false, "Un known request.!", 0, 0, null ) );
		}	
	}

	private function getStoreAdminUrl() {
		return "https://". $this->context->getStore() ."/admin";
	}
}
?>