
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Update Operations ( Create, Update & Remove ) of Multiple Expense Records
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var GlobalsForServiceModule = require('./GlobalsForService');
var QueryBuilderModule = require('./QueryBuilder');
var BudgetAnalyticsUpdateModule = require('./BudgetAnalyticsUpdateUtils');
var ExpenseMultipleRecordsUpdateModule = require('./Expense_MultipleRecords_UpdateUtils.js');


/**********************************************************************************
 **********************************************************************************
 **********************************************************************************
 * 
 * Expense Records : CRUD operations Wrappers Module for Update/Add/Remove
 *                  DB Specific User Input/Output processing
 * 
 **********************************************************************************
 **********************************************************************************
 */


/**
 *
 * @param {Map} recordObjectArray : Array of input expense records from file
 * @param {Collection} requiredDetailsCollection : required keys for expense record addition
 *
 * @returns {Array} expenseRecordsWithRequiredParams : Array of expense records with required values
 * 
 */

exports.retrieveValidatedExpenseRecords = function (recordObjectArray, requiredDetailsCollection) {

    var expenseRecordsWithRequiredParams = new Array();

    // Check if all the required fields are present before adding the records

    for (var currentRecordObject of recordObjectArray) {

        var i = 0;

        for (; i < requiredDetailsCollection.length; i++) {

            var currentKey = requiredDetailsCollection[i];

            if (!HelperUtilsModule.valueDefined(currentRecordObject[currentKey])) {

                console.error("ExpenseMultipleRecordsUpdateUtils.retrieveValidatedExpenseRecords : " +
                    "Value corresponding to required Key doesn't exist => Required Key : " + currentKey + "in current Object => " +
                    HelperUtilsModule.returnObjectString(currentRecordObject));

                break;

            }
        }

        if (i == requiredDetailsCollection.length) {

            // Remove URL spaces from "expense record object values" before adding to MongoDB

            currentRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(currentRecordObject);
            expenseRecordsWithRequiredParams.push(currentRecordObject);
        }
    }

    return expenseRecordsWithRequiredParams;
}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Expense database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addExpenseRecordsToDatabase = function (dbConnection, collectionName, recordObjectArray, requiredDetailsCollection, http_response) {

    var expenseRecordsWithRequiredParams = ExpenseMultipleRecordsUpdateModule.retrieveValidatedExpenseRecords(recordObjectArray,
        requiredDetailsCollection);

    // Check if all the required fields are present before adding the records

    if (expenseRecordsWithRequiredParams.length == 0) {

        console.error("ExpenseMultipleRecordsUpdateUtils.addExpenseRecordsToDatabase : " +
            "None of the Expense Records uploaded from file are valid..required values are missing..");

        var failureMessage = "ExpenseMultipleRecordsUpdateUtils.addExpenseRecordsToDatabase : " +
            "None of the Expense Records uploaded from file are valid..required values are missing..";
        HelperUtilsModule.logBadHttpRequestError("addExpenseRecordsToDatabase", failureMessage, http_response);

        return;

    }

    console.log("addExpenseRecordsToDatabase : All <K,V> pairs are present in uploaded Expense Records from file, " +
        "Adding all expense Records in single instance => NoOfRecords getting added : " + expenseRecordsWithRequiredParams.length);

    chequeUniquenessAndAddMultipleExpenseRecords(dbConnection,
        collectionName,
        expenseRecordsWithRequiredParams,
        "AddMultipleExpenseRecords",
        http_response);

}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Array} inputRecordObjectsArray : Input Record Objects Array to retrieve unique records from
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.retrieveUniqueExpenseRecords = function (dbConnection, collectionName, inputRecordObjectsArray, clientRequest, http_response) {

    var uniqueExpenseRecords = new Array();
    var noOfDuplicateRecords = 0;

    console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
        "retrieve unique expense Records by checking uniqueness in database => Total no of Records : " + inputRecordObjectsArray.length);

    inputRecordObjectsArray.forEach( function (currentRecordObject, currentRecordObjectIndex, currentRecordObjectList) {

        // Build Uniqueness Query

        var queryObjectForUniqueExpenseId = QueryBuilderModule.buildQuery_MatchAllFields(
            GlobalsForServiceModule.expenseRecordData_UniqueFields,
            currentRecordObject);
        var queryObjectForDuplicateExpenseCheck = QueryBuilderModule.buildQuery_MatchAllFields(
            GlobalsForServiceModule.expenseRecordData_AtleastOneValueShouldBeDifferent,
            currentRecordObject);

        var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectForUniqueExpenseId,
            queryObjectForDuplicateExpenseCheck, "$or");

        console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
            "currentRecordObject : " + HelperUtilsModule.returnObjectString(currentRecordObject));

        console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
            "checkUniquenessQuery : " + HelperUtilsModule.returnObjectString(checkUniquenessQuery));

        // Add Expense Record after uniqueness checks

        if (HelperUtilsModule.valueDefined(checkUniquenessQuery)) {

            dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

                if (err) {

                    console.error("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
                        "Internal Server Error while checking for uniqueness of record in database");

                }

                var recordPresent = (result) ? "true" : "false";
                if (recordPresent == "false") {

                    // Record Addition

                    console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
                        "Uniqueness checks passed, Updating list of unique records => " + " ,with record : " +
                        HelperUtilsModule.returnObjectString(currentRecordObject));

                    uniqueExpenseRecords.push(currentRecordObject);

                    console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords => " +
                        "Unique Expense Records Built so Far : uniqueExpenseRecords => " +
                        HelperUtilsModule.returnStringForArrayOfObjects(uniqueExpenseRecords));

                } else {

                    // Uniqueness checks failed. Returning Error

                    console.error("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
                        " Record already exists with current values : No duplicate expense will be allowed to be added : " +
                        HelperUtilsModule.returnObjectString(currentRecordObject));

                    noOfDuplicateRecords++;
                }

                var numOfProcessedRecords = uniqueExpenseRecords.length + noOfDuplicateRecords;

                console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords : " +
                    "No of Processed Records so far => " + numOfProcessedRecords);

                if (numOfProcessedRecords == inputRecordObjectsArray.length) {

                    console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords => " +
                        "Bulk addition of unique expense Records : NoOfRecords => " + uniqueExpenseRecords.length);
                    console.log("ExpenseMultipleRecordsUpdateUtils.retrieveUniqueExpenseRecords => " +
                        "Bulk addition of unique expense Records : uniqueExpenseRecords => " +
                        HelperUtilsModule.returnStringForArrayOfObjects(uniqueExpenseRecords));

                    MongoDbCrudModule.directAdditionOfMultipleRecordsToDatabase(dbConnection, collectionName, uniqueExpenseRecords,
                        clientRequest, http_response, BudgetAnalyticsUpdateModule.updateExpenseData);

                }

            });

        }

    });

}


/**
* 
* @param {DbConnection} dbConnection  : Connection to database
* @param {String} collectionName  : Name of Table ( Collection )
* @param {Array} expenseRecordsWithRequiredParams : Array of expense Records to be added to database
* @param {String} clientRequest : Client Request from Web client
* @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
*
*/

function chequeUniquenessAndAddMultipleExpenseRecords(dbConnection, collectionName, expenseRecordsWithRequiredParams,
    clientRequest, http_response) {

    ExpenseMultipleRecordsUpdateModule.retrieveUniqueExpenseRecords(dbConnection, collectionName,
        expenseRecordsWithRequiredParams, clientRequest, http_response);

}

