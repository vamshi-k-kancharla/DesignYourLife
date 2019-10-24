
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var ImageJSHelperUtilsModule = require('./ImageJSHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RawContentParserModule = require('./RawContentParser');
var HelperUtilsModule = require('./HelperUtils');

/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including Meta_Data
 * 
 * @returns {Array} columnPosObjArray  : Array of table column positions
 *
*/

exports.checkForTableInImageFileContents = function (sortedImageFileLines) {

    var minReqColumns = 2;
    //var minReqConsecutiveRows = 3;
    var matchingColumnsPosArray = new Array();
    var matchingIndexesArray = new Array();

    var avgLetterWidth = findAvgLetterWidth(sortedImageFileLines);
    console.debug("checkForTableInImageFileContents :=> avgLetterWidth : " + avgLetterWidth);

    for (var currentLineIndex = 0; currentLineIndex < (sortedImageFileLines.length-1); currentLineIndex++) {

        console.debug("==========================================================================================================");
        console.debug("checkForTableInImageFileContents :=> Checking for consecutive lines of table @ index : " + currentLineIndex);
        console.debug("==========================================================================================================");

        var currentCoordinates = retrieveContentCoordinates(sortedImageFileLines, currentLineIndex);
        var nextCoordinates = retrieveContentCoordinates(sortedImageFileLines, currentLineIndex + 1);

        var columnPosObj = checkForTableColumns(currentCoordinates, nextCoordinates, avgLetterWidth);

        if (columnPosObj.length < minReqColumns) {

            continue;
        }

        var matchIndexArr = new Array();

        matchIndexArr.push(currentLineIndex);
        matchIndexArr.push(currentLineIndex + 1);

        matchingIndexesArray.push(matchIndexArr);
        matchingColumnsPosArray.push(columnPosObj);

        /*
        var nextLineIndex = currentLineIndex+2;

        for (; nextLineIndex < sortedImageFileLines.length; nextLineIndex++) {

            var nextCoordinates = retrieveContentCoordinates(sortedImageFileLines, nextLineIndex);

            if (!doesLineFitInTable(columnPosObjArray, nextCoordinates, avgLetterWidth)) {

                break;
            }
        }

        if ((nextLineIndex - currentLineIndex) >= minReqConsecutiveRows) {

            return columnPosObjArray;
        }

        currentLineIndex = nextLineIndex-1;
        */
    }

    printMatchingColumnPosArray(sortedImageFileLines, matchingIndexesArray, matchingColumnsPosArray);

    // ToDo : Merge All 2 row tables to form Single big table  

    if (!matchingIndexesArray.length && !matchingColumnsPosArray.length) {

        return null;
    }

    var matchColumns3DArray = new Array();

    matchColumns3DArray.push(matchingIndexesArray);
    matchColumns3DArray.push(matchingColumnsPosArray);
    matchColumns3DArray.push(avgLetterWidth);

    return matchColumns3DArray;

}

/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including Meta_Data
 * @param {Number} currentLineIndex  : Current line index of content array
 *
 * @returns {Array} retCoordinates  : Array of processed coordinates
 *
*/

function retrieveContentCoordinates(sortedImageFileLines, currentLineIndex) {

    var retCoordinates = new Array();

    console.debug("==========================================================================================================");
    console.debug("TableHelperUtils.retrieveContentCoordinates : current line being processed : ");
    console.debug(ImageJSHelperUtilsModule.printImageLine(sortedImageFileLines, currentLineIndex));

    for (var currentContentIndex = 0; currentContentIndex < sortedImageFileLines[currentLineIndex].length; currentContentIndex++) {

        retCoordinates.push((sortedImageFileLines[currentLineIndex][currentContentIndex].boundingPoly.vertices[0].x +
            sortedImageFileLines[currentLineIndex][currentContentIndex].boundingPoly.vertices[1].x) / 2);
    }

    console.debug(retCoordinates.toString());
    console.debug("==========================================================================================================");

    return retCoordinates;
}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including Meta_Data
 *
 * @returns {Number} avgLetterWidth  : Average Letter Width of file contents
 *
*/

function findAvgLetterWidth(sortedImageFileLines) {

    var totalLetterWidth = 0;
    var numLetters = 0;

    for (var currentLine of sortedImageFileLines) {

        for (var curreLineContent of currentLine) {

            numLetters += String(curreLineContent.description).length;
            totalLetterWidth += ((curreLineContent.boundingPoly.vertices[2].x + curreLineContent.boundingPoly.vertices[3].x)/2) -
                ((curreLineContent.boundingPoly.vertices[0].x + curreLineContent.boundingPoly.vertices[1].x) / 2);

            if (GlobalsForServiceModule.bDebug == true) {

                ImageJSHelperUtilsModule.printImageLineContent(curreLineContent);
                console.debug("findAvgLetterWidth : numLetters : " + numLetters + " ,totalLetterWidth : " + totalLetterWidth);
            }
        }
    }

    return (totalLetterWidth / numLetters);
}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including Meta_Data
 * @param {Number} currentLineIndex  : Current line index of content array
 * @param {Number} avgLetterWidth  : Average Letter Width of file contents
 *
 * @returns {Array} columnPosObjArray  : Array of Column Positions for consecutive lines
 *
*/

function checkForTableColumns(currentCoordinates, nextCoordinates, avgLetterWidth) {

    var bufferRatio = .8;
    var currentPtr = 0, nextPtr = 0;
    var columnPosObjArray = new Array();

    while (true) {

        console.debug("checkForTableColumns :=> currentPtr : " + currentPtr + " ,nextPtr : " + nextPtr);
        console.debug("checkForTableColumns :=> currentCoordinates : " + currentCoordinates.toString());
        console.debug("checkForTableColumns :=> nextCoordinates : " + nextCoordinates.toString());

        while (currentPtr < currentCoordinates.length && (currentCoordinates[currentPtr] <
            (nextCoordinates[nextPtr] - bufferRatio * avgLetterWidth))) {

            currentPtr++;
        }

        if (currentPtr >= currentCoordinates.length) {

            break;
        }

        console.debug("checkForTableColumns :=> After iterating currentCoordinates : currentPtr : " + currentPtr);
        console.debug("checkForTableColumns :=> After iterating currentCoordinates : currentCoordinates[currentPtr] : " +
            currentCoordinates[currentPtr] + ", nextCoordinates[nextPtr] : " + nextCoordinates[nextPtr]);

        if (currentCoordinates[currentPtr] >= (nextCoordinates[nextPtr] - (bufferRatio * avgLetterWidth)) &&
            currentCoordinates[currentPtr] <= (nextCoordinates[nextPtr] + (bufferRatio * avgLetterWidth))) {

            columnPosObjArray.push((currentCoordinates[currentPtr] + nextCoordinates[nextPtr]) / 2);
            nextPtr++;
        }

        console.debug("checkForTableColumns :=> columnPosObjArray : " + columnPosObjArray.toString());

        while (nextPtr < nextCoordinates.length && (nextCoordinates[nextPtr] <
            (currentCoordinates[currentPtr] - bufferRatio * avgLetterWidth))) {

            nextPtr++;
        }

        if (nextPtr >= nextCoordinates.length) {

            break;
        }

        console.debug("checkForTableColumns :=> After iterating nextCoordinates : nextPtr : " + nextPtr);
        console.debug("checkForTableColumns :=> After iterating nextCoordinates : currentCoordinates[currentPtr] : " +
            currentCoordinates[currentPtr] + ", nextCoordinates[nextPtr] : " + nextCoordinates[nextPtr]);

        if (nextCoordinates[nextPtr] >= (currentCoordinates[currentPtr] - (bufferRatio * avgLetterWidth)) &&
            nextCoordinates[nextPtr] <= (currentCoordinates[currentPtr] + (bufferRatio * avgLetterWidth))) {

            columnPosObjArray.push((currentCoordinates[currentPtr] + nextCoordinates[nextPtr]) / 2);
            currentPtr++;
        }

        console.debug("checkForTableColumns :=> columnPosObjArray : " + columnPosObjArray.toString());

    }

    return columnPosObjArray;

}


/**
 * 
 * @param {Array} columnPosObjArray  : Array of Columns positions of Table
 * @param {Number} currentCoordinates  : Array of current Line coordinates
 * @param {Number} avgLetterWidth  : Average Letter Width of file contents
 *
 * @returns {Array} currentLineColumnIndexes  : Array of Column Indexes if row gets found in Table, null otherwise
 *
*/

function doesLineFitInTable(columnPosObjArray, currentCoordinates, avgLetterWidth) {

    var bufferRatio = .4;
    var currentLineColumnIndexes = new Array();

    for (var columnPos of columnPosObjArray) {

        for (var currentPosIndex = 0; currentPosIndex < currentCoordinates.length; currentPosIndex++) {

            if (currentCoordinates[currentPosIndex] >= (columnPos - (bufferRatio * avgLetterWidth)) &&
                currentCoordinates[currentPosIndex] <= (columnPos + (bufferRatio * avgLetterWidth))) {

                currentLineColumnIndexes.push(currentPosIndex);
            }
        }
    }

    return ((currentLineColumnIndexes.length == columnPosObjArray.length) ? currentLineColumnIndexes : null);
}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 * @param {Array} columnPosObjArray  : Array of Columns positions of Table
 * @param {Number} avgLetterWidth  : Average Letter Width of file contents
 *
 * @returns {Array} recordObjectValues  : Array of record objects retrieved from Table Contents
 *
*/

exports.buildRecordObjectValuesFromTableContents = function (sortedImageFileLines, columnPosObjArray, avgLetterWidth) {

    var recordObjectValuesArr = new Array();

    for (var currentLineIndex = 0; currentLineIndex < sortedImageFileLines.length; currentLineIndex++) {

        var currentObjectValues = new Array();

        var currentCoordinates = retrieveContentCoordinates(sortedImageFileLines, currentLineIndex);
        var currentLineColumnIndexes = doesLineFitInTable(columnPosObjArray, currentCoordinates, avgLetterWidth);

        if (currentLineColumnIndexes == null) {

            continue;
        }

        for (var currentPos = 0; currentPos < currentLineColumnIndexes.length-1; currentPos++) {

            var currentContent = "";

            for (var currentContentIndex = currentLineColumnIndexes[currentPos];
                currentContentIndex < currentLineColumnIndexes[currentPos + 1]; currentContentIndex++) {

                currentContent += sortedImageFileLines[currentLineIndex][currentContentIndex].description;
                currentContent += " ";
            }

            currentObjectValues.push(currentContent);
        }

        var currentContent = "";

        for (var currentContentIndex = currentLineColumnIndexes[currentLineColumnIndexes.length - 1];
            currentContentIndex < sortedImageFileLines[currentLineIndex].length; currentContentIndex++) {

            currentContent += sortedImageFileLines[currentLineIndex][currentContentIndex].description;
            currentContent += " ";
        }

        currentObjectValues.push(currentContent);

        recordObjectValuesArr.push(currentObjectValues);

    }

}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 * @param {Array} tableLineIndexArr  : Array of line indexes with matching columns
 * @param {Array} matchColumnPosObjArray  : Array of matching columns positions of Table
 * @param {Number} avgLetterWidth  : Average Letter Width of file contents
 *
 * @returns {Array} recordObjectValuesArr  : Array of record objects retrieved from Table Contents
 *
*/

exports.buildRecordObjectValuesFromMultipleTables = function (sortedImageFileLines, tableLineIndexArr, matchColumnPosObjArray,
    avgLetterWidth) {

    var recordObjectValuesArr = new Array();

    // ToDo : Complicated : Combine multiple indexes of matching columns as condense as possible through column positions and extract content

    // For Now : Regroup line indexes of table and process data with Raw Data Logic

    var extractedIndexes = new Array();

    for (var currentIndexArray of tableLineIndexArr) {

        for (var currentIndex of currentIndexArray) {

            extractedIndexes = HelperUtilsModule.addIfNotFound(extractedIndexes, currentIndex);
        }
    }

    var place_CurrentExpenses = RawContentParserModule.findPlaceFromInputContents(sortedImageFileLines);
    var date_CurrentExpenses = RawContentParserModule.findDateFromInputContents(sortedImageFileLines);

    for (var currentIndex of extractedIndexes) {

        var recordObjectValues = RawContentParserModule.processRawContentForExpenseRecord(sortedImageFileLines[currentIndex],
            place_CurrentExpenses, date_CurrentExpenses);

        if (HelperUtilsModule.valueDefined(recordObjectValues)) {

            recordObjectValuesArr.push(recordObjectValues);
        }
    }

    return recordObjectValuesArr;
}


/**
 * 
 * @param {Array} sortedImageFileLines  : Array of "Parsed & Sorted" File contents including
 * @param {Array} matchingIndexesArray  : Array of index positions of all matching columns
 * @param {Array} matchingColumnsPosArray  : Array of matching column positions for each match
 *
*/

function printMatchingColumnPosArray(sortedImageFileLines, matchingIndexesArray, matchingColumnsPosArray) {

    console.debug("================================================================");
    console.debug("printMatchingColumnPosArray => Matching Lines & Positions");

    for (var i = 0; i < matchingIndexesArray.length; i++) {

        console.debug("================================================================");

        for (var currentIndex of matchingIndexesArray[i]) {

            ImageJSHelperUtilsModule.printImageLine(sortedImageFileLines, currentIndex);
        }

        console.debug(matchingColumnsPosArray[i].toString());

        console.debug("================================================================");
    }

    console.debug("================================================================");
}

