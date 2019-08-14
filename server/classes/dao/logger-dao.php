<?php 

error_reporting ( E_ERROR | E_PARSE );

class Logger {
	private $context;
	private $shop;
	private $user;
	private $baseDir;
	private $rHeader;
	
	public function __construct( $_shop, $_user, $_rheader = null ){		
		$this->shop = $_shop;
		$this->user = $_user;
		$this->rHeader = $_rheader;
		$this->baseDir = dirname( dirname( dirname( dirname(__FILE__) ) ) ) . DIRECTORY_SEPARATOR ."logs". DIRECTORY_SEPARATOR;	
	}
	
	private function checkDirectoryExist() {
		$cyear = date("Y");
		$cyDir = $this->baseDir.$cyear;
		if( !file_exists( $cyDir ) ) {
			mkdir( $cyDir, 0777 );
		}
	}
	
	public function logIt( $context, $status, $line ) {
		$this->checkDirectoryExist();
		$logArray = array();
		$logTxtObj = array(
				"context"=>$context,
				"status"=>$status,
				"message"=> $this->user." : ".$line,
				"time"=>date('m/d/Y h:i:s a', time())
		);
	
		$cShop = str_replace( ".", "_", $this->shop );
		$logfile = $this->baseDir . date("Y") .DIRECTORY_SEPARATOR . $cShop ."_activity.log";
		$fsize = filesize( $logfile );
	
		if( $fsize <= 0 ) {
			$logArray[] = $logTxtObj;
		} else {
			$logArray = json_decode( file_get_contents( $logfile ), true );
			array_unshift( $logArray, $logTxtObj );
		}
	
		if( !file_put_contents( $logfile, json_encode( $logArray ) ) ) {
			error_log( $line );
		}
	}
	
	public function ReadActivity() {
		$index = 0;		
		$result = array();		
		$this->checkDirectoryExist();
		
		if( $this->user == "sark" ) {
			
			$year = $this->rHeader->getData()->{'year'};
			$store = $this->rHeader->getData()->{'store'};
			
			$cShop = str_replace( ".", "_", $store );
			$fp = file( $this->baseDir .$year .DIRECTORY_SEPARATOR . $cShop ."_activity.log" );
			$result = array_reverse( $fp );			
			
		}else {
			
			$cShop = str_replace( ".", "_", $this->shop );
			$fp = file( $this->baseDir . date("Y") .DIRECTORY_SEPARATOR . $cShop ."_activity.log" );
			$lines = array_reverse( $fp );
			
			foreach( $lines as $line ) {
				if( $index < 25 ){
					$result[] = $line;
					$index++;
				}else {
					break;
				}
			}	
		}			
		
		return json_encode( new Response(true, "Success.!", 0, 0, $result) );		
	}
}

?>