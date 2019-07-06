
'use strict';

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD')
var cryptoModule = require('crypto');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * User Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * @param {XMLHttpRequest} http_request  : http request passed from web service handler
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, http_response) {

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("UserRecordsQueryAndUpdates.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_UserRecord_JSON_String  : JSON String of Retrieved User Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult) {

    var queryResponse_UserRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.User_Id)) {

            queryResponse_UserRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                GlobalsForServiceModule.userRegistrationData_RequiredFields));
            queryResponse_UserRecord_JSON_String += "\n";
        }

    }

    return queryResponse_UserRecord_JSON_String;
}


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

exports.retrieveRecordFromUserDetailsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // User Record Retrieval based on "User_Id || Name || User_Type || Email || Location || Address || UserName || Password"

    var queryObject = new Object();

    var userRecordDetails = GlobalsForServiceModule.userRegistrationData_RequiredFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of userRecordDetails) {

        if (HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord))) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase => collectionName :"
        + collectionName + ", queryObject.length :" + Object.keys(queryObject).length);
    console.log("UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for User Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Internal Server Error while querying for specific Records from UserDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Null Records returned for UserDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Internal Server Error while querying for all the Records from UserDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if (!HelperUtilsModule.valueDefined(result)) {

                var failureMessage = "UserRecordsQueryAndUpdates.retrieveRecordFromUserDetailsDatabase : Null Records returned for UserDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);

        });

    }

}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to User database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addUserRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    for (var i = 0; i < requiredDetailsCollection.length; i++) {

        var currentKey = requiredDetailsCollection[i];

        if (recordObjectMap.get(currentKey) == null) {

            console.error("UserRecordUpdateUtils.addUserRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey);

            var failureMessage = "UserRecordUpdateUtils.addUserRecordToDatabase : Value corresponding to required Key doesn't exist => Required Key : " + currentKey;
            HelperUtilsModule.logBadHttpRequestError("addUserRecordToDatabase", failureMessage, http_response);

            return;
        }

    }

    console.log("addUserRecordToDatabase : All <K,V> pairs are present, Adding User Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the User Object and add to the User Details Database

    var userRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    // Remove spaces from user_object values before adding to MongoDB

    userRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(userRecordObject);

    addRecordToUserDetailsDatabase(dbConnection,
        collectionName,
        userRecordObject,
        "UserRegistration",
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

function addRecordToUserDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    console.log("addRecordToUserDetailsDatabase => collectionName :" + collectionName + ", User_Id :" + document_Object.User_Id);

    // Check Uniqueness of "User_Id, Name, Email, UserName, Password"

    // Update if Present ; Add Otherwise

    var query = null;
    if (HelperUtilsModule.valueDefined(document_Object.User_Id)) {

        query = { User_Id: document_Object.User_Id };
    }

    // Encrypt Password before Registering/Updating User registration record

    document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

    // Register User Record

    if (query) {

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("UserRecordUpdateUtils.addRecordToUserDetailsDatabase : Internal Server Error while querying for record to be inserted");

                var failureMessage = "UserRecordUpdateUtils.addRecordToUserDetailsDatabase : Internal Server Error while querying for record to be inserted";
                HelperUtilsModule.logInternalServerError("addRecordToUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Record => " + " User_Id : " + document_Object.User_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating the existing Record => " + " User_Id : " + document_Object.User_Id);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    } else {

        // Record Addition

        console.log("No User_Id in input Object, Adding New Record without primary keys");
        MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);
    }

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in User Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateUserRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("UserRecordUpdateUtils.updateUserRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the User Object and update it in the User Details Database

    var userRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    // Remove spaces from user_object values before updating record in MongoDB

    userRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(userRecordObject);

    updateRecordInUserDetailsDatabase(dbConnection,
        collectionName,
        userRecordObject,
        "UpdateUserDetails",
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

function updateRecordInUserDetailsDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    var query = null;

    console.log("UserRecordUpdateUtils.updateRecordInUserDetailsDatabase => collectionName :" + collectionName +
        ", UserName :" + document_Object.UserName);

    if (HelperUtilsModule.valueDefined(document_Object.UserName)) {

        query = { UserName: document_Object.UserName };
    }

    if (query == null) {

        // UserName not present in input : Return "Record Not present" Error

        console.error("UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : " +
            " UserName must be present in input request to update user details in database");

        var failureMessage = "UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : " +
            " UserName must be present in input request to update user details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordInUserDetailsDatabase", failureMessage, http_response);

    } else {

        // UserName present in input : Add / Update Record

        dbConnection.collection(collectionName).findOne(query, function (err, result) {

            if (err) {

                console.error("UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : Internal Server Error while querying for record to be updated");

                var failureMessage = "UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : Internal Server Error while querying for record to be updated";
                HelperUtilsModule.logInternalServerError("updateRecordInUserDetailsDatabase", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Not Present : Return Record Not present Error

                console.error("UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : Requested Record is not present in user details database");

                var failureMessage = "UserRecordUpdateUtils.updateRecordInUserDetailsDatabase : Requested Record is not present in user details database";
                HelperUtilsModule.logBadHttpRequestError("updateRecordInUserDetailsDatabase", failureMessage, http_response);
            }
            else {

                // Record Present : Record Updation

                console.log("Record Found, Updating the existing Record => " + " UserName : " + document_Object.UserName);
                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, document_Object, query, clientRequest, http_response);
            }

        });

    }

}

