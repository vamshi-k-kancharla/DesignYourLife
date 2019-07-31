var keyValueRetrivalModule = (function () {



	 function returnKey(index_position) {

		return keyArray[index_position];

	}	
		

	function returnValue(index_position){


		return valueArray[index_position];
	}
	
	return{
		retrieveKey : returnKey,

		retrieveValue : returnValue

	}
	
})();
