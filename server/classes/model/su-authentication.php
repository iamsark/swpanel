<?php

class suLogin {		
	private $session = null;
	private $context = null;	
	
	public function __construct( suSession $sess ) {
		$this->session = $sess;			
	}
	
	public function doLogin( $uname, $upass ) {		

		if( $uname != null && $uname != "" && $upass != null && $upass != "" ) {	
			$suUserObj = new suUserHandler();
			$suStoreObj = new suStoreHandler();					
			$userList = $suUserObj->AllUser( false );		
			
			foreach ( $userList->getData() as $user ) {
				if( $user->getUserName() === $uname && $user->getPassword() === $upass ) {
					$store = $suStoreObj->ListStore( "id", $user->getStore() );
					
					$this->context = new Context( 
							$user->getId(), 
							$user->getUserName(), 
							$user->getDisplayName(),
							$user->getActive(), 
							$store->getData()->getName(), 
							$store->getData()->getEmail(),
							$store->getData()->getDisplayName(),
							$store->getData()->getStoreUrl(),
							$store->getData()->getAccessCode(),							
							$store->getData()->getActive() 
					);
										
					$this->session->set("SUSER", serialize( $this->context) );					
					
					return true;
				}
			}			
		}
		return false;
	}
	
	public function doLogout() {
		session_destroy();
		return "SUCCESS";
	}
}
?>