/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @copyrights	: SARKWARE
 * @purpose 	: Mange dashboard view
 */

var dashboard = function( pObj ) {
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
		
	this.DoArchive = function() {		
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", this.swPanel.Context, "LIST", "", "", 0, {} );
		this.swPanel.Dock( "archive", this.swPanel, "dashboard" );
	};
	
	this.RenderArchive = function() {
		
		if( this.swPanel.Response.STATUS && this.swPanel.Response.DATA != null ) {
			var dashboard = this.swPanel.Response.DATA;
			
			$("#dashboard-orders").html("");
			$("#dashboard-orders").append($('<span>'+ dashboard.order_count.count +'</span>'));
			$("#dashboard-orders").append($('<span><i class="fi-shopping-cart"></i> Order(s)</span>'));
			
			$("#dashboard-collections").html("");
			$("#dashboard-collections").append($('<span>'+ dashboard.collection_count.count +'</span>'));
			$("#dashboard-collections").append($('<span><i class="fi-page-multiple"></i> Collection(s)</span>'));
			
			$("#dashboard-products").html("");
			$("#dashboard-products").append($('<span>'+ dashboard.product_count.count +'</span>'));
			$("#dashboard-products").append($('<span><i class="fi-pricetag-multiple"></i> Product(s)</span>'));
			
			$("#dashboard-customers").html("");
			$("#dashboard-customers").append($('<span>'+ dashboard.customer_count.count +'</span>'));
			$("#dashboard-customers").append($('<span><i class="fi-torsos-all"></i> Customer(s)</span>'));
		}
		
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", "activity", "LIST", "", "", 0, {} );
		this.swPanel.Dock( "sub-archive", this.swPanel, null );
		
	};
	
	/* here sub archive will be the activity */
	this.RenderSubArchive = function() {
		var rows = JSON.parse( this.swPanel.Response.DATA ),
		activityOL = $("#activity-feed-ol"),
		activityLI = null,
		ldate = null,
		msg = null,
		context = null,
		status = null;
		
		activityOL.html("");
		
		for( var i = 0; i < rows.length; i++ ) {
			
			activityLI = $('<li></li>');
			context = rows[i].context;
			status = rows[i].status;
			msg = rows[i].message;			
			ldate = new Date( rows[i].time ).format();
			
			
			if( context == "authentication" ) {
				if( status ) {
					activityLI.append( $('<div class="timeline-ico"><i class="fi-torso"></i></div>') );
				} else {					
					activityLI.append( $('<div class="timeline-ico" style="background:#ED1C25"><i class="fi-torso"></i></div>') );
				}				
			}else if( context == "collection" ) {
				if( status ) {
					activityLI.append( $('<div class="timeline-ico"><i class="fi-page-multiple"></i></div>') );
				} else {
					activityLI.append( $('<div class="timeline-ico" style="background:#ED1C25"><i class="fi-page-multiple"></i></div>') );
				}				
			}else if( context == "product" ) {
				if( status ) {
					activityLI.append( $('<div class="timeline-ico"><i class="fi-pricetag-multiple"></i></div>') );
				} else {
					activityLI.append( $('<div class="timeline-ico" style="background:#ED1C25"><i class="fi-pricetag-multiple"></i></div>') );
				}				
			}else if( context == "order" ) {
				if( status ) {
					activityLI.append( $('<div class="timeline-ico"><i class="fi-shopping-cart"></i></div>') );
				} else {
					activityLI.append( $('<div class="timeline-ico" style="background:#ED1C25"><i class="fi-shopping-cart"></i></div>') );
				}				
			}else if( context == "install" ) {
				if( status ) {
					activityLI.append( $('<div class="timeline-ico"><i class="fi-download"></i></div>') );
				} else {
					activityLI.append( $('<div class="timeline-ico" style="background:#ED1C25"><i class="fi-download"></i></div>') );
				}				
			}
			
			content_str = '<div class="timeline-content">';
			content_str += '<p class="activity-message">';			
			content_str += '<span>'+ msg +'</span>';
			content_str += '</p>';
			content_str += '</div>';
			
			activityLI.append( $(content_str) );
			activityLI.append( $('<span class="timeline-datetime">'+ ldate +'</span>') );			
			
			activityOL.append(activityLI);					
		}		
	};
	
	this.DoNew = function() {
		
	};
	
	this.DoCreate = function() {
		
	};
	
	this.DoDelete = function() {
		
	};
	
	this.DoSingle = function() {
		
	};
};