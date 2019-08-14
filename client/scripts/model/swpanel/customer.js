/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @copyrights	: SARKWARE
 * @purpose 	: A customer resource instance represents a customer account with the shop. 
 * 			  Customer's store account contact information for the customer
 */
var customers = function( pObj ) {
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* swGrid object fro listing sub archives */
	this.SubEGrid = null;
	
	this.DoAction = function( op ) {
		
	};
	
	this.RenderFilterTab = function() {
		$("#customer-tab-ul").html("");
		$("#customer-tab-ul").append( $('<li data.query="all" data.value="all"><a href="#" class="selected">All Customers</a></li>') );
		
		for( var i = 0; i < this.swPanel.PreFetch["group_meta"].length; i++ ) {
			$("#customer-tab-ul").append( $('<li data.query="group" data.value="'+ this.swPanel.PreFetch["group_meta"][i].id +'"><a href="#">'+ this.swPanel.PreFetch["group_meta"][i].name +'</a></li>') );
		}
	};
	
	this.DoArchive = function() {
		/* render customer filter tab using this.swPanel.PreFetch */
		this.RenderFilterTab();
		
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
					
					/* there is no way for know total count of response for customer search 
					 * we are gonna assume the whatever server returned, thats all we have to show.
					 * this will work for first 250 result, since customer filter feature
					 * is not crucial one i am leaving with this limitation */
					if( this.swPanel.Request.TYPE == "QUERY" ) {
						gridMeta.count = this.swPanel.Response.DATA[ gridMeta.object ].length;	
					}else {
						gridMeta.count = this.swPanel.Response.COUNT;	
					}				
									
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
	
	this.DoNew = function() {
		
	};
	
	this.DoCreate = function() {
		
	};
	
	this.DoDelete = function() {
		
	};
	
	this.DoSingle = function( namespace ) {
		
        if( this.ActiveRecord.default_address ) {
        	$("#su-customer-address").show();
        	$("#su-customers-empty-address").hide();
        	
	        $( namespace + "address-name" ).html( this.ActiveRecord.default_address.name );
			//$( namespace + "address-company" ).html( this.ActiveRecord.default_address.company );
			$( namespace + "address-address1" ).html( this.ActiveRecord.default_address.address1 );
			$( namespace + "address-address2" ).html( this.ActiveRecord.default_address.address2 );
			$( namespace + "address-city" ).html( this.ActiveRecord.default_address.city );
			$( namespace + "address-province_code" ).html( this.ActiveRecord.default_address.province_code );
			$( namespace + "address-zip" ).html( this.ActiveRecord.default_address.zip );
			$( namespace + "address-country" ).html( this.ActiveRecord.default_address.country );
			$( namespace + "address-phone" ).html( this.ActiveRecord.default_address.phone );
			$( namespace + "address-email" ).html( this.ActiveRecord.email );
        }else {
        	$("#su-customer-address").hide();
        	$("#su-customers-empty-address").show();
        }
        
        var detailsUL = $( "#single-customers-customer-details" );
        detailsUL.html("");
        
        if( this.ActiveRecord.accepts_marketing ) {
        	detailsUL.append( $('<li><i class="fi-megaphone"></i> Accepts marketing</li>') );
        } else {
        	detailsUL.append( $('<li><i class="fi-megaphone"></i> Does\'t Accept marketing</li>') );
        }
        
        if( this.ActiveRecord.state == "enabled" ) {
        	detailsUL.append( $('<li><i class="fi-torso"></i> Has an account</li>') );
        	detailsUL.append( $('<li><i class="fi-dollar"></i> '+ this.ActiveRecord.total_spent +' from orders</li>') );
        }else if( this.ActiveRecord.state == "invited" ) {
        	detailsUL.append( $('<li><i class="fi-torso"></i> Account invite sent</li>') );
        }else if( this.ActiveRecord.state == "decline" ) {
        	detailsUL.append( $('<li><i class="fi-torso"></i> Has declined the invitation</li>') );
        }else {
        	detailsUL.append( $('<li><i class="fi-torso"></i> No account</li>') );
        }       
        this.DoSubArchive( namespace );
	};
	
	this.DoSubArchive = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;
		sub_archive = SingleViewMeta[context].sub_archive.object; 
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", sub_archive, "QUERY", "customer_id", this.swPanel.Record, 1, {} );
		this.swPanel.Dock( "sub-archive", this.swPanel, (view +"-"+context + "-orders-table-container") );
	};
	
	this.RenderSubArchive = function( ) {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,		
		object_label = SingleViewMeta[context].sub_archive.object; 
		
		if( this.swPanel.Response.STATUS && this.swPanel.Response.DATA != null && this.swPanel.Response.DATA[object_label].length > 0 ) {
			var gridMeta = SingleViewMeta[ this.swPanel.Context ].sub_archive;
			gridMeta.data = this.swPanel.Response.DATA[ object_label ];

			this.SubEGrid = new swGrid( "context", this, gridMeta );
			this.SubEGrid.PaginationBtnClass = "su-bottom-pagination";
			this.SubEGrid.InitGrid( $("#" + view +"-"+ context + "-orders-table-container") );
		}else {
			$("#" + view +"-"+ context + "-orders-table-container").html("");
			
			var iTag = $("#main-nav li[data='"+ object_label +"']").find("a").children(":first").clone();
			var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
			h2Tag.append(iTag);
			h2Tag.html( h2Tag.html() + "Couldn't find any " + object_label );			
			
			$("#" + view +"-"+ context + "-orders-table-container").append( h2Tag );			
		}
	};
};