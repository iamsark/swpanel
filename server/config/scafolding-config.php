<?php 

$scafold = array(
	"context" => array(
		"entity" => array(
			"name" => "entity",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "name", 			"type" => "varchar(100)", 	"null" => false, 	"default" => "" ),
				array( "name" => "display_name", 	"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "parent", 			"type" => "int(11)", 		"null" => true, 	"default" => null ),
				array( "name" => "entity_type", 	"type" => "varchar(100)", 	"null" => true, 	"default" => "DYNAMIC" ),
				array( "name" => "entity_app", 		"type" => "varchar(100)", 	"null" => true, 	"default" => "ECONSOLE" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"org" => array(
			"name" => "org",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "name", 			"type" => "varchar(100)", 	"null" => false, 	"default" => "" ),
				array( "name" => "display_name", 	"type" => "varchar(100)", 	"null" => true, 	"default" => null ),				
				array( "name" => "active", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "YES" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"addresses" => array(
			"name" => "addresses",
			"columns" => array(			
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "door_no", 		"type" => "varchar(25)", 	"null" => true, 	"default" => null ),
				array( "name" => "street", 			"type" => "varchar(100)", 	"null" => true, 	"default" => null ),				
				array( "name" => "area_locality", 	"type" => "varchar(10)", 	"null" => true, 	"default" => null ),
				array( "name" => "city", 			"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "zip", 			"type" => "varchar(25)", 	"null" => true, 	"default" => null ),
				array( "name" => "state", 			"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "country", 		"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"contact" => array(
			"name" => "contact",			
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "email", 			"type" => "varchar(100)", 	"null" => false, 	"default" => "" ),
				array( "name" => "web_site", 		"type" => "varchar(150)", 	"null" => true, 	"default" => null ),				
				array( "name" => "contact_name", 	"type" => "varchar(10)", 	"null" => true, 	"default" => null ),
				array( "name" => "job_title", 		"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "department", 		"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "home_phone", 		"type" => "varchar(25)", 	"null" => true, 	"default" => null ),
				array( "name" => "work_phone", 		"type" => "varchar(25)", 	"null" => true, 	"default" => null ),
				array( "name" => "cell_phone", 		"type" => "varchar(25)", 	"null" => true, 	"default" => null ),
				array( "name" => "fax", 			"type" => "varchar(25)", 	"null" => true, 	"default" => null )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"contact_mapping" => array(
			"name" => "contact_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "entity_type_id", 	"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "entity_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),				
				array( "name" => "contact_id", 		"type" => "int(11)", 		"null" => true, 	"default" => null ),
				array( "name" => "address_id", 		"type" => "int(11)", 		"null" => true, 	"default" => null )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"roles" => array(
			"name" => "roles",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "name", 			"type" => "varchar(100)", 	"null" => false, 	"default" => "" ),
				array( "name" => "display_name", 	"type" => "varchar(100)", 	"null" => true, 	"default" => null )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"capabilities" => array(
			"name" => "capabilities",		
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),			
				array( "name" => "read", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "YES" ),
				array( "name" => "write", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "NO" ),
				array( "name" => "remove", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "NO" ),
				array( "name" => "econsole", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "YES" ),
				array( "name" => "eadmin", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "NO" ),
				array( "name" => "superadmin", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "NO" )					
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"capability_mapping" => array(
			"name" => "capability_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "role_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "cap_id", 			"type" => "int(11)", 		"null" => false, 	"default" => "" )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"users" => array(
			"name" => "users",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),				
				array( "name" => "user_name", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "display_name", 	"type" => "varchar(100)",	"null" => true, 	"default" => "" ),
				array( "name" => "password", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),				
				array( "name" => "active", 			"type" => "varchar(10)",	"null" => false, 	"default" => "YES" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array( "local_column" => "store", "foreign_table" => "stores", "foreign_column" => "id" )
				)
			)
		),
		"stores" => array(
			"name" => "stores",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "name", 			"type" => "varchar(100)", 	"null" => false, 	"default" => "" ),
				array( "name" => "display_name", 	"type" => "varchar(100)", 	"null" => true, 	"default" => null ),
				array( "name" => "public_url", 		"type" => "varchar(250)", 	"null" => false, 	"default" => "" ),
				array( "name" => "shopify_url", 	"type" => "varchar(250)", 	"null" => false, 	"default" => "" ),
				array( "name" => "store_email", 	"type" => "varchar(100)", 	"null" => false, 	"default" => null ),
				array( "name" => "apikey", 			"type" => "varchar(100)", 	"null" => false, 	"default" => null ),
				array( "name" => "password", 		"type" => "varchar(100)", 	"null" => false, 	"default" => null ),				
				array( "name" => "opened", 			"type" => "date", 			"null" => true, 	"default" => "" ),
				array( "name" => "active", 			"type" => "varchar(10)", 	"null" => false, 	"default" => "YES" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"stores_org_mapping" => array(
			"name" => "stores_org_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "store_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "org_id", 			"type" => "int(11)", 		"null" => false, 	"default" => "" )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"user_org_mapping" => array(
			"name" => "user_org_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "user_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "org_id", 			"type" => "int(11)", 		"null" => false, 	"default" => "" )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"user_store_mapping" => array(
			"name" => "user_store_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "user_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "store_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"user_role_mapping" => array(
			"name" => "user_role_mapping",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "user_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "role_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" )				
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array( 
					array()
				)
			)
		),
		"entity_meta" => array(
			"name" => "entity_meta",				
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "entity_id", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "meta_name", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "meta_key", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),				
				array( "name" => "meta_type", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array( "local_column" => "gateway_id", "foreign_table" => "gateway", "foreign_column" => "id" )
				)
			)
		),
		"records" => array(
			"name" => "records",			
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "entity_meta_id",	"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "entity_meta_key",	"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "entity_id", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),				
				array( "name" => "record_value", 	"type" => "varchar(500)",	"null" => false, 	"default" => "" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
						array( "local_column" => "gateway_id", "foreign_table" => "gateway", "foreign_column" => "id" ),
						array( "local_column" => "gateway_key", "foreign_table" => "gateway_meta", "foreign_column" => "meta_key" ),
						array( "local_column" => "store_id", "foreign_table" => "stores", "foreign_column" => "id" )
				)
			)
		),
		"store_preference" => array(
			"name" => "store_preference",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "store_id", 		"type" => "int(11)", 		"null" => false, 	"default" => "" ),
				array( "name" => "orders", 			"type" => "varchar(10)", 	"null" => true, 	"default" => "YES" ),
				array( "name" => "customers", 		"type" => "varchar(10)", 	"null" => true, 	"default" => "YES" ),
				array( "name" => "collections", 	"type" => "varchar(10)", 	"null" => true, 	"default" => "YES" ),
				array( "name" => "products", 		"type" => "varchar(10)", 	"null" => true, 	"default" => "YES" ),
				array( "name" => "inventory", 		"type" => "varchar(10)", 	"null" => true, 	"default" => "YES" ),
				array( "name" => "gifts", 			"type" => "varchar(10)", 	"null" => true, 	"default" => "NO" ),
				array( "name" => "chat", 			"type" => "varchar(10)", 	"null" => true, 	"default" => "NO" ),
				array( "name" => "payment", 		"type" => "varchar(10)", 	"null" => true, 	"default" => "NO" ),
				array( "name" => "gateway_id", 		"type" => "int(11)", 		"null" => true, 	"default" => "" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array( "local_column" => "store", "foreign_table" => "stores", "foreign_column" => "id" )
				)
			)
		),
		"gateway" => array(
			"name" => "gateway",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "gateway", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "gateway_url", 	"type" => "varchar(250)",	"null" => false, 	"default" => "" ),
				array( "name" => "provider_name", 	"type" => "varchar(100)",	"null" => true, 	"default" => "" ),				
				array( "name" => "active", 			"type" => "varchar(10)",	"null" => true, 	"default" => "YES" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array()
				)
			)
		),
		"gateway_meta" => array(
			"name" => "gateway_meta",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "gateway_id", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "meta_name", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "meta_key", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),				
				array( "name" => "meta_type", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array( "local_column" => "gateway_id", "foreign_table" => "gateway", "foreign_column" => "id" )
				)
			)
		),
		"gateways" => array(
			"name" => "gateways",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "gateway_id", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "gateway_key", 	"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "store_id", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),				
				array( "name" => "gateway_value", 	"type" => "varchar(500)",	"null" => false, 	"default" => "" )
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
						array( "local_column" => "gateway_id", "foreign_table" => "gateway", "foreign_column" => "id" ),
						array( "local_column" => "gateway_key", "foreign_table" => "gateway_meta", "foreign_column" => "meta_key" ),
						array( "local_column" => "store_id", "foreign_table" => "stores", "foreign_column" => "id" )
				)
			)
		),
		"preference" => array(
			"name" => "preference",
			"columns" => array(
				array( "name" => "id", 				"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "iire_home", 		"type" => "int(11)",		"null" => false, 	"default" => "" ),
				array( "name" => "iire_email", 		"type" => "varchar(100)",	"null" => false, 	"default" => "" ),
				array( "name" => "api_result_limit","type" => "varchar(100)",	"null" => false, 	"default" => "" ),				
				array( "name" => "smtp_from", 		"type" => "varchar(250)",	"null" => true, 	"default" => null ),
				array( "name" => "smtp_fromname", 	"type" => "varchar(250)",	"null" => true, 	"default" => null ),
				array( "name" => "smtp_host", 		"type" => "varchar(250)",	"null" => true, 	"default" => null ),
				array( "name" => "smtp_username", 	"type" => "varchar(100)",	"null" => true, 	"default" => null ),
				array( "name" => "smtp_password", 	"type" => "varchar(100)",	"null" => true, 	"default" => null ),
				array( "name" => "smtp_port", 		"type" => "int(11)",		"null" => true, 	"default" => null ),
				array( "name" => "smtp_secure", 	"type" => "varchar(100)",	"null" => true, 	"default" => null )					
			),
			"relations" => array(
				"primary" => "id",
				"foreign" => array(
					array()
				)
			)
		)
	)
);

?>