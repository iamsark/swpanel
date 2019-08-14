var su_preferences = function( pObj ) {
	/* holds the reference for iireAdmin object */
	this.eAdmin = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	
	this.RegisterAction = function() {
		
	};
	
	this.TabHandler = function( query, value ) {
		
	};
	
	this.ExtraRequest = function( request ) {
		
		if( request == "su-preference-update" ) {
			this.RenderArchive();
		}
		
	};
	
	this.RenderArchive = function() {
		var context = this.eAdmin.Context,
		view = this.eAdmin.ViewMode,
		fields = eAdminMeta[ this.eAdmin.Context ].single.fields;
		
		this.ActiveRecord = this.eAdmin.Response.DATA;
		
		for(var j = 0; j < fields.length; j++) {
			
			/* reset previous validation error's style */
			$( "#"+ view +"-"+ context +"-"+ fields[j].id ).css( "background-color", "#fff" );
			
			if( this.ActiveRecord[ fields[j].id ] == null ) {
				$( "#"+ view +"-"+ context +"-"+ fields[j].id ).val( "" );
			} else {
				if( fields[j].xtype == "TEXT" || fields[j].xtype == "DATE" || fields[j].xtype == "EMAIL" || fields[j].xtype == "PASSWORD" ) {				
					$( "#"+ view +"-"+ context +"-"+ fields[j].id ).val( this.ActiveRecord[ fields[j].id ] );
				}else if( fields[j].xtype == "RADIO" ) {
					$("input[name='"+ view +"-"+ context +"-"+ fields[j].id +"'][value='"+ this.ActiveRecord[ fields[j].id ] +"']").prop('checked', true);								
				}else if( fields[i].xtype == "SELECT" ) {
					$("#"+ view +"-"+ context + "-" + fields[j].id +" option[value="+ this.ActiveRecord[ fields[j].id ] +"]").attr('selected', 'selected');
				}
			}			
			
		}
	};
	
	this.DoSingle = function() {
		
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
		
	};
	
	this.DoCreate = function() {
		
	};
	
	this.DoUpdate = function() {
		var payload = this.DoFetch();
		if( payload ) {					
			/* prepare request object */
			this.eAdmin.Request = this.eAdmin.GetRequestObject( "PUT", this.eAdmin.Context, "", "", "", 0, payload );	
			/* since its an update operation add "id" key and value */
			this.eAdmin.Request.DATA["id"] = this.ActiveRecord.id;	
			/* send to server for further process */
			this.eAdmin.Dock( "su-preference-update", this.eAdmin );
		}
	};
	
	this.DoFetch = function() {
		var context = this.eAdmin.Context,
		view = this.eAdmin.ViewMode
		payload = {};
		
		var home_url = $( "#"+ view +"-"+ context +"-su_home" );
		var su_email = $( "#"+ view +"-"+ context +"-su_email" );
		var api_limit = $( "#"+ view +"-"+ context +"-api_result_limit" );
		var from = $( "#"+ view +"-"+ context +"-smtp_from" );
		var from_name = $( "#"+ view +"-"+ context +"-smtp_fromname" );
		var host = $( "#"+ view +"-"+ context +"-smtp_host" );
		var username = $( "#"+ view +"-"+ context +"-smtp_username" );
		var password = $( "#"+ view +"-"+ context +"-smtp_password" );
		var port = $( "#"+ view +"-"+ context +"-smtp_port" );
		var secure = $( "#"+ view +"-"+ context +"-smtp_secure" );		
		
		if( $.trim( home_url.val() ).length < 1 ) {
			home_url.css("background-color", "#D2B48C");
			return false;
		}
		
		if( $.trim( su_email.val() ).length < 1 ) {
			su_email.css("background-color", "#D2B48C");
			return false;
		}
		
		if( api_limit.val() == null ) {
			api_limit.css("background-color", "#D2B48C");
			return false;
		}
		
		payload[ "su_home" ] = $.trim( home_url.val() );
		payload[ "su_email" ] = $.trim( su_email.val() );
		payload[ "api_result_limit" ] = $.trim( api_limit.val() );
		
		if( $.trim( from.val() ).length > 0 || $.trim( from_name.val() ).length > 0 || $.trim( host.val() ).length > 0 || $.trim( username.val() ).length > 0 || $.trim( password.val() ).length > 0 || parseInt( $.trim( port.val() )) > 0 || $.trim( secure.val() ).length > 0 ) {
			
			/* user trying to configure SMTP also */
			
			if(  $.trim( from_name.val() ).length < 1 ) {
				from_name.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_fromname" ] = $.trim( from_name.val() );
			
			if(  $.trim( from.val() ).length < 1 ) {
				from.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_from" ] = $.trim( from.val() );
			
			if(  $.trim( host.val() ).length < 1 ) {
				host.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_host" ] = $.trim( host.val() ); 
			
			if(  $.trim( username.val() ).length < 1 ) {
				username.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_username" ] = $.trim( username.val() );

			if(  $.trim( password.val() ).length < 1 ) {
				password.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_password" ] = $.trim( password.val() );
			
			if(  $.trim( port.val() ).length < 1 ) {
				port.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_port" ] = $.trim( port.val() );
			
			if(  $.trim( secure.val() ).length < 1 ) {
				secure.css("background-color", "#D2B48C");
				return false;
			}
			
			payload[ "smtp_secure" ] =  $.trim( secure.val() );
						
		} else {
			
			/* ok user trying to update general preference only */
			payload[ "smtp_fromname" ] = "";
			payload[ "smtp_from" ] = "";
			payload[ "smtp_host" ] = ""; 
			payload[ "smtp_username" ] = "";
			payload[ "smtp_password" ] = "";
			payload[ "smtp_port" ] = "";
			payload[ "smtp_secure" ] = "";
			
		}
		
		return 	payload;	
		
	};
	
	this.ComboBoxLoaded = function() {
		/* ok all combo boxs has been loaded, time to load subarchive (if any) */
		this.DoSubArchive();
	};
		
};