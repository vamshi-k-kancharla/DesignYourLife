
var FormDataInputHelperUtilsModule = (function () {

    /**
     * 
     * @param {String} uniqueInputId  : Unique Id to be used for creating data object record from User Input
     * @param {Array} dataInputIds  : Array of input ids of HTML Elements for form data input processing
     * @param {Array} dataObjectKeys  : Array of dataObject Keys for which dataObjectMap needs to be created
     * 
     * @returns {Map} dataObjectMap: DataObjectMap consisting of processed Form data
     *
    */

    function processFormInputData(uniqueInputId, dataInputIds, dataObjectKeys) {

        var dataObjectMap = new Map();
        var currentIndex = 0;

        if (HelperUtilsModule.valueDefined(uniqueInputId)) {

            dataObjectMap.set(dataObjectKeys[0], uniqueInputId);
            currentIndex++;
        }

        for (var currentInputId of dataInputIds) {

            if (!HelperUtilsModule.valueDefined(document.getElementById(currentInputId))) {

                continue;
            }

            var currentInputValue = document.getElementById(currentInputId).value;

            if (currentInputValue.includes("&") || currentInputValue.includes("=") || currentInputValue.includes("?")) {

                alert("Special characters from list (&, =, ?) are not allowed in user input");
                return null;
            }

            dataObjectMap.set(dataObjectKeys[currentIndex], currentInputValue);
            currentIndex++;
        }

        return dataObjectMap;
    }

    /**
     * 
     * @param {Map} dataObjectMap  : DataObjectMap consisting of processed Form data
     * @param {Array} dataObjectRequiredKeys  : Array of dataObject Input Keys which are essential
     * 
     * @returns {Boolean} "true/false": Return 'true' if all required values are defined, 'false' otherwise
     *
    */

    function checkForRequiredInputData(dataObjectMap, dataObjectRequiredKeys) {

        for (var currentRequiredInput of dataObjectRequiredKeys) {

            if (!HelperUtilsModule.valueDefined(dataObjectMap.get(currentRequiredInput))) {

                return false;
            }
        }

        return true;
    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        processFormInputData: processFormInputData,
        checkForRequiredInputData: checkForRequiredInputData

    };

})();
