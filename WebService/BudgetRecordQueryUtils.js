
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to retrieve budget records based on input queries
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 * Globals : Trade And LC Objects
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var mongoDbCrudModule = require('./MongoDbCRUD');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Budget Records : CRUD operations Wrappers Module
 *                  DB Specific User Input/Output processing
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {any} err  : Error returned to callback function
 * @param {any} result  : Database Query Result ( List of Records : 1 - n )
 * @param       req  : Web Client Request
 * @param       res  : Reponse To be built
 * @param {any} queryType  : Type of Query Result ( SingleTradeRecord, SingleLcRecord, AllRecords ) to be processed
 *
 */

exports.handleQueryResults = function (err, queryResult, req, res, queryType) {

    if (err) {

        console.error("TradeAndLCRecordUpdates.handleQueryResults : Internal Server during record retrieval query execution");

        var failureMessage = "TradeAndLCRecordUpdates.handleQueryResults : Internal Server during record retrieval query execution";
        HelperUtilsModule.logInternalServerError("handleQueryResults", failureMessage, http_Response);

        return;
    }

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function (mongoDbCrudModule.retrieveRecordFromTradeAndLcDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult, queryType);

    // Build Success Response with Query Results

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(queryResponse_JSON_String);

    console.log("handleQueryResults: Written Success response for input query : " + queryResponse_JSON_String);
}


/**
 * 
 * @param {any} queryResult  : query Response received from Mongo DB
 * @param {any} queryType  : query Type for which JSON Response has to be built
 *
 */

function buildQueryResponse_JSON(queryResult, queryType) {

    var queryResponse_JSON = null;

    if (queryType == "SingleTradeRecord") {

        return JSON.stringify(buildTradeRecord_JSON(queryResult));

    } else if (queryType == "SingleLcRecord") {

        return JSON.stringify(buildLcRecord_JSON(queryResult));

    } else if (queryType == "TradeDetailsBasedOnUser") {

        var queryResponse_TradeRecords_JSON_String = "";

        for (var i = 0; i < queryResult.length; i++) {

            if (queryResult[i].Lc_Id == null || queryResult[i].Lc_Id == undefined) {

                queryResponse_TradeRecords_JSON_String += JSON.stringify(buildTradeRecord_JSON(queryResult[i]));
                queryResponse_TradeRecords_JSON_String += "\n";
            }

        }

        return queryResponse_TradeRecords_JSON_String;

    } else if (queryType == "LCDetailsBasedOnUser") {

        var queryResponse_LCRecords_JSON_String = "";

        for (var i = 0; i < queryResult.length; i++) {

            if (queryResult[i].Lc_Id != null && queryResult[i].Lc_Id != undefined) {

                queryResponse_LCRecords_JSON_String += JSON.stringify(buildLcRecord_JSON(queryResult[i]));
                queryResponse_LCRecords_JSON_String += "\n";

            }
        }

        return queryResponse_LCRecords_JSON_String;

    } else {

        var queryResponse_AllRecords_JSON_String = "";

        for (var i = 0; i < queryResult.length; i++) {

            if (queryResult[i].Lc_Id != null && queryResult[i].Lc_Id != undefined) {

                queryResponse_AllRecords_JSON_String += JSON.stringify(buildLcRecord_JSON(queryResult[i]));
                queryResponse_AllRecords_JSON_String += "\n";

            } else {

                queryResponse_AllRecords_JSON_String += JSON.stringify(buildTradeRecord_JSON(queryResult[i]));
                queryResponse_AllRecords_JSON_String += "\n";
            }

        }

        return queryResponse_AllRecords_JSON_String;
    }

    return queryResponse_JSON;
}


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Trade and LC record Query & Response Building
 * 
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * 
 * @param {any[Optional]} Trade_Id : query Key => Trade Id
 * @param {any[Optional]} Lc_Id : query Key => Letter of Credit Id
 * 
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to generate LC
 * @param {Function} handleQueryResults  : Call back function to handle the Query Results
 * @param {XMLHttpRequest} http_request  : http request passed from web service handler
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordFromTradeAndLcDatabase = function (dbConnection, collectionName, /*Trade_Identifier, Lc_Identifier,*/
    clientRequestWithParamsMap, handleQueryResults, http_request, http_response) {

    // Record Retrieval based on "Lc_Id | Trade_Id | lcStatus | sellerBank"

    var queryObject = new Object();
    var queryType = "AllRecords";

    var tradeId = clientRequestWithParamsMap.get("Trade_Id");
    var lcId = clientRequestWithParamsMap.get("Lc_Id");
    var lcStatus = clientRequestWithParamsMap.get("LC_Status");
    var sellerBank = clientRequestWithParamsMap.get("SellerBank");
    var buyerBank = clientRequestWithParamsMap.get("Bank");

    var parameterList = "Trade_Id : " + tradeId + ", lc_Id : " + lcId + ", lc_Status : " + lcStatus + ", sellerBank : " + sellerBank
        + ", buyerBank : " + buyerBank;

    console.log("MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase => collectionName :" + collectionName);
    console.log("MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Called with Parameter List : " + parameterList);

    // Build Query Object

    if (HelperUtilsModule.valueDefined(tradeId)) {

        //query = { Trade_Id: tradeId };
        queryObject.Trade_Id = tradeId;
        queryType = "SingleTradeRecord";
    }

    if (HelperUtilsModule.valueDefined(lcId)) {

        //query = { Lc_Id: lcId };
        queryObject.Lc_Id = lcId;
        queryType = "SingleLcRecord";
    }

    if (HelperUtilsModule.valueDefined(lcStatus)) {

        queryObject.Current_Status = lcStatus;
        queryType = "specificRecords";
    }

    if (HelperUtilsModule.valueDefined(sellerBank)) {

        queryObject.SellerBank = sellerBank;
        queryType = "specificRecords";
    }

    if (HelperUtilsModule.valueDefined(buyerBank)) {

        queryObject.Bank = buyerBank;
        queryType = "specificRecords";
    }

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Trade & LC Records

    if (queryType == "SingleTradeRecord" || queryType == "SingleLcRecord") {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Internal Server Error while querying the Record from tradeAndLc Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            console.log("retrieveRecordFromTradeAndLcDatabase => Query for single Record => returned Answer : ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Null Records returned for TradeAndLC Record query => Trade_Id: " + Trade_Identifier + ", LC_Id: " + Lc_Identifier;
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(null, result, http_request, http_response, queryType);
        });

    } else if (queryType == "specificRecords") {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Internal Server Error while querying for specific Records from tradeAndLc Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            console.log("MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Null Records returned for TradeAndLC Record query For specific Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            queryType = "AllRecords";
            return handleQueryResults(null, result, http_request, http_response, queryType);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Internal Server Error while querying for all the Records from tradeAndLc Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            console.log("MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "MongoDbCRUD.retrieveRecordFromTradeAndLcDatabase : Null Records returned for TradeAndLC Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromTradeAndLcDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(null, result, http_request, http_response, queryType);
        });

    }
}

