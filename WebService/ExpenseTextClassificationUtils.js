
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var ExpTextClassificationUtilsModule = require('./ExpenseTextClassificationUtils');

// PDF Helper Records

var expenseTextClassificationCategories = ["Date", "Place", "Merchant", "Amount", "Currency", "Address", "Picture", "Time"];

exports.expenseTextClassificationCategories = expenseTextClassificationCategories;


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


