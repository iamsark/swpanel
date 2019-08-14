<?php 

require_once "wcurl.php";

class Communicator {	
	private $lastResponseHeader = null;
	private $accessToken = null;
	private $baseurl = null;
	
	public function __construct( $_bUrl, $_aToken ) {
		$this->baseurl = $_bUrl ."/";
		$this->accessToken = $_aToken;		
	}

	public function call( $method, $path, $params=array() ) {	
		$url = $this->baseurl.$path;
		$query = in_array($method, array('GET','DELETE')) ? $params : array();
		$payload = in_array($method, array('POST','PUT')) ? json_encode($params) : array();
		$request_headers = in_array($method, array('POST','PUT')) ? array("Content-Type:application/json; charset=utf-8", 'Expect:') : array();
		$request_headers[] = 'X-Shopify-Access-Token:'.$this->accessToken;
		$response = $this->curlHttpApiRequest( $method, $url, $query, $payload, $request_headers );

		return json_decode( $response, true );
	}
	
	/**
	 *
	 * @param $url direct url of shop itself.
	 * 		  used to fetch some details from shop ( using api there is no way to get info like, product_types, tags, vendor list )
	 * 	      so we are using this override method for that purpose alone.
	 */
	public function shop_call( $url ) {	
		return json_decode( $this->curlHttpApiRequest( "GET", $url, array(), array(), array() ), true );
	}

	public function curlHttpApiRequest($method, $url, $query='', $payload='', $request_headers=array(), &$response_headers=array() ) {		
		try
		{
			$response = wcurl($method, $url, $query, $payload, $request_headers, $response_headers);
		}
		catch(WcurlException $e)
		{
			error_log($e->getMessage(), $e->getCode());
		}		
		
		if( $response_headers['http_status_code'] == 429 ) {
			$response = array( "CALL_LIMIT_EXCEED"=>"Too Many Request" );
		}
		
		return $response;			
	}
}

?>