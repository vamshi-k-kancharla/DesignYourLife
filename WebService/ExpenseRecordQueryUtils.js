
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve expense records based on input queries
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 * Globals : Import Modules
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RecordHelperUtilsModule = require('./RecordHelperUtils');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Expense Records : CRUD operations Wrappers Module for Queries
 *                  DB Specific User Input/Output processing
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, http_response) {

    if (err) {

        console.error("ExpenseRecordQueryUtils.handleQueryResults : Internal Server Error during record retrieval query execution");

        var failureMessage = "ExpenseRecordQueryUtils.handleQueryResults : Internal Server Error during record retrieval query execution";
        HelperUtilsModule.logInternalServerError("handleQueryResults", failureMessage, http_response);

        return;
    }

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("ExpenseRecordQueryUtils.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_ExpenseRecord_JSON_String  : JSON String of Retrieved Expense Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult) {

    var queryResponse_ExpenseRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.Expense_Id) ) {

            queryResponse_ExpenseRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                GlobalsForServiceModule.expenseRecordRequiredFields));
            queryResponse_ExpenseRecord_JSON_String += "\n";
        }

    }

    return queryResponse_ExpenseRecord_JSON_String;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Expense Details Record Query Processing & Response Building
 * 
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * 
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to Retrieve records
 * @param {Function} handleQueryResults  : Callback function to handle the Query Results
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordFromExpenseDetailsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // Expense Record Retrieval based on "Expense_Id | Name | Expense_Type | Place | Expense_Category | Expense_SubCategory
    //  | Date | Amount | AmountQuery | MerchantName | Expense_Id | UserName"

    var queryObject = new Object();

    var expenseRecordDetails = GlobalsForServiceModule.expenseRecordRequiredFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of expenseRecordDetails) {

        if( HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord)) ) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase => collectionName :" + collectionName);
    console.log("ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Expense Records

    if (queryObject.length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Internal Server Error while querying for specific Records from ExpenseDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if ( !HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Null Records returned for ExpenseDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Internal Server Error while querying for all the Records from ExpenseDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if ( HelperUtilsModule.valueDefined(result) ) {

                var failureMessage = "ExpenseRecordQueryUtils.retrieveRecordFromExpenseDetailsDatabase : Null Records returned for ExpenseDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);

        });

    }

}

