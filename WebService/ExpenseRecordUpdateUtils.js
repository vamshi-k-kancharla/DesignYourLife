
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
 * Update Operations ( Create, Update & Remove ) of Expense Records
 * 
 **************************************************************************
 **************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var ExpenseRecordsUpdateModule = require('./ExpenseRecordUpdateUtils');
var QueryBuilderModule = require('./QueryBuilder');
var BudgetAnalyticsUpdateModule = require('./BudgetAnalyticsUpdateUtils');
var ExcelJSHelperUtilsModule = require('./ExcelJSHelperUtils');
var ExpenseMultipleRecordsUpdateModule = require('./Expense_MultipleRecords_UpdateUtils');
var PdfJSHelperUtilsModule = require('./PDFJSHelperUtils');
var ImageJSHelperUtilsModule = require('./ImageJSHelperUtils');


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
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Expense database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addExpenseRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("ExpenseRecordUpdateUtils.addExpenseRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "ExpenseRecordUpdateUtils.addExpenseRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addExpenseRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addExpenseRecordToDatabase : All <K,V> pairs are present, Adding Expense Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Expense Object and add to the Expense Details Database

    var expenseRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from expense_object values before adding to MongoDB

    expenseRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(expenseRecordObject);

    //addRecordToExpenseDetailsDatabase(dbConnection,
    chequeUniquenessAndAddExpenseRecord(dbConnection,
        collectionName,
        expenseRecordObject,
        "AddExpenseRecord",
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

function addRecordToExpenseDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Add Otherwise

    var query = null;

    console.log("addRecordToExpenseDetailsDatabase => collectionName :" + collectionName + ", Expense_Id :" + document_Object.Expense_Id);

    if ( HelperUtilsModule.valueDefined(document_Object.Expense_Id) ) {

        query = { Expense_Id: document_Object.Expense_Id };
    }

    if (query) {

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("ExpenseRecordUpdateUtils.addRecordToExpenseDetailsDatabase : Internal Server Error while querying for record to be inserted");

                var failureMessage = "ExpenseRecordUpdateUtils.addRecordToExpenseDetailsDatabase : Internal Server Error while querying for record to be inserted";
                HelperUtilsModule.logInternalServerError("addRecordToExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating the existing Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    } else {

        // Record Addition

        console.log("No Expense_Id in input Object, Adding New Record without primary keys");
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

function chequeUniquenessAndAddExpenseRecord(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Build Query for Uniqueness check

    console.log("ExpenseRecordUpdateUtils.chequeUniquenessAndAddExpenseRecord => collectionName :" + collectionName +
        ", Expense_Id :" + document_Object.Expense_Id);


    // Build Uniqueness Query

    var queryObjectForUniqueExpenseId = QueryBuilderModule.buildQuery_MatchAllFields(
        GlobalsForServiceModule.expenseRecordData_UniqueFields,
        document_Object);
    var queryObjectForDuplicateExpenseCheck = QueryBuilderModule.buildQuery_MatchAllFields(
        GlobalsForServiceModule.expenseRecordData_AtleastOneValueShouldBeDifferent,
        document_Object);

    var checkUniquenessQuery = QueryBuilderModule.buildSpecificLogicalQueryBasedOnQueryObjects(queryObjectForUniqueExpenseId,
        queryObjectForDuplicateExpenseCheck, "$or");


    // Add Expense Record after uniqueness checks

    if (checkUniquenessQuery) {

        dbConnection.collection(collectionName).findOne(checkUniquenessQuery, function (err, result) {

            if (err) {

                console.error("ExpenseRecordUpdateUtils.chequeUniquenessAndAddExpenseRecord : " +
                    "Internal Server Error while checking for uniqueness of record to be inserted");

                var failureMessage = "Internal Server Error while checking for uniqueness of record to be inserted";
                HelperUtilsModule.logInternalServerError("chequeUniquenessAndAddExpenseRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("ExpenseRecordUpdateUtils.chequeUniquenessAndAddExpenseRecord : " +
                    "Uniqueness checks passed, Adding New Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object,
                    clientRequest, http_response, BudgetAnalyticsUpdateModule.updateExpenseData);

            }
            else {

                // Uniqueness checks failed. Returning Error

                console.error("ExpenseRecordUpdateUtils.chequeUniquenessAndAddExpenseRecord : " +
                    " Record already exists with current values : Expense_Id Should be unique & No duplicate expense");

                var failureMessage = " Record already exists with current values : Expense_Id Should be unique & No duplicate expense";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessAndAddBudgetRecord", failureMessage, http_response);

                return;
            }

        });

    } else {

        console.error("ExpenseRecordUpdateUtils.chequeUniquenessAndAddExpenseRecord : " +
            " Internal Server Error while building uniqueness query of expense Record");

        var failureMessage = " Internal Server Error while building uniqueness query of expense Record";
        HelperUtilsModule.logInternalServerError("checkUniquenessAndAddBudgetRecord", failureMessage, http_response);

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in Expense Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateExpenseRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("ExpenseRecordUpdateUtils.updateExpenseRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the Expense Object and update it in the Expense Details Database

    var expenseRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from expense_object values before updating record in MongoDB

    expenseRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(expenseRecordObject);

    updateRecordInExpenseDetailsDatabase(dbConnection,
        collectionName,
        expenseRecordObject,
        "UpdateExpenseRecord",
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

function updateRecordInExpenseDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = null;

    console.log("ExpenseRecordUpdateUtils.updateRecordToExpenseDetailsDatabase => collectionName :" + collectionName +
        ", Expense_Id :" + document_Object.Expense_Id);

    if (HelperUtilsModule.valueDefined(document_Object.Expense_Id)) {

        query = { Expense_Id: document_Object.Expense_Id };
    }

    if (query == null) {

        // Expense_Id not present in input : Return Record Not present Error

        console.error("ExpenseRecordUpdateUtils.updateRecordToExpenseDetailsDatabase : " +
            " Expense_Id must be present in input request to update expense details in database");

        var failureMessage = " Expense_Id must be present in input request to update expense details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordToExpenseDetailsDatabase", failureMessage, http_response);

    } else {

        // Expense_Id present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("ExpenseRecordUpdateUtils.updateRecordToExpenseDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordToExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("ExpenseRecordUpdateUtils.updateRecordToExpenseDetailsDatabase : Requested Record is not present in expense details database");

                var failureMessage = "Requested Record is not present in expense details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordToExpenseDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be removed from Expense details database
 * @param {Collection} removeRecordKeys : Required keys for record removal
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeExpenseRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, removeRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("ExpenseRecordRemoveUtils.removeExpenseRecordInDatabase : Remove record based on input <k,v> pairs of Client Request : ");

    // Prepare the Expense Object and remove it from the Expense Details Database

    var expenseRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, removeRecordKeys);

    // Remove spaces from expense_object values before removing from MongoDB

    expenseRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(expenseRecordObject);

    removeRecordFromExpenseDetailsDatabase(dbConnection,
        collectionName,
        expenseRecordObject,
        "RemoveExpenseRecord",
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

function removeRecordFromExpenseDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Remove if Present ; Return Error response otherwise

    var query = new Object();

    console.log("ExpenseRecordRemoveUtils.removeRecordFromExpenseDetailsDatabase => collectionName :" + collectionName +
        ", Expense_Id :" + document_Object.Expense_Id);

    if (HelperUtilsModule.valueDefined(document_Object.Expense_Id)) {

        query.Expense_Id = document_Object.Expense_Id;
    }

    if (HelperUtilsModule.valueDefined(document_Object.Budget_Id)) {

        query.Budget_Id = document_Object.Budget_Id;
    }

    if (query == null) {

        // Expense_Id not present in input : Return Record Not present Error

        console.error("ExpenseRecordRemoveUtils.removeRecordFromExpenseDetailsDatabase : " +
            " Expense_Id must be present in input request to remove expense details in database");

        var failureMessage = " Expense_Id must be present in input request to remove expense details in database";
        HelperUtilsModule.logBadHttpRequestError("removeRecordFromExpenseDetailsDatabase", failureMessage, http_response);

    } else {

        // Expense_Id present in input : Add / Remove Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("ExpenseRecordRemoveUtils.removeRecordFromExpenseDetailsDatabase : Internal Server Error while querying for record to be removed");

                var failureMessage = "Internal Server Error while querying for record to be removed";
                HelperUtilsModule.logInternalServerError("removeRecordFromExpenseDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("ExpenseRecordRemoveUtils.removeRecordFromExpenseDetailsDatabase : Requested Record is not present in expense details database");

                var failureMessage = "Requested Record is not present in expense details database";
                HelperUtilsModule.logBadHttpRequestError("removeRecordFromExpenseDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Removal

                console.log("Record Found, Removing the existing Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.removeRecordFromDatabase(dbConnection, collectionName, query, clientRequest, http_response);
            }

        });

    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {Object} queryObject : query consisting of Budget_Id
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.removeExpenseRecordsForBudgetId = function (dbConnection, queryObject, http_response) {

    console.log("ExpenseRecordUpdateUtils.removeExpenseRecordsForBudgetId : Related table Data call from another DB CRUD operation : "
        + " Budget_Id : " + queryObject.Budget_Id);

    var recordObjectMap = HelperUtilsModule.buildMapFromObject(queryObject);

    for (var currentKey of recordObjectMap.keys()) {

        console.log("currentKey : " + currentKey);
        console.log("currentValue : " + recordObjectMap.get(currentKey));
    }

    var collectionName = GlobalsForServiceModule.expenseDetails_Table_Name;

    ExpenseRecordsUpdateModule.removeExpenseRecordInDatabase(dbConnection, collectionName, recordObjectMap,
        GlobalsForServiceModule.expenseRecordRequiredFields, http_response);

}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} expenseFileDataMap : Map of <K,V> Pairs ( Expenses_File_Data ) to be used for deriving Expense Record Map
 * @param {Collection} requiredDetailsCollection : required keys for Expense record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addExpenseRecordsToDatabase_ThroughFile = function (dbConnection, collectionName, expenseFileDataMap, requiredDetailsCollection,
    http_response) {

    var addExpenseCallBackParams = new Map();
    var recordObjectMap = new Map();

    recordObjectMap.set("Budget_Id", expenseFileDataMap.get("Budget_Id"));
    recordObjectMap.set("UserName", expenseFileDataMap.get("UserName"));
    recordObjectMap.set("Record_Id", "Expense_Id");

    addExpenseCallBackParams.set("dbConnection", dbConnection);
    addExpenseCallBackParams.set("collectionName", collectionName);
    addExpenseCallBackParams.set("requiredDetailsCollection", requiredDetailsCollection);
    addExpenseCallBackParams.set("http_response", http_response);
    addExpenseCallBackParams.set("recordObjectMap", recordObjectMap);

    // Build Expense RecordObjectMap

    if (expenseFileDataMap.get("FileType") == "xls") {

        ExcelJSHelperUtilsModule.buildRecordObjectMapFromInputFile(expenseFileDataMap,
            GlobalsForServiceModule.expenseFilesUploadDirectory, GlobalsForServiceModule.expenseFileDataColumnKeys,
            ExpenseMultipleRecordsUpdateModule.addExpenseRecordsToDatabase, addExpenseCallBackParams);

    } else if (expenseFileDataMap.get("FileType") == "pdf") {

        PdfJSHelperUtilsModule.buildRecordObjectMapFromPDFFile(expenseFileDataMap,
            GlobalsForServiceModule.expenseFilesUploadDirectory, GlobalsForServiceModule.expenseFileDataColumnKeys,
            ExpenseMultipleRecordsUpdateModule.addExpenseRecordsToDatabase, addExpenseCallBackParams);

    } else if (expenseFileDataMap.get("FileType") == "jpg" || expenseFileDataMap.get("FileType") == "tif"
        || expenseFileDataMap.get("FileType") == "png" || expenseFileDataMap.get("FileType") == "gif") {

        ImageJSHelperUtilsModule.buildRecordObjectMapFromImageFile(expenseFileDataMap,
            GlobalsForServiceModule.expenseFilesUploadDirectory, GlobalsForServiceModule.expenseFileDataColumnKeys,
            ExpenseMultipleRecordsUpdateModule.addExpenseRecordsToDatabase, addExpenseCallBackParams);

    }

}

