<?php 
require_once(dirname(__FILE__) . '/server/classes/model/su-session.php');
require_once(dirname(__FILE__) . '/server/classes/model/su-context.php');
require_once(dirname(__FILE__) . '/server/classes/dao/logger-dao.php');

$session = new suSession();
if( $session->get("SUSER") != null ) {
	$context = unserialize($session->get("SUSER"));
	$logger = new Logger( $context->getStore(), $context->getUserDisplayName(), null );
	$logger->LogIt( "authentication", true, "Logged Out." );
}
	
session_destroy();
header("Location: index.php");
die();

?>