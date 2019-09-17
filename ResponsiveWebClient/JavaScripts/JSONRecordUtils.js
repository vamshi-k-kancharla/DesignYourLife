
var JSONRecordUtilsModule = (function () {

    /**
     * 
     * @param {Object} inputObject : Input Object to be converted to JSON String
     * @param {Array} requiredDetailsOfRecord : Mandatory fields of Record to be validated against
     * 
     * @returns {String} recordJSONString : Record in JSON format
     * 
     */

    function buildJSONRecord(inputObject, requiredDetailsOfRecord) {

        var record_JSON = new Object();

        for (var currentRequiredDetail of requiredDetailsOfRecord) {

            if (HelperUtilsModule.valueDefined(inputObject[currentRequiredDetail])) {

                record_JSON[currentRequiredDetail] = inputObject[currentRequiredDetail];
            }
        }

        var recordJSONString = JSON.stringify(record_JSON);

        return recordJSONString;
    }

    /****************************************************************************************
        Reveal private methods
    *****************************************************************************************/

    return {

        buildJSONRecord: buildJSONRecord,
    };

})();



