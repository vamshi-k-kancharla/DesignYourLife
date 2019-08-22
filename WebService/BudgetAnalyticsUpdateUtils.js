
'use strict';

/****************************************************************************************
 ****************************************************************************************
 ****************************************************************************************
 * 
 * Update Operations ( Create, Update & Remove ) of Budget Level Analytics Record
 *
 ****************************************************************************************
 ****************************************************************************************
 */


var HelperUtilsModule = require('./HelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD');
var GlobalsForServiceModule = require('./GlobalsForService');


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
 * @param {Object} analyticsRecord_DocumentObject : New Analytics Record being Created
 * @param {Object} currentAnalyticsRecord : Existing Analytics Record
 *
 * @returns {Object} analyticsRecord_DocumentObject : Document Object of Analytics Record
 *
 */

function addAllCategoriesObjectsFromExistingRecord(analyticsRecord_DocumentObject, currentAnalyticsRecord) {

    console.log("BudgetAnalyticsUpdateUtils.addAllCategoriesObjectsFromExistingRecord => " +
        "before the addition of current category level details => analyticsRecord_DocumentObject : ");
    console.log(analyticsRecord_DocumentObject);
    console.log("BudgetAnalyticsUpdateUtils.addAllCategoriesObjectsFromExistingRecord => " +
        "before the addition of current category level details => currentAnalyticsRecord : ");
    console.log(currentAnalyticsRecord);

    for (var currentExpenseCategory of GlobalsForServiceModule.budgetLevelAnalyticsRecord_CategoryFields) {

        if (HelperUtilsModule.valueDefined(currentAnalyticsRecord[currentExpenseCategory])) {

            analyticsRecord_DocumentObject[currentExpenseCategory] = currentAnalyticsRecord[currentExpenseCategory];
        }
    }

    console.log("BudgetAnalyticsUpdateUtils.addAllCategoriesObjectsFromExistingRecord => " +
        "After the addition of current category level details => analyticsRecord_DocumentObject : ");
    console.log(analyticsRecord_DocumentObject);

    return analyticsRecord_DocumentObject;
}


/**
 * 
 * @param {Object} document_Object : Document Object consisting of new Expense Details
 * @param {Object} analyticsRecord_DocumentObject : Analytics Record being created ( Already has all the basic data )
 *
 * @returns {Object} analyticsRecord_DocumentObject : Document Object of Analytics Record
 *
 */

function updateSubCategoriesObjectWithCurrentExpenseData(document_Object, analyticsRecord_DocumentObject) {

    var expenseCategory = document_Object.Expense_Category;
    var expenseSubCategory = document_Object.Expense_SubCategory;

    // Check the presence of Expense Sub Category and update data accordingly.

    if (HelperUtilsModule.valueDefined(analyticsRecord_DocumentObject[expenseCategory][expenseSubCategory])) {

        analyticsRecord_DocumentObject[expenseCategory][expenseSubCategory] = checkValidityAndAdd(
            analyticsRecord_DocumentObject[expenseCategory][expenseSubCategory], document_Object.Amount);

    } else {

        analyticsRecord_DocumentObject[expenseCategory][expenseSubCategory] = document_Object.Amount;
    }

    return analyticsRecord_DocumentObject;
}

/**
 * 
 * @param {String} inputStrValue1 : First input string value
 * @param {String} inputStrValue2 : Second input string value
 *
 * @returns {String} additionOutput : Output of addition based on number validity
 *
 */

function checkValidityAndAdd(inputStrValue1, inputStrValue2) {

    var firstInputValidity = HelperUtilsModule.isNumberOrFloat(inputStrValue1);
    var secondInputValidity = HelperUtilsModule.isNumberOrFloat(inputStrValue2);

    console.log("HelperUtils.checkValidityAndAdd => firstInputValidity : " + firstInputValidity +
        "secondInputValidity : " + secondInputValidity);

    var additionOutput = String(((firstInputValidity) ? parseInt(inputStrValue1, 10) : 0) +
        ((secondInputValidity) ? parseInt(inputStrValue2, 10) : 0));

    return additionOutput;
}

/**
 * 
 * @param {Object} document_Object : Document Object consisting of new Expense Details
 * @param {Object} analyticsRecord_DocumentObject : Analytics Record being created ( Already has all the basic data )
 *
 * @returns {Object} analyticsRecord_DocumentObject : Document Object of Analytics Record
 *
 */

function updateCategoriesDataObjectWithCurrentExpenseData(document_Object, analyticsRecord_DocumentObject) {

    var expenseCategory = document_Object.Expense_Category;

    console.log("BudgetAnalyticsUpdateUtils.updateCategoriesDataObjectWithCurrentExpenseData => " +
        "Analytics Record before updating basic Details at Category Level: ");
    console.log(analyticsRecord_DocumentObject);

    console.log("BudgetAnalyticsUpdateUtils.updateCategoriesDataObjectWithCurrentExpenseData => " +
        "Document Object before updating basic Details at Category Level: ");
    console.log(document_Object);

    // Check the presence of Expense Category and update data accordingly.

    if (HelperUtilsModule.valueDefined(analyticsRecord_DocumentObject[expenseCategory])) {

        analyticsRecord_DocumentObject[expenseCategory].Expenditure = checkValidityAndAdd(
            analyticsRecord_DocumentObject[expenseCategory].Expenditure, document_Object.Amount);
        analyticsRecord_DocumentObject[expenseCategory].NumOfExpenses = checkValidityAndAdd(
            analyticsRecord_DocumentObject[expenseCategory].NumOfExpenses, "1");

    } else {

        var analyticsRecord_CategoriesObject = new Object();
        analyticsRecord_CategoriesObject.Expenditure = document_Object.Amount;
        analyticsRecord_CategoriesObject.NumOfExpenses = 1;

        analyticsRecord_DocumentObject[expenseCategory] = analyticsRecord_CategoriesObject;
    }

    console.log("BudgetAnalyticsUpdateUtils.updateCategoriesDataObjectWithCurrentExpenseData => " +
        "Analytics Record after updating basic Details at Category Level: ");
    console.log(analyticsRecord_DocumentObject);

    // Update Sub Categories Data

    analyticsRecord_DocumentObject = updateSubCategoriesObjectWithCurrentExpenseData(document_Object,
        analyticsRecord_DocumentObject);

    console.log("BudgetAnalyticsUpdateUtils.updateCategoriesDataObjectWithCurrentExpenseData => " +
        "Analytics Record after adding SubCategory level objects : ");
    console.log(analyticsRecord_DocumentObject);

    return analyticsRecord_DocumentObject;
}

/**
 * 
 * @param {Object} document_Object : Document Object consisting of new Expense Details
 * @param {Boolean} firstUpdate : New Analytics record ? Update on existing record ?
 * @param {Object} currentAnalyticsRecord : Existing Analytics Record
 *
 * @returns {Object} analyticsRecord_DocumentObject : Document Object of Analytics Record
 *
 */

function prepareNewAnalyticsRecord_DocumentObject(document_Object, firstUpdate, currentAnalyticsRecord) {

    var analyticsRecord_DocumentObject = new Object();

    if (firstUpdate == false && !HelperUtilsModule.valueDefined(currentAnalyticsRecord)) {

        console.error("BudgetAnalyticsUpdateUtils.prepareNewAnalyticsRecord_DocumentObject : " +
            " Analytics record should be present for subsequent expense updates.");
        return;
    }

    console.log("BudgetAnalyticsUpdateUtils.prepareNewAnalyticsRecord_DocumentObject => " +
        "Fill the analytics record expense object values : " + document_Object.Expense_Id);

    // Fill the analytics record document object values

    analyticsRecord_DocumentObject.Budget_Id = document_Object.Budget_Id;
    analyticsRecord_DocumentObject.UserName = document_Object.UserName;

    if (firstUpdate == true) {

        analyticsRecord_DocumentObject.Expenditure = document_Object.Amount;
        analyticsRecord_DocumentObject.NumOfExpenses = 1;

    } else {

        analyticsRecord_DocumentObject.Expenditure = checkValidityAndAdd(
            currentAnalyticsRecord.Expenditure, document_Object.Amount);
        analyticsRecord_DocumentObject.NumOfExpenses = checkValidityAndAdd(
            currentAnalyticsRecord.NumOfExpenses, "1");

        analyticsRecord_DocumentObject = addAllCategoriesObjectsFromExistingRecord(analyticsRecord_DocumentObject, currentAnalyticsRecord);
    }

    console.log("BudgetAnalyticsUpdateUtils.prepareNewAnalyticsRecord_DocumentObject => " +
        "Analytics Record after adding basic Details : ");
    console.log(analyticsRecord_DocumentObject);

    // Fill the categories record document object values

    analyticsRecord_DocumentObject = updateCategoriesDataObjectWithCurrentExpenseData(document_Object, analyticsRecord_DocumentObject);

    console.log("BudgetAnalyticsUpdateUtils.prepareNewAnalyticsRecord_DocumentObject => " +
        "Analytics Record after adding category level objects : ");
    console.log(analyticsRecord_DocumentObject);

    return analyticsRecord_DocumentObject;
}


/**
 *
 * @param {Object} document_Object  : Document Object consisting of Expense Details
 *
 */

exports.updateExpenseData = function (document_Object, dbConnection) {

    var queryBudgetAnalyticsRecord = new Object();

    // Retrieve Collection Name of Budget Analytics Data

    var collectionName = GlobalsForServiceModule.budgetAnalytics_TableName;

    // building query for Budget Analytics Record

    console.log("BudgetAnalyticsUpdateUtils.updateExpenseData => Expense_Id : " + document_Object.Expense_Id +
        ",Budget_Id : " + document_Object.Budget_Id + ",UserName : " + document_Object.UserName );

    if (HelperUtilsModule.valueDefined(document_Object.Budget_Id) && HelperUtilsModule.valueDefined(document_Object.UserName)) {

        queryBudgetAnalyticsRecord.Budget_Id = document_Object.Budget_Id;
        queryBudgetAnalyticsRecord.UserName = document_Object.UserName;

    } else {

        console.error("BudgetAnalyticsUpdateUtils.updateExpenseData : " +
            " Expense Record Must have Budget_Id & UserName in order to be included in Budget Analytics");

        return;
    }

    // Budget Analytics Collection : Creation/Access

    dbConnection.createCollection(collectionName, function (err, result) {

        if (err) {

            console.error("BudgetAnalyticsUpdateUtils.updateExpenseData : " +
                "Error while creating / retrieving BudgetAnalyticsCollection(Table): " + collectionName);

            var failureMessage = "BudgetAnalyticsUpdateUtils.updateExpenseData : " +
                "Error while creating / retrieving Budget Analytics Collection(Table): " + collectionName;
            HelperUtilsModule.logInternalServerError("BudgetAnalyticsUpdateUtils.updateExpenseData", failureMessage, http_response);

            return;
        }

        console.log("Successfully created / retrieved collection (BudgetAnalyticsCollection) : " + collectionName);

        // Execute Query and Add/Update Analytics Record accordingly

        console.log("Checking the presence of Budget Analytics Record: CollectionName : " + collectionName);

        dbConnection.collection(collectionName).findOne(queryBudgetAnalyticsRecord, function (err, result) {

            if (err) {

                console.error("BudgetAnalyticsUpdateUtils.updateExpenseData : " +
                    "Internal Server Error while querying for Analytics Record");

                return;
            }

            var recordPresent = (result) ? "true" : "false";
            if (recordPresent == "false") {

                // Record Addition

                console.log("Record Not Found, Adding New Analytics Record with expense details => " + " Expense_Id : " +
                    document_Object.Expense_Id);

                var analyticsRecord_DocumentObject = prepareNewAnalyticsRecord_DocumentObject(document_Object, true, result);

                console.log("Adding new Analytics Record for Expense_Id : " + document_Object.Expense_Id);
                console.log(analyticsRecord_DocumentObject);

                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, analyticsRecord_DocumentObject,
                    "AddAnalyticsRecord", null);
            }
            else {

                // Record Updation

                console.log("Record Found, Updating Analytics Record with expense details => " + " Expense_Id : " +
                    document_Object.Expense_Id);

                var analyticsRecord_DocumentObject = prepareNewAnalyticsRecord_DocumentObject(document_Object, false, result);

                console.log("Updating existing Analytics Record for Expense_Id : " + document_Object.Expense_Id);
                console.log(analyticsRecord_DocumentObject);

                MongoDbCrudModule.directUpdationOfRecordToDatabase(dbConnection, collectionName, analyticsRecord_DocumentObject,
                    queryBudgetAnalyticsRecord, "UpdateAnalyticsRecord", null);
            }

        });

    });

}

