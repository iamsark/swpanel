var stores = function( pObj ) {
	/* holds the reference for iireAdmin object */
	this.eAdmin = pObj;
	/* active record for single view */
	this.ActiveRecord = null;
	/* sub archive object ( it will be products ) */
	this.SubArchive = null;
	/* eGrid object for listing sub archives */
	this.SubEGrid = null;
	/* holds current gateway ID */
	this.CurrentGateway = null;
	/* holds selected gateway's meta fields */
	this.GatewayMeta = null;
	/* holds current store's preferences */
	this.StorePreference = null;
	/* holds active tab's value ( used to switch 'update' button context like store or settings ) */
	this.ActiveTab = null;
	
	this.RegisterAction = function() {
		$(document).off( "click", "input#single-stores-preference-payment" );
		$(document).off( "change", "select#single-stores-preference-gateway_id" );		
		
		$(document).on( "click", "input#single-stores-preference-payment", this, function(e){
			if( $(this).is(':checked') ) {
				$( "select#single-stores-preference-gateway_id" ).removeAttr("disabled");
				$("select#single-stores-preference-gateway_id option[value='"+ e.data.StorePreference.gateway_id +"']").attr('selected', 'selected');
				
				e.data.eAdmin.Request = e.data.eAdmin.GetRequestObject( "GET", "gateway-meta", "SINGLE", "gateway_id", $( "select#single-stores-preference-gateway_id" ).val(), 0, {} );
				e.data.eAdmin.Dock( "gateway-configuration", e.data.eAdmin, null );
			} else {
				$( "select#single-stores-preference-gateway_id" ).attr("disabled", "disabled");
				$( "#single-stores-gateway-fieldset" ).html("");
			}
		});
		
		$(document).on( "change", "select#single-stores-preference-gateway_id", this, function(e){
			e.data.CurrentGateway = $(this).val();
			e.data.eAdmin.Request = e.data.eAdmin.GetRequestObject( "GET", "gateway-meta", "SINGLE", "gateway_id", $(this).val(), 0, {} );
			e.data.eAdmin.Dock( "gateway-configuration", e.data.eAdmin, null );
		});	
	};
	
	this.TabHandler = function( query, value ) {
		this.ActiveTab = value;
		/* load meta data */
		if( value == "settings" ) {
			this.DoPreferenceArchive();
		}
	};
	
	this.ExtraRequest = function( rtype ) {
		if( rtype == "store-preferences" ) {
			this.RenderPreference();
		} else if( rtype == "gateways-list" ) {
			this.RenderGatewayList();
		} else if( rtype == "gateway-configuration" ) {
			this.RenderGatewayConfig();
		} else if( rtype == "gateways-record-list" ) {
			this.RenderGatewayConfigRecords();
		} else if( rtype == "gateways-record-post" ) {
			this.DoUpdatePreference();
		} else if( rtype == "store-preferences-post" ) {
			this.eAdmin.DoAlert();
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
	
	/* render sub archive, which might belongs to single view */
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
	
	this.DoPreferenceArchive = function() {
		this.eAdmin.Request = this.eAdmin.GetRequestObject( "GET", "store-preferences", "SINGLE", "store_id", this.eAdmin.Record, 0, {} );
		this.eAdmin.Dock( "store-preferences", this.eAdmin, null );
	};
	
	this.RenderPreference = function() {
		if( this.eAdmin.Response.STATUS ) {
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode;
			
			/* update this.StorePreference for later use */
			this.StorePreference = this.eAdmin.Response.DATA;
			
			if( this.eAdmin.Response.DATA.orders == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-orders" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-orders" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.customers == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-customers" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-customers" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.collections == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-collections" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-collections" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.products == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-products" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-products" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.inventory == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-inventory" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-inventory" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.gifts == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-gifts" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-gifts" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.chat == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-chat" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-chat" ).prop('checked', false);
			}
			
			if( this.eAdmin.Response.DATA.payment == "YES" ) {
				$( "#"+ view +"-"+ context +"-preference-payment" ).prop('checked', true);
			} else {
				$( "#"+ view +"-"+ context +"-preference-payment" ).prop('checked', false);
			}
			
			this.CurrentGateway = this.eAdmin.Response.DATA.gateway_id;			
			this.eAdmin.Request = this.eAdmin.GetRequestObject( "GET", "gateways", "LIST", "", "", 0, {} );
			this.eAdmin.Dock( "gateways-list", this.eAdmin, null );
		}		
		
	};
	
	this.RenderGatewayList = function() {
		if( this.eAdmin.Response.STATUS ) {
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode,
			gate = $( "#"+ view +"-"+ context +"-preference-gateway_id" );
			
			gate.html("");
			$( "#"+ view +"-"+ context +"-gateway-fieldset" ).html("");
			for(var i = 0; i < this.eAdmin.Response.DATA.length; i++) {
				gate.append( $( '<option value="'+ this.eAdmin.Response.DATA[i].id +'">'+ this.eAdmin.Response.DATA[i].gateway +'</option>' ) );
			}
			
			if( this.StorePreference.payment == "YES" ) {
				gate.removeAttr( "disabled" );
				$("#"+ view +"-"+ context +"-preference-gateway_id option[value='"+ this.StorePreference.gateway_id +"']").attr('selected', 'selected');
				/* trigger click in order to load gateway meta fields */
				$("#"+ view +"-"+ context +"-preference-gateway_id option[value='"+ this.StorePreference.gateway_id +"']").trigger("click");
				
				/* get gateway configuration meta fields */
				this.eAdmin.Request = this.eAdmin.GetRequestObject( "GET", "gateway-meta", "SINGLE", "gateway_id", this.StorePreference.gateway_id, 0, {} );
				this.eAdmin.Dock( "gateway-configuration", this.eAdmin, null );
			} else {
				gate.attr("disabled", "disabled");
			}
		}
	};
	
	this.RenderGatewayConfig = function() {
		if( this.eAdmin.Response.STATUS ) {
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode,
			filedset = $( "#"+ view +"-"+ context +"-gateway-fieldset" );
			
			filedset.html("");	
			
			if( this.eAdmin.Response.DATA.length > 0 ) {
				this.GatewayMeta = this.eAdmin.Response.DATA;
				for( var i = 0; i < this.eAdmin.Response.DATA.length; i++ ) {
					filedset.append( $('<label>'+ this.eAdmin.Response.DATA[i].meta_name +'</label>') );
					filedset.append( $('<input type="text" id="'+ view +'-'+ context +'-gateway-'+ this.eAdmin.Response.DATA[i].meta_key +'" value="">') );
				}
				
				
				/* get gateway configuration records */
				var query = {
						'gateway_id' : $( "#"+ view +"-"+ context +"-preference-gateway_id" ).val(),
						'store_id' : this.ActiveRecord.id
				};
				this.eAdmin.Request = this.eAdmin.GetRequestObject( "GET", "gateways-record", "SINGLE", "", "", 0, query );
				this.eAdmin.Dock( "gateways-record-list", this.eAdmin, null );
			} else {
				var h2Tag = $('<h2 class="su-empty-result-h2" style="margin-top: 10px;"></h2>');
				h2Tag.append( $('<i class="fi-wrench"></i>') );
				h2Tag.html( h2Tag.html() +"Couldn't find any Configuration" );
				filedset.html(h2Tag);
			}			
		}
	};
	
	this.RenderGatewayConfigRecords = function() {
		if( this.eAdmin.Response.STATUS ) {
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode;
			
			for( var i = 0; i < this.eAdmin.Response.DATA.length; i++ ) {
				for( var j = 0; j < this.GatewayMeta.length; j++ ) {					
					if( this.eAdmin.Response.DATA[i].gateway_key == this.GatewayMeta[j].meta_key ) {						
						$( '#'+ view +'-'+ context +'-gateway-'+ this.GatewayMeta[j].meta_key ).val( this.eAdmin.Response.DATA[i].gateway_value );
					}
				}
			}			
		}
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
		
		if( this.ActiveTab == "settings" ) {
			var context = this.eAdmin.Context,
			view = this.eAdmin.ViewMode,
			payload = {},			
			gate_meta = {},
			field = null;console.log(this.GatewayMeta);
			
			if( this.CurrentGateway == 1 ) {
				this.DoUpdatePreference();
			} else {		
				if( !$('#'+ view +'-'+ context +'-preference-gateway_id').is(':disabled') && this.GatewayMeta != null ) {
					
					if( this.GatewayMeta.length > 0 ) {
						for( var i = 0; i < this.GatewayMeta.length; i++ ) {
							field = $( '#'+ view +'-'+ context +'-gateway-'+ this.GatewayMeta[i].meta_key );
							if( field.val() == "" || field.val() == " " || field.val() == null ) {
								field.css("background-color", "#D2B48C");
								return;
							}					
							gate_meta[ this.GatewayMeta[i].meta_key ] = field.val();					
						}
					} else {
						this.DoUpdatePreference();
					}			
					
					/* ok first we are gonna update gateway meta then update store preference. */
					payload["gateway_id"] = this.CurrentGateway == null ? 1 : this.CurrentGateway;
					payload["store_id"] = this.ActiveRecord.id;
					payload["gateway_config"] = gate_meta;
				
					/* make sure the selected gateway is not "Default Gateway" */
					if( this.CurrentGateway != null && this.CurrentGateway != 1 ) {
						this.eAdmin.Request = this.eAdmin.GetRequestObject( "POST", "gateways-record", "", "", "", 0, payload );
						this.eAdmin.Dock( "gateways-record-post", this.eAdmin, null );
					} else {					
						this.DoUpdatePreference();
					}
				}else {				
					this.DoUpdatePreference();
				}
			}
		} else {
			if( this.DoValidate() && this.eAdmin.DoValidate() ) {					
				/* prepare request object */
				this.eAdmin.Request = this.eAdmin.GetRequestObject( "PUT", this.eAdmin.Context, "", "", "", 0, this.DoFetch() );	
				/* since its an update operation add "id" key and value */
				this.eAdmin.Request.DATA["id"] = this.eAdmin.Record;	
				/* send to server for further process */
				this.eAdmin.Dock( "single", this.eAdmin );
			}
		}		
	};
	
	this.DoUpdatePreference = function() {
		var context = this.eAdmin.Context,
		view = this.eAdmin.ViewMode,
		payload = {},				
		field = null;
		
		payload = {
				store_id 	: this.ActiveRecord.id,
				orders 		: $( "#"+ view +"-"+ context +"-preference-orders" ).is(':checked') ? "YES" : "NO",
				customers	: $( "#"+ view +"-"+ context +"-preference-customers" ).is(':checked') ? "YES" : "NO",
				collections	: $( "#"+ view +"-"+ context +"-preference-collections" ).is(':checked') ? "YES" : "NO",
				products	: $( "#"+ view +"-"+ context +"-preference-products" ).is(':checked') ? "YES" : "NO",
				inventory 	: $( "#"+ view +"-"+ context +"-preference-inventory" ).is(':checked') ? "YES" : "NO",
				gifts		: $( "#"+ view +"-"+ context +"-preference-gifts" ).is(':checked') ? "YES" : "NO",
				chat		: $( "#"+ view +"-"+ context +"-preference-chat" ).is(':checked') ? "YES" : "NO",
				payment		: $( "#"+ view +"-"+ context +"-preference-payment" ).is(':checked') ? "YES" : "NO",
				gateway_id	: $( "#"+ view +"-"+ context +"-preference-gateway_id" ).val()
		};
		
		this.eAdmin.Request = this.eAdmin.GetRequestObject( "PUT", "store-preferences", "", "", "", 0, payload );
		this.eAdmin.Dock( "store-preferences-post", this.eAdmin, null );		
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