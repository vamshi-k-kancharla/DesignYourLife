
'use strict';

/*************************************************************************
 * 
 * GlobalsForService : Module that handles Globals for Flow Control
 * 
**************************************************************************/

// Globals for retrieving the Seller bank

var periodicPollingInterval_DisjointDatabase = 5000;

// Define globals as per JSPDF Inclusion Usage/Syntax

var port = process.env.PORT || 4500;

// MongoDB Connection Variables

var mongoDbConnection = require('mongodb');
var mongoClient = mongoDbConnection.MongoClient;

// Database & Table Names of "Budget Details"

var budgetDetails_Database_Name = "budgetDetailsDb";
var budgetDetails_Table_Name = "budgetDetailsCollection";

// Database & Table Names of "Expense Details"

var expenseDetails_Database_Name = "expenseDetailsDb";
var expenseDetails_Table_Name = "expenseDetailsCollection";

// Database & Table Names of "User Details"

var userDetails_DatabaseName = "userDetailsDb";
var userDetails_TableName = "userDetailsCollection";

// Mongo DB Database connections

var mongoBudgetDetailsDbUrl = 'mongodb://127.0.0.1:27017/' + budgetDetails_Database_Name;
var mongoExpenseDetailsDbUrl = 'mongodb://127.0.0.1:27017/' + expenseDetails_Database_Name;
var mongoUserDetailsDbUrl = 'mongodb://127.0.0.1:27017/' + userDetails_DatabaseName;


// Budget & Expense Details : Required Fields

var budgetRecordRequiredFields = ["Budget_Id", "Name", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];

var expenseRecordRequiredFields = ["Expense_Id", "Name", "Expense_Type", "Place", "Expense_Category", "Expense_SubCategory", "Date",
    "Amount", "MerchantName", "Budget_Id", "UserName"];

var userRegistrationData_RequiredFields = ["UserType", "User_Id", "Name", "Email", "Location", "Address", "UserName", "Password"];


// Global variables

var bDebug = true;


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Export the Globals
 * 
 **************************************************************************
 **************************************************************************
 */

exports.periodicPollingInterval_DisjointDatabase = periodicPollingInterval_DisjointDatabase;
exports.port = port;
exports.mongoDbConnection = mongoDbConnection;
exports.mongoClient = mongoClient;
exports.budgetDetails_Database_Name = budgetDetails_Database_Name;
exports.budgetDetails_Table_Name = budgetDetails_Table_Name;
exports.expenseDetails_Database_Name = expenseDetails_Database_Name;
exports.expenseDetails_Table_Name = expenseDetails_Table_Name;
exports.userDetails_DatabaseName = userDetails_DatabaseName;
exports.userDetails_TableName = userDetails_TableName;
exports.mongoBudgetDetailsDbUrl = mongoBudgetDetailsDbUrl;
exports.mongoExpenseDetailsDbUrl = mongoExpenseDetailsDbUrl;
exports.mongoUserDetailsDbUrl = mongoUserDetailsDbUrl;

exports.budgetRecordRequiredFields = budgetRecordRequiredFields;
exports.expenseRecordRequiredFields = expenseRecordRequiredFields;
exports.userRegistrationData_RequiredFields = userRegistrationData_RequiredFields;




