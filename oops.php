<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="en" >

<head>

	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<title>Welcome to SwPanel | A private Shopify Dashboard & Admin Panel</title>
  	
  	<link href="client/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  	<link rel="stylesheet" href="client/styles/normalize.css">
  	<link rel="stylesheet" href="client/styles/info.css">
	
</head>
	
<body>

	<?php	
		session_start();	
		if( !isset( $_SESSION["SU_INSTALL"]) && $_SESSION["SU_INSTALL"] != "NO" ) {
			header( "Location: index.php" );
		}	
	?>
	
	<div class="su-info-panel">
		<h1>Welcome to SwPanel</h1>
		<p>Thank you for trying to install SwPanel.</p>
		<p>Unfortunatly some error occured while installing.</p>
		<p>Please Try Again.</p>  
		
		<div class="su-copyright-container">
			Developed by <a href="http://iamsark.com" title="Saravana Kumar K Profile" target="_blank" rel="bookmark" class="logout">Saravana Kumar K</a>
			&#169; <a href="http://sarkware.com" title="Sarkware" target="_blank" rel="bookmark" class="logout">SARKWARE</a> All rights reserved
		</div>
	</div>
	
</body>

</html>