<?php 

class HttpRequester {
	
	private $contentType;
	private $charSet;
	/* special property used by shopiy api consumer objects */
	private $lastResponseHeader;
	
	public function __construct( $_ctype = "application/json", $_cset = "utf-8" ) {
		$this->contentType = $_ctype;
		$this->charSet = $_cset;		
	}	
	
	public function setContentType( $ctype ) {
		$this->contentType = $ctype;
	}
	
	public function setCharSet( $cset ) {
		$this->charSet = $cset;
	}
	
	public function getLastResponseHeader() {
		return $this->lastResponseHeader;
	}
	
	public function call( $method, $url, $params=array() ) {

		$query = in_array($method, array('GET','DELETE')) ? $params : array();		
		$payload = in_array($method, array('POST','PUT')) ? json_encode($params) : array();		
		$request_headers = in_array($method, array('POST','PUT')) ? array("Content-Type: ". $this->contentType ."; charset=". $this->charSet, 'Expect:') : array();
		
		return $this->curlHttpApiRequest( $method, $url, $query, $payload, $request_headers );
						
	}
	
	private function curlHttpApiRequest($method, $url, $query='', $payload='', $request_headers=array()) {
		$url = $this->curlAppendQuery($url, $query);
		$ch = curl_init($url);
		$this->curlSetopts($ch, $method, $payload, $request_headers);
		$response = curl_exec($ch);
		$errno = curl_errno($ch);
		$error = curl_error($ch);
		curl_close($ch);
	
		if ($errno) throw new WcurlException($error, $errno);
		list($message_headers, $message_body) = preg_split("/\r\n\r\n|\n\n|\r\r/", $response, 2);
		$this->lastResponseHeader = $this->curlParseHeaders( $message_headers );
		
		return $message_body;		
	}
	
	private function curlAppendQuery($url, $query) {
		
		if (empty($query)) return $url;
		if (is_array($query)) return "$url?".http_build_query($query);
		else return "$url?$query";
		
	}
	
	private function curlSetopts($ch, $method, $payload, $request_headers) {
		
		curl_setopt($ch, CURLOPT_HEADER, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
		//curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
		curl_setopt($ch, CURLOPT_USERAGENT, 'sw-panel-client');
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 180);
		curl_setopt($ch, CURLOPT_TIMEOUT, 180);
	
		curl_setopt ($ch, CURLOPT_CUSTOMREQUEST, $method);
		if (!empty($request_headers)) curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
	
		if ($method != 'GET' && !empty($payload))
		{
			if (is_array($payload)) $payload = http_build_query($payload);
			curl_setopt ($ch, CURLOPT_POSTFIELDS, $payload);
		}
		
	}

	private function curlParseHeaders($message_headers) {
		
		$header_lines = preg_split("/\r\n|\n|\r/", $message_headers);
		$headers = array();
		list(, $headers['Status'], $headers['Content-Type']) = explode(' ', trim(array_shift($header_lines)), 3);
		foreach ($header_lines as $header_line)
		{
			list($name, $value) = explode(':', $header_line, 2);
			$name = strtolower($name);
			$headers[$name] = trim($value);
		}
	
		return $headers;
		
	}
	
}

?>