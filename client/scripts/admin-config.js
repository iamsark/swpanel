var eAdminMeta = {		
		/* the data that needs to be loaded at startup  */
		PrefetchMeta : [
		                { context : "stores", query : "stores", object : "" },
		                { context : "users", query : "users", object : "" }
		],
		stores : {
			archive : {
				header : true,
				columns : [
				           { key : "name", label : "Shopify Name", type : "TEXT" },
				           { key : "display_name", label : "Display Name", type : "TEXT" },
				           { key : "email", label : "Contact", type : "EMAIL" },
				           { key : "opened", label : "Opened At", type : "DATE" },
				           { key : "active", label : "Active", type : "TEXT" }
				        ],
				data : null,				
				link : [
					   { key : "name", context : "stores", record_id : "id" }
					 ],
				sno : true,
				remove : false,
				pagination : false,
	  			record_per_page : 50,
				table_class : "su-table"
			},
			single : {
				title : "name",
				fields : [
				          { id : "name", xtype : "TEXT" },
				          { id : "display_name", xtype : "TEXT" },
				          { id : "store_url", xtype : "TEXT" },			          
				          { id : "apikey", xtype : "TEXT" },
				          { id : "secret", xtype : "TEXT" },
				          { id : "email", xtype : "EMAIL" },
				          { id : "opened", xtype : "DATE" },
				          { id : "active", xtype : "RADIO" }
				],
				sub_archive : {
					header : true,
				  	columns : [
				  	           { key : "user_name", label : "User Name", type : "TEXT" },
				  	           { key : "email", label : "Email", type : "EMAIL" },
				  	           { key : "active", label : "Active", type : "TEXT" }			          
				  	],
				  	data : null,
				  	link : [
				  		   { key : "user_name", context : "users", record_id : "id" }
				  	],
				  	sno : true,
				  	remove : false,
				  	pagination : false,
				  	record_per_page : 50,
				  	object : "users",
				  	filter_key : "store",
				  	table_class : "su-table stores-sub-archive"
				},
				cboxs : []
			},
			actions : [ 
			           { view : "archive", action : "new-btn", label : "Add Store", state : "PRIMARY" },
			           { view : "new", action : "cancel-btn", label : "Cancel", state : "SECONDARY" },
			           { view : "new", action : "save-btn", label : "Save", state : "PRIMARY" },
			           { view : "single", action : "cancel-btn", label : "Back", state : "SECONDARY" },
			           { view : "single", action : "update-btn", label : "Update", state : "PRIMARY" }			           
			]
		},             
		users : {
			archive : {
				header : true,
				columns : [
				           { key : "user_name", label : "User Name", type : "TEXT" },
				           { key : "display_name", label : "Display Name", type : "TEXT" },
				           { key : "store", label : "Store", type : "TEXT" },
				           { key : "email", label : "Email", type : "EMAIL" },
				           { key : "active", label : "Active", type : "TEXT" }			          
				],
				data : null,
				link : [
				        { key : "user_name", context : "users", record_id : "id" }
				],
				sno : true,
				remove : false,
				pagination : false,
	  			record_per_page : 50,
				table_class : "su-table"
			},
			single : {
				title : "user_name",
				fields : [
				          { id : "user_name", xtype : "TEXT" },
				          { id : "display_name", xtype : "TEXT" },
				          { id : "password", xtype : "PASSWORD" },
				          { id : "email", xtype : "EMAIL" },
				          { id : "store", xtype : "TEXT" },
				          { id : "active", xtype : "RADIO" },					
				],
				sub_archive : {},
				cboxs : [
				         { id : "store", from : "stores", label : "name", value : "id" }
				]
			},
			actions : [ 
			           { view : "archive", action : "new-btn", label : "Add User", state : "PRIMARY" },
			           { view : "new", action : "cancel-btn", label : "Cancel", state : "SECONDARY" },
			           { view : "new", action : "save-btn", label : "Save", state : "PRIMARY" },
			           { view : "single", action : "cancel-btn", label : "Back", state : "SECONDARY" },
			           { view : "single", action : "update-btn", label : "Update", state : "PRIMARY" }			           
			]
		},
		gateways : {
			archive : {
				header : true,
				columns : [
				           { key : "gateway", label : "Gateways", type : "TEXT" },
				           { key : "provider_name", label : "Provider", type : "TEXT" },		
				           { key : "gateway_url", label : "Gateway Access Point", type : "URL" }		
				],
				data : null,
				link : [
					   { key : "gateway", context : "gateways", record_id : "id" }
				],
				sno : true,
				remove : false,
				pagination : false,
	  			record_per_page : 50,
				table_class : "su-table"
			},
			single : {
				title : "gateway",
				fields : [
				          { id : "gateway", xtype : "TEXT" },
				          { id : "gateway_url", xtype : "TEXT" },				          
				          { id : "provider_name", xtype : "TEXT" },
				          { id : "active", xtype : "RADIO" },					
				],
				sub_archive : {
					header : true,
				  	columns : [
				  	           { key : "name", label : "Shopify Name", type : "TEXT" },
				  	           { key : "display_name", label : "Display Name", type : "TEXT" },
				  	           { key : "email", label : "Contact", type : "EMAIL" }			          
				  	],
				  	data : null,
				  	link : [
				  		   { key : "name", context : "stores", record_id : "id" }
				  	],
				  	sno : true,
				  	remove : false,
				  	pagination : false,
				  	record_per_page : 50,
				  	object : "stores",
				  	filter_key : "store",
				  	table_class : "su-table stores-sub-archive"
				},
				cboxs : []
			},
			actions : [ 
			           { view : "archive", action : "new-btn", label : "Add Gateway", state : "PRIMARY" },
			           { view : "new", action : "cancel-btn", label : "Cancel", state : "SECONDARY" },
			           { view : "new", action : "save-btn", label : "Save", state : "PRIMARY" },		
			           { view : "single", action : "cancel-btn", label : "Back", state : "SECONDARY" },
			           { view : "single", action : "update-btn", label : "Update", state : "PRIMARY" }			           
			]
		},
		activity : {
			archive : {
				
			},
			single : {
				
			},
			actions : [] 
		},
		su_preferences : {
			archive : {
				
			},
			single : {
				title : "",
				fields : [
				          { id : "su_home", xtype : "TEXT" },
				          { id : "su_email", xtype : "TEXT" },
				          { id : "api_result_limit", xtype : "TEXT" },
				          { id : "smtp_from", xtype : "TEXT" },
				          { id : "smtp_fromname", xtype : "TEXT" },
				          { id : "smtp_host", xtype : "TEXT" },
				          { id : "smtp_username", xtype : "TEXT" },
				          { id : "smtp_password", xtype : "TEXT" },
				          { id : "smtp_port", xtype : "TEXT" },
				          { id : "smtp_secure", xtype : "TEXT" },
				],
				sub_archive : {},
				cboxs : []
			},
			actions : [
			           { view : "archive", action : "update-btn", label : "Update", state : "PRIMARY" }
			]
		}		
};