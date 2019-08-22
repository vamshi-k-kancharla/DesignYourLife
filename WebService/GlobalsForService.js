
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

// Single Database for all "DesignYourLife" needs

var designYourLife_Database_Name = "designYourLifeDb";

// All Table/Collection Names

var budgetDetails_Table_Name = "budgetDetailsCollection";
var expenseDetails_Table_Name = "expenseDetailsCollection";
var userDetails_TableName = "designUserLifeUserDetailsCollection";
var budgetAnalytics_TableName = "budgetAnalyticsCollection";

// Mongo DB Database connections

var mongoDesignYourLifeDbUrl = 'mongodb://127.0.0.1:27017/' + designYourLife_Database_Name;
var designYourLifeDbConnection;

// Budget & Expense Details : Required Fields

var budgetRecordRequiredFields = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
var budgetRecordData_UniqueFields = ["Budget_Id"];
var budgetRecordData_NameFileds = ["BudgetName", "UserName"];
var budgetRecordData_SubGroupFileds = ["Budget_Type", "Place", "StartDate", "EndDate"];
var budgetRecordData_AtleastOneValueShouldBeDifferent = ["BudgetName", "UserName","Budget_Type", "Place", "StartDate", "EndDate"];

var expenseRecordRequiredFields = ["Expense_Id", "ExpenseName", "Expense_Type", "Place", "Expense_Category", "Expense_SubCategory", "Date",
    "Amount", "MerchantName", "Budget_Id", "UserName"];
var expenseRecordData_UniqueFields = ["UserName", " Budget_Id", "Expense_Id"];
var expenseRecordData_AtleastOneValueShouldBeDifferent = ["ExpenseName", "Expense_Type", "Place", "Expense_Category", "Expense_SubCategory",
    "Date", "Amount", "MerchantName", "Budget_Id", "UserName"];

var userRegistrationData_RequiredFields = ["UserType", "User_Id", "Name", "Email", "Location", "Address", "UserName", "Password"];
var userRegistrationData_UniqueFields = ["User_Id", "Email", "UserName"];

var budgetLevelAnalyticsRecord_RequiredFields = ["AnalyticsRecord_Id", "Budget_Id", "UserName", "Expenditure", "NumOfExpenses", "NumOfPlaces",
    "NumOfMerchants", "NumOfCategories", "NumOfSubCategories", "Categories"];
var budgetLevelAnalyticsRecord_CategoryFields = ["food", "accommodation", "entertainment", "familycare", "medicalandfitness",
    "miscellaneous", "shopping", "transportation", "vacation"];

var budgetAnalyticsRecord_RequiredQueryFields = ["Budget_Id", "UserName"];

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

exports.bDebug = bDebug;

exports.designYourLifeDbConnection = designYourLifeDbConnection;

exports.periodicPollingInterval_DisjointDatabase = periodicPollingInterval_DisjointDatabase;
exports.port = port;
exports.mongoDbConnection = mongoDbConnection;
exports.mongoClient = mongoClient;

exports.designYourLife_Database_Name = designYourLife_Database_Name;

exports.budgetDetails_Table_Name = budgetDetails_Table_Name;
exports.expenseDetails_Table_Name = expenseDetails_Table_Name;
exports.userDetails_TableName = userDetails_TableName;
exports.budgetAnalytics_TableName = budgetAnalytics_TableName;

exports.mongoDesignYourLifeDbUrl = mongoDesignYourLifeDbUrl;

exports.budgetRecordRequiredFields = budgetRecordRequiredFields;

exports.expenseRecordRequiredFields = expenseRecordRequiredFields;
exports.expenseRecordData_UniqueFields = expenseRecordData_UniqueFields;
exports.expenseRecordData_AtleastOneValueShouldBeDifferent = expenseRecordData_AtleastOneValueShouldBeDifferent;

exports.userRegistrationData_RequiredFields = userRegistrationData_RequiredFields;
exports.userRegistrationData_UniqueFields = userRegistrationData_UniqueFields;

exports.budgetRecordData_UniqueFields = budgetRecordData_UniqueFields;
exports.budgetRecordData_NameFileds = budgetRecordData_NameFileds;
exports.budgetRecordData_SubGroupFileds = budgetRecordData_SubGroupFileds;
exports.budgetRecordData_AtleastOneValueShouldBeDifferent = budgetRecordData_AtleastOneValueShouldBeDifferent;

exports.budgetLevelAnalyticsRecord_CategoryFields = budgetLevelAnalyticsRecord_CategoryFields;
exports.budgetAnalyticsRecord_RequiredQueryFields = budgetAnalyticsRecord_RequiredQueryFields;
exports.budgetLevelAnalyticsRecord_RequiredFields = budgetLevelAnalyticsRecord_RequiredFields;

