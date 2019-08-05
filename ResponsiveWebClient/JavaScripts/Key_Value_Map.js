
var keyValueMapModule = (function () {
 

    /**
     * 
     * @param {Array} keyIdArray  : Array of Doc Element (Key) Id's
     * @param {Array} valueIdArray  : Array of Doc Element (Value) Id's
     * @param {Map} keyValueMap  : Map of <k,v> pairs to be displayed in Container
     * 
     * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
     *
     */

    function displaySingleContainerValues(keyIdArray, valueIdArray, keyValueMap) {

         for( var keyId of keyIdArray) {
             
         	var keyIdValue = keyValueMap.get(keyId);
         	document.getElementById(keyId).innerHTML = keyIdValue;
         }
         
         for( var valueId of valueIdArray ) {

         	var valueIdValue = keyValueMap.get(valueId);
            document.getElementById(valueId).innerHTML = valueIdValue;
         }
    
     }

    /**
     * 
     * @param {Array} pathIdArray  : Array of Doc Element (Path) Id's
     * @param {Array} keyIdArray  : Array of Doc Element (Key) Id's
     * @param {Array} valueIdArray  : Array of Doc Element (Value) Id's
     * @param {Map} keyValueMap  : Map of <k,v> pairs to be displayed in Container
     * 
     */

    function displayimageContainerValues(pathIdArray, keyIdArray, valueIdArray, keyValueMap) {

        for (var pathId of pathIdArray) {

            var pathIdValue = keyValueMap.get(pathId);
            document.getElementById(pathId).innerHTML = pathIdValue;
        }

        displaySingleContainerValues(keyIdArray, valueIdArray, keyValueMap);
    }

    /**
     * 
     * @param {String} category  : String value of "Category/Sub Category"
     * @param {Number} no_of_rows  : Number of <k,v> pairs of Id's rendered in current container
     * @param {String} id  : Specific suffix of targeted id
     * 
     * @returns {Array} resultIdArray : Array of deduced Id's from input variables
     *
     */

     function deduceKeyValueIdArray(category, no_of_rows, suffixId) {

         var resultIdArray = new Array();

         for (var currentRow = 1; currentRow <= no_of_rows; currentRow++) {

             var resultId = category + "_row" + String(currentRow) + "_" + suffixId;
             resultIdArray.push(resultId);
         }

         return resultIdArray;
     }
    

    /**
     * 
     * @param {Array} keyIdArray  : Array of Doc Element (Key) Id's
     * @param {Array} valueIdArray  : Array of Doc Element (Value) Id's
     * @param {Object} resultKeyValueObject  : Result Object that needs to be displayed in a container
     *
     * @returns {Map} resultKeyValueMap : Map of <k,v> paris of container values to be displayed
     *
     */

    function deduceKeyValueMap(keyIdArray, valueIdArray, resultKeyValueObject) {

        var resultKeyValueMap = new Map();
        var currentKeyValueIndex = 0;

        if (GlobalWebClientModule.bDebug == true) {

            alert("deduceKeyValueMap resultKeyValueObject.Keys : " + Object.keys(resultKeyValueObject));
            alert("deduceKeyValueMap resultKeyValueObject.Values : " + Object.values(resultKeyValueObject));
        }

        for (var currentProperty in resultKeyValueObject) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("deduceKeyValueMap.currentProperty : " + currentProperty);
                alert("deduceKeyValueMap.currentValue : " + resultKeyValueObject[currentProperty]);
            }

            resultKeyValueMap.set(keyIdArray[currentKeyValueIndex], currentProperty);
            resultKeyValueMap.set(valueIdArray[currentKeyValueIndex], resultKeyValueObject[currentProperty]);
            currentKeyValueIndex++;
        }

        return resultKeyValueMap;
    }


    /**
     * 
     * @param {String} containerPrefix  : Prefix value of Expense container name
     * @param {Number} no_of_containers  : Number of Expense Containers
     * @param {String} idPrefix  : Prefix value of id
     * 
     * @returns {Array} resultIdArray : Array of deduced Id's from input variables
     *
     */

    function deduceExpenseKeyValueIdArray(containerPrefix, currentContainer, no_Of_Expense_Details, idPrefix) {

        var resultIdArray = new Array();

        for (var currentRow = 1; currentRow <= no_Of_Expense_Details; currentRow++) {

            var resultId = containerPrefix + String(currentContainer) + "_" + idPrefix + String(currentRow);
            resultIdArray.push(resultId);
        }

        return resultIdArray;
    }

    /**
     * 
     * @param {String} containerPrefix  : Prefix value of Expense container name
     * @param {Number} no_of_containers  : Number of Expense Containers
     * @param {String} idPrefix  : Prefix value of id
     * 
     * @returns {Array} resultIdArray : Array of deduced Id's from input variables
     *
     */

    function deduceExpenseKeyValueMap(containerPrefix, currentContainer, imageSource, keyIdArray, valueIdArray, resultKeyValueObject) {

        // Fill Expense Info details in map

        resultKeyValueMap = deduceKeyValueMap(keyIdArray, valueIdArray, resultKeyValueObject);

        // Fill image info in map

        var imageKey = containerPrefix + String(currentContainer);
        document.getElementById(imageKey).setAttribute("src", imageSource);

        return resultKeyValueMap;
    }

    // Expose the method implementations for Global Access

	 return {

        deduceKeyValueIdArray : deduceKeyValueIdArray,
        displayimageContainerValues : displayimageContainerValues,
        displaySingleContainerValues : displaySingleContainerValues,
        deduceKeyValueMap: deduceKeyValueMap,
        deduceExpenseKeyValueIdArray: deduceExpenseKeyValueIdArray,
        deduceExpenseKeyValueMap: deduceExpenseKeyValueMap

	 }

})();

