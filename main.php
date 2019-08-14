<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="en" >

<head>

	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<title>SwPanel - a private Shopify Control Panel</title>
  
  	<link href="client/images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  	<link rel="stylesheet" href="client/styles/normalize.css">
  	<link rel="stylesheet" href="client/styles/foundation.css">
  	<link rel="stylesheet" href="client/styles/foundation-icons.css">
  	<link rel="stylesheet" href="client/styles/jquery-te-1.4.0.css">
  	<link rel="stylesheet" href="client/styles/sw-panel.css">

  	<script type="text/javascript" src="client/scripts/vendor/modernizr.js"></script>  	
  	<script type="text/javascript" src="client/scripts/vendor/jquery.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation.min.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation/foundation.topbar.js"></script>
  	<script type="text/javascript" src="client/scripts/foundation/foundation.reveal.js"></script>  	
  	<script type="text/javascript" src="client/scripts/tinymce/jquery.tinymce.js"></script>
  	
  	<script type="text/javascript" src="client/scripts/utils/dateformat.js"></script> 
  	<script type="text/javascript" src="client/scripts/utils/grid.js"></script>
  	<script type="text/javascript" src="client/scripts/utils/dropdown-paginate.js"></script>  
  	<script type="text/javascript" src="client/scripts/swpanel-config.js"></script>  	
  	<script type="text/javascript" src="client/scripts/model/swpanel/dashboard.js"></script>
  	<script type="text/javascript" src="client/scripts/model/swpanel/order.js"></script>  
  	<script type="text/javascript" src="client/scripts/model/swpanel/customer.js"></script>  
  	<script type="text/javascript" src="client/scripts/model/swpanel/collection.js"></script>  
  	<script type="text/javascript" src="client/scripts/model/swpanel/product.js"></script> 
  	<script type="text/javascript" src="client/scripts/model/swpanel/inventory.js"></script>     

</head>

<body>

	<?php
	
		require_once(dirname(__FILE__) . '/server/classes/model/su-context.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-response.php');
		require_once(dirname(__FILE__) . '/server/classes/model/su-preference.php');
		session_start();
		
		$storeObj = null;
		$context = unserialize($_SESSION["SUSER"]);		

		if( !$context ) {
			header("Location: index.php");
			die();
		} else {			
			require_once(dirname(__FILE__) . '/server/classes/model/su-store.php');
			
			$storeHandler = new suStoreHandler();			
			$storeObj = $storeHandler->ListStore( "name", $context->getStore() );
			
			$suPrefHandler = new suPreferenceHandler();
			$suPref = $suPrefHandler->GetPreferences();
		}

		$gravatar = "http://www.gravatar.com/avatar/". md5(	$context->getStoreEmail() );
	
	?>	
	
	<script type="text/javascript">
		var shop_base = '<?php echo "http://". $context->getStore(); ?>';
		var docker_base = '<?php echo $suPref->getData()->getSuHome(); ?>'; 
	</script>
	
	<div class="row">	
	  	<div class="small-6 large-4 columns left-sidebar-wrapper">
	  	
	  		<nav class="top-bar" data-topbar>
	  			<section class="top-bar-section top-right-action-bar">		    		    	
			    	<div class="su-smart-popup-wrapper" >
			    		<a href="#" class="su-dropdown-btn">
			    			<img src="<?php echo $gravatar; ?>" title="<?php echo $context->getUserDisplayName(); ?>" />
			    			<span class="user-welcome-span">Welcome : </span><?php echo $context->getUserDisplayName(); ?>&nbsp;<i class="fi-power"></i>
			    		</a>					
						<div class="su-smart-popup su-preference-popup">
							<ul class="su-preference-dropdown">		
								<?php if( $context->getUserName() != "demo" ) : ?>					  	
							  	<li><a href="#" data-reveal-id="su-change-password-popup">Change Password</a></li>
							  	<?php endif; ?>
							  	<li><a href="<?php echo $suPref->getData()->getSuHome(); ?>/logout.php" class="logout">Log out</a>	</li>
							  	<li><a href="#" data-reveal-id="su-copyright-popup">About</a></li>							  						  	
							</ul>
						</div>
					</div>	       
			    </section>
	  		</nav>
	  	
	  		<nav class="navigation-vbar" >
	  			<h2 class="sidebar-heading">Your store</h2>
				<ol id="main-nav" class="main-nav">
	  				<li data="dashboard">
	    				<a href="#" class="selected"><i class="fi-home"></i>&nbsp;Dashboard</a>
	    			</li>	    			
	    			<li data="orders">
	    				<a href="#"><i class="fi-shopping-cart"></i>&nbsp;Orders</a>
	    			</li>	    			
	    			<li data="customers">
	    				<a href="#"><i class="fi-torsos-male-female"></i>&nbsp;Customers</a>
	    			</li>	    			
	    			<li data="collections">
	    				<a href="#"><i class="fi-page-multiple"></i>&nbsp;Collections</a>
	    			</li>	    			
	    			<li data="products">
	    				<a href="#"><i class="fi-pricetag-multiple"></i>&nbsp;Products</a>
	    			</li> 	    			
	    			<li data="inventory">
	    				<a href="#"><i class="fi-list-bullet"></i>&nbsp;Inventory</a>
	    			</li> 	    			
				</ol>
			</nav>	
			
			<div class="su-sidebar-copyright-container">
				<div>Developed by <a href="http://iamsark.com" title="Saravana Kumar K Profile" target="_blank" rel="bookmark" class="logout">Saravana Kumar K</a></div>
				<div>&#169; <a href="http://sarkware.com" title="Sarkware" target="_blank" rel="bookmark" class="logout">SARKWARE</a> All rights reserved </div>
			</div>		
	  	</div>
	  
	  	<div class="small-18 large-20 columns workarea-wrapper">	  	
	  		<div class="header-wrapper">
	        	<h1 id="workarea-header"><i class="fi-home"></i> Dashboard</h1>	        	
	        	<div id="top-action-bar" class="top-action-bar"></div>       
	        	<div id="top-pagination-bar" class="top-pagination-bar">
	        		<ul class="pagination-ul">
	        		
	        			<li><a class="pagination-btn su-top-pagination-prev disabled" title="previous page" href="#"><span class="page-prev"></span></a></li>
	        			<li><a class="pagination-btn su-top-pagination-next disabled" title="next page" href="#"><span class="page-next"></span></a></li>
	        		
	        		</ul>
	        	</div>  
	        	<span id="loading-notification">Loading...</span>  
	      	</div>
	      	
	      	<div class="su-result-popup" id="su-result-top-popup">
      			<h2 class="su-result-heading"><strong></strong> was created successfully.</h2>
      			<a href="#" class="new-btn">add another <span id="su-result-popup-context">store</span></a>.
    		</div>
    		
    		<div class="order-warning-notice" id="order-warning-notice">
    			This order was cancelled on <strong id="order-cancelled-date"></strong>    
  			</div>
	      		  	
	      	<div id="workarea-parent" class="workarea-parent">
	      	
		  		<div id="dashboard" class="workarea" style="display:block;">
		  		
		  			<div class="row">
		  				<div class="large-24 columns">
		  					<div class="welcome-box">
    							<div>
      								<h2>Welcome</h2>
      								<h1><?php echo $context->getStoreDisplayName(); ?></h1>
    							</div>
    							<div>
      								<span>Visit your store</span><a href="<?php echo "http://". $context->getStore(); ?>" title="View your store" target="_blank" class="logout"><?php echo $context->getStoreDisplayName(); ?></a>
    							</div>
  							</div>
		  				</div>
		  			</div>
		  			
		  			<div class="row">
		  			
		  				<div class="large-12 columns">
		  					<div class="dashboard-order dashboard-widget" id="dashboard-orders">
		  						
		  					</div>
		  				</div>
		  				
		  				<div class="large-12 columns">
		  					<div class="dashboard-customer dashboard-widget" id="dashboard-collections">
		  						
		  					</div>
		  				</div>
		  				
		  			</div>
		  			
		  			<div class="row">
		  			
		  				<div class="large-12 columns">
		  					<div class="dashboard-collection dashboard-widget" id="dashboard-products">
		  						
		  					</div>
		  				</div>
		  				
		  				<div class="large-12 columns">
		  					<div class="dashboard-product dashboard-widget" id="dashboard-customers">
		  						
		  					</div>
		  				</div>
		  				
		  			</div>
		  			
		  			<div class="row">
		  			
		  				<div class="activity-box">
		  					<h3 class="activity-header su-box-header">Recent Activity</h3>
		  					
		  					<div class="activity-feed">
		  					
		  						<ol class="activity-feed-ol" id="activity-feed-ol">		  						
		  								  						
		  						</ol>
		  					
		  					</div>
		  					
		  				</div>
		  			
		  			</div>
		  			
		  		</div>		  		
		  		
		  		<div id="orders" class="workarea">
		  		
		  			<div class="archive-orders workarea-child" id="archive-orders" style="display: block;">
		  				<div id="order-tab" class="su-tab-wrapper">
		  					<ul id="order-tab-ul" class="su-tab-ul">		  						
		  						<li data.query="status" data.value="any"><a href="#" class="selected">All</a></li>
		  						<li data.query="status" data.value="open"><a href="#">Open</a></li>		  						
		  						<li data.query="fulfillment_status" data.value="unshipped"><a href="#">Unfulfilled</a></li>
		  						<li data.query="financial_status" data.value="unpaid"><a href="#">Unpaid</a></li>
		  					</ul>
		  				</div>
		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					<div id="orders-table-container" class="su-tabcontent">
		  					
		  					<!-- place holder of order table -->
		  					
		  					</div>	
		  					
		  				</div>
		  				
		  			</div>
		  			
		  			<div class="single-orders workarea-child" id="single-orders">
		  				<div class="row">
		  					
		  					<div class="large-17 columns padding-right-zero">
		  					
		  						<div class="su-order-actions">        
        							<a class="button tiny secondary sub-action-btn" data.action="FULFILL" href="#" id="single-orders-fulfill-items-btn">Fulfill items</a>
        							<a class="button tiny secondary disabled" data.action="" style="display: none !important;" id="single-orders-fulfilled-btn">All line items fulfilled</a>
        
        							<a class="button tiny sub-action-btn" data.action="MARK-PAY-RECEIVED" href="#" id="single-orders-mark-as-pay-received-btn">Mark payment as received</a>
                					<a class="button tiny secondary disabled" data.action="" href="#" style="display: none !important;" id="single-orders-pay-received-btn">Payment received</a>
        							<a class="button tiny secondary sub-action-btn" data.action="REFUND" href="#" style="display: none !important;" id="single-orders-refund-btn">Refund</a>
     							</div>
     							
     							<!-- id=" [this.View]-[this.Context]-[sub archive key]-table-container " -->
     							<div id="single-orders-line_items-table-container">
     								
     							</div>
     							
     							<table class="su-order-summary-table">				
     								<tbody>
          								<tr>
            								<td colspan="2" class="tr" style="width: 70%;">              									               
                									      									
            								</td>
            								
            								<td class="tr" style="width: 15%;">
            									<span style="text-align: right;margin-top: 0px">Subtotal:</span>
            									<span style="text-align: right;">Discount:</span>
            									<span style="text-align: right;">Shipping:</span>
            									<span style="text-align: right;">Tax:</span>            									
            									<span style="text-align: right;font-weight: bold;margin-bottom: 0px">Total:</span>
            								</td>
            								
            								<td class="border-right tr" style="width: 15%;">
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-subtotal_price" style="margin-top: 0px; text-align:right;">195.00</span>
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-discount_price" style=" text-align:right;">0.00</span>
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-shipping_price" style=" text-align:right;">0.00</span>
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-tax_price" style=" text-align:right;">0.00</span>            									
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-total_price" style="font-weight: bold; text-align:right;margin-bottom: 0px">195.00</span>
            								</td>            
          								</tr>
        							</tbody>
        						</table>
     							
     							<table class="su-order-transaction-table">				
     								<tbody>
          								<tr>
            								<td colspan="2" class="tr" style="width: 70%;">              									               
                									<i class="fi-dollar order-transaction-payment-icon"></i>
                  									<span>Payment processed by:</span>
                  									<!-- id=" [this.View]-[this.Context]-[key] " -->
                  									<span id="single-orders-gateway">Cash On Delivery (cod)</span>      									
            								</td>
            								
            								<td class="tr" style="width: 15%;">
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-financial_status">Pending</span>:
            								</td>
            								
            								<td class="border-right tr" style="width: 15%;">
            									<!-- id=" [this.View]-[this.Context]-[key] " -->
            									<span id="single-orders-pending_amount">195.00</span>
            								</td>            
          								</tr>
        							</tbody>
        						</table>
		  						
		  					</div>
		  					
		  					<div class="large-7 columns padding-right-zero">
		  					
		  						<!-- id=" [this.View]-[this.Context]-[sub key]-[key] " -->
		  						
		  						<div class="su-box su-box-details">
        							<div class="su-box-header p">
          								<h3>Shipping Address</h3>          
        							</div>
        							<div class="su-box-content">
          
	          							<div class="su-order-address">
	            							<div class="su-details">
	            							
		              							<div class="su-address">
		              							
		                  							<strong class="customer-name" id="single-orders-shipping-name"></strong><br>		                  							
		                  							<span id="single-orders-shipping-address1"></span><br>
		                  							<span id="single-orders-shipping-address2"></span><br>
		 
		 						                    <span id="single-orders-shipping-city"></span>
		                    						<span id="single-orders-shipping-province_code"></span>
		                    						<span id="single-orders-shipping-zip"></span> <br>                 
		                  							<span id="single-orders-shipping-country"></span><br>
		                							
		                  							<i class="fi-telephone"></i>
		                  							<span id="single-orders-shipping-phone"></span>		                
		                  							             
		              							</div>
		              							
	            							</div>
	          							</div>
	          							
        							</div>

        							<div class="su-box-content su-box-connected">
          								<p>Method: <strong id="single-orders-shipping-code"></strong></p>
          								<p>Total Weight: <strong id="single-orders-shipping-total_weight">0</strong> (<span>kg</span>)</p>
        							</div>
        
      							</div>
      							
      							<div class="su-box su-box-details">
        							<div class="su-box-header p">
          								<h3>Billing Address</h3>          
        							</div>
        							<div class="su-box-content">
          
	          							<div class="su-order-address">
	            							<div class="su-details">
	            							
	            								
		              							<div class="su-address">
		                  							<strong class="customer-name" id="single-orders-billing-name"></strong><br>		                  							
		                  							<span id="single-orders-billing-address1"></span><br>
		                  							<span id="single-orders-billing-address2"></span><br>
		 
		 						                    <span id="single-orders-billing-city"></span>
		                    						<span id="single-orders-billing-province_code"></span>
		                    						<span id="single-orders-billing-zip"></span> <br>                 
		                  							<span id="single-orders-billing-country"></span><br>
		                							
		                  							<i class="fi-telephone"></i>
		                  							<span id="single-orders-billing-phone"></span>  <br>             
		                
		                  							<i class="fi-mail"></i>
		                  							<span id="single-orders-billing-email"></span>               
		              							</div>
		              									              							
		              							<a href="#"  id="single-orders-customer-profile-link" class="single-link" data.record="" data.context="customers"><i class="fi-torso"></i> view customer profile</a>
		              							
	            							</div>
	          							</div>
	          							
        							</div>
        							        
      							</div>
      							
		  					</div>
		  					
		  				</div>
		  			</div>
		  			
		  		</div>
		  		
		  		<div id="customers" class="workarea">
		  			<div class="archive-customers workarea-child" id="archive-customers" style="display: block;">
		  				<div id="customer-tab" class="su-tab-wrapper">
		  					<ul id="customer-tab-ul" class="su-tab-ul">
		  						<li data.query="all" data.value="all"><a href="" class="selected">All Customers</a></li>
		  						<li data.query="accepts_marketing" data.value="true"><a href="">Accept Marketing</a></li>
		  						<li data.query="country" data.value="India"><a href="">From India</a></li>
		  						<li data.query="prospect" data.value="500"><a href="">Prospects</a></li>
		  						<li data.query="repeated" data.value="2"><a href="">Repeated</a></li>
		  					</ul>
		  				</div>
		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					<div id="customers-table-container" class="su-tabcontent">
		  					
		  					<!-- place holder of customer table -->
		  					
		  					</div>			  					
		  				</div>
		  			</div>
		  			
		  			<div class="single-customers workarea-child" id="single-customers">
		  				<div class="row">
		  					
		  					<div class="large-17 columns padding-right-zero">
		  						<!-- id=" [this.View]-[this.Context]-[sub archive key]-table-container " -->
     							<div id="single-customers-orders-table-container">
     								
     							</div>
		  					</div>
		  					
		  					<div class="large-7 columns">
		  						<div class="su-box su-box-details">
        							<div class="su-box-header p">
          								<h3>Address</h3>          
        							</div>
        							<div class="su-box-content">
          
	          							<div class="su-order-address">
	            							<div class="su-details">           							
	            								
		              							<div class="su-address" id="su-customer-address">
		                  							<strong class="customer-name" id="single-customers-address-name"></strong><br>		                  							
		                  							<span id="single-customers-address-address1"></span><br>
		                  							<span id="single-customers-address-address2"></span><br>
		 
		 						                    <span id="single-customers-address-city"></span>
		                    						<span id="single-customers-address-province_code"></span>
		                    						<span id="single-customers-address-zip"></span> <br>                 
		                  							<span id="single-customers-address-country"></span><br>
		                							
		                  							<i class="fi-telephone"></i>
		                  							<span id="single-customers-address-phone"></span>  <br>             
		                
		                  							<i class="fi-mail"></i>
		                  							<span id="single-customers-address-email"></span>               
		              							</div>
		              							
		              							<div id="su-customers-empty-address">There are no addresses associated with this customer.</div>
		              							
	            							</div>
	          							</div>
	          							
        							</div>
        							        
      							</div>
      							
      							<div class="su-box su-box-details">
          							<div class="su-box-header p">
            							<h3>Details</h3>
          							</div>
          							<div class="su-box-content-customer p">

							            <ul class="customer-details" id="single-customers-customer-details">
											<li>
								                <i class="fl ico ico-16 ico-marketing"></i>
								                Accepts marketing
								              </li>
								              <li data-showif="customer.state" style="">
								                <i class="fl ico ico-16 ico-account"></i>
								                Has an account
								                </li>
							            </ul>

          							</div>
        						</div>
		  					</div>
		  					
		  				</div>
		  			</div>
		  		</div>
		  		
		  		<div id="collections" class="workarea">
		  		
		  			<div id="archive-collections" class="archive-collections workarea-child" style="display:block">
		  				<div id="product-tab" class="su-tab-wrapper">
		  					<ul id="collection-tab-ul" class="su-tab-ul">
		  						<li><a href="" class="selected">All Collections</a></li>		  						
		  					</ul>
		  				</div>
		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					<div id="collections-table-container" class="su-tabcontent">
		  					
		  					<!-- place holder of collection table -->
		  						
		  					</div>		  					
		  				</div>
		  			</div>
		  			
		  			<div id="single-collections" class="single-collection workarea-child">	
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Collection details</h1>
        							<p>Write a name and description for this collection.</p>
        							<div class="view-in-store-wrapper">
          								<a class="view-in-store logout" target="su-console_preview" href="#" id="single-collections-preview-link" style="">View in your store</a><i class="fi-monitor"></i>
        							</div>
        							<label class="feature-label">Featured image</label>
        							
          							<img class="collection-feature-images" id="single-collections-feature-images" src="//cdn.shopify.com/s/files/1/0272/2661/collections/Girl-Toys_Owl-030-02-0049-700x700_small.jpg?v=1381835378" title="Toys &amp; Gaming" style="">
                
                					<div class="fileUpload button tiny secondary">
									    <span>Choose image</span>
									    <input type="file" id="single-collections-upload-image" class="custom-file-input" />
									</div>                					
        						</div>      
		  					</div>
		  					
		  					<div class="large-18 columns su-single-view-white-wrapper">
		  						<label>Title</label>
		  						<input id="single-collections-title" type="text" />
		  						<label>Description</label>
		  						<textarea class="su-rte-box" id="single-collections-body_html"></textarea>
		  					</div>
		  				</div>  
		  				
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Products</h1>
        							<p>Manage the products that belong to this collection.</p>      							
									
									<div class="su-smart-popup-wrapper" >
										<a href="#" data.action="SHOW_PRODUCT" class="tiny secondary radius button su-dropdown-popup-btn">Add Products</a>
										<div class="su-smart-popup" id="single-collections-products-dropdown-popup"></div>
									</div>
		  						</div>
		  					</div>
		  					
		  					<div class="large-18 columns su-single-view-white-wrapper">
		  						<div id="single-collections-products-table-container">
		  						
			  						<!-- place holder for products sub-archive -->
			  						
		  						</div>
		  					</div>		  					
		  				</div>	
		  				
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Search Engines</h1>
        							<p>Set up the page title, meta description and handle. These help define how this collection shows up on search engines.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<label>Page title  <span>13 of 70 characters used</span></label>
        						<input type="text" id="single-collections-seo-title">
        						
        						<label>Meta description  <span>0 of 160 characters used</span></label>
        						<input type="text" id="single-collections-seo-meta-description">
        					
        						<label>URL & Handle <span>( better to leave as it is )</span></label>
        						<input type="text" id="single-collections-handle">
        						
        					</div>        					
        				</div>	
        				
        				<div class="row inner-row" style="border-bottom:none;">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Visibility</h1>
        							<p>Control if this collection can be viewed on your storefront.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<input type="radio" name="single-collections-visible-state" value="true"><label class="feature-label">Visible<span></span></label>
        						<br/>
      							<input type="radio" name="single-collections-visible-state" value="false" style="margin-bottom:0px;"><label class="feature-label">Hidden</label>
        						
        					</div>
        					
        				</div>	
        				
        				<div class="row inner-row inner-row-last">
        				
	        				<div class="large-6 columns">        				
	        					<a href="#" class="tiny alert radius button delete-btn">Delete This Collection</a>        				
	        				</div>
	        				
	        				<div class="large-18 columns right-aligned">
	        					<a href="#" class="tiny radius button update-btn">Update</a>
	        				</div>
        				
        				</div>			
		  				
		  			</div>
		  			
		  			<div id="new-collections" class="new-collection workarea-child">
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Collection details</h1>
        							<p>Write a name and description for this collection.</p>
        							<div class="view-in-store-wrapper">
          								<a class="view-in-store" href="#" style="">View in your store</a><i class="fi-monitor"></i>
        							</div>
        							<label class="feature-label">Featured image</label>
        							
          							<img class="collection-feature-images" id="new-collections-feature-preview" src="client/images/no-image.jpg" title="feature image">
        
        							<div class="fileUpload button tiny secondary">
									    <span>Choose image</span>
									    <input type="file" id="new-collections-upload-image" class="custom-file-input" />
									</div>
        							
        						</div>
      
		  					</div>
		  					
		  					<div class="large-18 columns su-single-view-white-wrapper">
		  						<label>Title</label>
		  						<input id="new-collections-title" type="text" class="" />
		  						<label>Description</label>
		  						<textarea class="su-rte-box" id="new-collections-body_html"></textarea>
		  					</div>
		  				</div> 
		  				
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Search Engines</h1>
        							<p>Set up the page title, meta description and handle. These help define how this collection shows up on search engines.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<label>Page title  <span>( 13 of 70 characters used )</span></label>
        						<input type="text" id="new-collections-page-title">
        						
        						<label>Meta description  <span>0 of 160 characters used</span></label>
        						<input type="text" id="new-collections-meta-description">
        					
        						<label>URL & Handle <span>( better to leave as it is )</span></label>
        						<input type="text" id="new-collections-handle">
        						
        					</div>
        					
        				</div>	
        				
        				<div class="row inner-row" style="border-bottom:none;">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Visibility</h1>
        							<p>Control if this collection can be viewed on your storefront.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<input type="radio" name="new-collections-visible-state" value="true" checked><label class="feature-label">Visible<span></span></label>
        						<br/>
      							<input type="radio" name="new-collections-visible-state" value="false" style="margin-bottom:0px;"><label class="feature-label">Hidden</label>
        						
        					</div>        					
        				</div> 
        				
        				<div class="row inner-row inner-row-last">        				
	        				
	        				<div class="large-24 columns right-aligned">
	        					<a href="#" class="tiny secondary radius button cancel-btn">Cancel</a>
	        					<a href="#" class="tiny radius button save-btn">Save</a>
	        				</div>
        				
        				</div>	
		  			</div>
		  			
		  		</div>
		  		
		  		<div id="products" class="workarea">
		  			<div id="archive-products" class="archive-products workarea-child" style="display:block;">
		  				<div id="product-tab" class="su-tab-wrapper">
		  					<ul id="product-tab-ul" class="su-tab-ul">
		  						<li><a href="" class="selected">All Products</a></li>		  						
		  					</ul>
		  				</div>
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  				
		  					<div class="su-filter-wrapper">
  								<div class="filter-contanier" style="margin-top: 15px;">  
  									<div class="su-smart-popup-wrapper">  								
      									
      									<a class="product-filter-btn su-dropdown-btn"><i class="fi-filter"></i> Filter products</a>
      								
      									<div class="su-smart-popup su-product-filter-popup">
      											
      										<label>Show all product where:</label>
      																				
											<select class="su-product-filter-select" id="products-product-filter-main-select">
												<option value="none">Select a filter...</option>
												<option value="published_status">Visibility</option>
												<option value="product_type">Product type</option>
												<option value="vendor">Product vendor</option>
											</select>
											
											<span class="product-filter-is-span">is</span>
											
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="products-product-filter-published_status-select">
												<option value="none">Select a value...</option>
												<option value="published">Visibile</option>
											  	<option value="unpublished">Hidden</option>										  	
											</select>
											  		
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="products-product-filter-product_type-select">
												<option>Select a value...</option>											  			
											</select>
											  	
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="products-product-filter-vendor-select">
												<option>Select a value...</option>											  			
											</select>
											
											<a class="button secondary tiny do-filter-btn">Add filter</a>
											
										</div>
      								
      								</div>
      								
      								<div class="filter-search-container">      
								        <input type="text" id="product-search-box" class="filter-search-input" placeholder="Type a product's name & hit Enter ...">      
    								</div>
      								
		  						</div>		  						
		  					</div>
		  				
		  					<div id="products-table-container" class="su-tabcontent">
		  					
		  					<!-- place holder of product table -->
		  						
		  					</div>	
		  					
		  				</div>
		  			</div>
		  			
		  			<div id="single-products" class="single-product workarea-child">
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Product details</h1>
        							<p>Write a name and description, and provide a type and vendor to categorize this product.</p>
        							<div class="view-in-store-wrapper">
          								<a class="view-in-store logout" target="_blank" href="#" id="single-products-preview-link">View in your store</a><i class="fi-monitor"></i>
        							</div>
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
		  						<label>Title</label>
		  						<input id="single-products-title" type="text" class="" />
		  						<label>Description</label>
		  						<textarea class="su-rte-box" id="single-products-body_html"></textarea>
		  						
		  						<div class="row">
		  							<div class="large-12 columns padding-left-zero">
		  								<label>Type <span>e.g. Bicycles, T-Shirts</span></label>
		  								<select id="single-products-product_types">
		  									<option value="new-product-type">Create a new product type</option>
		  								</select>
		  								
		  								<input type="text" id="single-products-add_product_type" style="margin-top: 25px; display: none;" placeholder="New product type name">
		  								
		  							</div>
		  							<div class="large-12 columns padding-right-zero">
		  								<label>Vendor <span>e.g. Reebok, Puma</span></label>
		  								<select id="single-products-vendors">
		  									<option value="new-vendor">Create a new vendor</option>
		  								</select>
		  								<input type="text" id="single-products-add_vendor" style="margin-top: 25px; display: none;" placeholder="New product vendor name">
		  							</div>
		  						</div>
		  						
		  					</div>        					
        				</div>
        				
        				<div class="row inner-row">
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Inventory & variants</h1>
        							<p>Configure the options for selling this product. You can also edit options.</p>
        							<a href="#" class="tiny secondary radius button new-variant-btn">Add a variant</a>
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<div id="single-products-variant-table-container">
        						
        						</div>        						
        						
        					</div>
        				</div>  				
        				
        				<div class="row inner-row">
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Collections</h1>
        							<p>Collections can be used to group products together.</p>
        							
        							<div class="su-smart-popup-wrapper" >
										<a href="#" data.action="SHOW_COLLECTION" class="tiny secondary radius button su-dropdown-popup-btn">Add to collections</a>
										<div class="su-smart-popup" id="single-products-collections-dropdown-popup"></div>
									</div>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        						<div id="single-products-collections-table-container"></div>
        					</div>
        				</div>
        				
        				<div class="row inner-row">
        				
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Images</h1>
        							<p>Upload images of this product.</p>
        							  
        							<div class="fileUpload button tiny secondary">
									    <span>Choose images</span>
									    <input type="file" id="single-products-upload-image" class="custom-file-input" />
									</div>          							
        						</div>
      
		  					</div>
		  					
		  					<div class="large-18 columns su-single-view-white-wrapper">
		  						<ul id="single-products-product-images" class="product-images-ul">
		  								  							
		  						</ul>
		  					</div>
        				
        				</div>
        				
        				<div class="row inner-row">
        				
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Tags</h1>
        							<p>Tags can be used to categorize products by properties like color, size, and material.</p>        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">	
        					
	        					<div class="selected-tags-ul-wrapper">
	        						<ul id="single-products-selected-tags-ul" class="selected-tags-ul">
	        							<li class="tagit-new">        								
	        								<input type="text" class="new-tags-text" id="new-tags-text" />
	        							</li>
	        						</ul>
	        					</div>
	        					
	        					<div class="all-tags-ul-wrapper">
	        					
	        						<ul class="products-all-tags-ul" id="single-products-all-tags-ul"></ul>
	        					
	        					</div>
        					
        					</div>
        					
        				</div>
        				
        				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Search Engines</h1>
        							<p>Set up the page title, meta description and handle. These help define how this collection shows up on search engines.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<label>Page title  <span>( 13 of 70 characters used )</span></label>
        						<input type="text" id="single-products-seo-title">
        						
        						<label>Meta description  <span>0 of 160 characters used</span></label>
        						<input type="text" id="single-products-meta-description">
        					
        						<label>URL & Handle <span>( better to leave as it is )</span></label>
        						<input type="text" id="single-products-handle">
        						
        					</div>
        					
        				</div>	
        				
        				<div class="row inner-row" style="border-bottom:none;">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Visibility</h1>
        							<p>Control if this collection can be viewed on your storefront.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<input type="radio" name="single-products-visible-state" value="true" checked><label class="feature-label">Visible<span></span></label>
        						<br/>
      							<input type="radio" name="single-products-visible-state" value="false" style="margin-bottom:0px;"><label class="feature-label">Hidden</label>
        						
        					</div>
        					
        				</div>
        				
        				<div class="row inner-row inner-row-last">
        				
	        				<div class="large-6 columns">        				
	        					<a href="#" class="tiny alert radius button delete-btn">Delete This Product</a>        				
	        				</div>
	        				
	        				<div class="large-18 columns right-aligned">
	        					<a href="#" class="tiny radius button update-btn">Update</a>
	        				</div>
        				
        				</div>	
        				
        				<div id="single-products-variants-popup" class="reveal-modal medium su-popup-model" data-reveal>
	  						
        					<div class="row inner-row">        					
        						<div class="large-24 columns">
        						
        							<label>Title</label>
        							<input type="text" id="single-products-variants-title">
        						
        						</div>        					
        					</div>

        					<div class="row">        					
        						<div class="large-8 columns">
        						
        							<label>Price</label>
        							<input type="text" id="single-products-variants-price">
        						
        						</div>
        						<div class="large-8 columns">
        						
        							<label>Compare at price</label>
        							<input type="text" id="single-products-variants-compare_at_price">
        						
        						</div>
        						<div class="large-8 columns">
        						
        							<label>Weight<span>(kg)</span></label>
        							<input type="text" id="single-products-variants-grams">
        						
        						</div>        					
        					</div>
        					
        					<div class="row" style="padding-top: 0px;">        					
        						<div class="large-12 columns">
        						
        							<label>SKU<span>(Stock Keeping Unit)</span></label>
        							<input type="text" id="single-products-variants-sku">
        						
        						</div>
        						<div class="large-12 columns">
        						
        							<label>Barcode<span>e.g. UPC, ISBN</span></label>
        							<input type="text" id="single-products-variants-barcode">
        						
        						</div>        						        					
        					</div>
        					
        					<div class="row" style="padding: 0px;">        					
        						<div class="large-24 columns">        						
        							
        							<input type="checkbox" id="single-products-variants-taxable">
        							<label>Charge taxes on this product</label>
        						
        						</div>        						        						        					
        					</div>
        					
        					<div class="row inner-row">        					
        						<div class="large-24 columns">      						
        							
        							<input type="checkbox" id="single-products-variants-requires_shipping">
        							<label>Require a shipping address<span>(not needed for services or digital goods)</span></label>
        						
        						</div>        						        						        					
        					</div>
        					
        					<div class="row">
        						<div class="large-12 columns">
        						
        							<label>Inventory policy<span>(Stock Keeping Unit)</span></label>
        							<select id="single-products-variants-inventory_management">
        								<option value="">Don't track inventory</option>
        								<option value="shopify">Tracks this variant's inventory</option>
        							</select>
        						
        						</div>
        						<div class="large-12 columns">
        						
        							<label>Quantity</label>
        							<input type="number" id="single-products-variants-inventory_quantity">
        						
        						</div> 
        					</div>
        					
        					<div class="row inner-row" style="padding-top:0px;">        					
        						<div class="large-24 columns">      						
        							
        							<input type="checkbox" id="single-products-variants-inventory_policy">
        							<label>Allow users to purchase this item, even if it is no longer in stock.</span></label>
        						
        						</div>        						        						        					
        					</div>
        					
        					<div class="row">
        						
        						<div class="large-24 columns variant-popup-action-bar">
        							<input type="hidden" id="single-products-variants-id" value="">
        							<a href="#" class="button tiny secondary variant-cancel-btn">Cancel</a>
        							<a href="#" class="button tiny secondary variant-save-btn">Save</a>
        							<a href="#" class="button tiny secondary variant-save-close-btn">Save and Close</a>
        						</div>
        						
        					</div>
        					
						</div>	
						
						<div id="single-products-new-variants-popup" class="reveal-modal medium su-popup-model" data-reveal>
	  						
        					<div class="row inner-row">        					
        						<div class="large-24 columns">
        						
        							<label>Title</label>
        							<input type="text" id="single-products-new-variants-title">
        						
        						</div>        					
        					</div>

        					<div class="row">        					
        						<div class="large-8 columns">
        						
        							<label>Price</label>
        							<input type="text" id="single-products-new-variants-price">
        						
        						</div>
        						<div class="large-8 columns">
        						
        							<label>Compare at price</label>
        							<input type="text" id="single-products-new-variants-compare_at_price">
        						
        						</div>
        						<div class="large-8 columns">
        						
        							<label>Weight<span>(kg)</span></label>
        							<input type="text" id="single-products-new-variants-grams">
        						
        						</div>        					
        					</div>
        					
        					<div class="row" style="padding-top: 0px;">        					
        						<div class="large-12 columns">
        						
        							<label>SKU<span>(Stock Keeping Unit)</span></label>
        							<input type="text" id="single-products-new-variants-sku">
        						
        						</div>
        						<div class="large-12 columns">
        						
        							<label>Barcode<span>e.g. UPC, ISBN</span></label>
        							<input type="text" id="single-products-new-variants-barcode">
        						
        						</div>        						        					
        					</div>
        					
        					<div class="row" style="padding: 0px;">        					
        						<div class="large-24 columns">        						
        							
        							<input type="checkbox" id="single-products-new-variants-taxable">
        							<label>Charge taxes on this product</label>
        						
        						</div>        						        						        					
        					</div>
        					
        					<div class="row inner-row">        					
        						<div class="large-24 columns">      						
        							
        							<input type="checkbox" id="single-products-new-variants-requires_shipping">
        							<label>Require a shipping address<span>(not needed for services or digital goods)</span></label>
        						
        						</div>        						        						        					
        					</div>
        					
        					<div class="row inner-row">
        						<div class="large-12 columns">
        						
        							<label>Inventory policy</label>
        							<select id="single-products-new-variants-inventory_management">
        								<option value="">Don't track inventory</option>
        								<option value="shopify">Tracks this variant's inventory</option>
        							</select>
        						
        						</div>        						
        					</div>       					
        					
        					<div class="row">
        						
        						<div class="large-24 columns variant-popup-action-bar">
        							<a href="#" class="button tiny secondary variant-cancel-btn">Cancel</a>
        							<a href="#" class="button tiny secondary add-variant-btn">Add Variant</a>        							
        						</div>
        						
        					</div>
        					
						</div>						
        				
		  			</div>
		  			
		  			<div id="new-products" class="new-product workarea-child">
		  				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Product details</h1>
        							<p>Write a name and description, and provide a type and vendor to categorize this product.</p>
        							<div class="view-in-store-wrapper">
          								<a class="view-in-store logout" target="_blank" href="#" id="single-products-preview-link">View in your store</a><i class="fi-monitor"></i>
        							</div>
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
		  						<label>Title</label>
		  						<input id="new-products-title" type="text" class="" />
		  						<label>Description</label>
		  						<textarea class="su-rte-box" id="new-products-body_html"></textarea>
		  						
		  						<div class="row">
		  							<div class="large-12 columns padding-left-zero">
		  								<label>Type <span>e.g. Bicycles, T-Shirts</span></label>
		  								<select id="new-products-product_types">
		  									<option value="new-product-type">Create a new product type</option>
		  								</select>
		  								
		  								<input type="text" id="new-products-add_product_type" style="display: none;" placeholder="New product type name">
		  								
		  							</div>
		  							<div class="large-12 columns padding-right-zero">
		  								<label>Vendor <span>e.g. Reebok, Puma</span></label>
		  								<select id="new-products-vendors">
		  									<option value="new-vendor">Create a new vendor</option>
		  								</select>
		  								<input type="text" id="new-products-add_vendor" style="display: none;" placeholder="New product vendor name">
		  							</div>
		  						</div>
		  						
		  					</div>        					
        				</div>
        				
        				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Inventory & variants</h1>
        							<p>Manage inventory, and configure the options for selling this product.</p>        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns new-variants-section su-single-view-white-wrapper">
		  						
		  						<div class="row" style="padding-top: 0px;">        					
	        						<div class="large-12 columns">
	        						
	        							<label>Price</label>
	        							<input type="text" id="new-products-variants-price">
	        						
	        						</div>
	        						<div class="large-12 columns">
	        						
	        							<label>Compare at price</label>
	        							<input type="text" id="new-products-variants-compare_at_price">
	        						
	        						</div>        						        					
	        					</div>
	        					
	        					<div class="row" style="padding-top: 0px;">        					
	        						<div class="large-12 columns">
	        						
	        							<label>SKU<span>(Stock Keeping Unit)</span></label>
	        							<input type="text" id="new-products-variants-sku">
	        						
	        						</div>
	        						<div class="large-12 columns">
	        						
	        							<label>Barcode<span>e.g. UPC, ISBN</span></label>
	        							<input type="text" id="new-products-variants-barcode">
	        						
	        						</div>        						        					
	        					</div>
	        					
	        					<div class="row" style="padding: 0px;">        					
	        						<div class="large-24 columns">        						
	        							
	        							<input type="checkbox" id="new-products-variants-taxable">
	        							<label>Charge taxes on this product</label>
	        						
	        						</div>        						        						        					
	        					</div>
	        					
	        					<div class="row inner-row">        					
	        						<div class="large-24 columns">      						
	        							
	        							<input type="checkbox" id="new-products-variants-requires_shipping">
	        							<label>Require a shipping address<span>(not needed for services or digital goods)</span></label>
	        						
	        						</div>        						        						        					
	        					</div>
	        					
	        					<div class="row inner-row">
	        						<div class="large-12 columns">
	        						
	        							<label>Weight<span>(kg)</span></label>
	        							<input type="text" id="new-products-variants-grams" >
	        						
	        						</div>        						
	        					</div> 
	        					
	        					<div class="row">
	        						<div class="large-12 columns">
	        						
	        							<label>Inventory policy</label>
	        							<select id="new-products-variants-inventory_management">
	        								<option value="">Don't track inventory</option>
	        								<option value="shopify">Tracks this variant's inventory</option>
	        							</select>
	        						
	        						</div>        						
	        					</div> 
		  						
		  					</div>        					
        				</div>
        				
        				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Images</h1>
        							<p>Upload images of this product.</p>        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">		  						
		  						
		  						<div class="row">
		  							<div class="large-24 columns padding-left-zero">
		  								<input type="file" id="new-products-image">
		  							</div>
		  						</div>
		  						
		  					</div>        					
        				</div>
        				
        				<div class="row inner-row">
        				
        					<div class="large-6 columns">
		  						<div class="collection-summary">
        							<h1>Tags</h1>
        							<p>Tags can be used to categorize products by properties like color, size, and material.</p>        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">	
        					
	        					<div class="selected-tags-ul-wrapper">
	        						<ul id="new-products-selected-tags-ul" class="selected-tags-ul">
	        							<li class="tagit-new">        								
	        								<input type="text" class="new-tags-text">
	        							</li>
	        						</ul>
	        					</div>
	        					
	        					<div class="all-tags-ul-wrapper">
	        					
	        						<ul class="products-all-tags-ul" id="new-products-all-tags-ul"></ul>
	        					
	        					</div>
        					
        					</div>
        					
        				</div>
        				
        				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Search Engines</h1>
        							<p>Set up the page title, meta description and handle. These help define how this collection shows up on search engines.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<label>Page title<span>( 13 of 70 characters used )</span></label>
        						<input type="text" id="new-products-page-title">
        						
        						<label>Meta description<span>0 of 160 characters used</span></label>
        						<input type="text" id="new-products-meta-description">
        					
        						<label>URL & Handle<span>( better to leave as it is )</span></label>
        						<input type="text" id="new-products-handle">
        						
        					</div>
        					
        				</div>	
        				
        				<div class="row inner-row">
		  					<div class="large-6 columns">
		  						<div class="collection-summary">
		  						
        							<h1>Visibility</h1>
        							<p>Control if this collection can be viewed on your storefront.</p>
        							
        						</div>
        					</div>
        					
        					<div class="large-18 columns su-single-view-white-wrapper">
        					
        						<input type="radio" name="new-products-visible-state" value="true" checked><label class="feature-label">Visible<span></span></label>
        						<br/>
      							<input type="radio" name="new-products-visible-state" value="false" style="margin-bottom:0px;"><label class="feature-label">Hidden</label>
        						
        					</div>
        					
        				</div>
        				
		  			</div>
		  		</div>
		  		
		  		<div id="inventory" class="workarea">
		  			<div id="archive-inventory" class="archive-inventory workarea-child" style="display:block;">
		  				<div id="product-tab" class="su-tab-wrapper">
		  					<ul id="inventory-tab-ul" class="su-tab-ul">
		  						<li><a href="" class="selected">All Products</a></li>		  						
		  					</ul>
		  				</div>		  				
		  				<div class="su-tabcontent-wrapper" id="su-tabcontent-wrapper">
		  					
		  					<div class="su-filter-wrapper">
  								<div class="filter-contanier" style="margin-top:10px;">  
  									<div class="su-smart-popup-wrapper">  								
      									
      									<a class="product-filter-btn su-dropdown-btn"><i class="fi-filter"></i> Filter products</a>
      								
      									<div class="su-smart-popup su-product-filter-popup">
      											
      										<label>Show all variants where:</label>
      																				
											<select class="su-product-filter-select" id="inventory-product-filter-main-select">
												<option value="none">Select a filter...</option>
												<option value="published_status">Visibility</option>
												<option value="product_type">Product type</option>
												<option value="vendor">Product vendor</option>
											</select>
											
											<span class="product-filter-is-span">is</span>
											
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="inventory-product-filter-published_status-select">
												<option value="none">Select a value...</option>
												<option value="published">Visibile</option>
											  	<option value="unpublished">Hidden</option>
											</select>
											  		
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="inventory-product-filter-product_type-select">
												<option value="none">Select a value...</option>											  			
											</select>
											  	
											<select class="su-product-filter-select product-filter-select" style="display: none;" id="inventory-product-filter-vendor-select">
												<option value="none">Select a value...</option>											  			
											</select>
											
											<a class="button secondary tiny do-filter-btn">Add filter</a>
											
										</div>
      								
      								</div>
      								
      								<div class="filter-search-container">      
								        <input type="text" class="filter-search-input" data-bind-placeholder="textInputPlaceholder" data-bind="paginator.searchQueryText" placeholder="Start typing a product's name..." disabled>      
    								</div>
      								
		  						</div>		  						
		  					</div>
		  					
		  					<div id="inventory-table-container" class="su-tabcontent">
		  					
		  					<!-- place holder of product table -->
		  						
		  					</div>	
		  					
		  				</div>
		  			</div>
		  		</div>
		  		
	  		</div>
	  	</div>	  	  
	</div>
	
	<div id="su-change-password-popup" class="reveal-modal tiny" data-reveal>
  		<div>
  			<div id="su-credential-update-error" class="login-error" style="display:none;"><p></p></div>
  			<h5>Update Your Password</h5>
  			<div class="row">
  				<label>Current Password</label>
  				<input type="password" id="su-change-password-current-pass">
  				<label>New Password</label>
  				<input type="password" id="su-change-password-new-pass">
  				<label>Confirm Password</label>
  				<input type="password" id="su-change-password-confirm-pass">
  				<a class="button secondary tiny" id="su-password-update-btn">Update</a>
  			</div>
  		</div>
	</div>
	
	<div id="su-copyright-popup" class="reveal-modal tiny" data-reveal>
		<div class="su-box-header p">
        	<h3>SwPanel V1.0</h3>          
        </div>
		<div class="su-copyright-panel">
			<img src="client/images/sarkware.jpg" alt="Sarkware" />
			<h4>Visit here</h4>
			<p>Visit <a href="http://sarkware.com/swpanel-a-customized-shopify-admin-panel/" target="_blank" title="Sarkware">here</a> to know how this Application built.</p>
			<h4>Install it on your own Store</h4>
			<p>You can play around with this application by installing it on your own Store, Use the below url to install</p>
			<div data-alert="" class="alert-box secondary">
			  	https://{{ your shop }}.myshopify.com/admin/oauth/authorize?client_id=f3af12563f672c64e53b1cca27a2279c&redirect_uri=http://sarkutils.in/swpanel/docker.php&scope=read_themes,write_themes,read_products,write_products,read_customers,write_customers,read_orders,write_orders		  
			</div>
		</div>
		<div class="su-copyright-container">
			Developed by <a href="http://iamsark.com" title="Saravana Kumar K Profile" target="_blank" rel="bookmark" class="logout">Saravana Kumar K</a>
			&#169; <?php echo date("Y"); ?> <a href="http://sarkware.com" title="Sarkware" target="_blank" rel="bookmark" class="logout">SARKWARE</a> All rights reserved
		</div>
	</div>	
	
	<div id="su-global-notification"></div>	
	
  	<script type="text/javascript" src="client/scripts/swpanel.js"></script>
</body>

</html>