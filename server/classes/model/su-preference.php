<?php 

require_once(dirname(dirname(__FILE__)) . '/db/dal.php');

class suPreference {
	
	public $id;
	public $su_home;
	public $su_email;
	public $api_result_limit;
	public $smtp_from;
	public $smtp_fromname;
	public $smtp_host;
	public $smtp_username;
	public $smtp_password;
	public $smtp_port;
	public $smtp_secure;
	
	public function __construct() {}
	
	public function setRow(DALQueryResult $result) {
		$this->id = $result->id;
		$this->su_home = $result->su_home;
		$this->su_email = $result->su_email;
		$this->api_result_limit = $result->api_result_limit;
		$this->smtp_from = $result->smtp_from;
		$this->smtp_fromname = $result->smtp_fromname;
		$this->smtp_host = $result->smtp_host;
		$this->smtp_username = $result->smtp_username;
		$this->smtp_password = $result->smtp_password;
		$this->smtp_port = $result->smtp_port;
		$this->smtp_secure = $result->smtp_secure;		
	}
	
	public function setId( $_id ) {
		$this->id = $_id;
	}
	
	public function getId() {
		return $this->id;
	}
	
	public function setSuHome( $_home ) {
		$this->su_home = $_home;
	}
	
	public function getSuHome() {
		return $this->su_home;
	}
	
	public function setSuEmail( $_email ) {
		$this->su_email = $_email;
	}
	
	public function getSuEmail() {
		return $this->su_email;
	}
	
	public function setApiLimit( $_limit ) {
		$this->api_result_limit = $_limit;
	}
	
	public function getApiLimit() {
		return $this->api_result_limit;
	}
	
	public function setSmtpFrom( $_from ) {
		$this->smtp_from = $_from;
	}
	
	public function getSmtpFrom() {
		return $this->smtp_from;
	}
	
	public function setSmtpFromName( $_fromname ) {
		$this->smtp_fromname = $_fromname;
	}
	
	public function getSmtpFromName() {
		return $this->smtp_fromname;
	}
	
	public function setSmtpHost( $_smtp ) {
		$this->smtp_host = $_smtp;
	}
	
	public function getSmtpHost() {
		return $this->smtp_host;
	}
	
	public function setSmtpUsername( $_uname ) {
		$this->smtp_username = $_uname;
	}
	
	public function getSmtpUsername() {
		return $this->smtp_username;
	}
	
	public function setSmtpPassword( $_pass ) {
		$this->smtp_password = $_pass;
	}
	
	public function getSmtpPassword() {
		return $this->smtp_password;
	}
	
	public function setPort( $_port ) {
		$this->smtp_port = $_port;
	}
	
	public function getPort() {
		return $this->smtp_port;
	}
	
	public function setSmtpSecure( $_secure ) {
		$this->smtp_secure = $_secure;
	}
	
	public function getSmtpSecure() {
		return $this->smtp_secure;
	}
	
}

class suPreferenceHandler {
	
	private $dal = null;
	
	public function __construct() {
		$this->dal = new DAL();
	}
	
	public function UpdatePreference( suPreference $suPrefObj ) {
		
		$sql = null;
		$val = null;
		$res = null;
		
		$sql = "UPDATE su_preference set su_home=?, su_email=?, api_result_limit=?, smtp_from=?, smtp_fromname=?, smtp_host=?, smtp_username=?, smtp_password=?, smtp_port=?, smtp_secure=? WHERE id=?";
		$val = array(
				$suPrefObj->getSuHome(),
				$suPrefObj->getSuEmail(),
				$suPrefObj->getApiLimit(),
				$suPrefObj->getSmtpFrom(),
				$suPrefObj->getSmtpFromName(),
				$suPrefObj->getSmtpHost(),
				$suPrefObj->getSmtpUsername(),
				$suPrefObj->getSmtpPassword(),
				$suPrefObj->getPort(),
				$suPrefObj->getSmtpSecure(),
				$suPrefObj->getId()
		);
		
		$res = $this->dal->query( $sql, $val );
		if($res == null || $res == false) {
			return new Response(false, "Internal Error.!", 0, 0, null);
		}
		
		$record = $this->GetPreferences( "id", $suPrefObj->getId() );
		return new Response(true, "<strong>Preferences</strong> Updated Successfully.!", 0, 0, $record->getData());
		
	}
	
	public function GetPreferences() {		
		
		$val = array();		
		$sql = "SELECT id, su_home, su_email, api_result_limit, smtp_from, smtp_fromname, smtp_host, smtp_username, smtp_password, smtp_port, smtp_secure FROM su_preference";		
		
		$results = $this->dal->query( $sql, $val );
		
		if( is_array( $results ) ) {
			$multi_row = null;
			foreach ($results as $result) {
				$multi_row = new suPreference();
				$multi_row-> setRow($result);
			}
			return new Response( true, "Success.!", 0, 0, $multi_row );
		}		
		return new Response(false, "Internal Error.!", 0, 0, array());	
		
	}
	
}

?>