
var HelperUtilsModule = (function () {

    var randomNumberSeed = 1000000;

    /**
     * 
     * @returns {string} dateString: Returns today's Date in 'DD-MM-YYYY' format
     *
    */

    function returnTodaysDateString() {

        var todaysDate = new Date();
        var todaysMonth = parseInt(todaysDate.getMonth().toString());
        todaysMonth += 1;
        var todaysYear = parseInt(todaysDate.getYear().toString());
        todaysYear += 1900;

        var dateString = "Date : " + todaysDate.getDate().toString() + "-" + todaysMonth.toString() + "-" + todaysYear.toString();
        return dateString;

    }

    /**
     * 
     * @returns {string} uniqueIdBasedOnCurrentTime: Returns UniqueId derived out of Current Instance Time
     *                                             : Todo => Doesn't work for multiple concurrent requests at exact instance
     *                                               => Add client's source IP
     *                                               => And also Add Randomly Generated Number
     *                                               => "SourceIP+RandomNumber+CurrentInstance" Id should be good enough for consumer web client
     *
    */

    function returnUniqueIdBasedOnCurrentTime() {

        var todaysDate = new Date();
        var todaysMonth = parseInt(todaysDate.getMonth().toString());
        todaysMonth += 1;
        var todaysYear = parseInt(todaysDate.getYear().toString());
        todaysYear += 1900;
        var randomNumber = Math.floor(Math.random() * randomNumberSeed);

        var uniqueIdBasedOnCurrentTime = randomNumber.toString() + todaysYear + todaysMonth + todaysDate.getDay().toString() +
            todaysDate.getHours().toString() + todaysDate.getMinutes().toString() + todaysDate.getSeconds().toString() +
            todaysDate.getMilliseconds().toString();
        return uniqueIdBasedOnCurrentTime;

    }

    /**
     * 
     * @param {String} inputValue  : inputValue whose value needs to be checked
     * 
     * @returns {Boolean} "true/false": Return 'true' if defined 'false' otherwise
     *
    */

    function valueDefined(inputValue) {

        if (inputValue == null || inputValue == undefined || inputValue == "") {

            return false;
        }

        return true;

    }

    /**
     * 
     * @param {any} elementId  : id of element whose data needs to be filled
     * @param {any} elementValue  : value that needs to be filled
     *
    */

    function setValueOfDocumentElement(elementId, elementValue) {

        if ( valueDefined(document.getElementById(elementId) ) ) {

            document.getElementById(elementId).innerHTML = elementValue;
        }

    }

    /**
     * 
     * @param {any} elementId  : id of element whose data needs to be filled
     * @param {any} elementValue  : value that needs to be filled
     *
    */

    function setValueOfDocumentElementThroughMap(elementsMap, elementKey, elementValue) {

        var elementId = elementsMap.get(elementKey);

        if ( valueDefined(elementId) && valueDefined(document.getElementById(elementId)) ) {

            document.getElementById(elementId).innerHTML = elementValue;
        }

    }

    /**
     *
     * @param {Object} inputObject  : Input Object to be converted to String Display format
     * 
     * @returns {string} objectStr: Returns string corresponding to input object
     *
    */

    function returnObjectString(inputObject) {

        var objectStr = "{";

        for (var currentKey in inputObject) {

            objectStr += currentKey + " : " + inputObject[currentKey] + ",";
        }
        objectStr += "}";

        return objectStr;
    }

    /**
     *
     * @param {Map} inputMap  : Input Map to be converted to String Display format
     * 
     * @returns {string} mapStr: Returns string corresponding to input map
     *
    */

    function returnMapString(inputMap) {

        var mapStr = "{";

        for (var currentKey of inputMap.keys()) {

            mapStr += currentKey + " : " + inputMap.get(currentKey) + ",";
        }
        mapStr += "}";

        return mapStr;
    }

    /**
     *
     * @param {Array} inputKeyArray  : Array of input Keys
     * @param {Map} inputMap  : Map of <k,v> pairs
     *
     * @returns {Array} valueArray: Returns an Array of values corresponding to input keys
     *
    */

    function retrieveValuesFromMap(inputKeyArray, inputMap) {

        var valueArray = new Array();

        for (var currentKey of inputKeyArray) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("currentKey : " + currentKey + ", inputMap.value : " + inputMap.get(currentKey));
            }

            valueArray.push(inputMap.get(currentKey));
        }

        return valueArray;

    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        returnTodaysDateString: returnTodaysDateString,
        returnUniqueIdBasedOnCurrentTime: returnUniqueIdBasedOnCurrentTime,
        valueDefined: valueDefined,
        fillDataInDocumentElement: setValueOfDocumentElement,
        fillDataInDocumentElementThroughMap: setValueOfDocumentElementThroughMap,
        returnObjectString: returnObjectString,
        retrieveValuesFromMap: retrieveValuesFromMap,
        returnMapString: returnMapString,

    };

})();
