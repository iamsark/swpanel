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
  	<link rel="stylesheet" href="client/styles/foundation-datepicker.css">
  	<link rel="stylesheet" href="client/styles/foundation-icons.css">  	
  	<link rel="stylesheet" href="client/styles/sw-panel.css">

  	<script type="text/javascript" src="client/scripts/vendor/modernizr.js"></script>  	
  	<script type="text/javascript" src="client/scripts/vendor/jquery.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation.min.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation/foundation.topbar.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation/foundation.dropdown.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation/foundation-datepicker.js"></script>
  	<script type="text/javascript" src="client/scripts/admin-config.js"></script>
  	<script type="text/javascript" src="client/scripts/utils/dateformat.js"></script> 
  	<script type="text/javascript" src="client/scripts/utils/grid.js"></script>  	
  	<script type="text/javascript" src="client/scripts/model/admin/stores.js"></script> 
  	<script type="text/javascript" src="client/scripts/model/admin/users.js"></script>  	
  	<script type="text/javascript" src="client/scripts/model/admin/activity.js"></script>
  	<script type="text/javascript" src="client/scripts/model/admin/preference.js"></script>     

</head>

<body>

	<?php

		require_once(dirname(__FILE__) . '/server/classes/model/su-context.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-response.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-preference.php');
		session_start();
		$context = unserialize( $_SESSION["SUSER"] );
			
		if( !$context ) {
			header("Location: index.php");
			die();
		}
		
		$suPrefHandler = new suPreferenceHandler();
		$suPrefHandler = $suPrefHandler->GetPreferences();
	
	?>
	
	<script type="text/javascript">

		var docker_base = '<?php echo $suPrefHandler->getData()->getSuHome(); ?>'; 
	
	</script>

	<div class="full-width header-area sticky">
  		<nav class="top-bar" data-topbar>
    		<ul class="title-area">
		    <!-- Title Area -->
		        <li class="name"><h1><a href="#" class="store_name">Sark Utils eAdmin Panel</a></h1></li>
		        <!-- Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone -->
		        <li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
		    </ul>
		    <!-- The Section wrap -->
		    <section class="top-bar-section right top-right-action-bar">
		    	<div class="su-smart-popup-wrapper" >
		    		<a href="#" class="su-dropdown-btn"><span class="user-welcome-span">Welcome : </span><?php echo $context->getUserDisplayName(); ?>&nbsp;<i class="fi-power"></i></a>					
					<div class="su-smart-popup su-preference-popup">
						<ul class="su-preference-dropdown">
						  	<li><a href="<?php echo $suPrefHandler->getData()->getSuHome(); ?>/logout.php" class="logout">Log out</a>	</li>						  							  	
						</ul>
					</div>
				</div>					        	       
		    </section>		    
  		</nav>
	</div>
	
	<div class="row">	
	  	<div class="small-3 large-3 columns left-sidebar-wrapper">
	  		<nav class="navigation-vbar" >
	  			<h2 class="sidebar-heading">Manage Stores</h2>
				<ol id="main-nav" class="main-nav">
					
	  				<li data="stores">
	    				<a href="#" class="selected"><i class="fi-home"></i>&nbsp;Stores</a>
	    			</li>
	    			
	    			<li data="users">
	    				<a href="#"><i class="fi-torsos-male-female"></i>&nbsp;Users</a>
	    			</li>
	    			<li data="activity">
	    				<a href="#"><i class="fi-record"></i>&nbsp;Activity</a>
	    			</li>	    			
	    			<li data="su_preferences">
	    				<a href="#"><i class="fi-list"></i>&nbsp;Preferences</a>
	    			</li>    					  
				</ol>
			</nav>
	  	</div>
	  
	  	<div class="small-21 large-21 columns workarea-wrapper">	
	  		<div class="header-wrapper">
	        	<h1 id="workarea-header"><i class="fi-home"></i> Stores</h1>  
	        	<div id="top-action-bar" class="top-action-bar"></div>     
	        	<span id="loading-notification">Loading...</span>
	      	</div>
	      	
	      	<div class="su-result-popup" id="su-result-top-popup">
      			<h2 class="su-result-heading"><strong>New store</strong> was created successfully.</h2>
      			<a href="#" class="new-btn">add another <span id="su-result-popup-context">store</span></a>.
    		</div>
	      		  	
	      	<div id="workarea-parent" class="workarea-parent">
	      	
	      		<div id="stores" class="workarea" style="display:block;">
		  			<div class="workarea-child" id="archive-stores"  style="display:block;">		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					<div id="stores-table-container" class="su-tabcontent">		  					
		  						
		  						<!-- place holder for stores archive table -->
		  						
		  					</div>	
		  					
		  				</div>
		  			</div>
		  			
		  			<div class="workarea-child" id="single-stores">		  						  				
		  				<div class="row inner-row">        				
        					<div class="large-14 columns">        					
		  						<div id="single-stores-users-table-container">
        							
        						</div>
      
		  					</div>
		  					
		  					<div class="large-10 columns su-forms" style="border-left: solid 1px #ececec;">
		  					
		  						<label>Store Name</label>
		  						<input type="text" id="single-stores-name" disabled>
		  						
		  						<label>Display Name</label>
		  						<input type="text" id="single-stores-display_name">
		  						
		  						<label>Store URL</label>
		  						<input type="text" id="single-stores-store_url">
		  						
		  						<label>API Key</label>
		  						<input type="password" id="single-stores-apikey">
		  						
		  						<label>Secret</label>
		  						<input type="password" id="single-stores-secret">
		  						
		  						<label>Email</label>
		  						<input type="email" id="single-stores-email" disabled>
		  						
		  						<label>Opened At</label>
		  						<input type="text" id="single-stores-opened" disabled>
		  						
		  						<div class="row"> 
								    <div class="large-12 columns">
								      	<label>Active</label>
								      	<input type="radio" name="single-stores-active" value="YES" checked>						      	
								    </div>
								    <div class="large-12 columns">
								      	<label>Deactive</label>
								      	<input type="radio" name="single-stores-active" value="NO">							      
								    </div>
							  	</div>
							  	
		  					</div>				
        				</div>
		  			</div>		  			
		  		</div>
		  		
		  		<div id="users" class="workarea">
		  			<div class="workarea-child" id="archive-users">		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					<div id="users-table-container" class="su-tabcontent">
		  					
		  						<!-- place holder for users archive table -->
		  						
		  					</div>	  					
		  				</div>
		  			</div>
		  			
		  			<div class="workarea-child" id="single-users">
		  				<div class="row inner-row">
        				
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>User</h1>
        							<p>Password and Status fields can be updated using this window (Activate or Deactivate account).</p>
        							  
          							<i class="fi-torsos su-summay-I"></i>
        						</div>      
		  					</div>
		  					
		  					<div class="large-18 columns su-forms">
		  					
		  						<label>User Name</label>
		  						<input type="text" id="single-users-user_name" disabled>
		  						
		  						<label>Display Name</label>
		  						<input type="text" id="single-users-display_name">
		  						
		  						<label>Password</label>
		  						<input type="password" id="single-users-password">
		  						
		  						<label>Email</label>
		  						<input type="email" id="single-users-email" disabled>		  									  						
		  								  						
		  						<div class="row">
		  							<div class="large-8 columns" style="padding-left: 0px;">
								      	<label>Store</label>
		  								<input type="text" id="single-users-store" disabled />						      	
								    </div>
								    <div class="large-8 columns">
								      	<label>Active</label>
								      	<input type="radio" name="single-users-active" value="YES" checked>						      	
								    </div>
								    <div class="large-8 columns" style="padding-right: 0px;">
								      <label>Deactive</label>
								      <input type="radio" name="single-users-active" value="NO">							      
								    </div>
							  	</div>
		  					</div>
        				
        				</div>
		  			</div>
		  		</div>	  		
		  		
		  		<div id="activity" class="workarea">
		  			<div class="workarea-child" id="archive-activity">		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					
		  					<div class="su-filter-wrapper">
  								<div class="filter-contanier">
  									<div class="row">  
  										<div class="large-4 columns" style="padding-left: 5px;">
		  									<span class="su-activity-filter-label">Year : </span>
		  									<select class="su-activity-filter-select" id="activity-year-select">
		  										<option value="none">--- Choose a year ---</option>  										
		  									</select>
	  									</div>
	  									
	  									<div class="large-4 columns">
		  									<span class="su-activity-filter-label">Store : </span>
		  									<select class="su-activity-filter-select" id="activity-store-select">
		  										<option value="none">--- Choose a store ---</option>		
		  									</select>
	  									</div>
	  									
	  									<div class="large-4 columns">
		  									<span class="su-activity-filter-label">User : </span>
		  									<select class="su-activity-filter-select" id="activity-user-select">
		  										<option value="none">--- Choose an user ---</option>	
		  									</select>
	  									</div>
	  									
	  									<div class="large-12 columns">
	  										<a class="activity-filter-btn product-filter-btn"><i class="fi-record"></i> Fetch Activities</a>
	  									</div>
  									</div>  									
  								</div>
  							</div>
		  					
		  					<div id="activity-table-container" class="su-tabcontent">
		  					
		  						<div class="activity-feed" style="position: relative;">
		  					
			  						<ol class="activity-feed-ol" id="activity-feed-ol" style="position: relative;">		  						
			  													
			  						</ol>
		  					
		  						</div>
		  						
		  					</div>	
		  					
		  				</div>
		  			</div>
		  		</div>
		  		
		  		<div id="su_preferences" class="workarea">
		  			<div class="workarea-child" id="archive-su_preferences">
		  			
		  				<div class="large-6 columns">
		  					<div class="collection-summary">
        						<h1>Preference</h1>
        						<p>Set eConsole's home url, limit the results count per API request and config smtp server for eConsole.!</p>
        							  
          						<i class="fi-list su-summay-I"></i>
        					</div>      
		  				</div>
		  					
		  				<div class="large-18 columns su-forms">
		  					
		  					<fieldset style="margin-top: 10px;">
							    <legend>General Configuration</legend>
								    
							    <label>Home URL</label>
		  						<input type="text" id="archive-su_preferences-su_home">
		  						
		  						<label>IIR Support Email</label>
		  						<input type="text" id="archive-su_preferences-su_email">
		  							
		  						<label>Result per Request <span style="font-size: 11px;">( Number of rows returned per Shopify API request )</span></label>
		  						<select id="archive-su_preferences-api_result_limit">
		  							<option value="50">50 rows</option>
		  							<option value="100">100 rows</option>
		  							<option value="150">150 rows</option>
		  							<option value="200">200 rows</option>
		  							<option value="250">250 rows</option>
		  						</select>
										    
							</fieldset>
								
							<fieldset style="margin-top: 10px;">
							    <legend>SMTP Configuration</legend>
								    
								<label>From Name</label>
		  						<input type="text" id="archive-su_preferences-smtp_fromname">
		  						
		  						<label>From Email</label>
		  						<input type="text" id="archive-su_preferences-smtp_from">
								    
							    <label>SMTP Host</label>
		  						<input type="text" id="archive-su_preferences-smtp_host">
		  							
		  						<label>User name</label>
		  						<input type="text" id="archive-su_preferences-smtp_username">
		  							
		  						<label>Password</label>
		  						<input type="password" id="archive-su_preferences-smtp_password">
		  							
		  						<label>Port</label>
		  						<input type="text" id="archive-su_preferences-smtp_port">
		  							
		  						<label>Secure</label>
		  						<select id="archive-su_preferences-smtp_secure">
		  							<option value="none">none</option>
		  							<option value="ssl">SSL</option>
		  							<option value="tsl">TSL</option>
		  						</select>
										    
							</fieldset>
		  					
		  				</div>		  			
		  			</div>		  			
		  		</div>
	      	
	      	</div>
	  	</div>
	  	
	</div>  	
	<div id="su-global-notification"></div>
	
	<script type="text/javascript" src="client/scripts/admin.js"></script>
	
</body>

</html>