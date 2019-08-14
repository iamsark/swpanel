<?php 
/**
 * @author : Saravana Kumar K
 * @todo   : it will do the login for you ( of course not by itself but with your user name & password )
 * 
 */

require_once(dirname(dirname(__FILE__)) . '/model/su-session.php');
require_once(dirname(dirname(__FILE__)) . '/model/su-context.php');
require_once(dirname(dirname(__FILE__)) . '/model/su-authentication.php');
require_once(dirname(dirname(__FILE__)) . '/dao/logger-dao.php');

class LoginDAO {
	
	private $session = null;
	private $context = null;
	
	public function __construct( $sess ) {
		$this->session = $sess;
	}
	
	/**
	 * if either store or user is in disabled mode then we never gonna allow this user enter into dashboard.
	 * @param $user
	 * @param $pass
	 */
	public function DoLogin( $user, $pass ) {	
	
		$storeObj = new suStoreHandler();
		$authObj = new suLogin( $this->session );
	
		if( $authObj->doLogin( $user, $pass ) ) {
				
			$this->context = unserialize( $this->session->get("SUSER") );
	
			if( $this->context->getStoreStatus() == "NO" ) {
	
				$this->session->set( "ERROR", "YES" );
				$this->session->set( "MESSAGE", "Your store has been disbled.!" );
				header("Location: index.php");
				die();
	
			}else if( $this->context->getUserStatus() == "NO" ) {
	
				$this->session->set( "ERROR", "YES" );
				$this->session->set( "MESSAGE", "This account has been disbled.!" );
				header("Location: index.php");
				die();
	
			}else {
					
				if( false && $this->context->getUserId() == 1 ) {
					header("Location: admin.php");
					die();
				}else {
					
					$logger = new Logger( $this->context->getStore(), $this->context->getUserDisplayName() );
					$logger->LogIt( "authentication", true, "Logged in." );
					header("Location: main.php");
					die();
				}
	
			}
				
		}else {
				
			$this->session->set( "ERROR", "YES" );
			$this->session->set( "MESSAGE", "User name or password was invalid.!" );
			header("Location: index.php");
			die();
				
		}
	}
}

?>