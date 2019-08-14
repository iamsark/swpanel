var users = function( pObj ) {
	/* holds the reference for iireAdmin object */
	this.eAdmin = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* sub archive object ( it will be products ) */
	this.SubArchive = null;
	/* eGrid object for listing sub archives */
	this.SubEGrid = null;
	
	this.RegisterAction = function() {
		
	};
	
	this.TabHandler = function( query, value ) {
		
	};
	
	this.ExtraRequest = function() {
		
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
		
	};
	
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
	
	this.DoFetch = function() {
		return this.eAdmin.DoFetch();
	};
	
	this.DoValidate = function() {
		/* nothing to validate (generic validation is enough) */
		return true;
	};
	
	this.ComboBoxLoaded = function() {
		/* ok all combo boxs has been loaded, time to load subarchive (if any) */
		this.DoSubArchive();
	};
};