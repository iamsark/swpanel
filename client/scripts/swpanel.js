/**
 * @author  	: Saravana Kumar K
 * @author url 	: http://iamsark.com
 * @url			: http://sarkware.com/
 * @copyrights	: SARKWARE
 * @purpose 	: Master control panel object, which handles initiate and maintain all context object also handles all communication with SwPanel Server Side Module.
 */

/* used to hold data received from server ( most often archive data ) */
var DATA = null;
/* swPanel object ( main module ) */
var swPanelObj = null

/* swPanel Action Controller Module */
var suSwPanel = function() {	
	/* context means active section, here it can be 'orders', 'products'... */			
	this.Context = null;	
	/* object which manage all action for current context */
	this.ContextObj = null;
	/* swGrid object, which is used to render archive view */
	this.Grid = null;
	/* swDropDown object ( smart drop down with pagination ) */
	this.DropDown = null;
	/* current view mode (archive, single or new) */
	this.ViewMode = null;
	/* previous view mode ( some obvious reaon i need this - especially to preserve local cache ) */
	this.LastViewMode = null;
	/* last queried Request object ( used in pagination ) */
	this.LastQueryObj = null;
	/* primary key of currently selected record */
	this.Record = null;		
	/* used to holds last operation's response from server */
	this.Response = null;
	/* used to holds next request's data (most likely to be transported to server) */
	this.Request = null;
	/* used for loading select boxs synchronously */
	this.CboxIndex = 0;
	/* used for loading static & one time data synchronously */
	this.PrefetchIndex = 0;
	/* instance of suMask, masking object */
	this.Mask = null;
	/* prevent user from doing anything while any communication between server & client is active. */
	this.AjaxFlaQ = true;
	/* used to hold static data from server, which never get changed through out the app life cycle eg. customer group search */
	this.PreFetch = {};
	
	
	/* init swPanel module ( bootstrap point for swPanel module ) */
	this.TakeCare = function() {
		this.InitLeftNavBar();
		this.InitTabs();
		this.RegisterActions();
		this.Mask = new suMask();
		/* make store tab visible */
		this.SwitchContext( "dashboard" );
		/* start to fetch pretech data ( first time only ) */
		if( PrefetchMeta.length > 0 ) {
			this.PrefetchIndex = 0;			
			this.Request = this.GetRequestObject( "GET", PrefetchMeta[ this.PrefetchIndex ].context, "QUERY", PrefetchMeta[ this.PrefetchIndex ].query, "", 1, {} );
			this.Dock( "prefetch", this, null );
		}else {
			this.ContextObj.DoArchive();
		}	
	};	
	
	/* Left side bar menu implementation */
	this.InitLeftNavBar = function() {
		$("#main-nav li").click( this, function(e) {
			
			if( !e.data.AjaxFlaQ ) {
				
				var notifyText = $("#loading-notification").html();				
				if( notifyText.indexOf("Please wait while ") == -1 ) {
					$("#loading-notification").html( "Please wait while " + notifyText );
				}
				
				return;
			}
			
			$("#main-nav li").find("a").removeClass();
			$(this).find("a").addClass("selected");

			$("#workarea-header").html($(this).find('a').html());
			e.data.SwitchContext($(this).attr("data"));
			e.data.ContextObj.DoArchive();

			$("#workarea-parent div.workarea").css("display", "none");
			$("#"+$(this).attr("data")).show();				
		});
	};
	
	/* Initialize tabs */
	this.InitTabs = function() {
		$(document).on("click", ".su-tab-ul li", this, function(e){
			$(".su-tab-ul li").find("a").removeClass();
			$(this).find("a").addClass("selected");
			
			var query = $(this).attr("data.query"),
			value = $(this).attr("data.value");
			
			if( query != null && value != null ) {
				e.data.DoFilter( query, value );
			}
		});
	};
	
	/* register action for single view link (store & user) */			
	this.RegisterActions = function() {
		/* register action for filter button */
		$(document).on( "click", "a.do-filter-btn", this, function(e) { 
			var context = e.data.Context,
			main_filter = $("#"+ context +"-product-filter-main-select"),
			sub_filter = null;		
			
			if( main_filter.val() != "none" ) {				
				sub_filter = $( "#"+ context +"-product-filter-"+ main_filter.val() +"-select" );
				
				if( sub_filter.val() != "none" ) {
					e.data.DoFilter( main_filter.val(), sub_filter.val() );
				}
			}
			
			e.stopPropagation();			
		});		
		
		/* register action for 'new' record */
		$(document).on( "click", "a.new-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.DoNew();				
			}			 
			e.preventDefault();
		});	

		/* register action for 'save' record */
		$(document).on( "click", "a.save-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.DoCreate();				
			}			
			e.preventDefault();
		});

		/* register action for 'save' record */
		$(document).on( "click", "a.update-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.DoUpdate(); 
			}			
			e.preventDefault();
		});		
		
		/* register action for 'delete' record */
		$(document).on( "click", "a.delete-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.DoDelete(); 
			}	
			e.preventDefault();
		});
		
		/* register action for 'back' record */
		$(document).on( "click", "a.cancel-btn", this, function(e){	
			if( !$(this).hasClass("disabled") ) {
				e.data.DoCancel();
			}
			e.preventDefault();
		});

		/* register action for single view */
		$(document).on( "click", "a.single-link", this, function(e){
			e.data.Record = $(this).attr('data.record');			
			e.data.DoSingle( $(this).attr('data.context') );
			e.preventDefault();
		});	
		
		/* register single views local actions ( context specific eg. add delete product in collection single view )*/
		$(document).on( "click", "a.sub-action-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.ContextObj.DoAction( $(this).attr('data.action'), $(this) ); 
			}		
			e.preventDefault();
		});
		
		/* smart dropdown popup event listener ( loading content from remote server with pagination & multi select support ) */
		$(document).on("click", "a.su-dropdown-popup-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.ContextObj.DoAction( $(this).attr('data.action'), $(this) );
			}			
			e.stopPropagation();
		});
		
		/* normal dropdown popup event listener */
		$(document).on("click", "a.su-dropdown-btn", this, function(e){
			if( !$(this).hasClass("disabled") ) {
				e.data.ContextObj.DoAction( $(this).attr('data.action'), $(this) );
			}			
			e.stopPropagation();
		});
				
		/* password update action */
		$("#su-password-update-btn").click(this, function(e){
			
			var current_pass = $("#su-change-password-current-pass"),
			new_pass = $("#su-change-password-new-pass"),
			confirm_pass = $("#su-change-password-confirm-pass");
			
			if( current_pass.val() == "" || current_pass.val() == " " ) {
				current_pass.css("background-color", "#D2B48C");
				return;
			}
			
			if( new_pass.val() == "" || new_pass.val() == " " ) {
				new_pass.css("background-color", "#D2B48C");
				return;
			}

			if( confirm_pass.val() == "" || confirm_pass.val() == " " ) {
				confirm_pass.css("background-color", "#D2B48C");
				return;
			}
			
			if( confirm_pass.val() != new_pass.val() ) {
				new_pass.css("background-color", "#D2B48C");
				confirm_pass.css("background-color", "#D2B48C");
				return;
			}
			
			e.data.Request = e.data.GetRequestObject( "PUT", "users", "CREDENTIAL", "", "", 1, { old_password : current_pass.val(), new_password : new_pass.val() } );
			e.data.Dock( "credential", e.data, null );
		});
	};	

	/* switch the action context ( stores, users, profile ) mostly called whenever left side bar menu being clicked */
	this.SwitchContext = function( context ) {		
		this.Context = context;
		/**
		 * creating dynamic context object. according to left menu bar selection this.ContextObj 
		 * can be 'orders', 'dashboard', 'customers', 'collections', 'products' or 'inventory'
		 **/
		this.ContextObj = new window[ this.Context ]( this );		
			
		this.SwitchView( "archive" );
		
		if( this.Context != "dashboard" ) {
			$("#top-pagination-bar").show();
		}
	};
	
	this.SwitchView = function( view ) {
		this.LastViewMode = this.ViewMode;
		this.ViewMode = view;
		/* hide last operation status popup */
		$( "#su-result-top-popup" ).hide();	
		/* hide last order warning popup */
		$( "#order-warning-notice" ).hide();
		$( "#archive-" + this.Context ).hide();
		$( "#single-" + this.Context ).hide();
		$( "#new-" + this.Context ).hide();
		
		if( view == "archive" ) {
			$("body").removeClass("su-archive").addClass("su-archive");
		} else {
			$("body").removeClass("su-archive");
		}
		
		this.UpdateActionBar( view );
		$( "#" + view + "-" + this.Context ).show();		
	};
	
	this.UpdateActionBar = function( view ) {
		$("#top-action-bar").html('');
		
		if( this.Context != "dashboard" ) {
			var context = this.Context,
	        view = this.ViewMode,			
			archiveActions = ArchiveViewMeta[context].actions,
			btnClass = null;		
			
			if( ArchiveViewMeta[context].pagination ) {
				if( view == "archive" ) {
					$("#top-pagination-bar").show();
				}else {
					$("#top-pagination-bar").hide();
				}				
			}else {
				$("#top-pagination-bar").hide();
			}
			
			for(var i = 0; i < archiveActions.length; i++) {
				if( archiveActions[i].view == view ) {
					if( archiveActions[i].state == "PRIMARY" ) {
						btnClass = "tiny radius button "+ archiveActions[i].action;						
					} else {
						btnClass = "tiny radius button secondary "+ archiveActions[i].action;						
					}				
					
					$("#top-action-bar").append($('<a href="#" data.context="'+ context +'" class="'+ btnClass +'">'+ archiveActions[i].label +'</a>'));
				}
			}				
		} else {
			$("#top-pagination-bar").hide();
		}
	};
	
	/*  */
	this.DoArchive = function() {
		//this.SwitchView( "archive" );
		this.ContextObj.DoArchive();
	};
	
	this.DoSingle = function( target ) {
		
		if( !this.AjaxFlaQ ) {
			
			var notifyText = $("#loading-notification").html();				
			if( notifyText.indexOf("Please wait while ") == -1 ) {
				$("#loading-notification").html( "Please wait while " + notifyText );
			}
			
			return;
		}
		
		var namespace = null;
		/* if this.Context != target then it's a cross context single view request */
		if( this.Context != target ) {
			/* update left side menu bar and breadcrumb section */
			$("#main-nav li").find("a").removeClass();
			$("#main-nav li[data='"+ target +"']").find("a").addClass("selected");
			
			var breadcrumb = $("#main-nav li").find("a.selected").html();			
			$("#workarea-header").html( breadcrumb );
			
			this.SwitchContext( target );
			
			$("#workarea-parent div.workarea").css("display", "none");
			$("#"+ $("#main-nav li[data='"+ target +"']").attr("data")).show();
			
			/* make single view visible */		
			$( "#archive-" + this.Context ).hide();
			$( "#new-" + this.Context ).hide();
			$( "#single-" + this.Context ).show();		
			
		} else {			
			this.SwitchView( "single" );	
		}
		
		$("#top-pagination-bar").hide();
		
		this.Request = this.GetRequestObject( "GET", this.Context, "SINGLE", "", this.Record, 0, {} );	
		this.Dock( "single", this, null );
	};
	
	this.RenderSingleView = function( isSingle ) {	
		
		var	title_key = SingleViewMeta[this.Context].title,
		object_label = ArchiveViewMeta[this.Context].object;		
		
		/* update context object's ActiveRecord field */
		this.ContextObj.ActiveRecord = this.Response.DATA[ object_label.substr( 0, object_label.length - 1 ) ];
		
		/* make sure it's in single view */
		this.SwitchView( "single" );			  
		
		if( isSingle ) {
			this.DoAlert();
		}
			
		/* namespace for id selector */
	    var namespace = "#"+ this.ViewMode +"-"+ this.Context +"-";		        
	    /* update breadcrumb title */    
	    $("#workarea-header").html( $("#main-nav li").find("a.selected").html() + " / ");
	    /* check for comma (incase of first_name + last_name) */
	    if( title_key.indexOf( "," ) != -1 ) {
	      	$("#workarea-header").append( $('<span class="breadcrumb-title">'+ this.ContextObj.ActiveRecord[ title_key.split(',')[0] ] +" "+ this.ContextObj.ActiveRecord[ title_key.split(',')[1] ] +'</span>') );
	    }else {
	      	$("#workarea-header").append( $('<span class="breadcrumb-title">'+ this.ContextObj.ActiveRecord[ title_key ] +'</span>') );
	    } 
			
	    /* call DoSingle() for context specific single view operation */
		this.ContextObj.DoSingle( namespace );		
	}
	
	this.DoCreate = function() {		
		this.ContextObj.DoCreate();
	}
	
	this.DoUpdate = function() {
		this.ContextObj.DoUpdate();
	};
	
	this.DoDelete = function() {
		this.ContextObj.DoDelete();
	};
	
	/* most of the time used to go back to archive mode ( need extra caution while cross context ) */
	this.DoCancel = function() {
		var breadcrumbTitle = $("#workarea-header").text();	      
	    if( breadcrumbTitle.indexOf("/") != -1 ) {
	      	$("#workarea-header").html( breadcrumbTitle.substr( 0, breadcrumbTitle.indexOf("/") ) );
	    }   
	    
		this.SwitchView( "archive" );
	};
	
	this.GoBack = function() {
		this.SwitchView( "archive" );
	};
	
	this.DoNew = function() {
		this.SwitchView( "new" );
		/* initialize combo boxs */
		this.InitComboBox();
		
		/* update breadcrumb title */
		$("#workarea-header").html( $("#main-nav li").find("a.selected").html() + " / Add a " + this.Context.substring( 0, this.Context.length - 1 ));

		var context = this.Context,
		view = this.ViewMode,		
		fields = SingleViewMeta[context].fields;

		for( var i = 0; i < fields.length; i++ ) {
			$("#"+ view +"-"+ context +"-"+ fields[i].id).val("");
			$("#"+ view +"-"+ context +"-"+ fields[i].id).css("background-color", "white");			
		}
		
		this.ContextObj.DoNew();
	};
	
	this.DoFilter = function( query, value ) {	
		
		if( !this.AjaxFlaQ ) {			
			var notifyText = $("#loading-notification").html();				
			if( notifyText.indexOf("Please wait while ") == -1 ) {
				$("#loading-notification").html( "Please wait while " + notifyText );
			}			
			return;
		}
		
		this.Request = this.GetRequestObject( "GET", this.Context, "QUERY", query, value, 1, {} );
		this.Dock( "archive", this, this.Context + "-table-container" );		
			
	};
	
	/* Used to fetch static data from server ( some data which won't get change through out the life cycle ) */
	this.LoadPrefetch = function() {
		
		if( this.Response.STATUS ) {
			//var obj = {};
			if( PrefetchMeta[ this.PrefetchIndex ].object == "" ) {
				//obj[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA; 
				//this.PreFetch.push( this.Response.DATA );
				this.PreFetch[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA;
			}else {
				//obj[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA[ PrefetchMeta[ this.PrefetchIndex ].object ];
				//this.PreFetch.push( this.Response.DATA[ PrefetchMeta[ this.PrefetchIndex ].object ] );
				this.PreFetch[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA[ PrefetchMeta[ this.PrefetchIndex ].object ];
			}
			
			this.PrefetchIndex++;
			
			if( this.PrefetchIndex < PrefetchMeta.length ) {
				/* still more data need to fetch so go get them again */
				this.Request = this.GetRequestObject( "GET", PrefetchMeta[ this.PrefetchIndex ].context, "QUERY", PrefetchMeta[ this.PrefetchIndex ].query, "", 1, {} );
				this.Dock( "prefetch", this, null );
			}else {
				/* ok we are done loading static data now start to load context archive */		
				this.ContextObj.DoArchive();
			}
			
		} else {
			/* this is not good habit, some error happend but still we are trying to continue. */
			if( this.PrefetchIndex < PrefetchMeta.length ) {				
				this.Request = this.GetRequestObject( "GET", PrefetchMeta[ this.PrefetchIndex ].context, "QUERY", PrefetchMeta[ this.PrefetchIndex ].query, "", 1, {} );
				this.Dock( "prefetch", this, null );
			}else {				
				this.ContextObj.DoArchive();
			}
		}
	};
	
	/* used to load combo boxs ( like product type, vendors ... ) */
	this.InitComboBox = function() { 
		var context = this.Context;
		var cboxs = SingleViewMeta[context].cboxs;

		if( this.CboxIndex < cboxs.length ) {					
			this.Request = this.GetRequestObject( "GET", cboxs[ this.CboxIndex ].from, "LIST", "", "", 0, {} );						
			/* send to server for further process */
			this.Dock( "load", this, null );
		}else {
			/* reset CboxIndex */
			this.CboxIndex = 0;
			this.ContextObj.ComboBoxLoaded();
		}
	};

	this.LoadComboBox = function() {
		if( this.Response.STATUS ) {
			var rows = this.Response.DATA,
			context = this.Context,
			view = this.ViewMode,
			cboxs = SingleViewMeta[context].cboxs;		
			
			/* update product type & vendor prefetch meta */
			if( cboxs[ this.CboxIndex ].id == "product_types" ) {
				this.PreFetch[ "product_types" ] = rows;
			} else if( cboxs[ this.CboxIndex ].id == "vendors" ) {
				this.PreFetch[ "vendors" ] = rows;
			}

			var cbox = $("#"+ view +"-"+ context + "-" + cboxs[ this.CboxIndex ].id);
			cbox.html("");
			
			for(var i = 0; i < rows.length; i++) {				
				cbox.append( $('<option value="'+ rows[i][ cboxs[ this.CboxIndex ].value ] +'">'+ rows[i][ cboxs[ this.CboxIndex ].label ] +'</option>') );
			}
			
			/* context specific applicable only for products */
			if( this.Context == "products" ) {
				var opt = $( $('<optgroup label="---"></optgroup>') ),
				newtype = this.ViewMode + "-product-type",
				newvendor = this.ViewMode + "-vendor";				
				
				if( cboxs[ this.CboxIndex ].id == "product_types" ) {
					opt.append( $('<option value="'+ newtype +'">Create a new product type</option>') );
				}else if( cboxs[ this.CboxIndex ].id == "vendors" ) {
					opt.append( $('<option value="'+ newvendor +'">Create a new vendor</option>') );
				}
				
				cbox.append( opt );				
			}
			
			if( view == "single" ) {
				$("#"+ view +"-"+ context + "-" + cboxs[ this.CboxIndex ].id+" option[value='"+ this.ContextObj.ActiveRecord[ cboxs[ this.CboxIndex ].value ] +"']").attr('selected', 'selected');
			}			
				
			this.CboxIndex++;
			this.InitComboBox();
			
		} else {
			this.ContextObj.ComboBoxLoaded();
		}
	};
	
	this.DoAlert = function() {

		/* no need to panic users when we are doing any "GET" operation */
		if(this.REQ_TYPE != "GET") {
			$("#su-global-notification").html(this.Response.MSG);
			$("#su-global-notification").slideDown().delay(4000).slideUp();
		} 

		/* tell user what next */
		if( this.Request.REQ_TYPE == "POST" && this.Request.TYPE == "MAIN" ) {
			var pop = $("#su-result-top-popup");
			pop.html( "" );
			pop.append( $('<h2 class="su-result-heading">'+ this.Response.MSG +'</h2>') );
			pop.append( $('<a href="#" class="new-btn">add another '+ this.Context.substr( 0, this.Context.length - 1 ) +'</span></a>') );      			
			pop.show();
		}			
		
	};
	
	/*****************
	 * Action mapping *
	 ******************
	 * POST    = SAVE
	 * PUT     = UPDATE
	 * GET     = GET
	 * DELETE  = DELETE
	 ******************/
	this.GetRequestObject = function( rtype, table, type, query, value, page, data ) {
		return {
			/* can be POST, PUT, GET or DELETE */
			REQ_TYPE : rtype,
			/* can be PRODUCT, COLLECTION, COLLECT, ORDER, CUSTOMER, STORE or USER */
			TABLE : table,
			/* can be LIST, COUNT, QUERY */
			TYPE : type,
			/* query label (eg. customer_id ) */
			QUERY : query,
			/* value for query */
			VALUE : value,
			/* page number ( used for pagination ) */			
			PAGE : page,
			/* payload data */
			DATA : data
		};
	}
	
	this.GetResponseObject = function( status, msg, page, count, data ) {
		return {
			/* status of the operation TRUE=SUCCESS FALSE=ERROR */
			STATUS : status,
			/* short message from server regarding last operation */
			MSG : msg,
			/* page index */
			PAGE : page,
			/* total number of result for query */
			COUNT : count,
			/* actual data received from server (result of last operation) */
			DATA : data
		};
	};	

	/* dock with server (::--))). single point of function to communicate with server */
	this.Dock = function( view, thisObj, container ) {
		
		/* see the ajax handler is free */
		if( !this.AjaxFlaQ ) {
			return;
		}
		
		$.ajax({  
			type       : "POST",  
			data       : { suParam : JSON.stringify(this.Request)},  
			dataType   : "json",  
			url        : docker_base +"/docker.php",  
			beforeSend : function(){  
				
				/* enable the ajax lock */
				thisObj.AjaxFlaQ = false;
				
				/* disable all action buttons in the top bar */
				$("#top-action-bar a").addClass("disabled");
				
				if( thisObj.Request.REQ_TYPE == "GET" ) {
					$("#loading-notification").html("Loading...");
					$("#loading-notification").show();
					
					if( container != null ) {
						if( thisObj.Context != "dashboard" ) {
							$( "#"+container ).html("");
						}					
					}
					
				}else {
					$("#loading-notification").html("Processing...");
					$("#loading-notification").show();
				}
				
				/* store if it is queruy request ( used in pagination ) */
				if( thisObj.Request.TYPE == "QUERY" || thisObj.Request.TYPE == "LIST" ) {
					thisObj.LastQueryObj = thisObj.Request;
				}
				
			},  
			success    : function(data) {
				
				/* disable the ajax lock */
				thisObj.AjaxFlaQ = true;
				
				/* enable all action buttons in the top bar */				
				$("#top-action-bar a").removeClass("disabled");
				
				$("#loading-notification").hide();
				//thisObj.Mask.doUnMask();
				
				thisObj.Response = thisObj.GetResponseObject( data.status, data.message, data.page, data.count.count,  data.data );		               

				/* look for session expired response */
				if( thisObj.Response.MSG == "LOGIN" ) {
					window.location.href="index.php";
				}

				/* if it is "archive" view then we have a data to display as archive */
				if( view == "archive" ) {
					/* makes sure its in the archive view */
					thisObj.SwitchView( "archive" );					
					DATA = data.data;
					thisObj.ContextObj.RenderArchive();
				}else if( view == "sub-archive" ) {
					/* sub archive from single views */
					thisObj.ContextObj.RenderSubArchive();
				}else if( view == "archive-pages" ) {
					/* sub archive from single views */
					thisObj.Grid.UpdatePages();
				}else if( view == "sub-archive-pages" ) {
					/* sub archive from single views */
					thisObj.ContextObj.SubEGrid.UpdatePages();
				}else if( view == "single" ){
					/* context's single view is about to render */
					if( thisObj.Request.TYPE == "SUB" ) {
						thisObj.DoAlert();
						thisObj.Request = thisObj.GetRequestObject( "GET", thisObj.Context, "SINGLE", "", thisObj.Record, 0, {} );	
						thisObj.Dock( "single", thisObj, null );
					}else {
						thisObj.RenderSingleView( false );
					}
				}else if( view == "new" ){
					/* context's single view is about to render */
					/* if the record is new then we need to update this.Record */					
					var object_label = ArchiveViewMeta[thisObj.Context].object;						
					thisObj.Record = thisObj.Response.DATA[ object_label.substr( 0, object_label.length - 1 ) ].id;					
					thisObj.RenderSingleView( true );				
				}else if( view == "inventory" ) {
					thisObj.DoAlert();
					/* special request, used for updating inventory in views */
					thisObj.ContextObj.RefreshInventoryRows();
				}else if( view == "load" ) {
					/* special request, used for loading combo boxs in views */
					thisObj.LoadComboBox();
				}else if( view == "tags" ) {
					/* special request, used for loading tags in views */
					thisObj.ContextObj.Tags = thisObj.Response.DATA;
					thisObj.ContextObj.RenderTags();
				}else if( view == "smart-drop" ) {
					/* request initiated from smart drop down popup, just redirect response to the context object */
					thisObj.ContextObj.SmartDrop.RenderDropDown();
				} else if( view == "delete-main" ) {
					thisObj.DoAlert();
					/* if any of the main context record has been deleted (eg. product, collection ..) */					
					thisObj.Request = thisObj.GetRequestObject( "GET", thisObj.Context, "LIST", "", "", 0, null );
					thisObj.Dock( "archive", thisObj, null );
				} else if( view == "delete-sub" ) {					
					/* if any of the main context's sub record has been deleted (eg. product belongs to a collection) */
					thisObj.DoAlert();
					thisObj.ContextObj.DoSubArchive();
				} else if( view == "add-sub" ) {					
					/* if any of the main context's sub record has been deleted (eg. product belongs to a collection) */
					thisObj.DoAlert();
					thisObj.ContextObj.DoSubArchive();
				} else if( view == "refresh" ){
					/* let's user know the result of the operation */		                
					thisObj.DoAlert();
					/* refresh the whole record ( some updates has happend ) */
					thisObj.Request = thisObj.GetRequestObject( "GET", thisObj.Context, "SINGLE", "", thisObj.Record, 0, null );
					thisObj.Dock( "single", thisObj, null );
				}else if( view == "prefetch" ){
					/* prefetch will occures before any other app activity begins, 
					 * here we used this for fetching static datas from server (just one time, eg customer searchs) */					
					thisObj.LoadPrefetch();					
				}else if( view == "search" ){
					/* request for searching a product */
					thisObj.ContextObj.RenderSearch();
				}else if( view == "credential" ){
					/* special request for update user password */
					if( thisObj.Response.STATUS ) {
						/* password updated successfully, time to redirect to login page (because session is cleared) */
						window.location.href="index.php";
					}else {
						$("#su-credential-update-error").show();
						$("#su-credential-update-error").html( thisObj.Response.MSG );
					}
				}else {
					/* let's user know the result of the operation */		                
					thisObj.DoAlert();					
				}   
				
			},  
			error      : function(jqXHR, textStatus, errorThrown) {                    
				/* disable the ajax lock */
				thisObj.AjaxFlaQ = true;
			}  
		});
	};
	
	/* convert file object to base64 string */
	this.GetBase64Image = function( input ) {
		if ( input.files && input.files[0] ) {
	        var FR= new FileReader();
	        FR.onload = function(e) {
	        	var str = e.target.result;
	        	
	        	/* collection only require preview */
	        	if( swPanelObj.Context == "collections" ) {
	        		$('#'+ swPanelObj.ViewMode +"-"+ swPanelObj.Context +'-feature-preview').attr( "src", str );
	        	}	        	
	            	        	
	        	swPanelObj.ContextObj.Base64Img = str.substr( str.indexOf("base64") + 7 );
	        	/* notify context object, that conversion process completed */
	        	swPanelObj.ContextObj.ImageConverted();
	        	
	        };       
	        FR.readAsDataURL( input.files[0] );
	    }
	};
	
	/* convert string to url slug */
	this.SanitizeStr = function( str ) {
		return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
	};	 
	
	/* escape string, whichever has html tags in it */
	this.EscapeHTML = function( str ) {
		var escape = document.createElement('textarea');
		escape.innerHTML = str;
		return escape.innerHTML;
	};
	
	this.UnescapeHTML = function( str ) {
		return str.replace(/&amp;/g, "&")
        	.replace(/&lt;/g, "<")
        	.replace(/&gt;/g, ">")
        	.replace(/&quot;/g, "\"")
        	.replace(/&#039;/g, "'");		
	};
	
	this.CheckForHTML = function( str ) {
		var res = /<[a-z][\s\S]*>/i.test( str );		
		return res;
	};
};

/* Masking object ( used to mask any container whichever being refreshed ) */
var suMask = function() {
	this.Top = 0;
	this.Left = 0;
	this.Bottom = 0;
	this.Right = 0;
	
	this.Target = null;
	this.mask = null;
	
	this.getPosition = function(targetID) {
		this.Target = jQuery("#"+targetID);		
		
		var position = this.Target.position();
		var offset = this.Target.offset();
	
		this.Top = offset.top;
		this.Left = offset.left;
		this.Bottom = jQuery(window).width() - position.left - this.Target.width();
		this.Right = jQuery(window).height() - position.right - this.Target.height();
	};

	this.doMask = function(targetID, message) {
		this.mask = jQuery('<div class="su-mask">'+message+'</div>');		
		this.Target = jQuery("#"+targetID);			
		this.Target.append(this.mask);

		this.mask.css("left", "0px");
		this.mask.css("top", "0px");
		this.mask.css("right", this.Target.width()+"px");
		this.mask.css("bottom", this.Target.height()+"px");

		this.mask.css("line-height", this.Target.height()+"px");
	};

	this.doUnMask = function() {				
		this.mask.remove();
	};
}

$(document).ready(function(){
	/* prevent default behaviour of anchor tag ( here, prevent from redirecting ) */
	$("a").click(function(e){
		/* don't disturb logout link */
		if( !$(this).hasClass("logout") ) {
			e.preventDefault();
		}				
	});
	
	$(".su-dropdown-btn").click(function(e){
		var position = $(this).position();
		var top = $(this).next().css("top");
		$(this).next().css("left", position.left+"px");
		$(this).next().css("top", (top - 10)+"px");
		$(this).next().show();
		
		e.stopPropagation();		
	});

	/* used for smart drop down box preventing from getting hide on it's own click events */
	$(".su-smart-popup").click(function(e){
		/* we need to allow the click for filter action pass through ( here only ) */
		if( !$(e.target).hasClass("do-filter-btn") ) {
			e.stopPropagation();
		}			
	});	
		
	/* clear previously showned errors when open update credential popup */
	$(document).on('open', 'su-credential-update-error', function () {
		$("#su-credential-update-error").hide();
	});
	
	/* Initialize rich text edit boxs */
	
	$("#single-collections-body_html").tinymce({
	      script_url : 'client/scripts/tinymce/tiny_mce.js',
	      mode : "textareas",
	      theme : "advanced",
	      theme_advanced_buttons1 : "mybutton,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
	      theme_advanced_buttons2 : "",
	      theme_advanced_buttons3 : "",
	      theme_advanced_toolbar_location : "top",
	      theme_advanced_toolbar_align : "left",
	      theme_advanced_statusbar_location : "bottom",	      
	      width: '100%',
	      height : "250"	      
	});
	
	$("#new-collections-body_html").tinymce({
	      script_url : 'js/tinymce/tiny_mce.js',
	      mode : "textareas",
	      theme : "advanced",
	      theme_advanced_buttons1 : "mybutton,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
	      theme_advanced_buttons2 : "",
	      theme_advanced_buttons3 : "",
	      theme_advanced_toolbar_location : "top",
	      theme_advanced_toolbar_align : "left",
	      theme_advanced_statusbar_location : "bottom",	      
	      width: '100%',
	      height : "250"    	  
	});
	
	$("#single-products-body_html").tinymce({
	      script_url : 'js/tinymce/tiny_mce.js',
	      mode : "textareas",
	      theme : "advanced",
	      theme_advanced_buttons1 : "mybutton,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
	      theme_advanced_buttons2 : "",
	      theme_advanced_buttons3 : "",
	      theme_advanced_toolbar_location : "top",
	      theme_advanced_toolbar_align : "left",
	      theme_advanced_statusbar_location : "bottom",	      
	      width: '100%',
	      height : "250"
	});
	
	$("#new-products-body_html").tinymce({
	      script_url : 'js/tinymce/tiny_mce.js',
	      mode : "textareas",
	      theme : "advanced",
	      theme_advanced_buttons1 : "mybutton,bold,italic,underline,separator,strikethrough,justifyleft,justifycenter,justifyright, justifyfull,bullist,numlist,undo,redo,link,unlink",
	      theme_advanced_buttons2 : "",
	      theme_advanced_buttons3 : "",
	      theme_advanced_toolbar_location : "top",
	      theme_advanced_toolbar_align : "left",
	      theme_advanced_statusbar_location : "bottom",	      
	      width: '100%',
	      height : "250"     
	});
		
	/* well time to start swPanel module */
	swPanelObj = new suSwPanel();
	/* hand over the application control to swPanelObj */
	swPanelObj.TakeCare();	
});

/* Foundation framework initialization "http://foundation.zurb.com/docs/" */
$(document).foundation('reveal', {
	  animation: 'fade',
	  animation_speed: 250,
	  close_on_background_click: true,
	  dismiss_modal_class: 'close-reveal-modal',
	  bg_class: 'reveal-modal-bg',
	  bg : $('.reveal-modal-bg'),
	  css : {
	    open : {
	      'opacity': 0,
	      'visibility': 'visible',
	      'display' : 'block'
	    },
	    close : {
	      'opacity': 1,
	      'visibility': 'hidden',
	      'display': 'none'
	    }
	  }
});

/* to close opened smart dropdown (helping handler for swDropDown) */
$(document).click(function(e){	
	$(".su-smart-popup").hide();
	if( swPanelObj.ContextObj.SmartDrop != null ) {
		swPanelObj.ContextObj.SmartDrop.Visible = false;
	}	
});