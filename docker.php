<?php

/**
 * @author   : Saravana Kumar K
 * @copyright: Sarkware http://sarkware.com
 * @category : Docker ( only script that listen & talk with clients ( admin.php, epanel.php, index.php also from store cart pages for payment processing ) )
 * @todo     : Primary interface for client side modules ( epanel as well as admin )
 * @param    : 'LOGIN'  ( when user tries to login, docker expect this param in the REQUEST Object )
 * 			 : along with 'LOGIN' it also expect 'login' and 'password' for authentication.
 * 
 * @param    : 'IIRHEADER'  ( when user tries to communicate (other then login) with docker, it expect this param in the REQUEST Object )
 * 			 : 'IIRHEADER' is a json object which contains the following properties.
 * 
 * 			 : @ REQ_TYPE : can be POST, PUT, GET or DELETE			 
 * 			 : @ TABLE    : can be PRODUCT, COLLECTION, ORDER, CUSTOMER, STORE or USER
 * 			 : @ TYPE     : can be LIST, COUNT or QUERY 
 * 			 : @ QUERY    : query label (eg. customer_id ) 
 * 			 : @ VALUE    : value for query 
 * 			 : @ PAGE     : page number ( used for pagination ) 			
 * 			 : @ DATA     : payload data ( a json object sent from client for creation or updation of record )
 * 
 * @param   : 'PROCEED' ( when store user's tries to checkout with our payment processing module )
 * 			 : 'PROCEED' is an exact duplicate of 'IIRHEADER' except the name.
 * 			 : @ REFERER  : client's base url.
 * 			 : @ callback : JSONP callback function's name.
 * 
 * @return  : returns an object of 'Response' ( /class/model/response.php )
 * 			 : 'Response' contains the following properties.
 * 
 * 			 : @ status   : true or false ( tells the client about the status of last operation, success or failure )
 *  		 : @ message  : any message that server wish to tell client ( eg. 'Product Created Succesully.!' )
 *  		 : @ data     : the data which is about to sent to client ( eg. list of products, listof users .... ) 
 * 			
 */

/**
 *  we started use eZcomponents for database abstraction,
 *  so eConsole now support 'MySql', 'Oracle', 'PgSql', 'MsSql' and 'Sqlite'.
 */
	
	require_once "server/classes/model/su-session.php";
	require_once "server/classes/model/su-request.php";
	require_once "server/classes/model/su-response.php";
	require_once "server/classes/dao/login-dao.php";
	require_once "server/classes/dao/installer-dao.php";
	require_once "server/classes/dao/logger-dao.php";
	require_once "server/classes/delegate/su-dispatcher.php";

	$session = new suSession();
	$dispatcher = null;
	
	/* clear installer flaq from session */
	$session->set( "SU_INSTALL", "NONE" );
	
	/* parameters send by sark utils application itself */
	$suParam = isset( $_REQUEST['suParam'] ) ? $_REQUEST['suParam'] : null;
	
	/* Application processing, Parameters passed by shopify admin */
	$app_shop = isset( $_REQUEST['shop'] ) ? $_REQUEST['shop'] : null;
	$app_path = isset( $_REQUEST['path_prefix'] ) ? $_REQUEST['path_prefix'] : null;
	$app_timestamp = isset( $_REQUEST['timestamp'] ) ? $_REQUEST['timestamp'] : null;
	$app_signature = isset( $_REQUEST['signature'] ) ? $_REQUEST['signature'] : null;
	
	/* Application Install authorization response */
	$app_code = isset( $_REQUEST['code'] ) ? $_REQUEST['code'] : null;
	$app_shop = isset( $_REQUEST['shop'] ) ? $_REQUEST['shop'] : null;
	$app_timestamp = isset( $_REQUEST['timestamp'] ) ? $_REQUEST['timestamp'] : null;
	$app_signature = isset( $_REQUEST['signature'] ) ? $_REQUEST['signature'] : null;
	
	if( $suParam != null ) {
		$rHeader = new RequestHeader( $suParam );
	}	
		
	if( isset($_REQUEST['LOGIN']) ) {
		/**
		 * if we are here then user tries to enter into the application
		 * make sure he is authorized.
		 */
		$loginer = new LoginDAO( $session );
		
		$username = isset( $_REQUEST['login'] ) ? $_REQUEST['login'] : "";
		$password = isset( $_REQUEST['password'] ) ? $_REQUEST['password'] : "";
		
		$loginer->DoLogin( $username, $password );
				
	} else if( $app_code && $app_shop && $app_timestamp && $app_signature ){
		/* request coming for app installation with temp access code ( App install level-2 ) */
		$logger = new Logger( $app_shop, $app_shop );
		
		$installer = new suInstaller( $session, $app_shop, $app_code, $app_timestamp, $app_signature, $logger );
		$installer->doInstall();
		
	} else if( $suParam ) {
		/**
		 * if we are here then user tries to enter into the application
		 * make sure he is authorized.
		 */
		if( $session->get("SUSER") != null ) {			
			$suParam = isset( $_REQUEST['suParam'] ) ? $_REQUEST['suParam'] : "{}";		
			$rHeader = new RequestHeader($suParam);
			
			$dispatcher = new suDispatcher( $session, $rHeader );				
		
			/* OK take your hands off, let dispatcher handle the rest. */
			echo $dispatcher->Dispatch();			
		}else {		
			/* OK session got expired, ask them to login again */
			echo json_encode(new Response(false, "LOGIN", 0, 0, null));						
		}	
	} else if( isset( $_REQUEST['PROCEED'] ) ) {
			
	}
	die();
?>