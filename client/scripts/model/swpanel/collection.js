/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @copyrights	: SARKWARE
 * @purpose 	: A Collection is a grouping of products that a shop owner can create to make their shops easier to browse.
 * 			  A shop owner creates a custom collection and then selects the products that will go into it.
 */
var collections = function( pObj ) {
	/* holds the reference for swPanelObj */
	this.swPanel = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* sub archive object ( it will be products ) */
	this.SubArchive = null;
	/* swGrid object for listing sub archives */
	this.SubEGrid = null;
	/* smart drop down object */
	this.SmartDrop = null;
	/**/
	this.Base64Img = "";
	
	/* event listener for collection title & body_html */
	$(document).off("keyup", "#new-collections-title");
	$(document).off("keyup", "#new-collections-body_html");
	$(document).off("change", ".custom-file-input");
	$(document).off("click", "div#single-collections-products-table-container .row-remove-btn");
		
	$(document).on("keyup", "#new-collections-title", this, function(e){
		$("#new-collections-page-title").val( $(this).val() );
		$("#new-collections-handle").val( e.data.swPanel.SanitizeStr($(this).val() ));
	});
	
	$(document).on("keyup", ".jqte_editor", function(){
		var des = $("#new-collections").find(".jqte_editor").html();				
		 $( "#new-collections-seo-meta-description" ).val( $("#new-collections").find(".jqte_editor").text() );		
	});
	
	$(document).on("change", ".custom-file-input", this, function(e){		
		e.data.swPanel.GetBase64Image( e.target );
	});
	
	$(document).on("click", "div#single-collections-products-table-container .row-remove-btn", this, function(e){		
		e.data.DropRowDeSelected( $(this).attr("data.record") );
		e.preventDefault();
	});
	
	/* actions that happens only in single view */
	this.DoAction = function( op, targetObj ) {
		if( op == "SHOW_PRODUCT" ) {
			if( this.SmartDrop == null ) {
				this.SmartDrop = new swDropDown( this, { dropdown : $("#single-collections-products-dropdown-popup"), archive : "products", object_label : "products", target : targetObj } );
				this.SmartDrop.ShowDropDown();
			}else {
				this.SmartDrop.ShowDropDown();
			}
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
	
	/* New collection */
	this.DoNew = function() {
		var context = this.swPanel.Context,
		view = this.swPanel.ViewMode;
		
		$("#"+ view +"-"+ context +"-body_html").html( "" );
		$("#"+ view +"-"+ context +"-title").val("");
		$("#"+ view +"-"+ context +"-page-title").val("");
		$("#"+ view +"-"+ context +"-handle").val("");
		
		$("#"+ view +"-"+ context +"-feature-preview").attr("src", "client/images/no-image.jpg" );		
		 
		$("input[name='"+ view +"-"+ context +"-visible-state'][value=true]").prop( 'checked', true );		 
	};
	
	/* Add collection */
	this.DoCreate = function() {
		if( this.DoValidate() ) {
			/* prepare request object */
			this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "MAIN", "", "", 0, this.DoFetch() );					
			/* send to server for further process */
			this.swPanel.Dock( "new", this.swPanel, null );
		}
	};
	
	/* for collection title field alone mandatory */
	this.DoValidate = function() {
		var context = this.swPanel.Context,
		view = this.swPanel.ViewMode;		

		if( $("#"+ view +"-"+ context +"-title").val() == "" || $("#"+ view +"-"+ context +"-title").val() == null || $("#"+ view +"-"+ context +"-title").val() == undefined ) {
			$("#"+ view +"-"+ context +"-title").css("background-color", "#D2B48C");
			return false;
		}
		
		return true;
	};
	
	this.DoFetch = function() {
		var context = this.swPanel.Context,
		view = this.swPanel.ViewMode,		
		payload = {};
		
		payload[ "title" ] = $("#"+ view +"-"+ context +"-title").val();
		payload[ "body_html" ] = $("#"+ view +"-"+ context +"-body_html").html();	
		
		payload[ "handle" ] = $("#"+ view +"-"+ context +"-handle").val();	
		
		payload[ "published" ] = $("input[name='"+ view +"-"+ context +"-visible-state']:checked").val();
		
		/* needed for PUT method */
		if( view == "single" ) {
			payload[ "collection_id" ] = this.swPanel.Record;
			if( this.Base64Img != "" ) {
				payload[ "image" ] = this.Base64Img;
			}
		}else {
			payload[ "image" ] = this.Base64Img;
		}
		
		return payload;
	};
	
	this.DoUpdate = function() {
		if( this.DoValidate() ) {
			/* prepare request object */
			this.swPanel.Request = this.swPanel.GetRequestObject( "PUT", this.swPanel.Context, "", "", "", 0, this.DoFetch() );					
			/* send to server for further process */
			this.swPanel.Dock( "single", this.swPanel );
		}
	};
	
	/* Delete collection */
	this.DoDelete = function() {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "MAIN", "", "", 0, { collection_id : this.swPanel.Record, collection_title : this.ActiveRecord.title } );					
		/* send to server for further process */
		this.swPanel.Dock( "delete-main", this.swPanel );
	};
		
	/* Add a product to this collection */
	this.DropRowSelected = function( pid ) {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "POST", this.swPanel.Context, "SUB", "", "", 0, { product_id : pid, collection_id : this.swPanel.Record } );					
		/* send to server for further process */
		this.swPanel.Dock( "add-sub", this.swPanel );
	};
		
	/* Delete a product from this collection */
	this.DropRowDeSelected = function( pid ) {
		/* prepare request object */
		this.swPanel.Request = this.swPanel.GetRequestObject( "DELETE", this.swPanel.Context, "SUB", "", "", 0, { product_id : pid, collection_id : this.swPanel.Record } );					
		/* send to server for further process */
		this.swPanel.Dock( "delete-sub", this.swPanel );
	};	
	
	/* Init single view for the selected collection */
	this.DoSingle = function( namespace ) {
		       
		if( this.ActiveRecord.image ) {
			
			var original_url = this.ActiveRecord.image.src,
			lIndex = original_url.lastIndexOf("/");
			base_url = original_url.substr(0, lIndex + 1),			
			fname = original_url.substr( lIndex + 1 ),
			final_name = fname.split(".")[0] +"_compact."+ fname.split(".")[1],			
			resulted_url = base_url + final_name;			
			
			$( namespace + "feature-images" ).attr("src", resulted_url );
		}else {
			$( namespace + "feature-images" ).attr("src", "client/images/no-image.jpg" );
		}
		
		/* reset image string */
		this.Base64Img = "";
		 
		 $( namespace + "title" ).val( this.ActiveRecord.title );
		 
		 $("#single-collections-body_html").html( this.ActiveRecord.body_html );
		
		 $( namespace + "seo-title" ).val( this.ActiveRecord.title );
		 
		 /* check if it really has any html elements inside */
		 if( this.ActiveRecord.body_html != null ) {
			 if( this.ActiveRecord.body_html.indexOf(">") != -1 && this.ActiveRecord.body_html.indexOf("<") != -1 ) {				
				 $( namespace + "seo-meta-description" ).val( $(this.ActiveRecord.body_html).text() );
			 }else {
				 $( namespace + "seo-meta-description" ).val( this.ActiveRecord.body_html );
			 }
		 }
		 
		 $( namespace + "handle" ).val( this.ActiveRecord.handle );
		 
		 if( this.ActiveRecord.published_at != null ) {			 
			 $("input[name='"+ namespace.substr(1) +"visible-state'][value='true']").prop('checked', true);			 
		 }else {
			 $("input[name='"+ namespace.substr(1) +"visible-state'][value='false']").prop('checked', true);
		 }
		 
		 $( namespace + "preview-link" ).attr( "href", shop_base + "/collections/" + this.ActiveRecord.handle );
		 
		 /* get */
		 this.DoSubArchive();
	};
	
	this.DoSubArchive = function() {
		var context = this.swPanel.Context,
        view = this.swPanel.ViewMode,
		sub_archive = SingleViewMeta[context].sub_archive.object; 
   
		this.swPanel.Request = this.swPanel.GetRequestObject( "GET", sub_archive, "QUERY", "collection_id", this.swPanel.Record, 1, {} );		
		this.swPanel.Dock( "sub-archive", this.swPanel, view +"-"+context + "-products-table-container" );
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
			this.SubEGrid.InitGrid( $("#" + view +"-"+ context + "-products-table-container") );		
		}else {
			this.SubArchive = null;			
			var tips = $('<div class="su-user-tip"><i class="fi-rewind"></i> Use the <strong>Add products</strong> button to add this product to a collection.</div>');
			
			$("#" + view +"-"+ context + "-products-table-container").html("");		
			$("#" + view +"-"+ context + "-products-table-container").append( tips );			
		}
		
		/* if smart drop down popup opened, then refresh it's current page */
		if( this.SmartDrop != null && this.SmartDrop.Visible ) {
			this.SmartDrop.RefreshDropView();
		}
	};
	
	/* will get called after POST & PUT actions (where you can alert user regarding last operation) */
	this.DoAlert = function() {		
	
	};	   
	
	this.ComboBoxLoaded = function() {
		
	};
	
	/* call back function ( usualy called after base64 conversion finished ) */
	this.ImageConverted = function() {
		if( this.swPanel.ViewMode == "single" ) {
		
		}
	};
};