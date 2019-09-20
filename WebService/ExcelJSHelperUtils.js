
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');

var ExcelModule = require('exceljs');

/**
 * 
 * @param {Map} inputFileDataMap  : Map of <k,v> pairs of inputFileData sent via WebClient Request
 * @param {String} inputFileLocation  : Location of input file
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) File to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 *
*/

exports.buildRecordObjectMapFromInputFile = function (inputFileDataMap, inputFileLocation, inputFileColumnKeys,
    addRecordToDatabase, addRecordCallbackParams) {

    var inputFileName = inputFileDataMap.get("FileName");
    var inputFileFullPath = inputFileLocation + inputFileName;

    // build RecordObjectMap Based on input Data file & present keys

    var currentXLWorkBook = new ExcelModule.Workbook();
    currentXLWorkBook.xlsx.readFile(inputFileFullPath).
        catch(error => console.error("ExcelJS read promise got rejected.." + error)).
        then(function () {
        
        currentXLWorkBook.eachSheet(function (currentWorkSheet, currentWorkSheetId) {

            //currentWorkSheet.getRow(1).values
            var columnKeysRowMap = determineColumnKeysRowMap(currentWorkSheet, inputFileColumnKeys);

            if (columnKeysRowMap == null) {

                var failureMessage = "Record Column Keys couldn't be found in current File..Couldn't add Records";
                HelperUtilsModule.logBadHttpRequestError("buildRecordObjectMapFromInputFile", failureMessage,
                    addRecordCallbackParams.get("http_response"));
            }

            console.debug("columnKeysRowMap => " + HelperUtilsModule.returnMapString(columnKeysRowMap));

            if (HelperUtilsModule.valueDefined(columnKeysRowMap)) {

                buildRecordAndAddToDB(currentWorkSheet, columnKeysRowMap, inputFileColumnKeys,
                    addRecordToDatabase, addRecordCallbackParams);

            }

        });

    });
}


/**
 * 
 * @param {Worksheet} currentWorkSheet  : Map of <k,v> pairs of inputFileData sent via WebClient Request
 * @param {Array} inputFileColumnKeys : Expected column keys of inputFile ( Min Req ) to build RecordObjectMap
 * 
*/

function determineColumnKeysRowMap(currentWorkSheet, inputFileColumnKeys) {

    var totalNumOfRows = currentWorkSheet.rowCount;
    var totalNumOfColumns = currentWorkSheet.columnCount;
    var foundColumnKeys = new Array();
    var columnKeysRowMap = new Map();

    console.debug("ExcelJSHelperUtils.determineColumnKeysRowMap => totalNumOfRows : " + totalNumOfRows +
        ", totalNumOfColumns : " + totalNumOfColumns);

    for (var currentRowIndex = 1; currentRowIndex <= totalNumOfRows; currentRowIndex++) {

        var currentRow = currentWorkSheet.getRow(currentRowIndex);
        columnKeysRowMap.clear();

        if (GlobalsForServiceModule.bDebug == true) {

            console.debug("ExcelJSHelperUtils.determineColumnKeysRowMap.CurrentRowValues => " + currentRow.values.toString() );
            console.debug("ExcelJSHelperUtils.determineColumnKeysRowMap.inputFileColumnKeys => " + inputFileColumnKeys.toString());
        }

        for (var currentColumnIndex = 1; currentColumnIndex <= totalNumOfColumns; currentColumnIndex++) {

            if (!HelperUtilsModule.valueDefined(currentRow.getCell(currentColumnIndex).value)) {

                continue;
            }

            var currentCellValue = HelperUtilsModule.removeStartingAndTrailingSpacesFromString(currentRow.getCell(currentColumnIndex).value);

            if (inputFileColumnKeys.includes(currentCellValue) && (foundColumnKeys.length == 0 ||
                !foundColumnKeys.includes(currentCellValue))) {

                foundColumnKeys.push(currentCellValue);
                columnKeysRowMap.set(currentCellValue, currentColumnIndex);
            }

            if (GlobalsForServiceModule.bDebug == true) {

                console.debug("foundColumnKeys => " + foundColumnKeys.toString());
            }

        }

        if (foundColumnKeys.length == inputFileColumnKeys.length) {

            columnKeysRowMap.set("columnKeysRow", currentRowIndex);
            break;
        }
    }

    if (currentRowIndex > totalNumOfRows) {

        return null;

    } else {

        return columnKeysRowMap;
    }

}


/**
 * 
 * @param {Worksheet} currentWorkSheet  : Map of <k,v> pairs of inputFileData sent via WebClient Request
 * @param {Map} columnKeysRowMap  : Map of <k,v> pairs of column Key Information
 * @param {Array} inputFileColumnKeys : Expected column keys of inputFile ( Min Req ) to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 *
*/

function buildRecordAndAddToDB(currentWorkSheet, columnKeysRowMap, inputFileColumnKeys,
    addRecordToDatabase, addRecordCallbackParams) {

    var totalNumOfRows = currentWorkSheet.rowCount;
    var currentRecordObjectMap = new Map();

    for (var currentRowIndex = 1; currentRowIndex <= totalNumOfRows; currentRowIndex++) {

        currentRecordObjectMap.clear();
        var currentRow = currentWorkSheet.getRow(currentRowIndex);

        if (GlobalsForServiceModule.bDebug == true) {

            console.debug("ExcelJSHelperUtils.determineColumnKeysRowMap.CurrentRowValues => " + currentRow.values.toString());
        }

        if (currentRow.hasValues == false || currentRowIndex == columnKeysRowMap.get("columnKeysRow")) {

            continue;
        }

        for (var currentColumnKey of inputFileColumnKeys) {

            var currentColumnKeyIndex = columnKeysRowMap.get(currentColumnKey);
            var currentColumnValue = currentRow.getCell(currentColumnKeyIndex).value;

            if (currentColumnKey == "Date") {

                var currentDateValue = new Date(currentColumnValue);
                currentColumnValue = currentDateValue.toLocaleDateString();

            } else if (HelperUtilsModule.isNumberOrFloat(currentColumnValue)) {

                currentColumnValue = String(currentColumnValue);

            } else {

                currentColumnValue = HelperUtilsModule.removeStartingAndTrailingSpacesFromString(currentColumnValue);
            }

            if (HelperUtilsModule.valueDefined(currentColumnValue)) {

                currentRecordObjectMap.set(currentColumnKey, currentColumnValue);
            }

        }

        console.debug("currentRecordObjectMap before adding callback params => " +
            HelperUtilsModule.returnMapString(currentRecordObjectMap) + "currentRecordObjectMap.size => " + currentRecordObjectMap.size +
            "inputFileColumnKeys.length => " + inputFileColumnKeys.length);

        if (currentRecordObjectMap.size == inputFileColumnKeys.length) {

            var currentRecordKeysFromCallbackParams = addRecordCallbackParams.get("recordObjectMap").keys();

            for (var currentKey of currentRecordKeysFromCallbackParams) {

                currentRecordObjectMap.set(currentKey, addRecordCallbackParams.get("recordObjectMap").get(currentKey));
            }

            console.debug("currentRecordObjectMap after adding callback params => " +
                HelperUtilsModule.returnMapString(currentRecordObjectMap));

            return addRecordToDatabase(addRecordCallbackParams.get("dbConnection"),
                addRecordCallbackParams.get("collectionName"),
                currentRecordObjectMap,
                addRecordCallbackParams.get("requiredDetailsCollection"),
                addRecordCallbackParams.get("http_response"));
        }

    }

}

