
var HelperUtilsModule = (function () {

    var randomNumberSeed = 1000000;

    /****************************************************************************************
        Prints paragraph into the document by splitting it based on input parameters
    *****************************************************************************************/

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

        var uniqueIdBasedOnCurrentTime = randomNumber.toString() + todaysYear + todaysMonth + todaysDate + todaysDate.getHours().toString() +
            todaysDate.getMinutes().toString() + todaysDate.getSeconds().toString() + todaysDate.getMilliseconds.toString();
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

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        returnTodaysDateString: returnTodaysDateString,
        returnUniqueIdBasedOnCurrentTime: returnUniqueIdBasedOnCurrentTime,
        valueDefined: valueDefined,
        fillDataInDocumentElement: setValueOfDocumentElement,
        fillDataInDocumentElementThroughMap: setValueOfDocumentElementThroughMap

    };

})();
