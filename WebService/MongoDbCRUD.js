
'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Mongo DB Connection Variables
 * 
*************************************************************************/

// Generic Variables Global

var bDebug = true;

var HelperUtilsModule = require('./HelperUtils');

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to handle => Direct CRUD Operations with MongoDB.
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} document_Object : Document object to be added ( Record, Row in Table )
 * @param {String} clientRequest : Request from Web Client
 * 
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 *
 */

exports.directAdditionOfRecordToDatabase = function (dbConnection, collectionName, document_Object, clientRequest, http_response) {

    // Record Addition

    dbConnection.collection(collectionName).insertOne(document_Object, function (err, result) {

        if (err) {
            console.error("MongoDbCRUD.directAdditionOfRecordToDatabase : Error while adding the Record to Database collection => " +
                collectionName);

            var failureMessage = "MongoDbCRUD.directAdditionOfRecordToDatabase : Internal Server Error adding the Record to Database collection => " +
                collectionName;
            HelperUtilsModule.logInternalServerError("directAdditionOfRecordToDatabase", failureMessage, http_response);

            return;
        }

        console.log("MongoDbCRUD.directAdditionOfRecordToDatabase : Successfully added the record to the Collection : " + collectionName);

        var successMessage = "Successfully added the record to the Collection : " + collectionName;
        HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

        console.log(result);

    });
}

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} document_Object : Document object to be added ( Record, Row in Table )
 * @param {Map} query : Query to identify the record to be updated
 * @param {String} clientRequest : Request from Web Client
 * 
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 *
 */

exports.directUpdationOfRecordToDatabase = function (dbConnection, collectionName, document_Object, query, clientRequest, http_response) {

    // Record Updation

    console.log("Added Query to Update operation : ");

    var newUpdateObject = { $set: document_Object };
    var udpateSert = {upsert: true};

    dbConnection.collection(collectionName).updateOne(query, newUpdateObject, udpateSert, function (err, result) {

        if (err) {
            console.error("MongoDbCRUD.directUpdationOfRecordToDatabase : Error while updating the Record to Database collection => " +
                collectionName);

            var failureMessage = "MongoDbCRUD.directUpdationOfRecordToDatabase : Internal Server Error updating the Record to Database collection => " +
                collectionName;
            HelperUtilsModule.logInternalServerError("directUpdationOfRecordToDatabase", failureMessage, http_response);

            return;
        }

        console.log("MongoDbCRUD.directUpdationOfRecordToDatabase : Successfully updated the record in database : Trade Id => " +
            document_Object.Trade_Id);
        var successMessage = "MongoDbCRUD.directUpdationOfRecordToDatabase : Successfully updated the record to the Collection : " +
            collectionName;
        HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

        console.log(result);
    });
}

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} query : Query to identify the record to be updated
 * @param {String} clientRequest : Request from Web Client
 *
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 *
 */

exports.removeRecordFromDatabase = function (dbConnection, collectionName, query, clientRequest, http_response) {

    console.log("removeRecordFromDatabase => collectionName :" + collectionName);

    // Record Deletion

    dbConnection.collection(collectionName).deleteMany(query, function (err, result) {

        if (err) {

            console.error("MongoDbCRUD.removeRecordFromDatabase : Error while deleting the Record from Database collection :" +
                collectionName);

            var failureMessage = "MongoDbCRUD.removeRecordFromDatabase : Error while deleting the Record from Database collection :" +
                collectionName;
            HelperUtilsModule.logInternalServerError("removeRecordFromTradeAndLcDatabase", failureMessage, http_response);

            return;
        }

        console.log("MongoDbCRUD.removeRecordFromDatabase : Successfully deleted the record from Database : ");
        var successMessage = "MongoDbCRUD.removeRecordFromDatabase : Successfully deleted the record from Database : ";
        HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

        console.log(result);
    });

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} query : Query to identify the record to be updated
 * @param {String} clientRequest : Request from Web Client
 *
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 * 
 */

exports.retrieveRecordsFromDatabase = function (dbConnection, collectionName, query, clientRequest, http_response) {

    console.log("retrieveRecordsFromDatabase => collectionName :" + collectionName);

    // Record Deletion

    if (Object.keys(query).length > 0) {

        dbConnection.collection(collectionName).find(query).toArray(function (err, result) {

            if (err) {

                var failureMessage = "MongoDbCRUD.retrieveRecordsFromDatabase : Internal Server Error while querying for specific Records from Database : " +
                    err;
                HelperUtilsModule.logInternalServerError(clientRequest, failureMessage, http_response);

                return;
            }

            console.log("MongoDbCRUD.retrieveRecordsFromDatabase : Successfully retrieved records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "MongoDbCRUD.retrieveRecordsFromDatabase : Null Records returned for Record query of specific Records";
                HelperUtilsModule.logBadHttpRequestError(clientRequest, failureMessage, http_response);

                return;
            }

            return handleQueryResults(null, result, http_request, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "MongoDbCRUD.retrieveRecordsFromDatabase : Internal Server Error while querying for all the Records from Database : " +
                    err;
                HelperUtilsModule.logInternalServerError(clientRequest, failureMessage, http_response);

                return;
            }

            console.log("MongoDbCRUD.retrieveRecordsFromDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "MongoDbCRUD.retrieveRecordsFromDatabase : Null Records returned for Record query of All Records";
                HelperUtilsModule.logBadHttpRequestError(clientRequest, failureMessage, http_response);

                return;
            }

            return handleQueryResults(null, result, http_request, http_response);
        });

    }

}

