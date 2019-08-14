<?php 

require_once( dirname(__FILE__) . '/class.phpmailer.php' );
require_once( dirname(dirname(__FILE__)) . '/model/su-preference.php');

class SuMailer {
	private $mailer = null;
	private $myEmail = "support@sarkutils.in";
	
	public function __construct() {
		$this->setupMailer();
	}

	private function setupMailer() {
		$this->mailer = new PHPMailer();
		$this->mailer->IsSMTP();
		$this->mailer->IsHTML(true);
		$this->mailer->Host = "smtpout.asia.secureserver.net";
		$this->mailer->Port = 465;
		$this->mailer->SMTPAuth = true;
		$this->mailer->SMTPSecure = 'ssl';
		
		$this->mailer->Username = $this->myEmail;
		$this->mailer->Password = "Mgt76MK(Z%=5";

		$this->mailer->From = $this->myEmail;
		$this->mailer->FromName = "SarkUtils";
		$this->mailer->AddReplyTo( $this->myEmail, "SarkUtils SwPanel");
	}

	public function notifyMe( $_Msg ) {
		$this->mailer->ClearAllRecipients();
		$this->mailer->AddAddress( $this->myEmail, "SarkUtils" );
		$this->mailer->Subject = "New SwPanel Installation";
		$this->mailer->Body    = $_Msg;
		$this->mailer->AltBody = $_Msg;

		if( $this->mailer->Send() ) { return true; }
		return false;
	}

	public function acknowledgeVisitor( $_toEmail, $_toName, $_Sub, $_Msg ) {
		$this->mailer->ClearAllRecipients();
		$this->mailer->AddAddress( $_toEmail, $_toName );
		$this->mailer->Subject = $_Sub;
		$this->mailer->Body    = $_Msg;
		$this->mailer->AltBody = $_Msg;
		
		if( $this->mailer->Send()) { return true; }
		return false;
	}
}

?>