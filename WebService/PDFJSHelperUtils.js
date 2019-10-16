
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles PDF Text Parsing Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');

var ExcelJSHelperUtilsModule = require('./ExcelJSHelperUtils');
var ExpTextClassificationUtilsModule = require('./ExpenseTextClassificationUtils');
var PDFJSHelperUtilsModule = require('./PDFJSHelperUtils');
var ImageJSHelperUtilsModule = require('./ImageJSHelperUtils');

var PdfReaderModule = require('pdfreader');

// PDF Helper Records

var tableRecordKeys = ["Start_X", "Start_Y", "Start_ContentIndex", "NoOfColumns", "End_X", "End_Y", "End_ContentIndex", "NoOfRows",
    "RowSeparatorObjectArr"];
var tableRowSeparatorKeys = ["CurrentRowEndIndex"];

exports.tableRecordKeys = tableRecordKeys;
exports.tableRowSeparatorKeys = tableRowSeparatorKeys;


/**
 * 
 * @param {Map} inputFileDataMap  : Map of <k,v> pairs of inputFileData sent via WebClient Request
 * @param {String} inputFileLocation  : Location of input file
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) File to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 * @param {boolean} bImgConverted : "true/false" ? Was pdf converted file ?
 *
*/

exports.buildRecordObjectMapFromPDFFile = function (inputFileDataMap, inputFileLocation, inputFileColumnKeys,
    addRecordsToDatabase, addRecordCallbackParams) {

    PDFJSHelperUtilsModule.buildRecordObjectMapFromPDFFile(inputFileDataMap, inputFileLocation, inputFileColumnKeys,
        addRecordsToDatabase, addRecordCallbackParams, false);

}

exports.buildRecordObjectMapFromPDFFile = function (inputFileDataMap, inputFileLocation, inputFileColumnKeys,
    addRecordsToDatabase, addRecordCallbackParams, bImgConverted) {

    var inputFileName = inputFileDataMap.get("FileName");
    var inputFileFullPath = inputFileLocation + inputFileName;

    // Parse PDF File

    var pdfReader = new PdfReaderModule.PdfReader();
    var parsedFileContents = new Array();
    var currentPagenumber = 0;

    console.log("Parsing PDF File : " + inputFileFullPath);
    console.log("===========================================================================");
    console.log("===========================================================================");

    pdfReader.parseFileItems(inputFileFullPath, function (err, fileStreamBuffer) {

        if (err) {

            console.debug("Error while parsing PDF File : " + inputFileFullPath + " , Error => " + err);

        } else if (!HelperUtilsModule.valueDefined(fileStreamBuffer)) {

            console.debug("Error while parsing PDF File : " + inputFileFullPath +
                " , Error => Undefined fileStreamBuffer / End of File Reached");
            console.debug("End of PDF File parsing : " + inputFileFullPath);

            if (HelperUtilsModule.valueDefined(parsedFileContents) && parsedFileContents.length >= 1) {

                console.debug("parsedFileContents.length : " + parsedFileContents.length +
                    "parsedFileContents[0].yCoOrdinate : " + parsedFileContents[0].yCoOrdinate +
                    "parsedFileContents[0].xCoOrdinate : " + parsedFileContents[0].xCoOrdinate);

            }

            retrieveExpensesAndAddRecordsToDatabase(parsedFileContents, inputFileColumnKeys,
                addRecordsToDatabase, addRecordCallbackParams);

        } else {

            if (HelperUtilsModule.valueDefined(fileStreamBuffer.page)) {

                currentPagenumber = fileStreamBuffer.page;

            } else if (HelperUtilsModule.valueDefined(fileStreamBuffer.text)) {

                console.log("PageNum : " + currentPagenumber + " ,Y : " + fileStreamBuffer.y +
                    " ,X : " + fileStreamBuffer.x + " ,Content : " + fileStreamBuffer.text);
                var currentContentObject = buildPDFFileContentObject(currentPagenumber, fileStreamBuffer);
                parsedFileContents.push(currentContentObject);
            }

        }

    });

}


/**
 * 
 * @param {Number} currentPageNumber  : Page number of input PDF file being parsed
 * @param {FILE_MetaData} fileStreamBuffer  : MetaData of file being parsed
 *
*/

function buildPDFFileContentObject(currentPageNumber, fileStreamBuffer) {

    var pdfContentObject = new Object();

    pdfContentObject.pageNum = currentPageNumber;
    pdfContentObject.yCoOrdinate = fileStreamBuffer.y;
    pdfContentObject.xCoOrdinate = fileStreamBuffer.x;
    pdfContentObject.text = fileStreamBuffer.text;

    return pdfContentObject;

}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) File to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 *
*/

function retrieveExpensesAndAddRecordsToDatabase(parsedFileContents, inputFileColumnKeys,
    addRecordsToDatabase, addRecordCallbackParams) {

    var horizontalMinMax = findMinMaxCoordinates(parsedFileContents, false);
    var verticalMinMax = findMinMaxCoordinates(parsedFileContents, true);

    console.log("Horizontal Min : " + horizontalMinMax.min + " ,Horizontal Max : " + horizontalMinMax.max);
    console.log("Vertial Min : " + verticalMinMax.min + " ,Vertial Max : " + verticalMinMax.max);

    var tableRecordObjects = parseTablesFromFileContents(parsedFileContents, horizontalMinMax, verticalMinMax);
    var bTablePresent = false;

    for (var currentTableRecordObject of tableRecordObjects) {

        if (currentTableRecordObject.NoOfRows > 1 && currentTableRecordObject.NoOfColumns > 2) {

            bTablePresent = true;
            break;
        }
    }

    var parsedFileContents = (bTablePresent == true) ? retrieveExpenseRecordsFromTables(parsedFileContents, tableRecordObjects) :
        parsedFileContents;

    var currentRecordObjectArray = null;

    if (bTablePresent == true) {

        currentRecordObjectArray = ExpTextClassificationUtilsModule.classifyAndRetrieveExpenseRecords(parsedFileContents,
            tableRecordObjects, inputFileColumnKeys);

    } else {

        currentRecordObjectArray = ImageJSHelperUtilsModule.retrieveExpenseRecordsFromRawFileContents(parsedFileContents,
            inputFileColumnKeys);
    }
    
    ExcelJSHelperUtilsModule.addMultipleRecordsToDB(addRecordsToDatabase, addRecordCallbackParams, currentRecordObjectArray);

}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {boolean} bVertical  : Vertical/Horizontal Coordinates ?
 *
*/

function findMinMaxCoordinates(parsedFileContents, bVertical) {

    var minMaxCoordinate = new Object();

    minMaxCoordinate.min = (bVertical == true) ? parsedFileContents[0].yCoOrdinate : parsedFileContents[0].xCoOrdinate;
    minMaxCoordinate.max = minMaxCoordinate.min;

    for (var index = 1; index < parsedFileContents.length; index++) {

        if (bVertical) {

            minMaxCoordinate.min = (minMaxCoordinate.min > parsedFileContents[index].yCoOrdinate) ? parsedFileContents[index].yCoOrdinate:
                minMaxCoordinate.min;
            minMaxCoordinate.max = (minMaxCoordinate.max < parsedFileContents[index].yCoOrdinate) ? parsedFileContents[index].yCoOrdinate:
                minMaxCoordinate.max;

        } else {

            minMaxCoordinate.min = (minMaxCoordinate.min > parsedFileContents[index].xCoOrdinate) ? parsedFileContents[index].xCoOrdinate:
                minMaxCoordinate.min;
            minMaxCoordinate.max = (minMaxCoordinate.max < parsedFileContents[index].xCoOrdinate) ? parsedFileContents[index].xCoOrdinate:
                minMaxCoordinate.max;

        }

    }

    return minMaxCoordinate;

}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Object} horizontalMinMax  : Object of X-Coordinate Min Max Values
 * @param {Object} verticalMinMax  : Object of Y-Coordinate Min Max Values
 *
*/

function parseTablesFromFileContents(parsedFileContents, horizontalMinMax, verticalMinMax) {

    // To do : Improvise Algorithm based on (Min, Max & ) Sorting of X-Coordinates, lower-upper bound limitations of current cell

    var maxNumberOfLinesInATableCell = 5;

    var minReqLinesInTable = 1;
    var tablRecordObjects = new Array();

    for (var index = 0; index < parsedFileContents.length; index++) {

        for (var j = 1; j < maxNumberOfLinesInATableCell && (index + j) < parsedFileContents.length; j++) {

            if (parsedFileContents[index].yCoOrdinate == parsedFileContents[index + j].yCoOrdinate) {

                var tableRecordObject = checkForPotentialTable(parsedFileContents, index, minReqLinesInTable, horizontalMinMax,
                    maxNumberOfLinesInATableCell);

                if (HelperUtilsModule.valueDefined(tableRecordObject)) {

                    index = tableRecordObject.End_ContentIndex-1;

                    console.log(" Table Found : Table End Index => " + index);
                    console.log(" Table Found : Details follow => " + HelperUtilsModule.returnObjectString(tableRecordObject));

                    if (tableRecordObject.NoOfRows > minReqLinesInTable) {

                        tablRecordObjects.push(tableRecordObject);
                    }

                } else {

                    console.log(" Table not found at current Index => " + index);

                }
            }

        }
    }

    return tablRecordObjects;
}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Array} tableRecordValues  : Array of Table Record Values
 * @param {Number} currentIndex  : Current Index of parsedFileContents to be processed
 *
 * @returns {Array} tableRecordValues  : Array of Post Processed Table Records
 * 
*/

function pushCurrentCoordinates(parsedFileContents, tableRecordValues, currentIndex) {

    tableRecordValues.push(parsedFileContents[currentIndex].xCoOrdinate);
    tableRecordValues.push(parsedFileContents[currentIndex].yCoOrdinate);
    tableRecordValues.push(currentIndex);

    return tableRecordValues;
}


/**
 *
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Number} currentIndex  : Current Index of parsedFileContents to be processed
 * @param {Number} minReqLinesInTable  : Minimum no Of Rows required to qualify as Table
 * @param {Object} horizontalMinMax  : Object of X-Coordinate Min Max Values
 *
 * @returns {Object} tableRecordObject  : Table Record object with required details for Table parsing
 *
*/

function checkForPotentialTable(parsedFileContents, currentIndex, minReqLinesInTable, horizontalMinMax, maxNumberOfLinesInATableCell) {

    var noOfRowsParsed = 0;

    var tableRecordValues = new Array();
    var tableRowSeparatorObjects = new Array();

    tableRecordValues = pushCurrentCoordinates(parsedFileContents, tableRecordValues, currentIndex);
    console.debug("PDFJSHelperUtils.checkForPotentialTable => tableRecordValues.Start : " + tableRecordValues.toString());

    while (currentIndex < parsedFileContents.length) {

        console.debug("PDFJSHelperUtils.checkForPotentialTable => Table Parsing : currentIndex => " + currentIndex +
            " ,noOfRowsParsed => " + noOfRowsParsed);

        var noOfColumns = 1;

        for (; currentIndex < parsedFileContents.length; currentIndex++) {

            if (parsedFileContents[currentIndex].yCoOrdinate != parsedFileContents[currentIndex + 1].yCoOrdinate) {

                // Handle special scenario of multiline cell
                // ToDo: Improvise algorithm without any line limit, Same X-Coordinate ( May not work with unaligned content )

                var j = 1;
                for (; j < maxNumberOfLinesInATableCell && (currentIndex + j) < parsedFileContents.length; j++) {

                    if (parsedFileContents[currentIndex].yCoOrdinate == parsedFileContents[currentIndex + j].yCoOrdinate) {

                        currentIndex = currentIndex + j-1;
                        noOfColumns += 2;
                        break;
                    }
                }

                if (j == maxNumberOfLinesInATableCell) {

                    break;
                }

            } else {

                noOfColumns++;
            }

        }

        if (noOfColumns == 1) {

            break;

        } 

        noOfRowsParsed++;
        var tableRowSeparatorValues = [currentIndex];
        tableRowSeparatorObjects.push(createTableRecord(tableRowSeparatorKeys, tableRowSeparatorValues));

        console.debug("PDFJSHelperUtils.checkForPotentialTable => TableParsing.End : currentIndex => " + currentIndex +
            " ,noOfColumns => " + noOfColumns + " ,noOfRowsParsed => " + noOfRowsParsed );
        currentIndex++;

        if (noOfRowsParsed == minReqLinesInTable) {

            tableRecordValues.push(noOfColumns);
        }
    }

    if (noOfRowsParsed < minReqLinesInTable) {

        return null;
    }

    tableRecordValues = pushCurrentCoordinates(parsedFileContents, tableRecordValues, currentIndex);
    tableRecordValues.push(noOfRowsParsed);
    tableRecordValues.push(tableRowSeparatorObjects);

    console.debug("PDFJSHelperUtils.checkForPotentialTable => tableRecordValues.End : " + tableRecordValues.toString());

    return createTableRecord(tableRecordKeys, tableRecordValues);
}


/**
 *
 * @param {Array} tableRecordKeys  : Record Keys of Table Object
 * @param {Array} tableRecordValues  : Record Values of Table Object
 *
 * @returns {Object} tableRecordObject  : Table Record object that got built
 *
*/

function createTableRecord(tableRecordKeys, tableRecordValues) {

    var tableRecord = new Object();

    for (var currentIndex = 0; currentIndex < tableRecordKeys.length; currentIndex++) {

        console.debug("current_Key : " + tableRecordKeys[currentIndex] + " ,current_Value : " + tableRecordValues[currentIndex]);
        tableRecord[tableRecordKeys[currentIndex]] = tableRecordValues[currentIndex];
    }

    return tableRecord;
}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Array} tableRecordObjects  : Array of table Record Objects having parsed Coordinate Data
 *
*/

function retrieveExpenseRecordsFromTables(parsedFileContents, tableRecordObjects) {

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

            sortCurrentRowOfTableBasedOnX(parsedFileContents, row_Start_Index, row_End_Index);
            sortCurrentRowOfTableBasedOnY(parsedFileContents, row_Start_Index, row_End_Index);

            if (currentRowObject.CurrentRowEndIndex + 1 < parsedFileContents.length) {

                console.log("Row Start_X : " + parsedFileContents[currentRowObject.CurrentRowEndIndex+1].xCoOrdinate +
                    "Row Start_Y : " + parsedFileContents[currentRowObject.CurrentRowEndIndex+1].yCoOrdinate);
            }

            row_Start_Index = currentRowObject.CurrentRowEndIndex+1;
        }

    }

    console.log("parsedFileContents After sorting Row contents : ");
    for (var currentContent of parsedFileContents) {

        console.log(HelperUtilsModule.returnObjectString(currentContent));
    }

    return parsedFileContents;

}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Number} rowStartIndex  : Start Index of Row
 * @param {Number} rowEndIndex  : End Index of Row
 *
*/

function sortCurrentRowOfTableBasedOnX(parsedFileContents, rowStartIndex, rowEndIndex) {

    for (var currentIndex = rowStartIndex; currentIndex <= rowEndIndex; currentIndex++) {

        for (var nextIndex = currentIndex + 1; nextIndex <= rowEndIndex; nextIndex++) {

            if (parsedFileContents[currentIndex].xCoOrdinate > parsedFileContents[nextIndex].xCoOrdinate) {

                exchangeDataObjects(parsedFileContents, currentIndex, nextIndex);
            }
        }
    }
}


/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Number} rowStartIndex  : Start Index of Row
 * @param {Number} rowEndIndex  : End Index of Row
 *
*/

function sortCurrentRowOfTableBasedOnY(parsedFileContents, rowStartIndex, rowEndIndex) {

    for (var currentIndex = rowStartIndex; currentIndex < rowEndIndex; currentIndex++) {

        var currentEndIndex = currentIndex+1;

        while (parsedFileContents[currentIndex].xCoOrdinate == parsedFileContents[currentEndIndex].xCoOrdinate) {

            currentEndIndex++;
        }

        if (currentEndIndex - currentIndex > 1) {

            for (var startIndex = currentIndex; startIndex < currentEndIndex; startIndex++) {

                for (var nextIndex = startIndex + 1; nextIndex < currentEndIndex; nextIndex++) {

                    if (parsedFileContents[startIndex].yCoOrdinate > parsedFileContents[nextIndex].yCoOrdinate) {

                        exchangeDataObjects(parsedFileContents, startIndex, nextIndex);
                    }
                }
            }
        }
    }
}

/**
 * 
 * @param {Array} parsedFileContents  : Array of Parsed File contents including Meta_Data
 * @param {Array} currentIndex  : Index where data needs to be inserted in Current Sort Algorithm
 * @param {Array} nextIndex  : Index from where data needs to be exchanged with
 *
*/

function exchangeDataObjects(parsedFileContents, currentIndex, nextIndex) {

    var tempObject = new Object();

    for (var currentProperty in parsedFileContents[currentIndex]) {

        tempObject[currentProperty] = parsedFileContents[currentIndex][currentProperty];
    }

    for (var currentProperty in parsedFileContents[nextIndex]) {

        parsedFileContents[currentIndex][currentProperty] = parsedFileContents[nextIndex][currentProperty];
    }

    for (var currentProperty in tempObject) {

        parsedFileContents[nextIndex][currentProperty] = tempObject[currentProperty];
    }

}












