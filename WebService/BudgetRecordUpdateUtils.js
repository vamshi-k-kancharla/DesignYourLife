
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * All CRUD Operations of Budget Records
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var ExpenseRecordsUpdateModule = require('./ExpenseRecordUpdateUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var QueryBuilderModule = require('./QueryBuilder');


/**********************************************************************************
 **********************************************************************************
 **********************************************************************************
 * 
 * Budget Records : CRUD operations Wrappers Module for Update/Add/Remove 
 *                  DB Specific User Input/Output processing
 * 
 **********************************************************************************
 **********************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Budget database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addBudgetRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("BudgetRecordUpdateUtils.addBudgetRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "BudgetRecordUpdateUtils.addBudgetRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addBudgetRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addBudgetRecordToDatabase : All <K,V> pairs are present, Adding Budget Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Budget Object and add to the Budget Details Database

    var budgetRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from budget_object values before adding to MongoDB

    budgetRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(budgetRecordObject);

    //addRecordToBudgetDetailsDatabase(dbConnection,
    checkUniquenessAndAddBudgetRecord(dbConnection,
        collectionName,
        budgetRecordObject,
        "AddBudgetRecord",
        http_response);

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function addRecordToBudgetDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    var query = null;

    console.log("addRecordToBudgetDetailsDatabase => collectionName :" + collectionName + ", Budget_Id :" + document_Object.Budget_Id);

    if ( HelperUtilsModule.valueDefined(document_Object.Budget_Id) ) {

        query = { Budget_Id: document_Object.Budget_Id };
    }

    if (query) {

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("BudgetRecordUpdateUtils.addRecordToBudgetDetailsDatabase : Internal Server Error while querying for record to be inserted");

                var failureMessage = "BudgetRecordUpdateUtils.addRecordToBudgetDetailsDatabase : Internal Server Error while querying for record to be inserted";
                HelperUtilsModule.logInternalServerError("addRecordToBudgetDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Record => " + " Budget_Id : " + document_Object.Budget_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating the existing Record => " + " Budget_Id : " + document_Object.Budget_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    } else {

        // Record Addition

        console.log("No Budget_Id in input Object, Adding New Record without primary keys");
        MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function checkUniquenessAndAddBudgetRecord(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    console.log("BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord => collectionName :" + collectionName +
        ", Budget_Id :" + document_Object.Budget_Id);

    // Build Uniqueness Query
    
    var queryObjectForUniqueBudgetId = { Budget_Id: document_Object.Budget_Id };
    var queryObjectForGroupValueChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.budgetRecordData_AtleastOneValueShouldBeDifferent,
        document_Object);
    var queryObjectForSameNameChecks = QueryBuilderModule.buildQuery_MatchAllFields(GlobalsForServiceModule.budgetRecordData_NameFileds,
        document_Object);

    var queryObjectLogicalIntermediate = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectForGroupValueChecks,
        queryObjectForUniqueBudgetId, "$or");
    var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectLogicalIntermediate,
        queryObjectForSameNameChecks, "$or");

    // Add Budget Record after uniqueness checks

    if (checkUniquenessQuery) {

        dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

            if (err) {

                console.error("BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
                    " Internal Server Error while querying for uniqueness of budget Record");

                var failureMessage = "BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
                    " Internal Server Error while querying for uniqueness of budget Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessAndAddBudgetRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Uniqueness checks passed, Adding New Record => " + " Budget_Id : " + document_Object.Budget_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Uniqueness checks failed. Returning Error

                console.error("BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
                    " Record already exists with current record values : uniqueness of budget record was not satisfied => " +
                    " Budget_Id, BudgetName_For_User must be unique. For a particular budget name atleast one of other record values must be different");

                var failureMessage = "BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
                    " Record already exists with current record values : uniqueness of budget record was not satisfied => " +
                    " Budget_Id, BudgetName_For_User must be unique. For a particular budget name atleast one of other record values must be different";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessAndAddBudgetRecord", failureMessage, http_response);

                return;
            }

        });

    } else {

        console.error("BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
            " Internal Server Error while building uniqueness query of budget Record");

        var failureMessage = "BudgetRecordUpdateUtils.checkUniquenessAndAddBudgetRecord : " +
            " Internal Server Error while building uniqueness query of budget Record";
        HelperUtilsModule.logInternalServerError("checkUniquenessAndAddBudgetRecord", failureMessage, http_response);

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in Budget Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateBudgetRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("BudgetRecordUpdateUtils.updateBudgetRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the Budget Object and update it in the Budget Details Database

    var budgetRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from budget_object values before updating record in MongoDB

    budgetRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(budgetRecordObject);

    updateRecordInBudgetDetailsDatabase(dbConnection,
        collectionName,
        budgetRecordObject,
        "UpdateBudgetRecord",
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the update Record DB Request API : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be updated ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function updateRecordInBudgetDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = null;

    console.log("BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase => collectionName :" + collectionName +
        ", Budget_Id :" + document_Object.Budget_Id);

    if (HelperUtilsModule.valueDefined(document_Object.Budget_Id)) {

        query = { Budget_Id: document_Object.Budget_Id };
    }

    if (query == null) {

        // Budget_Id not present in input : Return Record Not present Error

        console.error("BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : " +
            " Budget_Id must be present in input request to update budget details in database");

        var failureMessage = "BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : " +
            " Budget_Id must be present in input request to update budget details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToBudgetDetailsDatabase", failureMessage, http_response);

    } else {

        // Budget_Id present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordToBudgetDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : Requested Record is not present in budget details database");

                var failureMessage = "BudgetRecordUpdateUtils.updateRecordToBudgetDetailsDatabase : Requested Record is not present in budget details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordToBudgetDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + " Budget_Id : " + document_Object.Budget_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be removed from Budget details database
 * @param {Collection} removeRecordKeys : Required keys for record removal
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeBudgetRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, removeRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("BudgetRecordRemoveUtils.removeBudgetRecordInDatabase : Remove record based on input <k,v> pairs of Client Request : ");

    // Prepare the Budget Object and remove it from the Budget Details Database

    var budgetRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, removeRecordKeys);

    // Remove spaces from budget_object values before removing from MongoDB

    budgetRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(budgetRecordObject);

    removeRecordFromBudgetDetailsDatabase(dbConnection,
        collectionName,
        budgetRecordObject,
        "RemoveBudgetRecord",
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the Remove Record DB API Request : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be removed ( Record, Row in Table )
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function removeRecordFromBudgetDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Remove if Present ; Return Error response otherwise

    var query = new Object();

    console.log("BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase => collectionName :" + collectionName +
        ", Budget_Id :" + document_Object.Budget_Id);

    if (HelperUtilsModule.valueDefined(document_Object.Budget_Id)) {

        query.Budget_Id = document_Object.Budget_Id;
    }

    if (query == null) {

        // Budget_Id not present in input : Return Record Not present Error

        console.error("BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : " +
            " Budget_Id must be present in input request to remove budget details in database");

        var failureMessage = "BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : " +
            " Budget_Id must be present in input request to remove budget details in database";
        HelperUtilsModule.logBadHttpRequestError("removeRecordFromBudgetDetailsDatabase", failureMessage, http_response);

    } else {

        // Budget_Id present in input : Add / Remove Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : Internal Server Error while querying for record to be removed");

                var failureMessage = "BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : Internal Server Error while querying for record to be removed";
                HelperUtilsModule.logInternalServerError("removeRecordFromBudgetDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : Requested Record is not present in budget details database");

                var failureMessage = "BudgetRecordRemoveUtils.removeRecordFromBudgetDetailsDatabase : Requested Record is not present in budget details database";
                HelperUtilsModule.logBadHttpRequestError("removeRecordFromBudgetDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Removal

                console.log("Record Found, Removing the existing Record => " + " Budget_Id : " + document_Object.Budget_Id);
                MongoDbCrudModule.removeRecordFromDatabase(dbConnection, collectionName, query, clientRequest, http_response,
                    ExpenseRecordsUpdateModule.removeExpenseRecordsForBudgetId, query);

            }

        });

    }

}


