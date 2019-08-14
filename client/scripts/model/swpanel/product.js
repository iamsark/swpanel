/**
 * @author  : Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @purpose : Simply put: if it's something for sale in a shop, it's a Product. 
 */
var products = function( pObj ) {
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* sub archive object ( it will be products ) */
	this.SubArchive = null;
	/* swGrid object fro listing sub archives */
	this.SubEGrid = null;
	/* smart drop down object */
	this.SmartDrop = null;
	/* converted base64 string of selected image */
	this.Base64Img = "";
	/* file name of the selected image */
	this.ImageFileName = "";
	/* comma separated tags of ActiveRecord  */
	this.Tags = null;
		
	/* Unregister action for variant actions */
	$(document).off( "click", "a.variant-cancel-btn" );
	$(document).off( "click", "a.variant-save-btn" );
	$(document).off( "click", "a.variant-save-close-btn" );
	$(document).off( "click", "a.remove-tags-btn" );
	$(document).off( "click", "a.add-variant-btn" );
	
	$(document).off( "keyup", "#new-products-title" );
	$(document).off( "keyup", "#product-search-box" );	
	
	$(document).off( "click", "a.add-tag-btn" );	
	$(document).off( "keyup", ".new-tags-text" );	
	$(document).off( "change", "#new-products-image" );
	$(document).off( "change", "#single-products-upload-image" );
	$(document).off( "click", "a.new-variant-btn" );
	$(document).off( "click", "a.product-image-delete" );
	
	$(document).off( "change", "#products-product-filter-main-select" );
	
	/* Unregister action for variants removing */
	$(document).off( "click", "div#single-products-collections-table-container .row-remove-btn" );
	$(document).off( "click", "div#single-products-variant-table-container .row-remove-btn" );
	$(document).off( "click", "div#single-products-variant-table-container .row-edit-btn" );	
	
	$(document).on("keyup", "#new-products-title", this, function(e){
		$("#new-products-page-title").val( $(this).val() );
		$("#new-products-handle").val( e.data.swPanel.SanitizeStr($(this).val() ));
	});
	
	$(document).on( "click", "a.new-variant-btn", this, function(e){
		e.data.DoNewVariant();	
		e.preventDefault();
	});
	
	$(document).on( "click", "a.add-variant-btn", this, function(e){
		e.data.DoCreateVariant();	
		e.preventDefault();
	});	
	
	$(document).on( "click", "a.variant-cancel-btn", this, function(e){
		$('.su-popup-model').foundation('reveal', 'close');	
		e.preventDefault();
	});
	
	$(document).on( "click", "a.variant-save-btn", this, function(e){
		e.data.UpdateVariant( false );
		e.preventDefault();
	});
	
	$(document).on( "click", "a.variant-save-close-btn", this, function(e){
		e.data.UpdateVariant( true );
		e.preventDefault();
	});
	
	$(document).on( "click", "a.remove-tags-btn", this, function(e){
		e.data.RemoveTag( $(this) );		
		e.preventDefault();
	});
	
	$(document).on("click", "div#single-products-collections-table-container .row-remove-btn", this, function(e){		
		e.data.DropRowDeSelected( $(this).attr("data.record") );
		e.preventDefault();
	});
	
	$(document).on("click", "div#single-products-variant-table-container .row-remove-btn", this, function(e){		
		e.data.DoDeleteVariant( $(this).attr("data.record") );
		e.preventDefault();
	});
	
	$(document).on("click", "div#single-products-variant-table-container .row-edit-btn", this, function(e){		
		e.data.SingleVariant( $(this).attr("data.record") );	
		e.preventDefault();
	});

	$(document).on( "click", "li.add-tag-btn", this, function(e){
		if( !$(this).find("span").hasClass( "inactive" ) ) {			
			e.data.AddTag( $(this) );
		}else {			
			e.data.RemoveTag( $(this) );
		}		
		e.preventDefault();
	});
	
	$(document).on( "keyup", ".new-tags-text", this, function(e){
		if(e.which == 13) {
			if( $(this).val() != "" && $(this).val() != " " ) {				
				e.data.AddTag( $(this) );
			}			
		}
	});
	
	$(document).on( "keyup", "#product-search-box", this, function(e){
		if(e.which == 13) {
			if( $(this).val() != "" && $(this).val() != " " ) {				 
				e.data.swPanel.Request = e.data.swPanel.GetRequestObject( "GET", "search", "LIST", "", "", 1, { search : $(this).val() } );
				e.data.swPanel.Dock( "search", e.data.swPanel, e.data.swPanel.Context + "-table-container" );
			}
		}
	});
	
	$(document).on("change", "#new-products-image", this, function(e){		
		e.data.swPanel.GetBase64Image( e.target );
		e.preventDefault();
	});
	
	$(document).on( "change", "#single-products-upload-image", this, function(e){
		var file = $(this)[0].files[0];
		if(file){
			e.data.ImageFileName = file.name;
		}else {
			e.data.ImageFileName = "";
		}
		 
		e.data.swPanel.GetBase64Image( e.target );
		e.preventDefault();
	});
	
	$(document).on( "change", "#products-product-filter-main-select", this, function(e){		
		$( ".product-filter-select" ).hide();
		$( ".product-filter-is-span" ).hide();
		
		if( $(this).val() != "none" ) {
			$( "#"+ e.data.swPanel.Context +"-product-filter-"+ $(this).val() +"-select" ).show();
			$( ".product-filter-is-span" ).show();
		}			
	});
	
	$(document).on( "click", "a.product-image-delete", this, function(e){
		e.data.RemoveImage( $(this).attr("data.record") );
		e.preventDefault();
	});
	
	/* used only for new vendor & product types */
	this.RegisterAction = function() {
		/* Unregister action for new vendor & new product type */
		$(document).off( "change", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-product_types" );
		$(document).off( "change", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-vendors" );	
		$(document).off( "keyup", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-add_product_type" );
		$(document).off( "keyup", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-add_vendor" );
		
		/* Register actions for new product type & vendor ( for both new and single view ) */
		$(document).on( "change", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-product_types", this, function(e){			
			if( $(this).val() == "new-product-type" ) {
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_product_type").show();
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_product_type").css({"background-color":"#FFF", "margin-top":"15px"});
			}else {
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_product_type").hide();
			}
		});
		
		$(document).on( "change", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-vendors", this, function(e){
			if( $(this).val() == "new-vendor" ) {
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_vendor").show();
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_vendor").css({"background-color":"#FFF", "margin-top":"15px"});
			}else {
				$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-add_vendor").hide();
			}
		});	
		
		$(document).on( "keyup", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-add_product_type", this, function(e){
			if(e.which == 13) {
				if( $(this).val() != "" && $(this).val() != " " ) {
					$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-product_types optgroup:last").before('<option value="'+ $(this).val() +'" selected="selected">'+ $(this).val() +'</option>');
					$(this).val("");
					$(this).hide();
				}else {
					$(this).css("background-color", "#D2B48C");
				}		
			}
		});
		
		$(document).on( "keyup", "#"+ this.swPanel.ViewMode +"-"+ this.swPanel.Context +"-add_vendor", this, function(e){
			if(e.which == 13) {
				if( $(this).val() != "" && $(this).val() != " " ) {				
					$("#"+ e.data.swPanel.ViewMode +"-"+ e.data.swPanel.Context +"-vendors optgroup:last").before('<option value="'+ $(this).val() +'" selected="selected">'+ $(this).val() +'</option>');
					$(this).val("");
					$(this).hide();
				}else {
					$(this).css("background-color", "#D2B48C");
				}				
			}
		});
	};
	
	this.DoAction = function( op, targetObj ) {
		if( op == "SHOW_COLLECTION" ) {
			if( this.SmartDrop == null ) {			
				this.SmartDrop = new swDropDown( this, { dropdown : $("#single-products-collections-dropdown-popup"), archive : "collections", object_label : "custom_collections", target : targetObj } );
				this.SmartDrop.ShowDropDown();
			}else {
				this.SmartDrop.ShowDropDown();
			}
		}
	};
	
	/* we will load product type & vendor combo boxs from this.swPanel.Prefetch */
	this.InitFilterComboBox = function() {
		
		$("#products-product-filter-product_type-select").html("");
		$("#products-product-filter-product_type-select").append( $('<option value="none">Select a value...</option>') );
		
		$("#products-product-filter-vendor-select").html("");
		$("#products-product-filter-vendor-select").append( $('<option value="none">Select a value...</option>') );
		if (this.swPanel.PreFetch["product_types"]) {
			for( var i = 0; i < this.swPanel.PreFetch["product_types"].length; i++ ) {
				$("#products-product-filter-product_type-select").append( $('<option value="'+ this.swPanel.PreFetch["product_types"][i].type +'">'+ this.swPanel.PreFetch["product_types"][i].type +'</option>') );
			}
		}		
		
		if (this.swPanel.PreFetch["vendors"]) {
			for( var i = 0; i < this.swPanel.PreFetch["vendors"].length; i++ ) {
				$("#products-product-filter-vendor-select").append( $('<option value="'+ this.swPanel.PreFetch["vendors"][i].vendor +'">'+ this.swPanel.PreFetch["vendors"][i].vendor +'</option>') );
			}
		}
		
	};
	
	this.DoArchive = function() {	
		
		this.InitFilterComboBox();
				
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
					gridMeta.data = this.PrepareProductRows( "archive" );
		
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
	
	/* prepare product rows for archive rendring ( used by both normal archive & search archive ) */
	this.PrepareProductRows = function( flaQ ) {
		var gridMeta = ArchiveViewMeta[ this.swPanel.Context ],		
		rows = (flaQ == "archive") ? this.swPanel.Response.DATA[ gridMeta.object ] : this.swPanel.Response.DATA,
		pArray = [],
		pObj = {},
		variant = "",
		inventory = 0;			
		
		for( var i = 0; i < rows.length; i++ ) {
			pObj = {}
			
			pObj["id"] = rows[i].id;
			pObj["title"] = rows[i].title;
			pObj["product_type"] = rows[i].product_type;
			pObj["vendor"] = rows[i].vendor;
			
			if( flaQ == "archive" ) {
				if( rows[i].image ) {
					pObj["image"] = rows[i].image.src;
				}else {
					pObj["image"] = "";
				}									
				
				inventory = 0;			
				for( var j = 0; j < rows[i].variants.length; j++ ) {		
					inventory += rows[i].variants[j].inventory_quantity;			
				}	
				
				variant = "<strong>"+ inventory +"</strong> in stock for <strong>"+ rows[i].variants.length +"</strong>";
				
				if( rows[i].variants.length > 1 ) {
					variant += " variants";
				}else {
					variant += " variant";
				}
			}else {
				pObj["image"] = rows[i].thumb;
				
				if( rows[i].variant > 1 ) {
					variant = "<strong>"+ rows[i].variant +"</strong> variants";
				}else {
					variant = "<strong>"+ rows[i].variant +"</strong> variant";
				}				
			}
			
			
			pObj["variants"] = variant;
			pArray.push( pObj );
		}
		
		return pArray;
	};
	
	this.RenderSearch = function() {
		if( this.swPanel.Response.STATUS && this.swPanel.Response.DATA != null ) {
			if( this.swPanel.Response.DATA.length > 0 ) {
				var gridMeta = ArchiveViewMeta[ this.swPanel.Context ];
				gridMeta.count = this.swPanel.Response.DATA.length;
				gridMeta.data = this.PrepareProductRows( "search" );
	
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
	};
	
	this.DoSingle = function( namespace ) {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;
		/* reset image string */
		this.Base64Img = "";
		 
		 $( namespace + "title" ).val( this.ActiveRecord.title );
		 
		if( this.swPanel.CheckForHTML( this.ActiveRecord.body_html ) ) {
			 $( namespace + "body_html" ).html( this.swPanel.UnescapeHTML( this.ActiveRecord.body_html ) );
			 $( namespace + "meta-description" ).val( $( this.ActiveRecord.body_html ).text() );
		}else {
			 $( namespace + "body_html" ).html( "<div>"+ this.ActiveRecord.body_html +"</div>" );
			 $( namespace + "meta-description" ).val( this.ActiveRecord.body_html );
		}		
		
		 $( namespace + "seo-title" ).val( this.ActiveRecord.title );		 
		 $( namespace + "handle" ).val( this.ActiveRecord.handle );
		 
		 if( this.ActiveRecord.published_at != null ) {			 
			 $("input[name='"+ namespace.substr(1) +"visible-state'][value='true']").prop('checked', true);			 
		 }else {
			 $("input[name='"+ namespace.substr(1) +"visible-state'][value='false']").prop('checked', true);
		 }
		 
		 var tags = this.ActiveRecord.tags.split(",");
		 var tagsUL = $( namespace +"selected-tags-ul" );
		 tagsUL.html("");
		 
		 for( var i = 0; i < tags.length; i++ ) {
			 tagsUL.append( $('<li class="tag-selected"><span>'+ tags[i] +'</span><a href="#" class="fi-x remove-tags-btn"></a></li>') );
		 }
		 
		 tagsUL.append( $('<li class="tagit-new"><input type="text" class="new-tags-text" id="new-tags-text" /></li>') );
		 
		 $( namespace + "preview-link" ).attr( "href", shop_base + "/products/" + this.ActiveRecord.handle );
		 
		 /* special case applocable only for new product type & vendor */
		 this.RegisterAction();
		 
		 this.RenderVariants( namespace );
	};
	
	this.RenderVariants = function( ns ) {
		
		var rows = this.ActiveRecord.variants,
		options = this.ActiveRecord.options,
		data_rows = new Array(),
		row = {};
		
		
		for( var i = 0; i < rows.length; i++ ) {
			
			row = {};
			
			if( rows[i].option1 != null ) {				
				row[ options[ 0 ].name ] = rows[i].option1;				
			} else if( rows[i].option2 != null ) {				
				row[ options[ 1 ].name ] = rows[i].option2;				
			} else if( rows[i].option3 != null ) {				
				row[ options[ 2 ].name ] = rows[i].option3;				
			}
			
			row[ "id" ] = rows[i].id;
			row[ "sku" ] = rows[i].sku;
			row[ "price" ] = rows[i].price;
			row[ "inventory_quantity" ] = rows[i].inventory_quantity;
			
			data_rows.push( row );
			
		}
		
		var column = []; 
			
		for( var i = 0; i < options.length; i++ ) {
			column.push( { key : options[ i ].name, label : options[ i ].name, type : "TEXT" } );
		}
		
		column.push( { key : "sku", label : "SKU", type : "TEXT" } );
		column.push( { key : "price", label : "Price", type : "TEXT" } );
		column.push( { key : "inventory_quantity", label : "Quantity", type : "TEXT" } );
		
		var gridMeta = {
				header : true,
	  			columns : column,
	  			data : data_rows,
	  			link : [],			 
	  			sno : false,			
	  			remove : true,
	  			edit : true,
	  			pagination : false,
	  			object : "custom_collections",
	  			table_class : "su-table variants-table"			        	  
        };		

		this.SubEGrid = new swGrid( "context", this, gridMeta );
		this.SubEGrid.PaginationBtnClass = "su-bottom-pagination";
		this.SubEGrid.InitGrid( $( ns + "variant-table-container") );
		
		/* if only one variants, then hide the remove btn */
		var tbl = $( ns + "variant-table-container" ).find("table");		
		if( tbl.find("tbody").children().length == 1 ) {
			tbl.find("tbody tr td:last-child").children().eq(1).hide();
		}
			
		/* start to load combo boxs */
		this.swPanel.InitComboBox();
	};
		
	this.DoSubArchive = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
		sub_archive = SingleViewMeta[context].sub_archive.object; 
   
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", "collections", "QUERY", "product_id", this.swPanel.Record, 0, {} );		
		this.swPanel.Dock( "sub-archive", this.swPanel, view +"-"+context + "-collections-table-container" );
	};
	
	this.RenderSubArchive = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,		
		object_label = SingleViewMeta[context].sub_archive.object; 
		
		if( this.swPanel.Response.STATUS && this.swPanel.Response.DATA != null && this.swPanel.Response.DATA[object_label].length > 0 ) {
			var gridMeta = SingleViewMeta[ this.swPanel.Context ].sub_archive;
			gridMeta.data = this.swPanel.Response.DATA[ object_label ];
			/* store sub archive data for later use. ( used in drop down popup ) */
			this.SubArchive = this.swPanel.Response.DATA[ object_label ];

			this.SubEGrid = new swGrid( "context", this, gridMeta );
			/* this should use bottom pagination button */
			this.SubEGrid.PaginationBtnClass = "su-bottom-pagination";
			this.SubEGrid.InitGrid( $("#" + view +"-"+ context + "-collections-table-container") );		
		}else {
			this.SubArchive = null;			
			var tips = $('<div class="su-user-tip"><i class="fi-rewind"></i> Use the <strong>Add to collections</strong> button to add this product to a collection.</div>');
			
			$("#" + view +"-"+ context + "-collections-table-container").html("");		
			$("#" + view +"-"+ context + "-collections-table-container").append( tips );			
		}				
		
		/* if smart drop down popup opened, then refresh it's current page */
		if( this.SmartDrop != null && this.SmartDrop.Visible ) {
			this.SmartDrop.RefreshDropView();
		}
	};
	
	this.LoadImages = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        src = null,
        liElem = null,        
        imageUL = $("#"+ view +"-"+ context +"-product-images");	
		
		imageUL.html("");
		
		if( this.ActiveRecord.image ) {
			
			for( var i = 0; i < this.ActiveRecord.images.length; i++ ) {
				
				var original_url = this.ActiveRecord.images[i].src,
				lIndex = original_url.lastIndexOf("/"),
				base_url = original_url.substr(0, lIndex + 1),			
				fname = original_url.substr( lIndex + 1 ),
				final_name = fname.split(".")[0] +"_compact."+ fname.split(".")[1],			
				resulted_url = base_url + final_name;
				
				liElem = $( '<li><span><img src="'+ resulted_url +'" /></span><a href="#" class="product-image-delete" data.record="'+ this.ActiveRecord.images[i].id +'"><i class="fi-trash"></a></li>' );
				imageUL.append( liElem );
				
			}		
			
		}else {
			imageUL.append( $('<li> This product does\'t have any have any image, please use "Add Images" button to add images. </li>') );
		}
		
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", "tags", "LIST", "", "", 0, {} );						
		this.swPanel.Dock( "tags", this.swPanel, null );
	};
	
	this.AddImage = function() {		
		var payload = {};
		payload["image"] = this.Base64Img;
		payload["filename"] = this.ImageFileName;
					
		var imgObj = this.GetPayloadObject( this.swPanel.Record, "", payload );			
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "SUB", "IMAGE", "", 0, imgObj );					
		/* send to server for further process */
		this.swPanel.Dock( "single", this.swPanel, null );
	};
	
	this.RemoveImage = function( iid ) {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "SUB", "IMAGE", "", 0, { product_id : this.swPanel.Record, subop_id : iid } );					
		/* send to server for further process */
		this.swPanel.Dock( "single", this.swPanel, null );
	};
	
	this.SingleVariant = function( vid ) {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;
        
		for( var i = 0; i < this.ActiveRecord.variants.length; i++ ) {
			if( this.ActiveRecord.variants[i].id == vid ) {
				
				/* hidden variable for tracking the variant id that is being edited */
				$( "#"+ view +"-"+ context +"-variants-id" ).val( vid );
				
				$( "#"+ view +"-"+ context +"-variants-title" ).val( this.ActiveRecord.variants[i].title );
				$( "#"+ view +"-"+ context +"-variants-price" ).val( this.ActiveRecord.variants[i].price );
				$( "#"+ view +"-"+ context +"-variants-compare_at_price" ).val( this.ActiveRecord.variants[i].compare_at_price );
				$( "#"+ view +"-"+ context +"-variants-grams" ).val( this.ActiveRecord.variants[i].grams );
				$( "#"+ view +"-"+ context +"-variants-sku" ).val( this.ActiveRecord.variants[i].sku );
				$( "#"+ view +"-"+ context +"-variants-barcode" ).val( this.ActiveRecord.variants[i].barcode );
				$( "#"+ view +"-"+ context +"-variants-inventory_quantity" ).val( this.ActiveRecord.variants[i].inventory_quantity );
				
				if( this.ActiveRecord.variants[i].requires_shipping ) {
					$( "#"+ view +"-"+ context +"-variants-inventory_quantity" ).prop('checked', true);
				}else {
					$( "#"+ view +"-"+ context +"-variants-inventory_quantity" ).prop('checked', false);
				}
				
				if( this.ActiveRecord.variants[i].taxable ) {
					$( "#"+ view +"-"+ context +"-variants-taxable" ).prop('checked', true);
				}else {
					$( "#"+ view +"-"+ context +"-variants-taxable" ).prop('checked', false);
				}
				
				if( this.ActiveRecord.variants[i].inventory_policy == "continue" ) {
					$( "#"+ view +"-"+ context +"-variants-inventory_policy" ).prop('checked', true);
				}else {
					$( "#"+ view +"-"+ context +"-variants-inventory_policy" ).prop('checked', false);
				}
				
				if( this.ActiveRecord.variants[i].inventory_management == "shopify" ) {
					$( "#"+ view +"-"+ context +"-variants-inventory_management option:nth-child(2)" ).attr('selected', 'selected');
				}				
			}
		}
		$('#single-products-variants-popup').foundation('reveal', 'open');
	};
	
	this.DoNewVariant = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;
		
		$( "#"+ view +"-"+ context +"-new-variants-title" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-price" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-compare_at_price" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-grams" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-sku" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-barcode" ).val( "" );
		$( "#"+ view +"-"+ context +"-new-variants-inventory_quantity" ).val( "" );
		
		$( "#"+ view +"-"+ context +"-new-variants-inventory_quantity" ).prop('checked', false);
		$( "#"+ view +"-"+ context +"-new-variants-taxable" ).prop('checked', false);
		$( "#"+ view +"-"+ context +"-new-variants-inventory_management option:nth-child(1)" ).attr('selected', 'selected');
		
		$('#single-products-new-variants-popup').foundation('reveal', 'open');
	};
	
	this.DoCreateVariant = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        payload = {},
        title = "",
        price = 0,
        cprice = 0,
        grams = 0,
        decimalExp = new RegExp(/^[1-9][\.\d]*(,\d+)?$/);
		
		title = $( "#"+ view +"-"+ context +"-new-variants-title" );
		if( title.val() == "" || title.val() == " " ) {
			title.css("background-color", "#D2B48C");
			return false;
		}		
		payload["title"] = title.val();
		
		price = $( "#"+ view +"-"+ context +"-new-variants-price" );
		if( !decimalExp.test( price.val() ) ) {
			price.css("background-color", "#D2B48C");
			return false;
		}
		payload["price"] = price.val();
		
		cprice = $( "#"+ view +"-"+ context +"-new-variants-compare_at_price" );
		if( !decimalExp.test( cprice.val() ) && cprice.val() != "" ) {
			cprice.css("background-color", "#D2B48C");
			return false;
		}
		payload["compare_at_price"] = cprice.val();
		
		grams = $( "#"+ view +"-"+ context +"-new-variants-grams" );
		if( !decimalExp.test( grams.val() ) && grams.val() != "" ) {
			grams.css("background-color", "#D2B48C");
			return false;
		}
		payload["grams"] = grams.val();
			
		payload["sku"] = $( "#"+ view +"-"+ context +"-new-variants-sku" ).val();
		payload["barcode"] = $( "#"+ view +"-"+ context +"-new-variants-barcode" ).val();
		payload["inventory_management"] = $( "#"+ view +"-"+ context +"-new-variants-inventory_management" ).val();
		
		if( $( "#"+ view +"-"+ context +"-new-variants-requires_shipping" ).is(':checked') ){
			payload["requires_shipping"] = true;
		}else {
			payload["requires_shipping"] = false;
		}
		
		if( $( "#"+ view +"-"+ context +"-new-variants-taxable" ).is(':checked') ){
			payload["taxable"] = true;
		}else {
			payload["taxable"] = false;
		}
		
		var variantObj = this.GetPayloadObject( this.swPanel.Record, "", payload );			
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "SUB", "VARIANT", "", 0, variantObj );					
		/* send to server for further process */
		this.swPanel.Dock( "single", this.swPanel, null );
		/* close popup */
		$('.su-popup-model').foundation('reveal', 'close');	
	};
	
	this.DoDeleteVariant = function( vid ) {		
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "SUB", "VARIANT", "", 0, { product_id : this.swPanel.Record, subop_id : vid } );					
		/* send to server for further process */
		this.swPanel.Dock( "single", this.swPanel, null );
	}
	
	this.UpdateVariant = function( flaQ ) {		
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        payload = {},
        title = "",
        price = 0,
        cprice = 0,
        grams = 0,
        quantity = 0,
        decimalExp = new RegExp(/^[1-9][\.\d]*(,\d+)?$/),
        integerExp = new RegExp(/^\d+$/);
		
		title = $( "#"+ view +"-"+ context +"-variants-title" );
		if( title.val() == "" || title.val() == " " ) {
			title.css("background-color", "#D2B48C");
			return false;
		}		
		payload["title"] = title.val();
		
		price = $( "#"+ view +"-"+ context +"-variants-price" );
		if( !decimalExp.test( price.val() ) && price.val() != "" ) {
			price.css("background-color", "#D2B48C");
			return false;
		}
		payload["price"] = price.val();
		
		cprice = $( "#"+ view +"-"+ context +"-variants-compare_at_price" );
		if( !decimalExp.test( cprice.val() ) && cprice.val() != "" ) {
			cprice.css("background-color", "#D2B48C");
			return false;
		}
		payload["compare_at_price"] = cprice.val();
		
		grams = $( "#"+ view +"-"+ context +"-variants-grams" );
		if( !decimalExp.test( grams.val() ) && grams.val() != "" ) {
			grams.css("background-color", "#D2B48C");
			return false;
		}
		payload["grams"] = grams.val();
		
		quantity = $( "#"+ view +"-"+ context +"-variants-inventory_quantity" );
		if( !integerExp.test( quantity.val() ) && quantity.val() != "" ) {
			quantity.css("background-color", "#D2B48C");
			return false;
		}
		payload["inventory_quantity"] = quantity.val();
		
		payload["sku"] = $( "#"+ view +"-"+ context +"-variants-sku" ).val();
		payload["barcode"] = $( "#"+ view +"-"+ context +"-variants-barcode" ).val();
		payload["inventory_management"] = $( "#"+ view +"-"+ context +"-variants-inventory_management" ).val();
		
		if( $( "#"+ view +"-"+ context +"-variants-requires_shipping" ).is(':checked') ){
			payload["requires_shipping"] = true;
		}else {
			payload["requires_shipping"] = false;
		}
		
		if( $( "#"+ view +"-"+ context +"-variants-taxable" ).is(':checked') ){
			payload["taxable"] = true;
		}else {
			payload["taxable"] = false;
		}
		
		if( $( "#"+ view +"-"+ context +"-variants-inventory_policy" ).is(':checked') ){
			payload["inventory_policy"] = "continue";
		}else {
			payload["inventory_policy"] = "deny";
		}
		
		var variantObj = this.GetPayloadObject( this.swPanel.Record, $( "#"+ view +"-"+ context +"-variants-id" ).val(), payload );			
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "SUB", "VARIANT", "", 0, variantObj );					
		/* send to server for further process */
		this.swPanel.Dock( "single", this.swPanel, null );
		/* close popup */
		$('.su-popup-model').foundation('reveal', 'close');
		
		if( flaQ ) {
			$('.su-popup-model').foundation('reveal', 'close');
		}
	}
		
	this.RenderTags = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        tags = this.getUniqueArray( this.Tags ),
        selectedTags = [],
        flaQ = false;
				
		$( "#"+ view +"-"+ context +"-selected-tags-ul li" ).each(function(){
			if( $(this).hasClass("tag-selected") ) {
				selectedTags.push( $(this).children().eq(0).html() );
			}
		});		
				
		var tagsUL = $( "#"+ view +"-"+ context +"-all-tags-ul" );
		tagsUL.html("");
		
		for( var i = 0; i < tags.length; i++ ) {
			flaQ = false;
			
			if( tags[i] != "" ) {						 
				 for( var j = 0; j < selectedTags.length; j++ ) {
						 
					 if( $.trim( selectedTags[j] ) == $.trim( tags[i] ) ) {
						 flaQ = true;
						 break;
					 }
				 }
					 
				 if( flaQ ) {
					 tagsUL.append( $('<li class="tag add-tag-btn"><span class="inactive">'+ tags[i] +'</span></li>') );
				 }else {
					 tagsUL.append( $('<li class="tag add-tag-btn"><span>'+ tags[i] +'</span></li>') );
				 }								
			}		
		}
		
		/* load sub archive ( probably collections ), no need for "new" */
		if( this.swPanel.ViewMode == "single" ) {
			this.DoSubArchive();
		}
	};
	
	this.AddTag = function( target ) {		
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;	
		
		if( target.hasClass("new-tags-text") ) {
			$("#"+ view +"-"+ context +"-selected-tags-ul li:last").before( $('<li class="tag-selected"><span>'+ target.val() +'</span><a href="#" class="fi-x remove-tags-btn"></a></li>') );
			target.val("");
		} else if( !target.find("span").hasClass( "inactive" ) ) {
			$("#"+ view +"-"+ context +"-selected-tags-ul li:last").before( $('<li class="tag-selected"><span>'+ target.find("span").html() +'</span><a href="#" class="fi-x remove-tags-btn"></a></li>') );
			target.find("span").removeClass();
		}
		
		this.RenderTags();
	};
	
	this.RemoveTag = function( target ) {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;	
		
		if( target.hasClass("remove-tags-btn") ) {
			target.parent().remove();
		}else {
			$("#"+ view +"-"+ context +"-selected-tags-ul li").each(function(){
				if( $.trim( $(this).find("span").html() ) == $.trim( target.find("span").html() ) ) {
					$(this).remove();
				}
			});
		}
		
		this.RenderTags();
	}
		
	this.DoNew = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode;
		
		$( "#"+ view +"-"+ context +"-title" ).val("");
		$( "#"+ view +"-"+ context +"-body_html" ).html("");		
		$( "#"+ view +"-"+ context +"-handle" ).val("");
		$( "#"+ view +"-"+ context +"-product_types option:first-child" ).attr( "selected", "selected" );
		$( "#"+ view +"-"+ context +"-vendors option:first-child" ).attr( "selected", "selected" );
		$("input[name='"+ view +"-"+ context +"-visible-state'][value=true]").prop( 'checked', true );
		
		$( "#"+ view +"-"+ context +"-image" ).val("");		
		
		$( "#"+ view +"-"+ context +"-variants-price" ).val("");
		$( "#"+ view +"-"+ context +"-variants-compare_at_price" ).val("");
		$( "#"+ view +"-"+ context +"-variants-sku" ).val("");
		$( "#"+ view +"-"+ context +"-variants-barcode" ).val("");		
		$( "#"+ view +"-"+ context +"-variants-grams" ).val("");
		
		$( "#"+ view +"-"+ context +"-variants-inventory_management" ).val("");
		
		$( "#"+ view +"-"+ context +"-variants-requires_shipping" ).prop( 'checked', false );
		$( "#"+ view +"-"+ context +"-variants-taxable" ).prop( 'checked', false );
		
		$("#new-products-selected-tags-ul").html( '<li class="tagit-new"><input type="text" class="new-tags-text"></li>' );	
		
		$( "#"+ view +"-"+ context +"-page-title" ).val("");
		$( "#"+ view +"-"+ context +"-meta-description" ).val("");
		
		/* special case applocable only for new product type & vendor */
		 this.RegisterAction();
	};
	
	this.DoCreate = function() {
		if( this.DoValidate() ) {			
			var productObj = this.GetPayloadObject( "", "", this.DoFetchProduct() );			
			/* prepare request object */
			this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "MAIN", "PRODUCT", "", 0, productObj );					
			/* send to server for further process */
			this.swPanel.Dock( "new", this.swPanel, null );
		}
	};
	
	/* validation for new product creation */
	this.DoValidate = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        title = "",
		ptype = "",
		vendor = "",
        price = 0,
        cprice = 0,
        grams = 0,
        decimalExp = new RegExp(/^[1-9][\.\d]*(,\d+)?$/);
    	
		title = $( "#"+ view +"-"+ context +"-title" );
		if( title.val() == "" || title.val() == " " ) {
			title.css("background-color", "#D2B48C");
			return false;
		}	
		
		ptype = $( "#"+ view +"-"+ context +"-product_types" );
		if( ptype.val() == "new-product-type" ) {
			ptype = $( "#"+ view +"-"+ context +"-add_product_type" );
			
			if( ptype.val() != "" && ptype.val() != " " ) {
				$("#"+ view +"-"+ context +"-product_types optgroup:last").before('<option value="'+ ptype.val() +'" selected="selected">'+ ptype.val() +'</option>');
				ptype.val("");
				ptype.hide();
			}else {
				ptype.css("background-color", "#D2B48C");
				return false;
			}	
			
		}
		
		vendor = $( "#"+ view +"-"+ context +"-vendors" );
		if( vendor.val() == "new-vendor" ) {
			vendor = $( "#"+ view +"-"+ context +"-add_vendor" );

			if( vendor.val() != "" && vendor.val() != " " ) {
				$("#"+ view +"-"+ context +"-vendors optgroup:last").before('<option value="'+ vendor.val() +'" selected="selected">'+ vendor.val() +'</option>');
				vendor.val("");
				vendor.hide();
			}else {
				vendor.css("background-color", "#D2B48C");
				return false;
			}
			
		}		
		
		/* following three validation only applicable at the time product creation not at product updation */
		if( view == "new" ) {
			price = $( "#"+ view +"-"+ context +"-variants-price" );
			if( !decimalExp.test( price.val() ) ) {
				price.css("background-color", "#D2B48C");
				return false;
			}	
			
			cprice = $( "#"+ view +"-"+ context +"-variants-compare_at_price" );
			if( !decimalExp.test( cprice.val() ) && cprice.val() != "" ) {
				cprice.css("background-color", "#D2B48C");
				return false;
			}		
			
			grams = $( "#"+ view +"-"+ context +"-variants-grams" );
			if( !decimalExp.test( grams.val() ) && grams.val() != "" ) {
				grams.css("background-color", "#D2B48C");
				return false;
			}
		}
		
		return true;
	};
	
	this.DoFetchProduct = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,		
		payload = {},
		variant = {};	
		
		payload["title"] = $( "#"+ view +"-"+ context +"-title" ).val();
		payload["body_html"] = $( "#"+ view +"-"+ context +"-body_html" ).html();
		payload["handle"] = $( "#"+ view +"-"+ context +"-handle" ).val();
				
		payload["product_type"] = $( "#"+ view +"-"+ context +"-product_types" ).val();
		payload["vendor"] = $( "#"+ view +"-"+ context +"-vendors" ).val();
		payload["published"] = $("input[name='"+ view +"-"+ context +"-visible-state']:checked").val();
		
		payload["tags"] = this.DoFetchTags();
		payload["image"] = this.Base64Img;
		
		variant["price"] = $( "#"+ view +"-"+ context +"-variants-price" ).val();
		variant["compare_at_price"] = $( "#"+ view +"-"+ context +"-variants-compare_at_price" ).val();
		variant["sku"] = $( "#"+ view +"-"+ context +"-variants-sku" ).val();
		variant["barcode"] = $( "#"+ view +"-"+ context +"-variants-barcode" ).val();		
		variant["grams"] = $( "#"+ view +"-"+ context +"-variants-grams" ).val();
		variant["inventory_management"] = $( "#"+ view +"-"+ context +"-variants-inventory_management" ).val();
		
		if( $( "#"+ view +"-"+ context +"-variants-requires_shipping" ).is(':checked') ){
			variant["requires_shipping"] = true;
		}else {
			variant["requires_shipping"] = false;
		}
		
		if( $( "#"+ view +"-"+ context +"-variants-taxable" ).is(':checked') ){
			variant["taxable"] = true;
		}else {
			variant["taxable"] = false;
		}
		
		payload["variant"] = variant;
		return payload;		
	};
	
	this.DoFetchTags = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
        selectedTags = [];
		
		$( "#"+ view +"-"+ context +"-selected-tags-ul li" ).each(function(){
			if( $(this).hasClass("tag-selected") ) {
				selectedTags.push( $(this).children().eq(0).html() );
			}
		});
		
		return selectedTags.join(",");
	};
	
	this.DoUpdate = function() {		
		if( this.DoValidate() ) {	
			var context = this.swPanel.Context,
	        view = this.swPanel.ViewMode,
			payload = {};			
			
			payload["title"] = $( "#"+ view +"-"+ context +"-title" ).val();
			payload["body_html"] = $( "#"+ view +"-"+ context +"-body_html" ).html();
			payload["handle"] = $( "#"+ view +"-"+ context +"-handle" ).val();
			payload["product_type"] = $( "#"+ view +"-"+ context +"-product_types" ).val();
			payload["vendor"] = $( "#"+ view +"-"+ context +"-vendors" ).val();
			payload["published"] = $("input[name='"+ view +"-"+ context +"-visible-state']:checked").val();
			
			payload["tags"] = this.DoFetchTags();
			
			var productObj = this.GetPayloadObject( this.swPanel.Record, "", payload );			
			/* prepare request object */
			this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "MAIN", "PRODUCT", "", 0, productObj );					
			/* send to server for further process */
			this.swPanel.Dock( "single", this.swPanel, null );			
		}
		
	};
	
	this.DoDelete = function() {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "MAIN", "PRODUCT", "", 0, { product_id : this.swPanel.Record, product_title : this.ActiveRecord.title } );					
		/* send to server for further process */
		this.swPanel.Dock( "delete-main", this.swPanel );
	};
	
	/* Add a collection to this product */
	this.DropRowSelected = function( cid ) {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "SUB", "COLLECTION", "", 0, { product_id : this.swPanel.Record, subop_id : cid } );					
		/* send to server for further process */
		this.swPanel.Dock( "add-sub", this.swPanel );
	};
		
	/* Delete a collection from this product */
	this.DropRowDeSelected = function( cid ) {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "SUB", "COLLECTION", "", 0, { product_id : this.swPanel.Record, subop_id : cid } );					
		/* send to server for further process */
		this.swPanel.Dock( "delete-sub", this.swPanel );
	};	
	
	/* since product has more sub operation & properties we need context specific object for payload */
	this.GetPayloadObject = function( pid, sid, pobj ) {
		return {
			product_id : pid,
			subop_id : sid,
			payload : pobj
		};
	};
	
	/* context specific function applicable only for 'product' */
	/* callback from swPanel object when all combo box loaded */
	this.ComboBoxLoaded = function() {	
		if( this.swPanel.ViewMode == "single" ) {
			/* load product images */		
			this.LoadImages();
		} else {
			/* if it is for "new" then no need for loading image */
			this.swPanel.Request = this.swPanel.GetRequestObject( "GET", "tags", "LIST", "", "", 0, {} );						
			this.swPanel.Dock( "tags", this.swPanel, null );
		}	
	};
	
	/* call back function ( usualy called after base64 conversion finished ) */
	this.ImageConverted = function() {
		if( this.swPanel.ViewMode == "single" ) {
			this.AddImage();
		}
	};
	
	this.getUniqueArray = function( arr ) {
		var uniqueNames = [];
		$.each( arr, function( i, el ){
		    if( $.inArray( el, uniqueNames ) === -1 ) uniqueNames.push( el );
		});
		return uniqueNames;
	}
	
};