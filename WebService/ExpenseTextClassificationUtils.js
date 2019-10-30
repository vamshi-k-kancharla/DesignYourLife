
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Expense Text Classification
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var ExpTextClassificationUtilsModule = require('./ExpenseTextClassificationUtils');
var GlobalsForServiceModule = require('./GlobalsForService');

var GoogleCloud_MLLanguage_APIModule = require('@google-cloud/language');

// PDF Helper Records

var expenseTextClassificationCategories = ["Date", "Place", "Merchant", "Amount", "Currency", "Address", "Picture", "Time"];
var rawTextClassificationCategories = ["Noun", "Pronoun", "Verb", "Adjective", "Adverb", "Number", "CurrencyNumber", "Currency", "Date"];

exports.expenseTextClassificationCategories = expenseTextClassificationCategories;
exports.rawTextClassificationCategories = rawTextClassificationCategories;

/**
 * 
 * @returns {Array} googleCloudLanguageAPIClient  : Google Cloud ML Language Service Client
 *
*/

exports.retrieveGoogleCloudMLLanguageParser = function () {

    var googleCloudLanguageAPIClient = new GoogleCloud_MLLanguage_APIModule.LanguageServiceClient();

    var newStrValue = 'Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks';

    var currentDocument = {
        content: newStrValue,
        type: 'PLAIN_TEXT',
    };

    googleCloudLanguageAPIClient.classifyText({ currentDocument }, function (err, result) {

        console.log("Input String Content => " + currentDocument.content + " , Categories => : ");

        if (err) {

            console.error("ExpTextClassificationUtilsModule.retrieveGoogleCloudMLLanguageParser: Error while classifying text through googleCloud Language API => "
                + err.toString() + " ,result " + result);
            return;
        }

        for (var currentCategory of result.categories) {

            console.log("Category Name : " + currentCategory.name + " , Confidence : " + currentCategory.confidence);
        }

    });

    return googleCloudLanguageAPIClient;
}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Array} tableRecordObjects  : Array of table Record Objects having parsed Coordinate Data
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) data to build RecordObjectMap
 * 
 * @returns {Array} recordObjectArray  : Array of Expense Record objects that got built
 *
*/

exports.classifyAndRetrieveExpenseRecords = function (parsedFileContents, tableRecordObjects, inputFileColumnKeys) {

    var currentRecordValuesArray = new Array();

    for (var currentTableObject of tableRecordObjects) {

        console.log("No of Rows in Current Table : " + currentTableObject.NoOfRows);
        console.log("Row Details Below : ");
        console.log("Row Start_X : " + currentTableObject.Start_X + "Row Start_Y : " + currentTableObject.Start_Y);

        var row_Start_Index = currentTableObject.Start_ContentIndex;
        var row_End_Index = 0;

        for (var currentRowObject of currentTableObject.RowSeparatorObjectArr) {

            console.log("currentRowObject : " + HelperUtilsModule.returnObjectString(currentRowObject));
            console.log("Row End_X : " + parsedFileContents[currentRowObject.CurrentRowEndIndex].xCoOrdinate +
                "Row End_Y : " + parsedFileContents[currentRowObject.CurrentRowEndIndex].yCoOrdinate);

            row_End_Index = currentRowObject.CurrentRowEndIndex;

            if (currentRowObject.CurrentRowEndIndex + 1 < parsedFileContents.length) {

                console.log("Row Start_X : " + parsedFileContents[currentRowObject.CurrentRowEndIndex + 1].xCoOrdinate +
                    "Row Start_Y : " + parsedFileContents[currentRowObject.CurrentRowEndIndex + 1].yCoOrdinate);
            }

            var currentRecordValues = new Array();

            for (var currentIndex = row_Start_Index; currentIndex <= row_End_Index; currentIndex++) {

                var currentText = parsedFileContents[currentIndex].text;

                while (parsedFileContents[currentIndex].xCoOrdinate == parsedFileContents[currentIndex + 1].xCoOrdinate) {

                    currentText += " " + parsedFileContents[currentIndex + 1].text;
                    currentIndex++;
                }

                currentRecordValues.push(currentText);
            }

            currentRecordValuesArray.push(currentRecordValues);
            row_Start_Index = row_End_Index + 1;
        }

    }

    var expenseRecordObjectsArray = new Array();

    for (var currentRecordValues of currentRecordValuesArray) {

        var currentExpenseRecord = ExpTextClassificationUtilsModule.buildExpenseRecordObjectsFromAvailableData(currentRecordValues,
            inputFileColumnKeys);

        if (HelperUtilsModule.valueDefined(currentExpenseRecord)) {

            expenseRecordObjectsArray.push(currentExpenseRecord);
        }
    }

    return expenseRecordObjectsArray;
}


/**
 * 
 * @param {Array} currentRecordValues  : Array of values for the current expense Record 
 * @param {Array} inputFileColumnKeys  : Expected column keys of input data ( Min Req ) to build RecordObjectMap
 * 
 * @returns {Object} currentExpenseRecord  : Expense Record object that got built based on Text Classification
 *
*/

exports.buildExpenseRecordObjectsFromAvailableData = function (currentRecordValues, inputFileColumnKeys) {

    // ToDo : Text classification

    var minReqExpenseDetails = 4;

    var currentExpenseRecord = { Expense_Category: "food", Expense_SubCategory: "restaurants", Expense_Type: "occasional"};

    if (currentRecordValues.length < minReqExpenseDetails) {

        return null;
    }

    currentExpenseRecord.Date = currentRecordValues[0];
    currentExpenseRecord.ExpenseName = "ExpName_" + currentRecordValues[1];
    currentExpenseRecord.Place = currentRecordValues[2];
    currentExpenseRecord.MerchantName = currentRecordValues[2];
    currentExpenseRecord.Amount = currentRecordValues[currentRecordValues.length-1];

    return currentExpenseRecord;
}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * 
 * @returns {Array} expenseContentArray  : Array of Expense Content values
 *
*/

exports.classifyExpenseContentFromRawText = function (parsedFileContents) {

    var expenseContentArray = new Array();

    for (var currentFileContent of parsedFileContents) {

        // ToDo: Classify Raw Text Category
        // var rawTextCategory = classifyRawText();
        
        if (doesContentFallInExpenseCategory(currentFileContent.text, rawTextCategory) == true) {

            expenseContentArray.push(currentFileContent);
        }
    }

    return expenseContentArray;
}


/**
 * 
 * @param {Array} recordObjectValuesArray  : Array of Record object values retrieved from table contents
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) data to build RecordObjectMap
 *
 * @returns {Array} expenseRecordObjectsArray  : Array of Expense Record objects that got built
 *
*/

exports.classifyAndBuildExpenseRecordObjects = function(recordObjectValuesArray, inputFileColumnKeys) {

    var expenseRecordObjectsArray = new Array();

    for (var currentRecordValues of recordObjectValuesArray) {

        var currentExpenseRecord = ExpTextClassificationUtilsModule.buildExpenseRecordObjectsFromAvailableData(currentRecordValues,
            inputFileColumnKeys);

        if (HelperUtilsModule.valueDefined(currentExpenseRecord)) {

            expenseRecordObjectsArray.push(currentExpenseRecord);
        }
    }

    return expenseRecordObjectsArray;
}

/**
 * 
 * @param {String} inputStrValue  : Input string value in potential date format
 *
 * @returns {Boolean} true/false  : true if date input; false otherwise
 *
*/

exports.isDate = function (inputStrValue) {

    // ToDo : Classify and check if Date Input

    return false;
}

/**
 * 
 * @param {String} inputStrValue  : Input string value ( Potential Place )
 *
 * @returns {Boolean} true/false  : true if place input; false otherwise
 *
*/

exports.isPlace = function (inputStrValue) {

    // ToDo : Classify and check if Input is place

    return false;
}


/**
 * 
 * @param {Object} googleCloudLanguageAPIClient  : Google Cloud ML Language API Client
 * @param {String} inputStrValue  : Input string value ( Potential Merchant Name )
 *
 * @returns {Boolean} true/false  : true if merchant input; false otherwise
 *
*/

exports.isMerchant = function (googleCloudLanguageAPIClient, inputStrValue) {

    inputStrValue = HelperUtilsModule.buildInputStrWithMinReqTokens(inputStrValue, GlobalsForServiceModule.minReqTokens);

    var newStrValue = 'Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks Starbucks';

    var currentDocument = {
        content: newStrValue,
        type: 'PLAIN_TEXT',
    };

    googleCloudLanguageAPIClient.classifyText({currentDocument}, function (err, result) {

        console.log("Input String Content => " + currentDocument.content + " , Categories => : ");

        if (err) {

            console.error("ExpTextClassificationUtilsModule.isMerchant: Error while classifying text through googleCloud Language API => "
                + err.toString() + " ,result " + result);
            return;
        }

        for (var currentCategory of result.categories) {

            console.log("Category Name : " + currentCategory.name + " , Confidence : " + currentCategory.confidence);
        }

    });

    /*
    console.log("Input String Content => " + currentDocument.content + " , Categories => : ");

    var [classificationResultArr] = await googleCloudLanguageAPIClient.classifyText({ currentDocument });

    for (var currentCategory of classificationResultArr.categories) {

        console.log("Category Name : " + currentCategory.name + " , Confidence : " + currentCategory.confidence);
    }*/

    return false;
}

