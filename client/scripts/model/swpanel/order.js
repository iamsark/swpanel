/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @purpose 	: An order is a customer's completed request to purchase one or more products from a shop. 
 * 			  Customer accounts store contact information for the customer
 */
var orders = function( pObj ){
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* swGrid object fro listing sub archives */
	this.SubEGrid = null;
	
	/* unregister & register event for order cancel */
	$(document).off( "click", "a.order-cancel-btn" );	
	$(document).on( "click", "a.order-cancel-btn", this, function(e){
		e.data.DoCancel();
	});	
	
	this.DoAction = function( op, target ) {
		if( op == "FULFILL" ) {
			this.DoFulFill();
		} else if( op == "MARK-PAY-RECEIVED" ) {
			this.DoMarkPaymentReceived();			
		} else if( op == "REFUND" ) {
			this.DoRefund();
		} else if( op == "CANCEL" ) {
			this.DoCancel();
		}
	};
	
	this.DoArchive = function() {		
								
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", this.swPanel.Context, "LIST", "", "", 1, {} );
		this.swPanel.Dock( "archive", this.swPanel, this.swPanel.Context + "-table-container" );
		
	};
	
	this.RenderArchive = function() {
		/* fix cross context archive error (some time two clicks needs to go to archive) */
		if(  !this.swPanel.Response.DATA[ ArchiveViewMeta[this.swPanel.Context].object ] ) {
			this.swPanel.LastViewMode = "archive";
			this.DoArchive();			
		}else {	
			if( this.swPanel.Response.STATUS && this.swPanel.Response.DATA != null ) {
				
				if( this.swPanel.Response.DATA[ ArchiveViewMeta[this.swPanel.Context].object ].length > 0 ) {			
					var gridMeta = ArchiveViewMeta[ this.swPanel.Context ];
					gridMeta.count = this.swPanel.Response.COUNT;
					gridMeta.data = this.swPanel.Response.DATA[ gridMeta.object ];
		
					this.swPanel.Grid = new swGrid( "swPanel", this, gridMeta );
					/* this should use top pagination button ( because it's a main archive ) */
					this.swPanel.Grid.PaginationBtnClass = "su-top-pagination";
					this.swPanel.Grid.InitGrid( $("#" + this.swPanel.Context + "-table-container") );			
				}else {
					$("#" + this.swPanel.Context + "-table-container").html("");
					
					var iTag = $("#main-nav li").find("a.selected").children(":first").clone();
					var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
					h2Tag.append(iTag);
					h2Tag.html( h2Tag.html() + "Couldn't find any " + this.swPanel.Context );			
					
					$("#" + this.swPanel.Context + "-table-container").append( h2Tag );
				}
			}
		}
	};
	
	this.DoSingle = function( namespace ) {      
        
        $( namespace + "subtotal_price").html( this.ActiveRecord.total_line_items_price );
        $( namespace + "shipping_price").html( this.ActiveRecord.shipping_lines.length > 0 ? this.ActiveRecord.shipping_lines[0].price : 0.00 );
        $( namespace + "tax_price").html( this.ActiveRecord.total_tax );      
        $( namespace + "discount_price").html( this.ActiveRecord.total_discounts );
        $( namespace + "total_price").html( this.ActiveRecord.total_price );
        $( namespace + "gateway").html( this.ActiveRecord.gateway );
        $( namespace + "financial_status").html( this.ActiveRecord.financial_status );
        $( namespace + "pending_amount").html( this.ActiveRecord.total_price );
        
        $( namespace + "shipping-name").html( this.ActiveRecord.shipping_address.name );
        //$( namespace + "shipping-company").html( this.ActiveRecord.shipping_address.company );
        $( namespace + "shipping-address1").html( this.ActiveRecord.shipping_address.address1 );
        $( namespace + "shipping-address2").html( this.ActiveRecord.shipping_address.address2 );
        $( namespace + "shipping-city").html( this.ActiveRecord.shipping_address.city );
        $( namespace + "shipping-province_code").html( this.ActiveRecord.shipping_address.province_code );
        $( namespace + "shipping-zip").html( this.ActiveRecord.shipping_address.zip );
        $( namespace + "shipping-country").html( this.ActiveRecord.shipping_address.country );
        $( namespace + "shipping-phone").html( this.ActiveRecord.shipping_address.phone );
                
        $( namespace + "shipping-code").html( this.ActiveRecord.shipping_lines.length > 0 ? this.ActiveRecord.shipping_lines[0].code : "" );        
        $( namespace + "shipping-total_weight").html( this.ActiveRecord.total_weight );
        
        $( namespace + "billing-name").html( this.ActiveRecord.billing_address.name );
        //$( namespace + "billing-company").html( this.ActiveRecord.billing_address.company );
        $( namespace + "billing-address1").html( this.ActiveRecord.billing_address.address1 );
        $( namespace + "billing-address2").html( this.ActiveRecord.billing_address.address2 );
        $( namespace + "billing-city").html( this.ActiveRecord.billing_address.city );
        $( namespace + "billing-province_code").html( this.ActiveRecord.billing_address.province_code );
        $( namespace + "billing-zip").html( this.ActiveRecord.billing_address.zip );
        $( namespace + "billing-country").html( this.ActiveRecord.billing_address.country );
        $( namespace + "billing-phone").html( this.ActiveRecord.billing_address.phone );
        $( namespace + "billing-email").html( this.ActiveRecord.email );       
        
        $( namespace + "customer-profile-link").attr("data.record", this.ActiveRecord.customer.id);
        
        
        /* Update action bar areas ( payment, fullful ... ) */
        if( this.ActiveRecord.fulfillment_status == null ) {        	
        	$("#single-orders-fulfilled-btn").hide();
        	$("#single-orders-fulfill-items-btn").show();  
        	$("#single-orders-fulfill-items-btn").removeClass("disabled");        	
        }else {        	
        	$("#single-orders-fulfilled-btn").show();
        	$("#single-orders-fulfill-items-btn").hide();    
        	
        	$( namespace + "line_items-table-container").addClass("fullfiled-table");
        }
        
        /*  */
        if( this.ActiveRecord.financial_status == "pending" ) {        	
        	$("#single-orders-pay-received-btn").hide();
        	$("#single-orders-refund-btn").hide();
        	$("#single-orders-mark-as-pay-received-btn").show();    
        	$("#single-orders-mark-as-pay-received-btn").removeClass("disabled");
        }else {
        	$("#single-orders-pay-received-btn").show();        	
        	//$("#single-orders-refund-btn").show();
        	$("#single-orders-mark-as-pay-received-btn").hide();
        }  
        
        /* if it not null then the order has been cancelled */
        if( this.ActiveRecord.cancel_reason != null ) {
        	$(".su-order-actions a").removeClass("disabled").addClass("disabled");
        	
        	$( "#order-warning-notice" ).show();
        	$( "#order-cancelled-date" ).html( this.ActiveRecord.cancelled_at );
        }
        
        this.DoSubArchive( namespace );
	};
	
	/* used to render sub archive list in single view ( here it will be used to list products for currently selected order ) */
	this.DoSubArchive = function( ns ) {
		
		var rows = this.ActiveRecord.line_items;
		var data_rows = new Array();
		
		for( var i = 0; i < rows.length; i++ ) {
			data_rows.push( 
					{ 
						id : rows[i].product_id,
						title : rows[i].title,
						sub_total : '<span class="order-item-count">'+ rows[i].quantity +' * </span> '+ rows[i].price,
						total : ( parseInt( rows[i].quantity ) * parseInt( rows[i].price ) ).toFixed(2)
					}					
			);
		}
		
		var gridMeta = SingleViewMeta[ this.swPanel.Context ].sub_archive;
		gridMeta.data = data_rows;

		this.SubEGrid = new swGrid( "context", this, gridMeta );
		/* this should use bottom pagination button */
		this.SubEGrid.PaginationBtnClass = "su-bottom-pagination";
		this.SubEGrid.InitGrid( $( ns + "line_items-table-container") );		
		
	}	
	
	this.DoFulFill = function() {
		
		var fulfill = { fulfillment : "" };		
		fulfill.fulfillment = { tracking_number : null, line_items : [] };
		
		for( var i = 0; i < this.ActiveRecord.line_items.length; i++ ) {
			fulfill.fulfillment.line_items.push( { id : this.ActiveRecord.line_items[i].id } );
		}
		
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "FULFILL", "", "", 0, { order_id : this.ActiveRecord.id, order : fulfill } );					
		/* send to server for further process */
		this.swPanel.Dock( "refresh", this.swPanel );
	};
	
	this.DoMarkPaymentReceived = function() {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "MARK_AS_PAYMENT", "", "", 0, { order_id : this.ActiveRecord.id } );					
		/* send to server for further process */
		this.swPanel.Dock( "refresh", this.swPanel );
	};
	
	this.DoRefund = function() {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "REFUND", "", "", 0, { order_id : this.ActiveRecord.id } );					
		/* send to server for further process */
		this.swPanel.Dock( "refresh", this.swPanel );
	};
	
	this.DoCancel = function() {
		if( this.ActiveRecord.cancel_reason == null ) {
			/* prepare request object */
			this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "CANCEL", "", "", 0, { order_id : this.ActiveRecord.id } );					
			/* send to server for further process */
			this.swPanel.Dock( "delete", this.swPanel );
		}
	};
	
	this.DoNew = function() {
		
	};
	
	this.DoCreate = function() {
		
	};
	
	this.DoDelete = function() {
		
	};	
	
	this.DoAlert = function() {
			
	};
};