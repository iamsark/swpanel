<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="en" >

<head>
	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<title>SwPanel - a private Shopify Control Panel</title>
  	
  	<link href="client/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  	<link rel="stylesheet" href="client/styles/normalize.css">
  	<link rel="stylesheet" href="client/styles/foundation.css">
  	<link rel="stylesheet" href="client/styles/foundation-icons.css">
  	<link rel="stylesheet" href="client/styles/login.css">
</head>

<body>

	<?php
	 
		require_once(dirname(__FILE__) . '/server/classes/db/dal.php');
	
		require_once(dirname(__FILE__) . '/server/classes/model/su-context.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-response.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-preference.php');
		
		session_start();		
		$isError = isset( $_SESSION["ERROR"] ) ? $_SESSION["ERROR"] : false;	
		$errorMsg = isset( $_SESSION["MESSAGE"] ) ? $_SESSION["MESSAGE"] : "";
		
		$suPrefHandler = new suPreferenceHandler();
		$suPref = $suPrefHandler->GetPreferences();
	
	?>

	<div id="container">
	    <div id="dialog">
	    	
	    	<?php if( $isError ) : ?>
	      	<div class="login-error"><p><i class="fi-alert"></i> <?php echo $errorMsg; ?></p></div>
	      	<?php endif; ?>
	      
			<div class="ssb sst clearfix c">
			  <div class="span24">
			    <img alt="eAdmin" src="client/images/logo.jpg">
			  </div>
			</div>
	
			<form accept-charset="UTF-8" action="<?php echo $suPref->getData()->getSuHome(); ?>/docker.php" method="post">
				<input type="hidden" name="LOGIN" value="YES"/>
	  			<div class="clearfix">
	    			<div class="span24">
	      				<div id="sign-in-form" class="lform">   
	  
	        				<div id="login">
	          					<div class="ppb clearfix">
	            					<input type="text" name="login" size="30" id="login-input" class="email large" value="" tabindex="1" autofocus="autofocus" placeholder="User Name">
	          					</div>
	          					<div class="ppb clearfix" id="password-wrapper">
	            					<input type="password" name="password" size="16" id="password" class="large" tabindex="2" placeholder="Password">            
	          					</div>
	        				</div>
	      				</div>           
	    			</div>
	  			</div>
	
	  			<div class="actions">
	    			<input class="button small radius" name="commit" tabindex="3" type="submit" style="font-weight: bold" value="Log in">
	  			</div>
	  		</form>
		</div>
	</div>  
</body>

</html>