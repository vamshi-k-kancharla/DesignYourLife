
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * Copy Rights Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var ImageJSHelperUtilsModule = require('./ImageJSHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var HelperUtilsModule = require('./HelperUtils');
var ExpTextClassificationUtilsModule = require('./ExpenseTextClassificationUtils');

/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 * @param {Array} columnPosObjArray  : Array of Columns positions of Table
 * @param {Number} avgLetterWidth  : Average Letter Width of file contents
 *
 * @returns {Array} recordObjectValues  : Array of record objects retrieved from Table Contents
 *
*/

exports.processRawContentForExpenseRecord = function (currentLineContents, inputPlace, inputDate) {

    var recordObjectValues = new Array();

    var currentRecord_Amount = 0;
    var currentRecord_Date = (HelperUtilsModule.valueDefined(inputDate)) ? inputDate : (new Date());
    var currentRecord_Place = (HelperUtilsModule.valueDefined(inputPlace)) ? inputPlace : "KR Puram, Bangalore";
    var currentRecord_Merchant = "BigBasket";
    var currentRecord_Expense = "";

    var googleMLCloudLanguageClient = ExpTextClassificationUtilsModule.retrieveGoogleCloudMLLanguageParser();

    for (var currentContentObject of currentLineContents) {

        var currentContent = currentContentObject.description;

        // Proprietary Text Classification : Simple algos

        if (HelperUtilsModule.isFloatingNumber(currentContent)) {

            currentRecord_Amount = currentContent;

        } else if (ExpTextClassificationUtilsModule.isDate(currentContent)) {

            currentRecord_Date = currentContent;

        } else if (HelperUtilsModule.isNumber(currentContent)) {

            // ToDo : quantity/SNO ( Differentiate )

        } else if (ExpTextClassificationUtilsModule.isPlace(currentContent)) {

            currentRecord_Place += currentContent;

        } else if (ExpTextClassificationUtilsModule.isMerchant(googleMLCloudLanguageClient, currentContent)) {

            currentRecord_Merchant += currentContent;

        } else {

            currentRecord_Expense += currentContent;

        }

    }

    recordObjectValues.push(currentRecord_Date);
    recordObjectValues.push(currentRecord_Expense);
    recordObjectValues.push(currentRecord_Place);
    recordObjectValues.push(currentRecord_Merchant);
    recordObjectValues.push(currentRecord_Amount);

    console.debug("RawContentParser.processRawContentForExpenseRecord : currentRecord_Amount => " + currentRecord_Amount);
    console.debug("RawContentParser.processRawContentForExpenseRecord : currentRecord_Expense => " + currentRecord_Expense);

    return (currentRecord_Amount == 0)?null:recordObjectValues;

}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 *
 * @returns {String} currentPlace  : Extract place from input Contents
 *
*/

exports.findPlaceFromInputContents = function (sortedImageFileLines) {

    var currentPlace = null;

    // ToDo : Extract Place from input Contents

    return currentPlace;
}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 *
 * @returns {String} currentDate  : Extract date from input Contents
 *
*/

exports.findDateFromInputContents = function (sortedImageFileLines) {

    var currentDate = null;

    // ToDo : Extract Date from input Contents

    return currentDate;
}

