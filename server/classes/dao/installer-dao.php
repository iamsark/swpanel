<?php 

require_once(dirname(dirname(__FILE__)) . '/utils/http-requester.php');
require_once(dirname(dirname(__FILE__)) . '/utils/su-mail.php'); 

class suInstaller {
	
	private $shop;
	private $code;
	private $timestamp;
	private $signature;
	private $logger;
	private $session;
	
	private $clientID;
	private $client_secret;
	
	private $access_code;
	
	public function __construct( suSession $_sess, $_shop, $_code, $_timestamp, $_signature, Logger $log ) {
		$this->session = $_sess;
		$this->shop = $_shop;
		$this->code = $_code;
		$this->timestamp = $_timestamp;
		$this->signature = $_signature;
		$this->logger = $log;
		
		/* For SwPanel */
		$this->clientID = "f3af12563f672c64e53b1cca27a2279c";
		$this->client_secret = "5497581ed1af093788a51719cf18ec2d";
	}
	
	public function doInstall() {		
		$isError = false;		
		$this->getAccessCode();
		
		if( $this->access_code ) {
			
			$storeObj = new suStore();
			$storeHandlerObj = new suStoreHandler();
			$storeInfo = $this->getStoreInfo();
			
			if( $storeInfo ) {			
				
				$storeObj->setName( $this->shop );
				$storeObj->setDisplayName( $storeInfo["name"] );
				$storeObj->setOwnerName( $storeInfo["shop_owner"] );
				$storeObj->setStoreUrl( $storeInfo["domain"] );
				$storeObj->setEmail( $storeInfo["email"] );
				$storeObj->setAccessCode( $this->access_code );
				$storeObj->setOpened( date( 'Y-m-d H:i:s', strtotime( $storeInfo["created_at"] ) ) );			
				$storeObj->setActive( "YES" );
				
				$res = $storeHandlerObj->AddStore( $storeObj, "NEW" );
				
				if( $res->getStatus() ) {
					
					$store_res = $res->getData();
					$userObj = new suUser();
					$userHandlerObj = new suUserHandler();
					
					$userObj->setStore( $store_res->getId() );
					$userObj->setUserName( $store_res->getEmail() );
					$userObj->setDisplayName( $store_res->getDisplayName() );
					$userObj->setPassword( $this->generateRandomString() );
					$userObj->setActive( "YES" );
					
					$res = $userHandlerObj->AddUser( $userObj, "NEW" );
					
					if( $res->getStatus() ) {
						
						if( $this->installTemplates() ) {
							$mailer = new suMailer();
							
							$this->logger->LogIt( "install", true, "Welcome to SwPanel." );
							$suMsg = $storeObj->getDisplayName()." store has installed SwPanel.";
							$clientMsg = "Thank You for installing our SwPanel application, please visit <a href='http://sarkutils.in/swpanel'>SwPanel</a> page and use the following User Name & Password<br/><br/>";
							$clientMsg .= "User Name : ".$storeObj->getEmail()."<br/>";
							$clientMsg .= "Password : ".$userObj->getPassword();
							
							$mailer->acknowledgeVisitor( $storeObj->getEmail(), $storeObj->getDisplayName(), "Welcome SwPanel - A Private Shopify Dashboard", $clientMsg );
							$mailer->notifyMe( $suMsg );
								
							$isError = false;
						} else {
							$isError = true;
						}				
						
					} else {
						$isError = true;
					}
					
				} else {
					$isError = true;
				}
				
			} else {
				$isError = true;
			}
			
		} else {
			$isError = true;
		}
		
		if( $isError ) {	
			$this->session->set( "SU_INSTALL", "NO" );		
			header("Location: oops.php");		
		} else {
			$this->session->set( "SU_INSTALL", "YES" );
			header("Location: welcome.php");
		}
		
		die();
	}
	
	private function getAccessCode() {
		$requester = new HttpRequester();
		$url = $this->getStoreAdminUrl()."/oauth/access_token";
		$param = array(
			"client_id" => $this->clientID,
			"client_secret" => $this->client_secret,
			"code" => $this->code
		);
		
		$res = $requester->call( "POST", $url, $param );
		$header = $requester->getLastResponseHeader();
		
		if( $header["Status"] == "200" ) {
			$res = json_decode( $res, true );
			$this->access_code = $res["access_token"];
		} else {
			$this->access_code = null;
		}
		return;
	}
	
	private function installTemplates() {
		
		$communicator = new Communicator( $this->getStoreAdminUrl(), $this->access_code );
		$themes = $communicator->call("GET", "themes.json" );
		$currentTheme = null;
		$liquidBase = dirname( dirname( dirname(__FILE__) ) ). DIRECTORY_SEPARATOR ."liquids". DIRECTORY_SEPARATOR;
		
		if( isset( $themes["themes"] ) ) {
			
			foreach ( $themes["themes"] as $theme ) {
				if( $theme["role"] == "main" ) {
					$currentTheme = $theme["id"];
				}
			}
			
		} else {			
			return false;
		}
		
		if( $currentTheme === null ) {			
			return false;
		}
		
		$searchContent = file_get_contents( $liquidBase."search.sw_panel.liquid" );
		$jsonContent = file_get_contents( $liquidBase."sw_panel_json_safe.liquid" );
		$tagsContent = file_get_contents( $liquidBase."search.sw_panel_tags.liquid" );
		$vendorContent =  file_get_contents( $liquidBase."search.sw_panel_vendors.liquid" );
		$productTypeContent = file_get_contents( $liquidBase."search.sw_panel_product_types.liquid" );
		
		$searchParams = array( 'asset' => array( "key" => "templates/search.sw_panel.liquid", "value"=> $searchContent ) );
		$jsonParams = array( 'asset' => array( "key" => "snippets/sw_panel_json_safe.liquid", "value"=> $jsonContent ) );		
		$tagsParams = array( 'asset' => array( "key" => "templates/search.sw_panel_tags.liquid", "value"=> $tagsContent ) );
		$vendorsParams = array( 'asset' => array( "key" => "templates/search.sw_panel_vendors.liquid", "value"=> $vendorContent ) );
		$ptypeParams = array( 'asset' => array( "key" => "templates/search.sw_panel_product_types.liquid", "value"=> $productTypeContent ) );		
		
		$communicator->call( 'PUT', 'themes/'. $currentTheme .'/assets.json', $searchParams );
		$communicator->call( 'PUT', 'themes/'. $currentTheme .'/assets.json', $jsonParams );		
		$communicator->call( 'PUT', 'themes/'. $currentTheme .'/assets.json', $tagsParams );
		$communicator->call( 'PUT', 'themes/'. $currentTheme .'/assets.json', $vendorsParams );
		$communicator->call( 'PUT', 'themes/'. $currentTheme .'/assets.json', $ptypeParams );
		
		return true;
	}
	
	private function getStoreInfo() {
		$communicator = new Communicator( $this->getStoreAdminUrl(), $this->access_code );
		$storeInfo = $communicator->call( "GET", "shop.json" );
		
		if( isset( $storeInfo["shop"] ) ) {
			return $storeInfo["shop"];
		}
		return null;
	}
	
	private function getStoreAdminUrl() {
		return "https://".$this->shop."/admin";
	}
	
	private function generateRandomString( $length = 10 ) {
	    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]-_&*^#$@!~+=';
	    $charsLength = strlen( $chars );
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $chars[rand(0, $charsLength - 1)];
	    }
	    return $randomString;
	}
}

?>