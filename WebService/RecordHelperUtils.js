
'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 *  Record Builder Helper Utils
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 *  Globals : Import all the helper modules
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Build New Record Objects required for "Design Your Life"
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Map} budgetRecordMap  : Map of <K,V> pairs of Budget Record
 * 
 * @returns {Object} budgetRecord_DocumentObject : Document Object of Budget Record
 *
 */

function prepareBudgetRecord_DocumentObject(budgetRecordMap) {

    var budgetRecord_DocumentObject = new Object();

    // Replace the "URL Space" with regular space in budget record Map Values

    budgetRecordMap = HelperUtilsModule.removeUrlSpacesFromMapValues(budgetRecordMap);

    // Remove "Starting & Trailing Spaces" from budget record Map Values

    budgetRecordMap = HelperUtilsModule.removeStartingAndTrailingSpacesFromMapValues(budgetRecordMap);

    // Prepare Budget Record Document Object for MongoDB consumption

    budgetRecord_DocumentObject.Budget_Id = budgetRecordMap.get("Budget_Id");
    budgetRecord_DocumentObject.Name = budgetRecordMap.get("Name");
    budgetRecord_DocumentObject.Budget_Type = budgetRecordMap.get("Budget_Type");
    budgetRecord_DocumentObject.Place = budgetRecordMap.get("Place");
    budgetRecord_DocumentObject.StartDate = budgetRecordMap.get("StartDate");
    budgetRecord_DocumentObject.EndDate = budgetRecordMap.get("EndDate");
    budgetRecord_DocumentObject.Amount = budgetRecordMap.get("Amount");

    if (HelperUtilsModule.valueDefined(budgetRecordMap.get("UserName"))) {

        budgetRecord_DocumentObject.UserName = budgetRecordMap.get("UserName");
    }

    return budgetRecord_DocumentObject;
}


/**
 * 
 * @param {Map} expenseRecordMap  : Map of <K,V> pairs of expense Record
 * 
 * @returns {Object} expenseRecord_DocumentObject : Document Object of expense Record
 *
 */

function prepareExpenseRecord_DocumentObject(expenseRecordMap) {

    var expenseRecord_DocumentObject = new Object();

    // Replace the "URL Space" with regular space in expense record Map Values

    expenseRecordMap = HelperUtilsModule.removeUrlSpacesFromMapValues(expenseRecordMap);

    // Remove "Starting & Trailing Spaces" from expense record Map Values

    expenseRecordMap = HelperUtilsModule.removeStartingAndTrailingSpacesFromMapValues(expenseRecordMap);

    // Prepare expense Record Document Object for MongoDB consumption

    expenseRecord_DocumentObject.Expense_Id = expenseRecordMap.get("Expense_Id");
    expenseRecord_DocumentObject.Name = expenseRecordMap.get("Name");
    expenseRecord_DocumentObject.Expense_Type = expenseRecordMap.get("Expense_Type");
    expenseRecord_DocumentObject.Place = expenseRecordMap.get("Place");
    expenseRecord_DocumentObject.Expense_Category = expenseRecordMap.get("Expense_Category");
    expenseRecord_DocumentObject.Expense_SubCategory = expenseRecordMap.get("Expense_SubCategory");
    expenseRecord_DocumentObject.Date = expenseRecordMap.get("Date");
    expenseRecord_DocumentObject.Amount = expenseRecordMap.get("Amount");
    expenseRecord_DocumentObject.MerchantName = expenseRecordMap.get("MerchantName");
    expenseRecord_DocumentObject.Budget_Id = expenseRecordMap.get("Budget_Id");

    if (HelperUtilsModule.valueDefined(expenseRecordMap.get("UserName"))) {

        expenseRecord_DocumentObject.UserName = expenseRecordMap.get("UserName");
    }

    return expenseRecord_DocumentObject;
}


/**
 * 
 * @param {Map} userRegistrationRecordMap  : Map of <K,V> pairs of userRegistration Record
 * 
 * @returns {Object} userRegistrationRecord_DocumentObject : Document Object of userRegistration Record
 *
 */

function prepareUserRegistrationRecord_DocumentObject(userRegistrationRecordMap) {

    var userRegistrationRecord_DocumentObject = new Object();

    // Replace the "URL Space" with regular space in userRegistration record Map Values

    userRegistrationRecordMap = HelperUtilsModule.removeUrlSpacesFromMapValues(userRegistrationRecordMap);

    // Remove "Starting & Trailing Spaces" from userRegistration record Map Values

    userRegistrationRecordMap = HelperUtilsModule.removeStartingAndTrailingSpacesFromMapValues(userRegistrationRecordMap);

    // Prepare userRegistration Record Document Object for MongoDB consumption

    userRegistrationRecord_DocumentObject.UserType = userRegistrationRecordMap.get("UserType");
    userRegistrationRecord_DocumentObject.User_Id = userRegistrationRecordMap.get("User_Id");
    userRegistrationRecord_DocumentObject.Name = userRegistrationRecordMap.get("Name");
    userRegistrationRecord_DocumentObject.Email = userRegistrationRecordMap.get("Email");
    userRegistrationRecord_DocumentObject.Location = userRegistrationRecordMap.get("Location");
    userRegistrationRecord_DocumentObject.Address = userRegistrationRecordMap.get("Address");
    userRegistrationRecord_DocumentObject.UserName = userRegistrationRecordMap.get("UserName");
    userRegistrationRecord_DocumentObject.Password = userRegistrationRecordMap.get("Password");

    return userRegistrationRecord_DocumentObject;
}


/**
 * 
 * @param {Object} queryResult : query Result from mongo DB
 * 
 * @returns {JSON} budgetRecord_JSON : Budget Record in JSON format
 * 
 */

function buildBudgetRecord_JSON(queryResult) {

    var budgetRecord_JSON = new Object();

    queryResult = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryResult);

    budgetRecord_JSON.Budget_Id = queryResult.Budget_Id;
    budgetRecord_JSON.Name = queryResult.Name;
    budgetRecord_JSON.Budget_Type = queryResult.Budget_Type;
    budgetRecord_JSON.Place = queryResult.Place;
    budgetRecord_JSON.StartDate = queryResult.StartDate;
    budgetRecord_JSON.EndDate = queryResult.EndDate;
    budgetRecord_JSON.Amount = queryResult.Amount;

    if (HelperUtilsModule.valueDefined(queryResult.UserName) {

        budgetRecord_JSON.UserName = queryResult.UserName;
    }

    return budgetRecord_JSON;
}



/**
 * 
 * @param {Object} queryResult : query Result from mongo DB
 * 
 * @returns {JSON} expenseRecord_JSON : Expense Record in JSON format
 * 
 */

function buildExpenseRecord_JSON(queryResult) {

    var expenseRecord_JSON = new Object();

    queryResult = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryResult);

    expenseRecord_JSON.Expense_Id = queryResult.Expense_Id;
    expenseRecord_JSON.Name = queryResult.Name;
    expenseRecord_JSON.Expense_Type = queryResult.Expense_Type;
    expenseRecord_JSON.Place = queryResult.Place;
    expenseRecord_JSON.Expense_Category = queryResult.Expense_Category;
    expenseRecord_JSON.Expense_SubCategory = queryResult.Expense_SubCategory;
    expenseRecord_JSON.Date = queryResult.Date;
    expenseRecord_JSON.Amount = queryResult.Amount;
    expenseRecord_JSON.MerchantName = queryResult.MerchantName;
    expenseRecord_JSON.Budget_Id = queryResult.Budget_Id;

    if (HelperUtilsModule.valueDefined(queryResult.UserName) {

        expenseRecord_JSON.UserName = queryResult.UserName;
    }

    return expenseRecord_JSON;
}



/**
 * 
 * @param {Object} queryResult : query Result from mongo DB
 * 
 * @returns {JSON} userRegistrationRecord_JSON : userRegistration Record in JSON format
 * 
 */

function buildUserRegistrationRecord_JSON(queryResult) {

    var userRegistrationRecord_JSON = new Object();

    queryResult = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryResult);

    userRegistrationRecord_JSON.UserType = queryResult.UserType;
    userRegistrationRecord_JSON.User_Id = queryResult.User_Id;
    userRegistrationRecord_JSON.Name = queryResult.Name;
    userRegistrationRecord_JSON.Email = queryResult.Email;
    userRegistrationRecord_JSON.Location = queryResult.Location;
    userRegistrationRecord_JSON.Address = queryResult.Address;
    userRegistrationRecord_JSON.UserName = queryResult.UserName;

    if (HelperUtilsModule.valueDefined(queryResult.Password) {

        userRegistrationRecord_JSON.Password = queryResult.Password;
    }

    return userRegistrationRecord_JSON;
}



