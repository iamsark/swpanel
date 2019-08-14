<?php

require_once(dirname(dirname(__FILE__)) . '/model/su-user.php');

/**
 * @author : Saravana Kumar K
 * @todo   : Data Access Object for User Management ( Users of econsole )
 *           Users can be created or updated, but cannot be deleted.
 *           They can only be disabled.
 */

class UserDAO {
	
	private $rHeader = null;
	
	public function __construct( RequestHeader $rheader ) {
		$this->rHeader = $rheader;
	}
	
	/**
	 * 
	 * @param string $op
	 * @return string
	 * 
	 * @todo   : Used to insert a new user as wel as update existing user
	 * 			 Update function exclusively used from IIR Admin Panel
	 * 			 If $op == "NEW" record will be inserted
	 * 			 If $op == "UPDATE" record will be updated
	 * 
	 */
	public function NewUser( $op ) {
		$suUserObj = new suUser();
		$suUserObjHandler = new suUserHandler();
	
		if( $op == "UPDATE" ) {
			$suUserObj->setId( $this->rHeader->getData()->{'id'} );
		}
		$suUserObj->setUserName( $this->rHeader->getData()->{'user_name'} );
		$suUserObj->setDisplayName( $this->rHeader->getData()->{'display_name'} );
		$suUserObj->setPassword( $this->rHeader->getData()->{'password'} );		
		$suUserObj->setStore( $this->rHeader->getData()->{'store'} );
		$suUserObj->setActive( $this->rHeader->getData()->{'active'} );
	
		return json_encode( $suUserObjHandler->AddUser( $suUserObj, $op ) );
	}
	
	/* Used to List all users or users belongs to specific store */
	public function ListUsers() {
		$suUserObjHandler = new suUserHandler();
	
		if( $this->rHeader->getType() == "LIST" ) {
			$res = $suUserObjHandler->AllUser( true );
		} else if( $this->rHeader->getType() == "SINGLE" ) {
			$res = $suUserObjHandler->ListUsers( "id", $this->rHeader->getValue() );
		} else if( $this->rHeader->getType() == "QUERY" ) {
			$res = $suUserObjHandler->ListUsers( $this->rHeader->getQuery(), $this->rHeader->getValue() );
		}
	
		return json_encode( $res );
	}
	
	/* used to update password */
	public function UpdateCredential( Context $context ) {
		$res = null;
		$flaQ = false;
		$userObj = null;
		$suUserObjHandler = new suUserHandler();
		$userList = $suUserObjHandler->ListUsers( "id", $context->getUserId() );
	
		error_log($userList->getData()->getPassword() ." == ". $this->rHeader->getData()->{'old_password'});
		if( $userList->getData()->getPassword() == $this->rHeader->getData()->{'old_password'} ) {
			$userObj = $userList->getData();
			$flaQ = true;				
		}
		
		if( $flaQ ) {
			$userObj->setPassword( $this->rHeader->getData()->{'new_password'} );
			$res = $suUserObjHandler->AddUser($userObj, "UPDATE");
			
			/* password successfully updated */
			if( $res->getStatus() ) {
				/* now time to clear the current session */
				session_destroy();
				return json_encode( new Response( true, "LOGIN", 1, 1, null) );
				
			}else {
				return json_encode( new Response( false, "Current Password was Not Valid", 1, 1, null) );
			}
			
		}else {
			return json_encode( new Response( false, "Current Password was Not Valid", 1, 1, null) );
		}
	}
	
}

?>