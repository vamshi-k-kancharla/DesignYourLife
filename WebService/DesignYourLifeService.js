
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

var globalsForServiceModule = require('./GlobalsForService');

var mongoDbCrudModule = require('./MongoDbCRUD');
var HelperUtilsModule = require('./HelperUtils');

var UserAuthenticationModule = require('./UserAuthentication');
var UserRecordsQueryAndUpdatesModule = require('./UserRecordsQueryAndUpdates');


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

    console.log("requestParamsMap after parsing URL : ");
    console.log(requestParamsCollection);

    var clientRequestWithParamsMap = HelperUtilsModule.parseWebClientRequest(requestParamsCollection);
    console.log("Parsed the Web Client Request : " + clientRequestWithParamsMap.get("Client_Request"));

    var webClientRequest = clientRequestWithParamsMap.get("Client_Request");


    // Connect to Mongo DB, Create Database & Collections, Retrieve Data


    // Connect to "User Details" db for "User Registration & Authentication"

    if (webClientRequest == "UserRegistration" || webClientRequest == "UserAuthentication" ||
        webClientRequest == "RetrieveUserDetails") {

        handleUserDatabaseRequests(http_response);
    }

    // Connect to "Budget Details" db for "Budget Related CRUD operations"

    if ( webClientRequest == "AddBudget" || webClientRequest == "UpdateBudget" ||
         webClientRequest == "RetrieveBudgetDetails" || webClientRequest == "RemoveBudget" ) {

        handleBudgetDatabaseRequests(http_response);
    }

    // Connect to "Budget Details" db for "Budget Related CRUD operations"

    if (webClientRequest == "AddExpense" || webClientRequest == "RetrieveExpenseDetails") {

        handleExpensesDatabaseRequests(http_response);
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

    var dbConnection_UserDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoUserDetailsDbUrl, function (err, db) {

        console.log("Inside the connection to User Details Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to UserDetails mongo db on local server :"
                + globalsForServiceModule.mongoUserDetailsDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to UserDetails mongo db on local server :"
                + globalsForServiceModule.mongoUserDetailsDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to UserDetails MongoDb : " + globalsForServiceModule.mongoUserDetailsDbUrl);

            // Database Creation

            console.log("Creating / Retrieving User Details Database : ");
            dbConnection_UserDetails_Database = db.db(globalsForServiceModule.userDetails_DatabaseName);

            // Table( Collection ) Creation

            dbConnection_UserDetails_Database.createCollection(globalsForServiceModule.userDetails_TableName, function (err, result) {

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

                        UserAuthenticationModule.addUserRegistrationRecordToDatabase(dbConnection_UserDetails_Database,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed User Registration call");

                        break;

                    case "UserAuthentication":

                        UserAuthenticationModule.validateUserCredentials(dbConnection_UserDetails_Database,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed User Authentication call");

                        break;

                    case "RetrieveUserDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside User Registration & Auth Switch : " +
                            "RetrieveUserDetails : UserName : " + clientRequestWithParamsMap.get("UserName"));

                        // Build Query

                        var queryMap = new Map();

                        if (HelperUtilsModule.valueDefined(userName)) {

                            queryMap.set("UserName", userName);
                        }

                        // DB query & Reponse Building

                        UserRecordsQueryAndUpdatesModule.retrieveUserDetails(dbConnection_UserDetails_Database,
                            globalsForServiceModule.userDetails_TableName,
                            queryMap,
                            UserRecordsQueryAndUpdatesModule.handleUserDatabaseQueryResults,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Failed to Retrieve the required User Details");

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

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoBudgetDetailsDbUrl, function (err, db) {

        console.log("Inside the connection to BudgetDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoBudgetDetailsDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoBudgetDetailsDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to BudgetDetails MongoDb : " + globalsForServiceModule.mongoBudgetDetailsDbUrl);

            // Database Creation

            console.log("Creating / Retrieving BudgetDetails Database : ");
            dbConnection_BudgetDetails_Database = db.db(globalsForServiceModule.budgetDetails_Database_Name);

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

                        BudgetRecordsUpdateModule.updateBudgetRecordToDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Update Budget Record call");

                        break;

                    case "RetrieveBudgetDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside Budget Details Switch : " +
                            "RetrieveBudetDetails : BudgetName : " + clientRequestWithParamsMap.get("BudgetName"));

                        // Build Query

                        var queryMap = new Map();

                        if (HelperUtilsModule.valueDefined(budgetName)) {

                            queryMap.set("BudgetName", budgetName);
                        }

                        // DB query & Reponse Building

                        BudgetRecordsUpdateModule.retrieveBudgetDetails(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            queryMap,
                            BudgetRecordsQueryAndUpdatesModule.handleUserDatabaseQueryResults,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Failed to Retrieve the required Budget Details");

                        break;

                    case "RemoveBudget":

                        BudgetRecordsUpdateModule.removeBudgetRecordFromDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
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

function handleExpenseDetailsDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_ExpenseDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoExpenseDetailsDbUrl, function (err, db) {

        console.log("Inside the connection to ExpenseDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourLifeWebService.createServer : Server Error while connecting to ExpenseDetails mongo db on local server :"
                + globalsForServiceModule.mongoExpenseDetailsDbUrl);

            var failureMessage = "DesignYourLifeWebService.createServer : Server Error while connecting to ExpenseDetails mongo db on local server :"
                + globalsForServiceModule.mongoExpenseDetailsDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourLifeWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to ExpenseDetails MongoDb : " + globalsForServiceModule.mongoExpenseDetailsDbUrl);

            // Database Creation

            console.log("Creating / Retrieving ExpenseDetails Database : ");
            dbConnection_ExpenseDetails_Database = db.db(globalsForServiceModule.ExpenseDetails_Database_Name);

            // Table( Collection ) Creation

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

                        expenseRecordsUpdateModule.addExpenseRecordToDatabase(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.expenseRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Successfully placed Add Expense Record call");

                        break;

                    case "RetrieveExpenseDetails":

                        console.log("DesignYourLifeWebService.createServer : Inside Expense Details Switch : " +
                            "RetrieveBudetDetails : ExpenseName : " + clientRequestWithParamsMap.get("ExpenseName"));

                        // Build Query

                        var queryMap = new Map();

                        if (HelperUtilsModule.valueDefined(ExpenseName)) {

                            queryMap.set("ExpenseName", ExpenseName);
                        }

                        // DB query & Reponse Building

                        ExpenseRecordsUpdateModule.retrieveExpenseDetails(dbConnection_ExpenseDetails_Database,
                            globalsForServiceModule.expenseDetails_Table_Name,
                            queryMap,
                            ExpenseRecordsQueryAndUpdatesModule.expenseRecordRequiredFields,
                            http_response);

                        console.log("DesignYourLifeWebService.createServer : Switch Statement : " +
                            "Failed to Retrieve the required Expense Details");

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


