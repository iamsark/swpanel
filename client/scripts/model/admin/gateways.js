var gateways = function( pObj ) {
	/* holds the reference for iireAdmin object */
	this.eAdmin = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* sub archive object ( it will be products ) */
	this.SubArchive = null;
	/* eGrid object for listing sub archives */
	this.SubEGrid = null;
	/* place holder for functions, which likely be executed in future ( most often after getting user confirmation ) */
	this.PendingAction = null;
	
	this.RegisterAction = function() {
		$(document).off( "click", "a.add-meta-btn" );
		$(document).off( "click", "a.row-remove-btn" );
		$(document).off( "keyup", "input#single-gateways-meta-meta-name" );		
		
		$(document).on( "click", "a.add-meta-btn", this, function(e){
			e.data.DoCreateMeta();
		});
		
		$(document).on( "click", "a.row-remove-btn", this, function(e){
			/* assign a function which will be called after user confirmation */
			var metaID = $(this).attr("data.record");
			e.data.PendingAction = function() {	
				this.DoRemoveMeta( metaID );
			} 
			e.data.eAdmin.AreYouSure("Caution", "Never do this, if the gateway is already in use. You will end up with broken payment gateway.!", e.data);	     
		});
		
		$(document).on( "keyup", "input#single-gateways-meta-meta-name", this, function(e){			
			$("input#single-gateways-meta-meta-key").val( e.data.eAdmin.SanitizeStr($(this).val() ));
		});		
	};
	
	this.TabHandler = function( query, value ) {
		/* load meta data */
		if( value == "settings" ) {
			this.DoMetaArchive();
		}
	};
	
	this.ExtraRequest = function( op_type ) {
		if( op_type == "gateway-meta-list" ) {
			this.RenderMetaList();
		}else if( op_type == "gateway-meta-new" ) {
			this.ResetMetaNewView();
		}
	};
	
	this.RenderArchive = function() {
		var gridMeta = eAdminMeta[ this.eAdmin.Context ].archive;
		gridMeta.data = this.eAdmin.Response.DATA;

		this.eAdmin.Grid = new swGrid( "eadmin", this, gridMeta );
		this.eAdmin.Grid.InitGrid( $( "#" + this.eAdmin.Context + "-table-container" ) );
	};
	
	this.RenderSingleView = function() {		
		/* initialize combo boxs */		
		this.eAdmin.InitComboBox();
	};
	
	this.DoSubArchive = function() {
		/* subarchive applicable only for single view not for 'new' nor 'archive' */
		if( this.eAdmin.ViewMode == "single" ) {
			/* use eAdmin DoSubArchive instead ( no special case involved ) */
			this.eAdmin.DoSubArchive();
		}
	};
	
	this.RenderSubArchive = function() {
		/* make sure context specific tabs are resetted */
		var context = this.eAdmin.Context,
		view = this.eAdmin.ViewMode;
		$( "#"+ view +"-"+ context +"-tab" ).find("ul li:first-child").trigger("click");
	};	
	
	this.DoMetaArchive = function() {
		this.eAdmin.Request = this.eAdmin.GetRequestObject( "GET", "gateway-meta", "SINGLE", "gateway_id", this.eAdmin.Record, 0, {} );
		this.eAdmin.Dock( "gateway-meta-list", this.eAdmin, null );
	};
	
	this.RenderMetaList = function() {
		if( this.eAdmin.Response.STATUS && this.eAdmin.Response.DATA.length > 0 ) {
			
			var column = [];
			column.push( { key : "meta_name", label : "Meta Name", type : "TEXT" } );
			column.push( { key : "meta_key", label : "Meta Key", type : "TEXT" } );
			column.push( { key : "meta_type", label : "Meta Type", type : "TEXT" } );
			
			var gridMeta = {
					header : true,
		  			columns : column,
		  			data : this.eAdmin.Response.DATA,
		  			link : [],			 
		  			sno : true,			
		  			remove : true,
		  			edit : false,
		  			pagination : false,
		  			object : "gateway-meta",
		  			table_class : "iir-table"			        	  
	        };	
			
			this.SubEGrid = new swGrid( "context", this, gridMeta );			
			this.SubEGrid.InitGrid( $("#"+ this.eAdmin.Context +"-meta-table-container") );
			
		} else {
			$("#"+ this.eAdmin.Context +"-meta-table-container").html("");			
			var h2Tag = $('<h2 class="iire-empty-result-h2" style="margin-top: 80px;"></h2>');
			h2Tag.append($('<i class="fi-wrench"></i>'));
			h2Tag.html( h2Tag.html() +"Couldn't find any Meta Data");			
			
			$("#"+ this.eAdmin.Context +"-meta-table-container").append( h2Tag );	
		}
	}
	
	this.DoNew = function() {
		/* initialize combo boxs */
		this.eAdmin.InitComboBox();
	};
	
	this.DoCreate = function() {
		if( this.DoValidate() && this.eAdmin.DoValidate() ) {			
			/* prepare request object */
			this.eAdmin.Request = this.eAdmin.GetRequestObject( "POST", this.eAdmin.Context, "", "", "", 0, this.DoFetch() );					
			/* send to server for further process */
			this.eAdmin.Dock( "single", this.eAdmin, null );
		}
	};
	
	this.DoUpdate = function() {
		if( this.DoValidate() && this.eAdmin.DoValidate() ) {					
			/* prepare request object */
			this.eAdmin.Request = this.eAdmin.GetRequestObject( "PUT", this.eAdmin.Context, "", "", "", 0, this.DoFetch() );	
			/* since its an update operation add "id" key and value */
			this.eAdmin.Request.DATA["id"] = this.eAdmin.Record;	
			/* send to server for further process */
			this.eAdmin.Dock( "single", this.eAdmin );
		}
	};
	
	this.ResetMetaNewView = function() {		
		if( this.eAdmin.Response.STATUS ) {		
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode;
			
			$("#"+ view +"-"+ context +"-meta-meta-key").val("");
			$("#"+ view +"-"+ context +"-meta-meta-key").css("background-color", "#FFF");
			$("#"+ view +"-"+ context +"-meta-meta-name").val("");
			$("#"+ view +"-"+ context +"-meta-meta-name").css("background-color", "#FFF");
			$("#"+ view +"-"+ context +"-meta-meta-type").val("");
			$("#"+ view +"-"+ context +"-meta-meta-type").css("background-color", "#FFF");
			
			this.DoMetaArchive();
		} else {
			
		}
	};
	
	this.DoCreateMeta = function() {
		var context = this.eAdmin.Context,
		view = this.eAdmin.ViewMode;
		
		var meta_key = $("#"+ view +"-"+ context +"-meta-meta-key"),
		meta_name = $("#"+ view +"-"+ context +"-meta-meta-name"),
		meta_type =  $("#"+ view +"-"+ context +"-meta-meta-type");
				
		if( meta_name.val() == "" ||  meta_name.val() == " " || meta_name.val() ==null ) {
			meta_name.css("background-color", "#D2B48C");
			return;
		}
		
		if( meta_key.val() == "" ||  meta_key.val() == " " || meta_key.val() ==null ) {
			meta_key.css("background-color", "#D2B48C");
			return;
		}

		if( meta_type.val() == "" ||  meta_type.val() == " " || meta_type.val() ==null ) {
			meta_value.css("background-color", "#D2B48C");
			return;
		}
		
		var payload = {
				gateway_id : this.eAdmin.Record,
				meta_name : meta_name.val(),
				meta_key : meta_key.val(),
				meta_type : meta_type.val()
		};
		
		this.eAdmin.Request = this.eAdmin.GetRequestObject( "POST", "gateway-meta", "", "", "", 0, payload );
		this.eAdmin.Dock( "gateway-meta-new", this.eAdmin, null );
	};
	
	this.DoRemoveMeta = function( metaId ) {
		this.eAdmin.Request = this.eAdmin.GetRequestObject( "DELETE", "gateway-meta", "", "id", metaId, 0, {} );
		/* we are re using the "gateway-meta-new" op type here */
		this.eAdmin.Dock( "gateway-meta-new", this.eAdmin, null );
	};
	
	this.DoFetch = function() {
		return this.eAdmin.DoFetch();
	};
	
	this.DoValidate = function() {
		return true;
	};
	
	this.ComboBoxLoaded = function() {
		/* ok all combo boxs has been loaded, time to load subarchive (if any) */
		this.DoSubArchive();
	};	
	
	/**
	 * @purpose 	: call back function for user confirm box
	 * @res			: typically true or false ( ok or cancel )	 * 
	 */
	this.NotifyAlert = function( res ) {
		if( res ) {
			this.PendingAction();
		}		
	};
};