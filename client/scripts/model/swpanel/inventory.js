/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @copyrights	: SARKWARE
 * @purpose 	: Handles all inventory related events
 */

var inventory = function( pObj ) {
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
	/* the records which comes from server ( products ) */
	this.SourceRecords = [];
	/* total record count */
	this.ServerRecordCount = null;
	/*  */
	this.CurrentServerPage = 1;
	/**/
	this.TotalServerPage = 0;
	/**/
	this.TotalLocalRows = 0;
	
	$(document).off( "click", "ul.inventory-action-box li");
	$(document).off( "keyup", "input.stock-count-input" );
	$(document).off( "change", "input.stock-count-input" );
	
	$(document).off( "change", "#inventory-product-filter-main-select" );
	
	/* make all save btn disabled */
	$("a.inventory-btn-save").addClass("disabled");
	$("input.stock-count-input").val(0);
	
	$(document).on( "click", "ul.inventory-action-box li", this, function(e){
		
		if( $(this).find("a").hasClass("op-btn") ) {
			$(this).parent().children().eq(0).find("a").removeClass().addClass("op-btn btn");
			$(this).parent().children().eq(1).find("a").removeClass().addClass("op-btn btn");
			
			$(this).find("a").removeClass().addClass("op-btn btn btn-active");
		} else if( $(this).find("a").hasClass( "inventory-btn-save" ) ) {
			
			if( !$(this).find("a").hasClass("disabled") ) {
				
				var vid = $(this).find("a").attr("data.record"),
				utype = "",
				quantity = 0;
				
				if( $(this).parent().children().eq(0).find("a").hasClass("btn-active") ) {
					utype = "add";
				}else {
					utype = "set";
				}
				
				quantity = $(this).prev().find("input").val();				
				e.data.DoUpdate( vid, utype, quantity );
			
			}		
			
		}
		
		e.preventDefault();
	});
	
	$(document).on( "keyup", "input.stock-count-input", this, function(e){
		if( $(this).val() > 0 ) {
			$(this).parent().next().find("a").removeClass().addClass("btn inventory-btn-save");
		}else {
			$(this).parent().next().find("a").removeClass().addClass("btn inventory-btn-save disabled");
		}
	});
	
	$(document).on( "change", "input.stock-count-input", this, function(e){
		if( $(this).val() > 0 ) {
			$(this).parent().next().find("a").removeClass().addClass("btn inventory-btn-save");
		}else {
			$(this).parent().next().find("a").removeClass().addClass("btn inventory-btn-save disabled");
		}
	});
	
	$(document).on( "change", "#inventory-product-filter-main-select", this, function(e){		
		$( ".product-filter-select" ).hide();
		$( ".product-filter-is-span" ).hide();
		
		if( $(this).val() != "none" ) {
			$( "#"+ e.data.swPanel.Context +"-product-filter-"+ $(this).val() +"-select" ).show();
			$( ".product-filter-is-span" ).show();
		}			
	});
		
	this.DoAction = function( op ) {
		
	};
	
	/* we will load product type & vendor combo boxs from this.swPanel.Prefetch */
	this.InitFilterComboBox = function() {
		
		$("#inventory-product-filter-product_type-select").html("");
		$("#inventory-product-filter-product_type-select").append( $('<option value="none">Select a value...</option>') );
		
		$("#inventory-product-filter-vendor-select").html("");
		$("#inventory-product-filter-vendor-select").append( $('<option value="none">Select a value...</option>') );
		
		if (this.swPanel.PreFetch["product_types"]) {
			for( var i = 0; i < this.swPanel.PreFetch["product_types"].length; i++ ) {
				$("#inventory-product-filter-product_type-select").append( $('<option value="'+ this.swPanel.PreFetch["product_types"][i].type +'">'+ this.swPanel.PreFetch["product_types"][i].type +'</option>') );
			}
		}
		
		if (this.swPanel.PreFetch["vendors"]) {
			for( var i = 0; i < this.swPanel.PreFetch["vendors"].length; i++ ) {
				$("#inventory-product-filter-vendor-select").append( $('<option value="'+ this.swPanel.PreFetch["vendors"][i].vendor +'">'+ this.swPanel.PreFetch["vendors"][i].vendor +'</option>') );
			}
		}
		
	};
	
	this.DoArchive = function() {		
			
		this.InitFilterComboBox();
		
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", "products", "LIST", "", "", 1, {} );
		this.swPanel.Dock( "archive", this.swPanel, this.swPanel.Context + "-table-container" );
				
	};
	
	/* called first time only */
	this.RenderArchive = function() {
		var gridMeta = ArchiveViewMeta[ this.swPanel.Context ];
		/* api gives max of 250 rows ( any records ) */
		this.TotalServerPage = this.swPanel.Response.COUNT / 250;		
		
		/* just a wild guess will be corrected in GetPages() */			
		gridMeta.data = this.PrepareInventoryRows();
		if( this.swPanel.Response.COUNT < 250 ) {
			gridMeta.count = gridMeta.data.length;
		}else {
			gridMeta.count = this.swPanel.Response.COUNT * 3;	
		}		

		if( gridMeta.data.length > 0 ) {
			this.swPanel.Grid = new swGrid( "swPanel", this, gridMeta );
			if( this.CurrentServerPage == Math.ceil( this.TotalServerPage ) ) {
				this.swPanel.Grid.TotalServerRecord = this.TotalLocalRows;
			}
			/* this should use top pagination button ( because it's a main archive ) */
			this.swPanel.Grid.PaginationBtnClass = "su-top-pagination";
			this.swPanel.Grid.InitGrid( $("#" + this.swPanel.Context + "-table-container") );	
		} else {
			$("#" + this.swPanel.Context + "-table-container").html("");
			
			var iTag = $("#main-nav li").find("a.selected").children(":first").clone();
			var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
			h2Tag.append(iTag);
			h2Tag.html( h2Tag.html() + "Looka like inventory is not managed by Shopify.!" );			
			
			$("#" + this.swPanel.Context + "-table-container").append( h2Tag );
		}	
	};
	
	this.PrepareInventoryRows = function() {
		var gridMeta = ArchiveViewMeta[ this.swPanel.Context ],		
		rows = this.swPanel.Response.DATA[ gridMeta.object ],
		iArray = [],
		vObj = {},
		policy = "",
		actionBox = "";	
		
		for( var i = 0; i < rows.length; i++ ) {
			
			for( var j = 0; j < rows[i].variants.length; j++ ) {				
				if( rows[i].variants[j].inventory_management == "shopify" ) {				
					vObj = {};
					
					if( rows[i].image ) {
						vObj["image"] = rows[i].image.src;
					}else {
						vObj["image"] = "";
					}
					
					vObj["id"] = rows[i].id;
					vObj["vid"] = rows[i].variants[j].id;					
					
					vObj["title"] = '<a href="#" class="single-link" data.record="'+ rows[i].id +'" data.context="products">'+ rows[i].title +'</a><div class="grid-variant-title">'+ rows[i].variants[j].title +'</div>';
					vObj["sku"] = rows[i].variants[j].sku;
					
					policy = "<p class=\"policy-p\"><strong>Auto</strong> track stock level enabled,<br/>";
					
					if( rows[i].variants[j].inventory_policy == "continue" ) {
						policy += "<strong>continue selling</strong> when sold out.";
					}else {
						policy += "<strong>stop selling</strong> when sold out.</p>";
					}
					
					vObj["inventory_policy"] = policy;
					vObj["stock"] = rows[i].variants[j].inventory_quantity;
					
					actionBox = '<ul class="inventory-action-box">';
					actionBox += '<li><a href="#" class="op-btn btn btn-active">add</a></li>';
					actionBox += '<li><a href="#" class="op-btn btn">set</a></li>';
					actionBox += '<li><input type="number" class="stock-count-input" value="0"/></li>';
					actionBox += '<li><a href="#" data.record="'+ rows[i].variants[j].id +'" class="btn inventory-btn-save disabled">save</a></li>';
					actionBox += '<ul>';
					
					vObj["inventory_action"] = actionBox;					
					iArray.push( vObj );
				}				
			}			
		}
		
		this.TotalLocalRows += iArray.length;
		/* notify grid object about true total server records */
		if( this.CurrentServerPage == Math.ceil( this.TotalServerPage ) && this.swPanel.Grid ) {
			this.swPanel.Grid.TotalServerRecord = this.TotalLocalRows;
		}

		return iArray;
	};
	
	/* context specific function for fetching additional pages from server */
	this.DoGetPages = function() {
		if( this.CurrentServerPage < this.TotalServerPage ) {
			this.swPanel.LastQueryObj.PAGE = ++(this.CurrentServerPage);							
			this.swPanel.Request = this.swPanel.LastQueryObj;
			this.swPanel.Dock( "archive-pages", this.swPanel, this.swPanel.Context + "-table-container" );
		}		
	};
	
	/* update inventory quantity */
	this.DoUpdate = function( vid, utype, quantity ) {
		
		var oldQuantity = 0;
		/* retrieve current stock count */
		var rows = this.swPanel.Grid.Rows;		
		for( var i = 0; i < rows.length; i++ ) {			
				
			if( vid == rows[i].vid ) {
				oldQuantity = rows[i].stock;
				break;
			}				
			
		}
		
		if( utype == "add" ) {
			quantity = parseInt( quantity ) + parseInt( oldQuantity );
		}
		
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", "products", "SUB", "INVENTORY", "", 0, { variant_id : vid, inventory_quantity : quantity } );					
		/* send to server for further process */
		this.swPanel.Dock( "inventory", this.swPanel, null );		
	};
	
	/* we are gonna update rows in the grid object and trigger to refresh it's current page */
	this.RefreshInventoryRows = function() {
		
		var id = this.swPanel.Response.DATA[ "variant" ].id;
		var quantity = this.swPanel.Response.DATA[ "variant" ].inventory_quantity
		
		for( var i = 0; i < this.swPanel.Grid.Rows.length; i++ ) {			
			
			if( id == this.swPanel.Grid.Rows[i].vid ) {
				
				this.swPanel.Grid.Rows[i].stock = quantity;
				break;
				
			}				
			
		}
		
		/* refresh the current page */
		this.swPanel.Grid.SetContent();
		
	};
	
	this.DoNew = function() {
		
	};
	
	this.DoCreate = function() {
		
	};
	
	this.DoDelete = function() {
		
	};
	
	this.DoSingle = function() {
		
	};
}