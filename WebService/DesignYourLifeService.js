
/*************************************************************************
 * 
 * 
 * =================
 * To Do List:
 * =================
 * 
 * Decrypt the Client Requests after moving to HTTPS mode
 * Check for Uniqueness of UserName before Registration
 * 
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables
 * 
 *************************************************************************/

// Generic Variables Global

var http = require('http');
var url = require('url');
var fileSystem = require('fs');

var globalsForServiceModule = require('./GlobalsForService');
var HelperUtilsModule = require('./HelperUtils');

var UserAuthenticationModule = require('./UserAuthentication');
var UserRecordsQueryAndUpdatesModule = require('./UserRecordsQueryAndUpdates');

var BudgetRecordsUpdateModule = require('./BudgetRecordUpdateUtils');
var BudgetRecordsQueryModule = require('./BudgetRecordQueryUtils');
var ExpenseRecordsUpdateModule = require('./ExpenseRecordUpdateUtils');
var ExpenseRecordsQueryModule = require('./ExpenseRecordQueryUtils');
var BudgetAnalyticsQueryModule = require('./BudgetAnalyticsQueryUtils');


/**************************************************************************
 **************************************************************************
 * 
 *  Main Service Module : DesignYourLife Web Service
 *  
 *  Start DesignYourLife Web Server and serve requests from web client
 *
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {XMLHttpRequest} http_request  : HTTP Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

http.createServer(function (http_request, http_response) {

    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    if (http_request.url == null || http_request.url == "/favicon.ico") {

        console.log("unexpected http_request.url : " + http_request.url);
        return;
    }

    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Parse the params from Web requests

    console.log("http_request.url : " + http_request.url);
    console.log("http_request.url.query : " + (url.parse(http_request.url)).query);

    var requestParams = (url.parse(http_request.url)).query;

    if (requestParams == null || requestParams == "") {

        console.log("Null /Empty http_request.url.query :");
        return;
    }

    // Extract Query Parameters

    var requestParamsCollection = requestParams.split("&");

    // Handle special characters (&) of file data ( File Upload Requests )

    requestParamsCollection = HelperUtilsModule.handleSpecialCharacters_FileUploadRequests(requestParamsCollection);

    console.log("requestParamsMap after parsing URL : ");
    console.log(requestParamsCollection);

    var clientRequestWithParamsMap = HelperUtilsModule.parseWebClientRequest(requestParamsCollection);
    console.log("Parsed the Web Client Request : " + clientRequestWithParamsMap.get("Client_Request"));

    var webClientRequest = clientRequestWithParamsMap.get("Client_Request");

    // Connect to "DesignYourLife" db for "User Registration & Authentication"

    if (webClientRequest == "UserRegistration" || webClientRequest == "UserAuthentication" ||
        webClientRequest == "RetrieveUserDetails" || webClientRequest == "UpdateUserProfile") {

        handleUserDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "AddBudget" || webClientRequest == "UpdateBudget" ||
        webClientRequest == "RetrieveBudgetDetails" || webClientRequest == "RemoveBudget") {

        // Connect to "DesignYourLife" db for "Budget Related CRUD operations"

        handleBudgetDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "AddExpense" || webClientRequest == "RetrieveExpenseDetails" ||
        webClientRequest == "UpdateExpense") {

        // Connect to "DesignYourLife" db for "Expense Related CRUD operations"

        handleExpensesDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "CustomUploadFile") {

        handleFileUploadRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "RetrieveBudgetAnalytics") {

        // Connect to "DesignYourLife" db for "Budget Analytics CRUD Operations"

        globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourLifeDbUrl, function (err, db) {

            console.log("Inside the connection to DesignYourLife Mongo DB");

            if (err != null) {

                console.error("DesignYourLifeWebService.createServer : " +
                    "Server Error while connecting to DesignYourLife mongo db :" + globalsForServiceModule.mongoDesignYourLifeDbUrl);

                var failureMessage = "DesignYourLifeWebService.createServer : " +
                    "Server Error while connecting to DesignYourLife mongo db :" + globalsForServiceModule.mongoDesignYourLifeDbUrl;
                HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

            } else {

                // Accessing Database for further exploration 

                console.log("Connecting to database for Budget Analytics: ");
                globalsForServiceModule.designYourLifeDbConnection = db.db(globalsForServiceModule.designYourLife_Database_Name);

                handleBudgetAnalyticsDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

                console.log("Successfully connected to DesignYourLife Details MongoDb : " +
                    globalsForServiceModule.mongoDesignYourLifeDbUrl);

            }

        });

    } else {

        console.error("DesignYourLifeWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting");

        var failureMessage = "DesignYourLifeWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting";
        HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

    }

    //  close the db connection

    //db.close();
    //console.log("Closed the Db connection successfully");

    delete global.window;
    delete global.navigator;
    delete global.btoa;

}).listen(globalsForServiceModule.port);



/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleUserDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var designYourLife_Database_Name;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourLifeDbUrl, function (err, db) {

        console.log("Inside the connection to DesignYourLife Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to DesignYourLife mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to DesignYourLife mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        } else {

            console.log("Successfully connected to DesignYourLife Details MongoDb : " + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            // Database Creation

            console.log("Creating / Retrieving User Details Database : ");
            designYourLife_Database_Name = db.db(globalsForServiceModule.designYourLife_Database_Name);

            // Table( Collection ) Creation

            designYourLife_Database_Name.createCollection(globalsForServiceModule.userDetails_TableName, function (err, result) {

                if (err) {

                    console.error("DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
                        + globalsForServiceModule.userDetails_TableName);

                    var failureMessage = "DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
                        + globalsForServiceModule.userDetails_TableName;
                    HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (userDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of User Registration and Authentication");

                // Redirect the web Requests based on Query Key => Client_Request

                switch (webClientRequest) {

                    case "UserRegistration":

                        console.log("Adding User Registration Record to Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.addUserRecordToDatabase(designYourLife_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed User Registration call");

                        break;

                    case "UserAuthentication":

                        UserAuthenticationModule.validateUserCredentials(designYourLife_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed User Authentication call");

                        break;

                    case "UpdateUserProfile":

                        console.log("Updating User Profile in User Details Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.updateUserRecordInDatabase(designYourLife_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed UserProfile Update call");

                        break;

                    case "RetrieveUserDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside User Registration & Auth Switch : " +
                            "RetrieveUserDetails : UserName : " + clientRequestWithParamsMap.get("UserName"));

                        // Build Query

                        var queryMap = new Map();
                        var userName = clientRequestWithParamsMap.get("UserName");

                        if (HelperUtilsModule.valueDefined(userName)) {

                            queryMap.set("UserName", userName);
                        }

                        // DB query & Reponse Building

                        UserRecordsQueryAndUpdatesModule.retrieveRecordFromUserDetailsDatabase(designYourLife_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            queryMap,
                            UserRecordsQueryAndUpdatesModule.handleQueryResults,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Successfully placed RetrieveUserDetails call");

                        break;

                    default:

                        console.error("DesignYourLifeWebService.createServer : Inappropriate Web Client Request received...exiting");

                        var failureMessage = "DesignYourLifeWebService : Inappropriate Web Client Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

                        break;

                }

            });

        }

    });

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleBudgetDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_BudgetDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourLifeDbUrl, function (err, db) {

        console.log("Inside the connection to BudgetDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to BudgetDetails MongoDb : " + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            // Database Creation

            console.log("Creating / Retrieving BudgetDetails Database : ");
            dbConnection_BudgetDetails_Database = db.db(globalsForServiceModule.designYourLife_Database_Name);

            // Table( Collection ) Creation

            dbConnection_BudgetDetails_Database.createCollection(globalsForServiceModule.budgetDetails_Table_Name, function (err, result) {

                if (err) {

                    console.error("DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in Budget Details mongoDb : "
                        + globalsForServiceModule.budgetDetails_Table_Name);

                    var failureMessage = "DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in Budget Details mongoDb : "
                        + globalsForServiceModule.budgetDetails_Table_Name;
                    HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (budgetDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of Budget CRUD operations");

                // Redirect the web Requests based on Query => Client_Request

                switch (webClientRequest) {

                    case "AddBudget":

                        BudgetRecordsUpdateModule.addBudgetRecordToDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Add Budget Record call");

                        break;

                    case "UpdateBudget":

                        BudgetRecordsUpdateModule.updateBudgetRecordInDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Update Budget Record call");

                        break;

                    case "RetrieveBudgetDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside Budget Details Switch : " +
                            "RetrieveBudetDetails : BudgetName : " + clientRequestWithParamsMap.get("Name"));

                        // DB query & Reponse Building

                        BudgetRecordsQueryModule.retrieveRecordFromBudgetDetailsDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            BudgetRecordsQueryModule.handleQueryResults,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Successfully placed Retrieve_Budget_Records call");

                        break;

                    case "RemoveBudget":

                        BudgetRecordsUpdateModule.removeBudgetRecordInDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Remove Budget Record call");

                        break;

                    default:

                        console.error("DesignYourLifeWebService.createServer : Inappropriate WebClient Request received...exiting");

                        var failureMessage = "DesignYourLifeWebService : Inappropriate WebClient Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

                        break;

                }

            });

        }

    });

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleExpensesDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_ExpenseDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourLifeDbUrl, function (err, db) {

        console.log("Inside the connection to ExpenseDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to ExpenseDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to ExpenseDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourLifeDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to ExpenseDetails MongoDb : " + globalsForServiceModule.mongoDesignYourLifeDbUrl);

            // Database Creation

            console.log("Creating / Retrieving ExpenseDetails Database : ");
            dbConnection_ExpenseDetails_Database = db.db(globalsForServiceModule.designYourLife_Database_Name);

            // Table( Collection ) Creation / Access

            dbConnection_ExpenseDetails_Database.createCollection(globalsForServiceModule.expenseDetails_Table_Name, function (err, result) {

                if (err) {

                    console.error("DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in Expense Details mongoDb : "
                        + globalsForServiceModule.expenseDetails_Table_Name);

                    var failureMessage = "DesignYourLifeWebService.createServer : Error while creating / retrieving Collection ( Table ) in Expense Details mongoDb : "
                        + globalsForServiceModule.expenseDetails_Table_Name;
                    HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (ExpenseDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of Expense CRUD operations");

                // Redirect the web Requests based on Query => Client_Request

                switch (webClientRequest) {

                    case "AddExpense":

                        ExpenseRecordsUpdateModule.addExpenseRecordToDatabase(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.expenseRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Add Expense Record call");

                        break;

                    case "UpdateExpense":

                        ExpenseRecordsUpdateModule.updateExpenseRecordInDatabase(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.expenseRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Update Expense Record call");

                        break;

                    case "RetrieveExpenseDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside Expense Details Switch : " +
                            "RetrieveBudetDetails : ExpenseName : " + clientRequestWithParamsMap.get("Name"));

                        // DB query & Reponse Building

                        ExpenseRecordsQueryModule.retrieveRecordFromExpenseDetailsDatabase(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            clientRequestWithParamsMap,
                            ExpenseRecordsQueryModule.handleQueryResults,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Successfully placed Retrieve_Expense_Records call");

                        break;

                    case "RemoveExpense":

                        ExpenseRecordsUpdateModule.removeExpenseRecordInDatabase(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.expenseRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Remove Expense Record call");

                        break;

                    default:

                        console.error("DesignYourLifeWebService.createServer : Inappropriate WebClient Request received...exiting");

                        var failureMessage = "DesignYourLifeWebService : Inappropriate WebClient Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

                        break;

                }

            });

        }

    });

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleBudgetAnalyticsDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {


    // Budget Analytics Table( Collection ) Creation / Access

    globalsForServiceModule.designYourLifeDbConnection.createCollection(globalsForServiceModule.budgetAnalytics_TableName,
        function (err, result) {

        if (err) {

            console.error("DesignYourLifeWebService.createServer : " +
                "Error while creating / retrieving Budget Analytics Collection(Table) from mongoDb: "
                + globalsForServiceModule.budgetAnalytics_TableName);

            var failureMessage = "DesignYourLifeWebService.createServer : " +
                "Error while creating / retrieving Budget Analytics Collection(Table) from mongoDb: "
                + globalsForServiceModule.budgetAnalytics_TableName;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

            return;
        }

        console.log("Successfully created / retrieved collection (BudgetAnalyticsCollection)");
        console.log("Created / retrieved Collection ( Table ) : Now taking care of Analytics CRUD operations");

        // Redirect the web Requests based on Query => Client_Request

        switch (webClientRequest) {

            case "RetrieveBudgetAnalytics":

                console.log("DesignYourLifeWebService.createServer : Inside Budget Analytics Switch : " +
                    "RetrieveBudgetAnalytics : Budget_Id : " + clientRequestWithParamsMap.get("Budget_Id"));

                // DB query & Reponse Building

                BudgetAnalyticsQueryModule.retrieveRecordFromBudgetAnalyticsDatabase(globalsForServiceModule.designYourLifeDbConnection,
                    globalsForServiceModule.budgetAnalytics_TableName,
                    clientRequestWithParamsMap,
                    BudgetAnalyticsQueryModule.handleQueryResults,
                    http_response);

                console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                    "Successfully placed Retrieve_Budget_Analytics_Record call");

                break;

            default:

                console.error("DesignYourLifeWebService.createServer : Inappropriate WebClient Request received...exiting");

                var failureMessage = "DesignYourLifeWebService : Inappropriate WebClient Request received...exiting";
                HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

                break;

        }

    });

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleFileUploadRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    switch (webClientRequest) {

        case "CustomUploadFile":

            console.log("DesignYourLifeWebService.handleFileUploadRequests : Uploaded File : " + clientRequestWithParamsMap.get("FileName"));

            var clientRequestWithParamsMap = HelperUtilsModule.removeUrlSpacesFromMapValues(clientRequestWithParamsMap);

            fileSystem.writeFile(globalsForServiceModule.expenseFilesUploadDirectory + clientRequestWithParamsMap.get("FileName"),
                clientRequestWithParamsMap.get("FileData"),
                function (err) {

                    if (err) {

                        console.error("DesignYourLifeWebService.handleFileUploadRequests : Error while creating recently uploaded file: "
                            + clientRequestWithParamsMap.get("FileName"));

                        var failureMessage = "DesignYourLifeWebService.handleFileUploadRequests: Error while creating recently uploaded file: "
                            + clientRequestWithParamsMap.get("FileName");
                        HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.handleFileUploadRequests",
                            failureMessage, http_response);

                        return;

                    } else {

                        console.error("DesignYourLifeWebService.handleFileUploadRequests : Successfully created new file: "
                            + clientRequestWithParamsMap.get("FileName"));

                        var successMessage = "DesignYourLifeWebService.handleFileUploadRequests: Successfully created new file: "
                            + clientRequestWithParamsMap.get("FileName");
                        HelperUtilsModule.buildSuccessResponse_Generic("DesignYourLifeWebService.handleFileUploadRequests",
                            successMessage, http_response);

                        return;

                    }

                });

            break;

        default:

            console.error("DesignYourLifeWebService.handleFileUploadRequests : Inappropriate WebClient Request received...exiting");

            var failureMessage = "DesignYourLifeWebService : Inappropriate WebClient Request received...exiting";
            HelperUtilsModule.logBadHttpRequestError("DesignYourLifeWebService", failureMessage, http_response);

            break;

    }

}


