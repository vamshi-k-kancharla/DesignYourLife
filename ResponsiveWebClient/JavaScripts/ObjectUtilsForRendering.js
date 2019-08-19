
var ObjectUtilsForRenderingModule = (function () {

    /**
    * 
    * @param {Array} inputObjectArray : Array of raw input objects
    * @param {Array} objectKeysForDisplay : Array of required keys for display
    * 
    * @returns {Array} objectListForDisplay: Returns array of objects with required values for display
    *
    */

    function buildObjectListForDisplay(inputObjectArray, objectKeysForDisplay) {

        var objectListForDisplay = new Array();

        for (var currentInputObject of inputObjectArray) {

            var currentObject = new Object();

            for (var currentKey of objectKeysForDisplay) {

                if (HelperUtilsModule.valueDefined(currentInputObject[currentKey])) {

                    currentObject[currentKey] = currentInputObject[currentKey];
                }
            }

            objectListForDisplay.push(currentObject);
        }

        return objectListForDisplay;
    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        buildObjectListForDisplay: buildObjectListForDisplay,
    };

})();
