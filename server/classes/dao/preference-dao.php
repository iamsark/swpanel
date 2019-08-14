<?php 

require_once(dirname(dirname(__FILE__)) . '/model/su-preference.php');

class PrefereneceDAO {	
	
	private $rHeader = null;	
	
	public function __construct( RequestHeader $rheader ) {		
		$this->rHeader = $rheader;				
	}
	
	public function UpdatePreference() {
		
		$suPrefObj = new suPreference();
		$suPrefHandler = new suPreferenceHandler();
		
		$suPrefObj->setId( $this->rHeader->getData()->{'id'} );
		$suPrefObj->setSuHome( $this->rHeader->getData()->{'su_home'} );
		$suPrefObj->setSuEmail( $this->rHeader->getData()->{'su_email'} );
		$suPrefObj->setApiLimit( $this->rHeader->getData()->{'api_result_limit'} );		
		$suPrefObj->setSmtpFrom( $this->rHeader->getData()->{'smtp_from'} );
		$suPrefObj->setSmtpFromName( $this->rHeader->getData()->{'smtp_fromname'} );		
		$suPrefObj->setSmtpHost( $this->rHeader->getData()->{'smtp_host'} );
		$suPrefObj->setSmtpUsername( $this->rHeader->getData()->{'smtp_username'} );
		$suPrefObj->setSmtpPassword( $this->rHeader->getData()->{'smtp_password'} );
		$suPrefObj->setPort( $this->rHeader->getData()->{'smtp_port'} );
		$suPrefObj->setSmtpSecure( $this->rHeader->getData()->{'smtp_secure'} );
		
		return json_encode( $suPrefHandler->UpdatePreference( $suPrefObj ) );
		
	}
	
	public function GetPreferences() {
		
		$suPrefHandler = new suPreferenceHandler();
		return json_encode( $suPrefHandler->GetPreferences() );
		
	}
	
}

?>