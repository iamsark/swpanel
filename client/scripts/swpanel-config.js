var PrefetchMeta = [
        { context : "customers", query : "group_meta", object : "customer_saved_searches" },
        { context : "vendors", query : "vendors", object : "" },
        { context : "product_types", query : "product_types", object : "" }
];
/* archives configuration */
var ArchiveViewMeta = {
		orders : {
			header : true,
			columns : [			           
			           { key : "name", label : "Order", type : "TEXT" },
			           { key : "created_at", label : "Date", type : "DATE" },
			           { key : "customer.first_name,customer.last_name", label : "Customer", type : "TEXT" },
			           { key : "financial_status", label : "Payment Status", type : "TEXT" },
			           { key : "fulfillment_status", label : "Fullfillment Status", type : "FULFILL" },
			           { key : "total_price", label : "Total", type : "TEXT" }
			        ],			
			data : null,
			/* actions exclusively for top bar applicable to all view */
			actions : [ 
			            { view : "single", action : "order-cancel-btn", label : "Cancel this order", state : "SECONDARY" },
			            { view : "single", action : "cancel-btn", label : "Back", state : "PRIMARY" }
			         ],
			link : [
			        { key : "name", context : "orders", record_id : "id" },
			        { key : "customer.first_name,customer.last_name", context : "customers", record_id : "id" }
			     ],			 
			sno : false,			
			remove : false,
			edit : false,	
			pagination : true,
			record_per_page : 50,
			object : "orders",			
			table_class : "su-table"
		},
		customers : {
			header : true,
			columns : [
			           { key : "first_name,last_name", label : "Name", type : "TEXT" },
					   { key : "default_address.city", label : "Location", type : "TEXT" },
					   { key : "orders_count", label : "Orders", type : "TEXT" },
					   { key : "last_order_name", label : "Last Order", type : "TEXT" },
					   { key : "total_spent", label : "Total Spent", type : "TEXT" }		
			        ],			        
			data : null,
			actions : [{ view : "single", action : "cancel-btn", label : "Back", state : "PRIMARY" }],
			link : [
			        { key : "first_name,last_name", context : "customers", record_id : "id" },
			        { key : "last_order_name", context : "orders", record_id : "last_order_id" }
			     ],
			sno : false,
			remove : false,
			edit : false,
			pagination : true,
			record_per_page : 50,
			object : "customers",
			table_class : "su-table"
		},
		collections : {
			header : true,
			columns : [
			           { key : "image.src", label : "", type : "SMALL" },
			           { key : "title", label : "Title", type : "TEXT" },
					   { key : "sort_order", label : "Sorting Order", type : "TEXT" }
			        ],
			data : null,
			/* actions exclusively for top bar applicable to all view */
			actions : [ 
			            { view : "archive", action : "new-btn", label : "Add Collection", state : "PRIMARY" },
			            { view : "new", action : "save-btn", label : "Save", state : "PRIMARY" },
			            { view : "new", action : "cancel-btn", label : "Cancel", state : "PRIMARY" },
			            { view : "single", action : "update-btn", label : "Update", state : "PRIMARY" },
			            { view : "single", action : "cancel-btn", label : "Back", state : "PRIMARY" }
			         ],
			link : [
			        { key : "title", context : "collections", record_id : "id" }
				 ],
			sno : false,
			remove : false,
			edit : false,
			pagination : true,
			record_per_page : 50,
			object : "custom_collections",
			table_class : "su-table"
		},
		products : {
			header : true,
			columns : [
			           { key : "image", label : "", type : "THUMB" },
			           { key : "title", label : "Title", type : "TEXT" },
					   { key : "variants", label : "Inventory", type : "TEXT" },
					   { key : "product_type", label : "Type", type : "TEXT" },
					   { key : "vendor", label : "Vendor", type : "TEXT" }
			        ],
			data : null,
			actions : [
						{ view : "archive", action : "new-btn", label : "Add Product", state : "PRIMARY" },
						{ view : "new", action : "save-btn", label : "Save", state : "PRIMARY" },
						{ view : "new", action : "cancel-btn", label : "Cancel", state : "PRIMARY" },
						{ view : "single", action : "update-btn", label : "Update", state : "PRIMARY" },
						{ view : "single", action : "cancel-btn", label : "Back", state : "PRIMARY" }
			         ],
			link : [
			        { key : "title", context : "products", record_id : "id" }
				 ],
			sno : false,
			remove : false,
			edit : false,
			pagination : true,
			record_per_page : 50,
			object : "products",
			table_class : "su-table"
		},
		inventory : {
			header : true,
			columns : [
			           { key : "image", label : "", type : "THUMB" },
			           { key : "title", label : "Product Variant", type : "TEXT" },
					   { key : "sku", label : "SKU", type : "TEXT" },
					   { key : "inventory_policy", label : "Inventory Policy", type : "TEXT" },
					   { key : "stock", label : "Available", type : "TEXT" },
					   { key : "inventory_action", label : "Update Inventory", type : "TEXT" }
			        ],
			data : null,
			actions : [],
			link : [],
			sno : false,
			remove : false,
			edit : false,
			pagination : true,
			record_per_page : 50,
			object : "products",
			table_class : "su-table"
		}
};

/* single view meta */
var SingleViewMeta = {
		orders : {
			title : "name",
			fields : [
			          { id : "shipping-name", xtype : "TEXT", mandatory : false },
			          { id : "shipping-company", xtype : "TEXT", mandatory : false },
			          { id : "shipping-address1", xtype : "TEXT", mandatory : false },
			          { id : "shipping-address2", xtype : "TEXT", mandatory : false },
			          { id : "shipping-city", xtype : "TEXT", mandatory : false },
			          { id : "shipping-province_code", xtype : "TEXT", mandatory : false },
			          { id : "shipping-zip", xtype : "TEXT", mandatory : false },
			          { id : "shipping-country", xtype : "TEXT", mandatory : false },
			          { id : "shipping-phone", xtype : "TEXT", mandatory : false },
			          { id : "shipping-code", xtype : "TEXT", mandatory : false },
			          { id : "shipping-total_weight", xtype : "TEXT", mandatory : false },
			          { id : "billing-name", xtype : "TEXT", mandatory : false },
			          { id : "billing-company", xtype : "TEXT", mandatory : false },
			          { id : "billing-address1", xtype : "TEXT", mandatory : false },
			          { id : "billing-address2", xtype : "TEXT", mandatory : false },
			          { id : "billing-city", xtype : "TEXT", mandatory : false },
			          { id : "billing-province_code", xtype : "TEXT", mandatory : false },
			          { id : "billing-zip", xtype : "TEXT", mandatory : false },
			          { id : "billing-country", xtype : "TEXT", mandatory : false },
			          { id : "billing-phone", xtype : "TEXT", mandatory : false },
			          { id : "billing-email", xtype : "TEXT", mandatory : false },
			          { id : "customer-profile-link", xtype : "LINK", mandatory : false },
			          { id : "subtotal_price", xtype : "TEXT", mandatory : false },
			          { id : "shipping_price", xtype : "TEXT", mandatory : false },
			          { id : "total_price", xtype : "TEXT", mandatory : false },
			          { id : "gateway", xtype : "TEXT", mandatory : false },
			          { id : "financial_status", xtype : "TEXT", mandatory : false },
			          { id : "pending_amount", xtype : "TEXT", mandatory : false },
			          { id : "fulfill-items-btn", xtype : "BUTTON", mandatory : false },
			          { id : "fulfilled-btn", xtype : "BUTTON", mandatory : false },
			          { id : "mark-as-pay-received-btn", xtype : "BUTTON", mandatory : false },
			          { id : "pay-received-btn", xtype : "BUTTON", mandatory : false },
			          { id : "refund-btn", xtype : "BUTTON", mandatory : false }
			          ],
			          sub_archive : {			        	  
			        	  header : false,
			  			  columns : [
			  			           { key : "title", label : "Title", type : "TEXT" },
			  					   { key : "sub_total", label : "Sub Total", type : "TEXT" },
			  					   { key : "total", label : "Total", type : "TEXT" },			  					   
			  			        ],
			  			  data : null,
			  			  link : [
			  			        { key : "title", context : "products", record_id : "id" }
			  				 ],
			  			  sno : true,
			  			  remove : false,
			  			  edit : false,
			  			  pagination : false,
			  			  record_per_page : 50,
			  			  object : "products",
			  			  table_class : "su-order-line-item-table"		        	  
			          },
			          actions : [],
			          cboxs : []
		},
		customers : {
			title : "first_name,last_name",
			fields : [
						{ id : "address-name", xtype : "TEXT", mandatory : false },
						{ id : "address-company", xtype : "TEXT", mandatory : false },
						{ id : "address-address1", xtype : "TEXT", mandatory : false },
						{ id : "address-address2", xtype : "TEXT", mandatory : false },
						{ id : "address-city", xtype : "TEXT", mandatory : false },
						{ id : "address-province_code", xtype : "TEXT", mandatory : false },
						{ id : "address-zip", xtype : "TEXT", mandatory : false },
						{ id : "address-country", xtype : "TEXT", mandatory : false },
						{ id : "address-phone", xtype : "TEXT", mandatory : false },
						{ id : "address-email", xtype : "TEXT", mandatory : false }					
			          ],
			          sub_archive : {
			        	  header : true,
			  			  columns : [
			  			             { key : "name", label : "Order", type : "TEXT" },
			  			             { key : "created_at", label : "Date", type : "DATE" },				           
			  			             { key : "financial_status", label : "Payment Status", type : "TEXT" },
			  			             { key : "fulfillment_status", label : "Fullfillment Status", type : "FULFILL" },
			  			             { key : "total_price", label : "Total", type : "TEXT" }
			  			           ],
						  data : null,
						  link : [
						          { key : "name", context : "orders", record_id : "id" }
						        ],
						  sno : false,
						  remove : false,
						  edit : false,
						  pagination : false,
						  record_per_page : 50,
						  object : "orders",
						  table_class : "su-table"
			          },
			          actions : [],
			          cboxs : [
			                   { id : "store", from : "stores", label : "name", value : "id" }
			                 ]
		},
		collections : {
			title : "title",
			fields : [
			          	{ id : "feature-images", xtype : "IMAGE", mandatory : false },
			          	{ id : "title", xtype : "TEXT", mandatory : false },	
			          	{ id : "body_html", xtype : "TEXT", mandatory : false },	
			          	{ id : "page-title", xtype : "TEXT", mandatory : false },	
			          	{ id : "seo-meta-description", xtype : "TEXT", mandatory : false },	
			          	{ id : "handle", xtype : "TEXT", mandatory : false }			          
			          ],
			          sub_archive : {
			        	header : false,
			  			columns : [			        
			  			           { key : "image.src", label : "Thumbnail", type : "ICON" },
			  			           { key : "title", label : "Products", type : "TEXT" }			  			           
			  			        ],
			  			data : null,
			  			link : [
			  			        { key : "title", context : "products", record_id : "id" }			  			        
			  			     ],			 
			  			sno : false,			
			  			remove : true,
			  			edit : false,
			  			pagination : false,
			  			record_per_page : 50,
			  			object : "products",
			  			table_class : "su-table collections-sub-archive"
			          },
			          actions : [
			                     { action : "PUT", label : "Update", view : "single", top : true, bottom : true, state : "PRIMARY" },
			                     { action : "DELETE", label : "Delete this collection", view : "single", top : false, bottom : true, state : "SECONDARY" },
			                     { action : "POST", label : "Save", view : "new", top : true, bottom : true, state : "PRIMARY" },
			                     { action : "BACK", label : "Cancel", view : "new", top : true, bottom : true, state : "SECONDARY" }
			                  ],			          
			          cboxs : [
			                ]
		},
		products : {
			title : "title",
			fields : [
			          { "main" : [
						{ id : "title", xtype : "TEXT", mandatory : true },
						{ id : "body_html", xtype : "TEXT", mandatory : false },
						{ id : "handle", xtype : "TEXT", mandatory : false },
						{ id : "product_type", xtype : "SELECT", mandatory : false },
						{ id : "vendor", xtype : "SELECT", mandatory : false },
						{ id : "tags", xtype : "TEXT", mandatory : false },
						{ id : "image", xtype : "TEXT", mandatory : false }        
			          ] },
			          { "variants" : [
			            { id : "title", xtype : "TEXT", mandatory : true },
			  			{ id : "barcode", xtype : "TEXT", mandatory : true },
						{ id : "grams", xtype : "TEXT", mandatory : false },
						{ id : "inventory_management", xtype : "SELECT", mandatory : false },
						{ id : "price", xtype : "TEXT", mandatory : false },
						{ id : "compare_at_price", xtype : "TEXT", mandatory : false },
						{ id : "sku", xtype : "TEXT", mandatory : false },
						{ id : "taxable", xtype : "CHECK", mandatory : false },
						{ id : "inventory_quantity", xtype : "TEXT", mandatory : false },
						{ id : "inventory_policy", xtype : "CHECK", mandatory : false },
						{ id : "requires_shipping", xtype : "CHECK", mandatory : false },						
						{ id : "product_id", xtype : "TEXT", mandatory : false }
					 ] },
					 { "options" : [
						{ id : "name", xtype : "TEXT", mandatory : true },
						{ id : "position", xtype : "TEXT", mandatory : false },						
						{ id : "product_id", xtype : "TEXT", mandatory : false }						
					 ] },
					 { "images" : [
						{ id : "src", xtype : "TEXT", mandatory : true },
						{ id : "position", xtype : "TEXT", mandatory : false },						
						{ id : "product_id", xtype : "TEXT", mandatory : false }						
					 ] }
			          
			        ],
			          sub_archive : {
			        	  header : false,
				  			columns : [			        
				  			           { key : "image.src", label : "", type : "THUMB" },
				  			           { key : "title", label : "Collection", type : "TEXT" }			  			           
				  			        ],
				  			data : null,
				  			link : [
				  			        { key : "title", context : "collections", record_id : "id" }			  			        
				  			     ],			 
				  			sno : false,			
				  			remove : true,
				  			edit : false,
				  			pagination : false,
				  			record_per_page : 50,
				  			object : "custom_collections",
				  			table_class : "su-table collections-sub-archive"			        	  
			          },
			          actions : [
			                     { action : "PUT", label : "Update", view : "single", top : true, bottom : true, state : "PRIMARY" },
			                     { action : "DELETE", label : "Delete this product", view : "single", top : false, bottom : true, state : "SECONDARY" },
			                     { action : "POST", label : "Save", view : "new", top : true, bottom : true, state : "PRIMARY" },
			                     { action : "BACK", label : "Cancel", view : "new", top : true, bottom : true, state : "SECONDARY" }
			                  ],
			          cboxs : [
			                   { id : "product_types", from : "product_types", label : "type", value : "type" },
			                   { id : "vendors", from : "vendors", label : "vendor", value : "vendor" }
			                ]
		}		
};		