var keyValueMapModule = (function (){
 
    function displaySingleContainerValues( keyIdArray, valueIdArray, keyValueMap) {

         for( var keyId of keyIdArray) {

         	var keyIdValue = keyValueMap.get(keyId);

         	document.getElementById(keyId).innerHTML = keyIdValue;
         
         }
         
         for( var valueId of valueIdArray ) {

         	var valueIdValue = keyValueMap.get(valueId);
         	
            document.getElementById(valueId).innerHTML = valueIdValue;
         
         }
    
     }

     function deduceKeyValueIdArray(Category,No_of_rows,Id) {

                var resultArray = new Array();

                for(var i = 1 ; i <= No_of_rows ; i++)
                {
                    var result = "";
                    result += Category + String(i)+ Id;

                    resultArray.push(result);
                }

                return resultArray;

         }
    

     function displayimageContainerValues(path,keyIdArray,valueIdArray,keyValueMap){

         for( var pathId of path) {

            var pathIdValue = keyValueMap.get(pathId);
            
            document.getElementById(pathId).innerHTML = pathIdValue;
            
            }
            
            displaySingleContainerValues(keyIdArray,valueIdArray,keyValueMap);

    }

	return {

        deduceKeyValueIdArray : deduceKeyValueIdArray ,

        displayimageContainerValues : displayimageContainerValues ,

        displaySingleContainerValues : displaySingleContainerValues

	}

}) ();