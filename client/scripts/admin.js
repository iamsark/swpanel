/**
 * @author  : Saravana Kumar K
 * @url		: http://sarkware.com
 * @purpose : Master Admin Module & Config.
 * @api_url	: https://API:PASS@STORE.myshopify.com/admin
 * 
 */
/* used to hold data received from server ( most often archive data ) */
var DATA = null;
/* Action Controller Module for iireconsole Admin Section */	
var iireAdmin = function() {
	/* context means active section, here it will be 'store', 'users'... */			
	this.Context = null;
	/* current view mode (archive, single or new) */
	this.ViewMode = null;
	/* primary key of currently selected record */
	this.Record = null;
	/* currently selected record of single view */
	this.ActiveRecord = null;
	/* eGrid object, which is used to render archive view */
	this.Grid = null;
	/* used to holds last operation's response from server */
	this.Response = null;
	/* used to holds next request's data (most likely to be transported to server) */
	this.Request = null;
	/* used for loading select boxs synchronously */
	this.CboxIndex = 0;
	/* used for loading static & one time data synchronously */
	this.PrefetchIndex = 0;
	/* used to hold static data from server, which never get changed through out the app life cycle eg. customer group search */
	this.PreFetch = {};
	/* starting year for activity filter */
	this.StartYear = 2014;	
	/* prevent user from doing anything while any communication between server & client is active. */
	this.AjaxFlaQ = true;

	/* init admin module ( bootstrap of Admin module ) */
	this.TakeCare = function() {
		this.InitLeftNavBar();
		this.InitTabs();
		this.RegisterActions();
		/* make store tab visible */
		this.SwitchContext( "stores" );
		/* start to fetch pretech data ( first time only ) */
		if( eAdminMeta.PrefetchMeta.length > 0 ) {
			this.PrefetchIndex = 0;			
			this.Request = this.GetRequestObject( "GET", eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].context, "LIST", "", "", 1, {} );
			this.Dock( "prefetch", this, null );
		}else {
			/* init first archive list (will be 'stores') */
			this.DoArchive();
		}						
	};

	/* Left side bar menu implementation */
	this.InitLeftNavBar = function() {
		$("#main-nav li").click( this, function(e) {			
			$("#main-nav li").find("a").removeClass();
			$(this).find("a").addClass("selected");

			$("#workarea-header").html($(this).find('a').html());
			e.data.SwitchContext($(this).attr("data"));
			e.data.DoArchive();

			$("#workarea-parent div.workarea").css("display", "none");
			$("#"+$(this).attr("data")).show();				
		});
	};
	
	/* Initialize tabs */
	this.InitTabs = function() {
		$(document).on("click", ".su-tab-ul li", this, function(e){
			/* only for stores context ( need to prevent user from opening settings tab for Default Store ) */
			if( $(this).attr("data.value") != "settings" || e.data.Record != 1 ) {
				$(".su-tab-ul li").find("a").removeClass();
				$(this).find("a").addClass("selected");
				
				var query = $(this).attr("data.query"),
				value = $(this).attr("data.value");
				
				if( query != null && value != null ) {
					e.data.TabHandler( query, value );
				}
			}			
		});
	};

	/* register action for single view link (store & user) */			
	this.RegisterActions = function() {
		/* register action for 'new' record */
		$(document).on( "click", "a.new-btn", this, function(e){
			e.data.DoNew(); 
			e.stopPropagation();
		});	

		/* register action for 'save' record */
		$(document).on( "click", "a.save-btn", this, function(e){ 
			e.data.DoCreate(); 
			e.stopPropagation();
		});

		/* register action for 'update' record */
		$(document).on( "click", "a.update-btn", this, function(e){ 
			e.data.DoUpdate(); 
			e.stopPropagation();
		});		
		
		/* register action for 'cancel' whatever happening right now and go back to previous mode */
		$(document).on( "click", "a.cancel-btn", this, function(e){ 
			e.data.DoCancel(); 
			e.stopPropagation();
		});

		/* register action for single view */
		$(document).on( "click", "a.single-link", this, function(e){
			e.data.Record = $(this).attr('data.record');
			e.data.DoSingle( $(this).attr('data.context') ); 
			e.stopPropagation();
		});		
	};

	/* switch the action context ( stores, users, profile ) mostly called whenever left side bar menu being clicked */
	this.SwitchContext = function(context) {
		this.Context = context;	
		/**
		 * creating dynamic context object. according to left menu bar selection. this.ContextObj 
		 * can be 'stores', 'users', 'gateways', 'activity', 'preference' ...
		 **/
		this.ContextObj = new window[ this.Context ]( this );	
		this.ContextObj.RegisterAction();
		
		this.SwitchView( "archive" );
		this.UpdateActionBar();
	};

	/* update the action bar according to current context */
	this.UpdateActionBar = function() {
		$("#top-action-bar").html('');
		var context = this.Context,
		view = this.ViewMode,
		classes = "",
		actions = eAdminMeta[ this.Context ].actions;
		
		for( var i = 0; i < actions.length; i++ ) {			
			if( actions[i].view == view ) {
				
				if( actions[i].state == "PRIMARY" ) {
					classes = "tiny radius button "+ actions[i].action;
				} else {
					classes = "tiny radius secondary button "+ actions[i].action;
				}
				
				$("#top-action-bar").append($('<a href="#" class="'+ classes +'">'+ actions[i].label +'</a>'));
			}						
		}
	};

	/* switch view between 'archive' and 'single' views */
	this.SwitchView = function( view ) {
		/* hide last operation status popup */
		$( "#su-result-top-popup" ).hide();
		/* hide old view */
		$( "#archive-" + this.Context ).hide();
		$( "#single-" + this.Context ).hide();
		$( "#new-" + this.Context ).hide();
		
		this.ViewMode = view;		
		this.UpdateActionBar();
		
		$( "#" + view + "-" + this.Context ).show();							
	};
	
	/* main wrapper su-tabcontent-wrapper-[context] */
	/* tab wrapper [context]-tab-[selected value from active tab] */
	this.TabHandler = function( query, value ) {
		
		$( "#su-tabcontent-wrapper-"+ this.Context +" > div" ).hide();
		$( "#"+ this.Context +"-tab-"+ value ).show();		
		this.ContextObj.TabHandler( query, value );	
		
	};

	/*  */
	this.DoArchive = function() {
		this.SwitchView( "archive" );
		this.Request = this.GetRequestObject( "GET", this.Context, "LIST", "", "", 0, {} );
		this.Dock( "archive", this, null );		
	};

	/*  */
	this.RenderArchive = function() {
		if( this.Response.STATUS && this.Response.DATA.length > 0 ) {			
			this.ContextObj.RenderArchive();			
		}else {
			if( this.Context == "activity" ) {
				this.DoActivity();
			} else if( this.Context == "su_preferences" ){
				this.ContextObj.RenderArchive();
			} else {
				$("#" + this.Context + "-table-container").html("");	
				var iTag = $("#main-nav li").find("a.selected").children(":first").clone();
				var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
				h2Tag.append(iTag);
				h2Tag.html( h2Tag.html() + "Couldn't find any " + this.Context );			
				
				$("#" + this.Context + "-table-container").append( h2Tag );			
			}		
		}
	}

	/* [view]-[context]-[field] */
	this.DoSingle = function( target ) {		
		if( !this.AjaxFlaQ ) {
			
			var notifyText = $("#loading-notification").html();				
			if( notifyText.indexOf("Please wait while ") == -1 ) {
				$("#loading-notification").html( "Please wait while " + notifyText );
			}			
			return;
		}
		
		/* if this.Context != target then it's a cross context songle view request */
		if( this.Context != target ) {			
			/* update left side menu bar and breadcrumb section */
			$("#main-nav li").find("a").removeClass();
			$("#main-nav li[data='"+ target +"']").find("a").addClass("selected");
			
			var breadcrumb = $("#main-nav li").find("a.selected").html();			
			$("#workarea-header").html( breadcrumb );
			
			this.SwitchContext( target );
			$("#workarea-parent div.workarea").css("display", "none");
			$("#"+$("#main-nav li[data='"+ target +"']").attr("data")).show();						
		}		
		this.SwitchView( "single" );		
		
		this.Request = this.GetRequestObject( "GET", this.Context, "SINGLE", "id", this.Record, 0, {} );	
		this.Dock( "single", this, null );
	};
	
	this.RenderSingleView = function() {
		var context = this.Context,
		view = this.ViewMode,
		fields = eAdminMeta[ this.Context ].single.fields,
		title_key = eAdminMeta[ this.Context ].single.title;
		
		/* update breadcrumb title */
	    $("#workarea-header").html($("#workarea-header").html()+" / ");
	    /* check for comma (incase of first_name + last_name) */
	    if( title_key.indexOf( "," ) != -1 ) {
	       	$("#workarea-header").append( $('<span class="breadcrumb-title">'+ this.ContextObj.ActiveRecord[ title_key.split(',')[0] ] +" "+ this.ContextObj.ActiveRecord[ title_key.split(',')[1] ] +'</span>') );
	    } else {
	       	$("#workarea-header").append( $('<span class="breadcrumb-title">'+ this.ContextObj.ActiveRecord[ title_key ] +'</span>') );
	    }
	   
	    for(var j = 0; j < fields.length; j++) {	   
			if( fields[j].xtype == "TEXT" || fields[j].xtype == "DATE" || fields[j].xtype == "EMAIL" || fields[j].xtype == "PASSWORD" ) {
					$( "#"+ view +"-"+ context +"-"+ fields[j].id ).val( this.ContextObj.ActiveRecord[fields[j].id] );
			}else if( fields[j].xtype == "RADIO" ) {
					$("input[name='"+ view +"-"+ context +"-"+ fields[j].id +"'][value='"+ this.ContextObj.ActiveRecord[fields[j].id] +"']").prop('checked', true);								
			}else if( fields[i].xtype == "SELECT" ) {
				/* handled by this.LoadComboBox() */
			}
		}
	    
		/* handover to ContextObj.RenderSingleView for context specific single view operation */
		this.ContextObj.RenderSingleView();
	};
	
	/* generic sub archive routines ( context independence ) */
	this.DoSubArchive = function() {
		var context = this.Context,
        view = this.ViewMode;
		sub_archive_context = eAdminMeta[ this.Context ].single.sub_archive.object,
		filter_key = eAdminMeta[ this.Context ].single.sub_archive.filter_key; 
		
		if( sub_archive_context != undefined && sub_archive_context != null ) {
			this.Request = this.GetRequestObject( "GET", sub_archive_context, "QUERY", filter_key, this.Record, 0, {} );			
			this.Dock( "sub-archive", this, view +"-"+ context +"-"+ sub_archive_context +"-table-container" );
		} else {
			/* not necessory but it might has to do some other work to continue */
			this.ContextObj.RenderSubArchive();
		}
	};
	
	this.RenderSubArchive = function() {
		var context = this.Context,
        view = this.ViewMode,		
        sub_archive_context = eAdminMeta[ this.Context ].single.sub_archive.object,
		object_label = eAdminMeta[ this.Context ].single.sub_archive.object; 
		
		if( this.Response.STATUS && this.Response.DATA != null && this.Response.DATA.length > 0 ) {
			var gridMeta = eAdminMeta[ this.Context ].single.sub_archive;			
			gridMeta.data = this.Response.DATA;

			this.ContextObj.SubEGrid = new swGrid( "context", this.ContextObj, gridMeta );
			this.ContextObj.SubEGrid.InitGrid( $("#"+ view +"-"+ context +"-"+ sub_archive_context +"-table-container") );
			/* call context specific DoRenderSubArchive for futher operations */
			this.ContextObj.RenderSubArchive();			
		}else {
			$("#"+ view +"-"+ context +"-"+ sub_archive_context +"-table-container").html("");
			
			var iTag = $("#main-nav li").find("a.selected").children(":first").clone();
			var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
			h2Tag.append(iTag);
			h2Tag.html( h2Tag.html() +"Couldn't find any "+ object_label );			
			
			$("#"+ view +"-"+ context +"-"+ sub_archive_context +"-table-container").append( h2Tag );	
			/* not necessory but it might has to do some other work to continue */
			this.ContextObj.RenderSubArchive();	
		}
	};

	/* [view]-[context]-[field] */
	this.DoNew = function() {		
		this.SwitchView( "new" );					

		var context = this.Context,
		view = this.ViewMode,		
		fields = eAdminMeta[ this.Context ].single.fields;

		for( var i = 0; i < fields.length; i++ ) {
			$("#"+ view +"-"+ context +"-"+ fields[i].id).val("");
			$("#"+ view +"-"+ context +"-"+ fields[i].id).css("background-color", "white");	
			
			if( fields[i].xtype == "PASSWORD" ) {
				$("#"+ view +"-"+ context +"-confirm-"+ fields[i].id).val();
			}
		}	
		/* handover to ContextObj.DoNew */
		this.ContextObj.DoNew();
	};

	this.DoCreate = function() {
		this.ContextObj.DoCreate();
	};

	this.DoUpdate = function() {
		this.ContextObj.DoUpdate();
	};
	
	/* most of the time used to go back to archive mode ( need extra caution while cross context ) */
	this.DoCancel = function() {
		var breadcrumbTitle = $("#workarea-header").text();	      
	    if( breadcrumbTitle.indexOf("/") != -1 ) {
	      	$("#workarea-header").html( breadcrumbTitle.substr( 0, breadcrumbTitle.indexOf("/") ) );
	    }   
	    
		this.SwitchView( "archive" );
	};

	this.DoFetch = function() {
		var context = this.Context,
		view = this.ViewMode,
		fields = eAdminMeta[ this.Context ].single.fields,
		payload = {};

		for( var i = 0; i < fields.length; i++ ) {
			if( fields[i].xtype == "TEXT" || fields[i].xtype == "DATE" || fields[i].xtype == "SELECT" || fields[i].xtype == "EMAIL" || fields[i].xtype == "PASSWORD" ) {
				payload[ fields[i].id ] = $("#"+ view +"-"+ context +"-"+ fields[i].id).val();
			}else if( fields[i].xtype == "RADIO" ) {
				payload[ fields[i].id ] = $("input[name='"+ view +"-"+ context +"-"+ fields[i].id +"']:checked").val();
			}
		}

		return payload;
	};

	/* generic validation routine ( works across all context ) */
	this.DoValidate = function() {
		var context = this.Context,
		view = this.ViewMode,
		fields = eAdminMeta[ this.Context ].single.fields,
		flaQ = true;

		for( var i = 0; i < fields.length; i++ ) {
			var val = null;
			if( fields[i].xtype == "TEXT" || fields[i].xtype == "DATE" || fields[i].xtype == "SELECT" ) {
				val = $("#"+ view +"-"+ context +"-"+ fields[i].id).val();
			}else if( fields[i].xtype == "PASSWORD" ) {				
				val = $("#"+ view +"-"+ context +"-"+ fields[i].id).val();				
				
				if( val != "" ) {
					if( this.ViewMode == "new" ) {
						var val1 = $("#"+ view +"-"+ context +"-confirm-"+ fields[i].id).val();
						if( val != val1 ) {
							$("#"+ view +"-"+ context +"-confirm-"+ fields[i].id).css("background-color", "#D2B48C");
							val = null;
						}
					}
				}
				
				if( val != null && val != "" ) {
					$("#"+ view +"-"+ context +"-confirm-"+ fields[i].id).css("background-color", "white");
				}
			}else if( fields[i].xtype == "EMAIL" ) {			
				val = $("#"+ view +"-"+ context +"-"+ fields[i].id).val();
				
				var emailEx = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
				if( !emailEx.test(val) ) {
					val = null;
				}				
			}else if( fields[i].xtype == "RADIO" ) {
				val = $("input[name='"+ view +"-"+ context + "-" + fields[i].id +"']:checked").val();
			}

			if( val == "" || val == null || val == undefined ) {
				$("#"+ view +"-"+ context +"-"+ fields[i].id).css("background-color", "#D2B48C");
				flaQ = false;
				break;						
			}else {
				/* reset previously invalid but current corrected fields css back to normal */
				$("#"+ view +"-"+ context +"-"+ fields[i].id).css("background-color", "white");	
			}
		}

		return flaQ;
	};

	/* Alert users regrading recent operation */
	this.DoAlert = function() {
		/* no need to panic users when we are doing any "GET" operation */
		if(this.Request.REQ_TYPE != "GET") {
			$("#su-global-notification").html(this.Response.MSG);
			$("#su-global-notification").slideDown().delay(4000).slideUp();
		} 

		/* tell user what next */
		if( this.Request.REQ_TYPE == "POST" ) {
			var pop = $("#su-result-top-popup");
			pop.html( "" );
			pop.append( $('<h2 class="su-result-heading">'+ this.Response.MSG +'</h2>') );
			pop.append( $('<a href="#" class="new-btn">add another '+ this.Context.substr( 0, this.Context.length - 1 ) +'</span></a>') );      			
			pop.show();
		}		
	};
	
	/* special handler for activity context */
	this.DoActivity = function() {
		$("#activity-year-select").html("");
		$("#activity-store-select").html("");
		$("#activity-user-select").html("");		
		$("#activity-feed-ol").html("");
		
		/* Initialize year combo */
		$("#activity-year-select").append( '<option data.id="" value="none">--- Choose a year ---</option>' );
		for( var i = this.StartYear; i <= new Date().getFullYear(); i++ ) {
			$("#activity-year-select").append( '<option data.id="" value="'+ i +'">'+ i +'</option>' );
		}
		
		/* Initialize store combo */
		$("#activity-store-select").append( '<option data.id="" value="none">--- Choose a store ---</option>' );
		for( var i = 0; i < this.PreFetch["stores"].length; i++ ) {
			$("#activity-store-select").append( '<option data.id="'+ this.PreFetch["stores"][i].id +'" value="'+ this.PreFetch["stores"][i].name +'">'+ this.PreFetch["stores"][i].display_name +'</option>' );
		}
		
		$("#activity-user-select").append( '<option data.id="" value="none">--- Choose a user ---</option>' );
		
		$(document).off( "change", "#activity-store-select" );
		$(document).on( "change", "#activity-store-select", this, function(e){
			
			$("#activity-user-select").html("");
			$("#activity-user-select").append( '<option data.id="" value="none">--- Choose a user ---</option>' );
			
			for( var  i = 0; i < e.data.PreFetch["users"].length; i++ ) {				
				if( e.data.PreFetch["users"][i].store == $(this).val() ) {
					$("#activity-user-select").append( '<option data.id="'+ e.data.PreFetch["users"][i].id +'" value="'+ e.data.PreFetch["users"][i].user_name +'">'+ e.data.PreFetch["users"][i].display_name +'</option>' );
				}
			}
			
		});
		
		$(document).off( "click", "a.activity-filter-btn" );
		$(document).on( "click", "a.activity-filter-btn", this, function(e){
			
			if( $("#activity-year-select").val() != "none" && $("#activity-store-select").val() != "none" && $("#activity-user-select").val() != "none" ) {
				e.data.Request = e.data.GetRequestObject( "GET", e.data.Context, "LIST", "", "", 1, { year : $("#activity-year-select").val(), store : $("#activity-store-select").val(), user : $("#activity-user-select").val() } );
				e.data.Dock( "activity", e.data, null );
			}
			
		});
	};
	
	this.RenderActivity = function() {
		var rows = this.Response.DATA,
		activityOL = $("#activity-feed-ol"),
		activityLI = null,
		user = null,
		time = null,
		content = null,
		content_str = null;		
		
		activityOL.html("");
		
		if( rows.length < 1 ) {			
			activityLI = $('<li></li>');
			
			var iTag = $("#main-nav li").find("a.selected").children(":first").clone();
			var h2Tag = $('<h2 class="su-empty-result-h2"></h2>');
			h2Tag.append(iTag);
			h2Tag.html( h2Tag.html() + "Couldn't find any " + this.Context );			
			
			activityLI.append( h2Tag );
			activityOL.append(activityLI);
		}
		
		for( var i = 0; i < rows.length; i++ ) {
			
			activityLI = $('<li></li>');
			
			user = rows[i].substring( 0, rows[i].indexOf(" ") );
			time = rows[i].substring( rows[i].indexOf(".")+1 );
			content = rows[i].substring( rows[i].indexOf(" "), rows[i].indexOf(".") );
			
			if( content.indexOf("Log") != -1 ) {
				activityLI.append( $('<div class="timeline-ico"><i class="fi-torso"></i></div>') );
			}else if( content.indexOf("product") != -1 ) {
				activityLI.append( $('<div class="timeline-ico"><i class="fi-pricetag-multiple"></i></div>') );
			}else if( content.indexOf("collection") != -1 ) {
				activityLI.append( $('<div class="timeline-ico"><i class="fi-page-multiple"></i></div>') );
			}else if( content.indexOf("order") != -1 ) {
				activityLI.append( $('<div class="timeline-ico"><i class="fi-shopping-cart"></i></div>') );
			}
			
			content_str = '<div class="timeline-content">';
			content_str += '<p class="activity-message">';
			content_str += '<strong>'+ user +'</strong>';
			content_str += '<span>'+ content +'</span>';
			content_str += '</p>';
			content_str += '</div>';
			
			activityLI.append( $(content_str) );
			activityLI.append( $('<span class="timeline-datetime">'+ new Date(time).format() +'</span>') );
			activityOL.append(activityLI);					
		}
	};
	
	/* Used to fetch static data from server ( some data which won't get change through out the life cycle ) */
	this.LoadPrefetch = function() {
		
		if( this.Response.STATUS ) {
			//var obj = {};
			if( eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].object == "" ) {
				//obj[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA; 
				//this.PreFetch.push( this.Response.DATA );
				this.PreFetch[ eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA;
			}else {
				//obj[ PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA[ PrefetchMeta[ this.PrefetchIndex ].object ];
				//this.PreFetch.push( this.Response.DATA[ PrefetchMeta[ this.PrefetchIndex ].object ] );
				this.PreFetch[ eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].query ] = this.Response.DATA[ eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].object ];
			}
			
			this.PrefetchIndex++;
			
			if( this.PrefetchIndex < eAdminMeta.PrefetchMeta.length ) {
				/* still more data need to fetch so go get them again */
				this.Request = this.GetRequestObject( "GET", eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].context, "LIST", "", "", 1, {} );
				this.Dock( "prefetch", this, null );
			}else {
				/* ok we are done loading static data now start to load context archive */		
				this.DoArchive();
			}
			
		} else {
			/* this is not good habit, some error happend but still we are trying to continue. */
			if( this.PrefetchIndex < eAdminMeta.PrefetchMeta.length ) {				
				this.Request = this.GetRequestObject( "GET", eAdminMeta.PrefetchMeta[ this.PrefetchIndex ].context, "LIST", "", "", 1, {} );
				this.Dock( "prefetch", this, null );
			}else {				
				this.DoArchive();
			}
		}
	};

	this.InitComboBox = function() { 
		var context = this.Context;
		var cboxs = eAdminMeta[ this.Context ].single.cboxs;

		if( this.CboxIndex < cboxs.length ) {					
			this.Request = this.GetRequestObject( "GET", cboxs[ this.CboxIndex ].from, 0, this.DoFetch() );						
			/* send to server for further process */
			this.Dock( "load", this, null );
		}else {
			/* reset CboxIndex */
			this.CboxIndex = 0;
			/* notify context object about combo box loaded status */
			this.ContextObj.ComboBoxLoaded();
		}
	};

	this.LoadComboBox = function() {
		if( this.Response.STATUS ) {
			var rows = this.Response.DATA,
			context = this.Context,
			view = this.ViewMode,
			cboxs = eAdminMeta[ this.Context ].single.cboxs;

			var cbox = $("#"+ view +"-"+ context + "-" + cboxs[ this.CboxIndex ].id);
			cbox.html("");
			
			for(var i = 0; i < rows.length; i++) {						
				cbox.append( $('<option value="'+ rows[i][ cboxs[ this.CboxIndex ].value ] +'">'+ rows[i][ cboxs[ this.CboxIndex ].label ] +'</option>') );
			}
			
			for( var i = 0; i < DATA.length; i++ ) {
				if( DATA[i].id == this.Record ) { 						
					$("#"+ view +"-"+ context + "-" + cboxs[ this.CboxIndex ].id+" option[value="+ DATA[i][ cboxs[ this.CboxIndex ].value ] +"]").attr('selected', 'selected');
				}
			}		

			this.CboxIndex++;
			this.InitComboBox();
		} else {
			this.ContextObj.ComboBoxLoaded();
		}
	};	
	
	/**
	 * @purpose	: convert string to url friendly slug
	 * @str			: string that needs to be converted 
	 * @returns	: url friendly string
	 */
	this.SanitizeStr = function( str ) {
		return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_');
	};
	
	/**
	 * @purpose 	: confirm dialog ( equalent to window.confirm() )
	 * @title   	: title text
	 * @message 	: body text 
	 * @obj			: context object
	 * @returns 	: ok = true, cancel = false
	 */
	this.AreYouSure = function( title, msg, obj ) {
	    var confirm_button, modal;	      
	   
	    modal = $("<div class='reveal-modal tiny' data-reveal>\n  <h2 class='header'></h2>\n  <p class='warning'></p>\n  <div class='footer'>\n    <a class='tiny cancel-button secondary button radius inline'></a>\n  </div>\n</div>");
	    modal.find('.header').html( title );
	    modal.find('.warning').html( msg );
	    modal.find('.cancel-button').html( 'cancel' );
	    confirm_button = $('<a/>');
	    confirm_button.addClass('tiny button radius alert inline confirm').html( 'No Problem' );
	    
	    confirm_button.on('click', function() {
	    	modal.foundation('reveal', 'close');
		    obj.NotifyAlert( true );
	    });
	    
	    modal.find('.cancel-button').on('click', function(e) {
	      modal.foundation('reveal', 'close');
	      obj.NotifyAlert( false );
	    });   
	    
	    modal.find('.footer').append(confirm_button);
	   
	    modal.appendTo($('body')).foundation().foundation('reveal', 'open').on('closed.fndtn.reveal', function(e) {
	    	modal.remove();
	    });	   
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
	};

	this.GetResponseObject = function( status, msg, data ) {
		return {
			/* status of the operation TRUE=SUCCESS FALSE=ERROR */
			STATUS : status,
			/* short message from server regarding last operation */
			MSG : msg,
			/* actual data received from server (result of last operation) */
			DATA : data
		};
	};	

	/* dock with server (::--))). single point to communicate with server */
	this.Dock = function( view, thisObj ) {
		
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
				if( thisObj.Request.REQ_TYPE == "GET" ) {
					$("#loading-notification").html("Loading...");
					$("#loading-notification").show();
				}else {
					$("#loading-notification").html("Processing...");
					$("#loading-notification").show();
				}
			},  
			success    : function(data){     
				
				/* disable the ajax lock */
				thisObj.AjaxFlaQ = true;
				$("#loading-notification").hide(); 
				thisObj.Response = thisObj.GetResponseObject( data.status, data.message, data.data );	
				
				/* look for session expired response */
				if( thisObj.Response.MSG == "LOGIN" ) {
					window.location.href="index.php";
				}

				/* show notification if anything goes wrong in server side */
				if( !thisObj.Response.STATUS ) {
					$("#loading-notification").html( thisObj.Response.MSG ); 
					$("#loading-notification").show();
				}				

				/* if it is "archive" view then we have a data to display as archive */
				if( view == "archive" ) {
					DATA = data.data;
					thisObj.RenderArchive();
				}else if( view == "sub-archive" ) {
					/* special request, for loading sub archive within single views */
					thisObj.RenderSubArchive();
				}else if( view == "single" ) {
					thisObj.ContextObj.ActiveRecord = data.data;
					
					if( thisObj.Request.REQ_TYPE == "POST" ) {
						thisObj.DoAlert();
					}					
					
					thisObj.RenderSingleView( thisObj.Context );
				}else if( view == "load" ) {
					/* special request, used for loading combo boxs in views */
					thisObj.LoadComboBox();
				}else if( view == "activity" ) {
					/* special request, used for loading combo boxs in views */
					thisObj.RenderActivity();
				}else if( view == "prefetch" ){
					/* prefetch will occures before any other app activity begins, 
					 * here we used this for fetching static datas from server (just one time, eg customer searchs) */					
					thisObj.LoadPrefetch();					
				}else {
					/* these are the context specific operation or request, lets ContextObj handle this response */		                
					thisObj.ContextObj.ExtraRequest( view );		
				}            		                
			},  
			error      : function(jqXHR, textStatus, errorThrown) {                    
				/* disable the ajax lock */
				thisObj.AjaxFlaQ = true;
			}  
		});
	}		
};

/* onReady handler (this is where everything get starts) */
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
		e.stopPropagation();
	});	

	/* init Datepicker */
	$('#single-stores-opened').fdatepicker({ format : 'yyyy/mm/dd' });	
	$('#new-stores-opened').fdatepicker({ format : 'yyyy/mm/dd' });

	/* well time to start Admin module */
	var eAdminObj = new iireAdmin();
	/* hand over the application control to AdminObj */
	eAdminObj.TakeCare();	
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

/* to close opened smart dropdown (helping handler for iirDropDown) */
$(document).click(function(e){	
	$(".su-smart-popup").hide();	
});