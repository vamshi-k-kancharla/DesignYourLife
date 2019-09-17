
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 *  Record Builder Helper Utils
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 *  Globals : Import all the helper modules
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Build New Record Objects required for "Design Your Life"
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Map} recordMap  : Map of <K,V> pairs of Record
 * @param {Array} requiredDetailsOfRecord : Array of all the required fields to be present in Map before building document object
 *
 * @returns {Object} record_DocumentObject : Document Object of Record
 *
 */

exports.prepareRecord_DocumentObject = function (recordMap, requiredDetailsOfRecord) {

    var record_DocumentObject = new Object();

    // Replace the "URL Space" with regular space in record Map Values

    recordMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordMap);

    // Remove "Starting & Trailing Spaces" from record Map Values

    recordMap = HelperUtilsModule.removeStartingAndTrailingSpacesFromMapValues(recordMap);

    // Fill the record document object values

    for (var currentRequiredDetail of requiredDetailsOfRecord) {

        if ( HelperUtilsModule.valueDefined(recordMap.get(currentRequiredDetail)) ) {

            record_DocumentObject[currentRequiredDetail] = recordMap.get(currentRequiredDetail);
        }
    }

    return record_DocumentObject;
}


/**
 * 
 * @param {Object} queryResult : query Result from mongo DB
 * @param {Array} requiredDetailsOfRecord : Array of all the required fields to be present (in DB Record) before building response
 *
 * @returns {JSON} record_JSON : Record in JSON format
 * 
 */

exports.buildJSONRecord = function (queryResult, requiredDetailsOfRecord) {

    var record_JSON = new Object();

    queryResult = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryResult);

    for (var currentRequiredDetail of requiredDetailsOfRecord) {

        if (HelperUtilsModule.valueDefined(queryResult[currentRequiredDetail])) {

            record_JSON[currentRequiredDetail] = queryResult[currentRequiredDetail];
        }
    }

    return record_JSON;
}


/**
 * 
 * @param {Object} queryResult : query Result from mongo DB
 * 
 * @returns {JSON} record_JSON : Record in JSON format ( Builds JSON Record without any validation of required Fields )
 * 
 */

exports.buildJSONRecord = function (queryResult) {

    var record_JSON = new Object();

    queryResult = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryResult);

    for (var currentRequiredDetail in queryResult) {

        // Exclude identifier while sending data to client

        if (currentRequiredDetail == "_id") {

            continue;
        }

        // Parse all other values including category object values

        if (HelperUtilsModule.valueDefined(queryResult[currentRequiredDetail])) {

            if (HelperUtilsModule.doesValueExistInArray(GlobalsForServiceModule.budgetLevelAnalyticsRecord_CategoryFields,
                currentRequiredDetail)) {

                console.log("RecordHelperUtils.buildJSONRecord : value is categories object: convert object to string format.");
                record_JSON[currentRequiredDetail] = JSON.stringify(queryResult[currentRequiredDetail]);

            } else {

                record_JSON[currentRequiredDetail] = queryResult[currentRequiredDetail];
            }
        }
    }

    return record_JSON;
}

