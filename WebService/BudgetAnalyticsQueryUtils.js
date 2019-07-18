
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve budget Analytics records based on input queries
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 * Globals : Import of Helper Modules
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RecordHelperUtilsModule = require('./RecordHelperUtils');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Budget Analytics Records : CRUD operations Wrappers Module for Queries
 *                            DB Specific User Input/Output processing
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * 
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, http_response) {

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildAnalyticsRecord_QueryResponse_JSON(queryResult);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("BudgetAnalyticsQueryUtils.handleQueryResults: Written Success response for input query : Analytics Record Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_BudgetAnalyticsRecord_JSON_String  : JSON String of Retrieved Budget Analytics Record(s)
 *
 */

function buildAnalyticsRecord_QueryResponse_JSON(queryResult) {

    var queryResponse_BudgetAnalyticsRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.Budget_Id) ) {

            queryResponse_BudgetAnalyticsRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord));
            queryResponse_BudgetAnalyticsRecord_JSON_String += "\n";
        }

    }

    return queryResponse_BudgetAnalyticsRecord_JSON_String;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Budget Analytics Record Query Processing & Response Building
 * 
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * 
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to generate LC
 * @param {Function} handleQueryResults  : Call back function to handle the Query Results
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordFromBudgetAnalyticsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // Budget Analytics Record Retrieval based on "Budget_Id || UserName"

    var queryObject = new Object();
    var parameterList = " ";

    // Build Query Object

    for (var currentFieldOfQuery of GlobalsForServiceModule.budgetAnalyticsRecord_RequiredQueryFields) {

        if (HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentFieldOfQuery)) ) {

            parameterList += currentFieldOfQuery;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentFieldOfQuery);
            parameterList += ", ";

            queryObject[currentFieldOfQuery] = clientRequestWithParamsMap.get(currentFieldOfQuery);
        }
    }

    console.log("BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase => collectionName :" + collectionName);
    console.log("BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Budget Analytics Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : " +
                    "Internal Server Error while querying for specific Records from Budget Analytics Database: " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromBudgetAnalyticsDatabase", failureMessage, http_response);

                return;
            }

            console.log("BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : " +
                    "Null Records returned for BudgetAnalytics Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromBudgetAnalyticsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : " +
                    "Internal Server Error while querying for all the Records from BudgetAnalytics Database: " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromBudgetAnalyticsDatabase", failureMessage, http_response);

                return;
            }

            console.log("BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "BudgetAnalyticsQueryUtils.retrieveRecordFromBudgetAnalyticsDatabase : " +
                    "Null Records returned for BudgetAnalytics Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromBudgetAnalyticsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    }

}

