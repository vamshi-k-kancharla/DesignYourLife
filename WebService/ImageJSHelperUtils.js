
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var ExpTextClassificationUtilsModule = require('./ExpenseTextClassificationUtils');
var PdfJSHelperUtilsModule = require('./PDFJSHelperUtils');
var ImageJSHelperUtilsModule = require('./ImageJSHelperUtils');
var TableHelperUtilsModule = require('./TableHelperUtils');
var ExcelJSHelperUtilsModule = require('./ExcelJSHelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');

var ImageToPdfModule = require('images-to-pdf');
var GoogleCloudVisionAPIModule = require('@google-cloud/vision');

/**
 * 
 * @param {Map} inputFileDataMap  : Map of <k,v> pairs of inputFileData sent via WebClient Request
 * @param {String} inputFileLocation  : Location of input file
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) File to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 *
*/

exports.buildRecordObjectMapFromImageFile = function (inputFileDataMap, inputFileLocation, inputFileColumnKeys,
    addRecordsToDatabase, addRecordCallbackParams) {

    var inputFileName = inputFileDataMap.get("FileName");
    var inputFileFullPath = inputFileLocation + inputFileName;
    var pdfFileFullPath = inputFileLocation + (inputFileName.split("."))[0] + ".pdf";

    // Convert to PDF File

    /*
    var inputFileArray = [inputFileFullPath];

    ImageToPdfModule(inputFileArray, pdfFileFullPath, function (err) {

        if (err) {

            console.error("buildRecordObjectMapFromImageFile: Error while converting image to PDF File => " + err);
            return;
        } 

    }); 

    console.log("buildRecordObjectMapFromImageFile: Successfully converted image file to PDF file");
    */

    var googleCloudVisionAPIClient = new GoogleCloudVisionAPIModule.ImageAnnotatorClient();

    googleCloudVisionAPIClient.textDetection(inputFileFullPath, function (err, result) {

        if (err) {

            console.error("buildRecordObjectMapFromImageFile: Error while parsing text from image file through googleCloud Vision API => "
                + err);
            return;
        }

        var textContentArr = result.textAnnotations;

        console.log("File Name => " + inputFileName);
        console.log("Text description of starting content  => " + textContentArr[0].description);

        ImageJSHelperUtilsModule.buildRecordObjectsFromImageFilesAndAddToDatabase(textContentArr, inputFileColumnKeys,
            addRecordsToDatabase, addRecordCallbackParams);

    });

    // Parse PDF File

    /*
    inputFileDataMap.set("FileName", (inputFileName.split("."))[0] + ".pdf");
    PdfJSHelperUtilsModule.buildRecordObjectMapFromPDFFile(inputFileDataMap, inputFileLocation, inputFileColumnKeys,
        addRecordsToDatabase, addRecordCallbackParams);
    */

}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Array} inputFileColumnKeys : Expected column keys of input ( Min Req ) File to build RecordObjectMap
 * @param {Function} addRecordToDatabase  : Callback function from caller to add Record to given database
 * @param {Map} addRecordCallbackParams : Map of <k,v> pairs of Callback function Parameters
 *
*/

exports.buildRecordObjectsFromImageFilesAndAddToDatabase = function (textContentArr, inputFileColumnKeys,
    addRecordsToDatabase, addRecordCallbackParams) {

    if (GlobalsForServiceModule.bDebug == true) {

        for (var currentText of textContentArr) {

            ImageJSHelperUtilsModule.printImageLineContent(currentText);
        }
    }

    textContentArr = textContentArr.slice(1, textContentArr.length - 1);
    var minMaxCoordinate = ImageJSHelperUtilsModule.findMinMaxCoordinatesImageContent(textContentArr);

    console.debug("Text description of starting content  => " + textContentArr[0].description +
        " ,Text description of ending content  => " + textContentArr[textContentArr.length - 1].description);
    console.debug("Min Max Coordinates => xMin : " + minMaxCoordinate.xMin + " ,xMax : " + minMaxCoordinate.xMax +
        " ,yMin : " + minMaxCoordinate.yMin + " ,yMax : " + minMaxCoordinate.yMax);
    console.debug("Letter heights => letterMinHeight : " + minMaxCoordinate.letterMinHeight + " ,letterMaxHeight : " +
        minMaxCoordinate.letterMaxHeight + " ,letterAvgHeight : " + minMaxCoordinate.letterAvgHeight);

    var lineMarkingsArray = ImageJSHelperUtilsModule.segregateImageContentIntoLines(textContentArr, minMaxCoordinate);

    console.debug("Image content segregated into lines :=> ");

    for (var currentLineIndexes of lineMarkingsArray) {

        var currentLineText = "New Line : ";

        for (var currentIndex of currentLineIndexes) {

            currentLineText += textContentArr[currentIndex].description;
            currentLineText += "   ,";
        }

        console.debug(currentLineText);
    }

    console.debug("Sorted line content of image file :=> ");

    var sortedImageFileLines = ImageJSHelperUtilsModule.sortImageContentLines(textContentArr, lineMarkingsArray);
    ImageJSHelperUtilsModule.printImageLines(sortedImageFileLines);

    var matchColumns3DArray = TableHelperUtilsModule.checkForTableInImageFileContents(sortedImageFileLines);
    var recordObjectValuesArray;

    if (!HelperUtilsModule.valueDefined(matchColumns3DArray)) {

        // ToDo : Raw Content ( No Tables ) => Needs further processing => Classify and add Records

    } else if (matchColumns3DArray[0].length == 1 && matchColumns3DArray[1].length == 1) {

        recordObjectValuesArray = TableHelperUtilsModule.buildRecordObjectValuesFromTableContents(sortedImageFileLines,
            matchColumns3DArray[1], matchColumns3DArray[2]);

    } else {

        recordObjectValuesArray = TableHelperUtilsModule.buildRecordObjectValuesFromMultipleTables(sortedImageFileLines,
            matchColumns3DArray[0], matchColumns3DArray[1], matchColumns3DArray[2]);

    }

    if (!HelperUtilsModule.valueDefined(recordObjectValuesArray)) {

        console.error("ImageJSHelperUtils.buildRecordObjectsFromImageFilesAndAddToDatabase : " +
            "Some error while retrieving Record Values from image file (invalid record values)");

        var failureMessage = "Some error while retrieving Record Values from image file (parsed record values are incorrect)";
        HelperUtilsModule.logBadHttpRequestError("buildRecordObjectsFromImageFilesAndAddToDatabase", failureMessage,
            addRecordCallbackParams.get("http_response"));

        return;
    }

    console.debug("buildRecordObjectsFromImageFilesAndAddToDatabase :=> recordObjectValuesArray => ");
    for (var currentIndex = 0; currentIndex < recordObjectValuesArray.length; currentIndex++) {

        console.debug("Record Object values ( " + currentIndex + " ) :=> " +
            HelperUtilsModule.returnObjectString(recordObjectValuesArray[currentIndex]));
    }

    var expenseRecordObjectsArray = ExpTextClassificationUtilsModule.classifyAndBuildExpenseRecordObjects(recordObjectValuesArray,
        inputFileColumnKeys);
    ExcelJSHelperUtilsModule.addMultipleRecordsToDB(addRecordsToDatabase, addRecordCallbackParams, expenseRecordObjectsArray);

}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * 
 * @returns {Object} minMaxCoordinate  : Min Max Coordinate object
 *
*/

exports.findMinMaxCoordinatesImageContent = function (textContentArr) {

    var minMaxCoordinate = new Object();

    minMaxCoordinate.xMin = minMaxCoordinate.yMin = 999999;
    minMaxCoordinate.xMax = minMaxCoordinate.yMax = 0;
    minMaxCoordinate.letterMinHeight = 999999;
    minMaxCoordinate.letterMaxHeight = 0;

    var letterHeightArr = new Array();

    for (var currentText of textContentArr) {

        var currentLetterHeightMinVertice = 999999;
        var currentLetterHeightMaxVertice = 0;

        for (var currentVertice of currentText.boundingPoly.vertices) {

            minMaxCoordinate.xMin = (minMaxCoordinate.xMin > currentVertice.x)
                ? currentVertice.x : minMaxCoordinate.xMin;
            minMaxCoordinate.xMax = (minMaxCoordinate.xMax < currentVertice.x)
                ? currentVertice.x : minMaxCoordinate.xMax;

            minMaxCoordinate.yMin = (minMaxCoordinate.yMin > currentVertice.y)
                ? currentVertice.y : minMaxCoordinate.yMin;
            minMaxCoordinate.yMax = (minMaxCoordinate.yMax < currentVertice.y)
                ? currentVertice.y : minMaxCoordinate.yMax;

            currentLetterHeightMinVertice = (currentLetterHeightMinVertice > currentVertice.y)
                ? currentVertice.y : currentLetterHeightMinVertice;
            currentLetterHeightMaxVertice = (currentLetterHeightMaxVertice < currentVertice.y)
                ? currentVertice.y : currentLetterHeightMaxVertice;
        }

        var currentLetterHeight = currentLetterHeightMaxVertice - currentLetterHeightMinVertice;
        letterHeightArr.push(currentLetterHeight);

    }

    var totalLetterHeight = 0;

    for (var currentLetterHeight of letterHeightArr) {

        minMaxCoordinate.letterMinHeight = (minMaxCoordinate.letterMinHeight > currentLetterHeight)
            ? currentLetterHeight : minMaxCoordinate.letterMinHeight;
        minMaxCoordinate.letterMaxHeight = (minMaxCoordinate.letterMaxHeight < currentLetterHeight)
            ? currentLetterHeight : minMaxCoordinate.letterMaxHeight;

        totalLetterHeight += currentLetterHeight;

        console.debug("currentLetterHeight : " + currentLetterHeight);
    }

    minMaxCoordinate.letterAvgHeight = Math.ceil(totalLetterHeight / letterHeightArr.length);

    return minMaxCoordinate;
}



/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Object} minMaxCoordinate  : Derived Coordinate values based on Image Text Content
 *
 * @returns {Array} lineMarkingsObjArr  : Array of objects with Line Markings
 *
*/

exports.segregateImageContentIntoLines = function (textContentArr, minMaxCoordinate) {

    var lineHeightBuffer = 8;     // Improve accuracy by taking <mean, min, max> into consideration
    var lineMarkingsObjArr = new Array();
    var bNewLine = true;
    var allowedVerticeMin = 0;
    var allowedVerticeMax = 0;
    var currentLineStartIndex = 0;
    var currentLineEndIndex = 0;
    var visitedNodes = new Array(textContentArr.length);

    visitedNodes = visitedNodes.fill(false, 0, visitedNodes.length - 1);

    for (var currentIndex = 0; currentIndex < textContentArr.length; currentIndex++) {

        if (visitedNodes[currentIndex] == true) {

            continue;
        }

        var currentVertice = ImageJSHelperUtilsModule.retrieveCurrentVericeMinMax(textContentArr, currentIndex);

        if (bNewLine == true) {

            allowedVerticeMin = currentVertice.yMin - Math.ceil((minMaxCoordinate.letterMaxHeight - (currentVertice.yMax - currentVertice.yMin) +
                (lineHeightBuffer * 2)) / 2);
            allowedVerticeMax = currentVertice.yMax + Math.ceil((minMaxCoordinate.letterMaxHeight - (currentVertice.yMax - currentVertice.yMin) +
                (lineHeightBuffer * 2)) / 2);

            allowedVerticeMin = (allowedVerticeMin < minMaxCoordinate.yMin) ? minMaxCoordinate.yMin : allowedVerticeMin;
            allowedVerticeMax = (allowedVerticeMax > minMaxCoordinate.yMax) ? minMaxCoordinate.yMax : allowedVerticeMax;

            console.debug("Current Line allowed y coordinates => Min : " + allowedVerticeMin + " ,Max : " + allowedVerticeMax);

            currentLineStartIndex = currentIndex;
            bNewLine = false;

        } else {

            if (!(currentVertice.yMin >= allowedVerticeMin && currentVertice.yMax <= allowedVerticeMax)) {

                var nextVertice = ImageJSHelperUtilsModule.retrieveCurrentVericeMinMax(textContentArr, currentIndex+1);

                if (nextVertice.yMin >= allowedVerticeMin && nextVertice.yMax <= allowedVerticeMax) {

                    allowedVerticeMax = currentVertice.yMax + Math.ceil((minMaxCoordinate.letterMaxHeight - (currentVertice.yMax - currentVertice.yMin) +
                        (lineHeightBuffer * 2)) / 2);
                    allowedVerticeMax = (allowedVerticeMax > minMaxCoordinate.yMax) ? minMaxCoordinate.yMax : allowedVerticeMax;

                    currentIndex++;

                } else {

                    bNewLine = true;
                    currentIndex--;
                    currentLineEndIndex = currentIndex;

                    var currentLineIndexes = new Array();

                    console.debug("currentLineStartIndex : " + currentLineStartIndex + "currentLineEndIndex : " + currentLineEndIndex);
                    console.debug("visitedNodes[currentLineStartIndex] : " + visitedNodes[currentLineStartIndex].toString() +
                        "visitedNodes[currentLineEndIndex] : " + visitedNodes[currentLineEndIndex].toString());

                    for (var currentIdx = currentLineStartIndex; currentIdx <= currentLineEndIndex; currentIdx++) {

                        if (visitedNodes[currentIdx] == false) {

                            currentLineIndexes.push(currentIdx);
                            visitedNodes[currentIdx] = true;
                        }
                    }

                    console.debug("currentLineIndexes after determining clustered vertices : " + currentLineIndexes.toString());

                    var disbursedIndexes = ImageJSHelperUtilsModule.retrieveRemainingVerticesOfCurrentLine(textContentArr, visitedNodes,
                        allowedVerticeMin, allowedVerticeMax);

                    for (var currentIdx = 0; currentIdx < disbursedIndexes.length; currentIdx++) {

                        currentLineIndexes.push(disbursedIndexes[currentIdx]);
                        visitedNodes[disbursedIndexes[currentIdx]] = true;
                    }

                    console.debug("currentLineIndexes after determining scattered vertices : " + currentLineIndexes.toString());

                    lineMarkingsObjArr.push(currentLineIndexes);

                }

            }
        }

    }

    return lineMarkingsObjArr;
}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Number} currentIndex  : Current Index of text data for processing
 *
 * @returns {Object} currentVertice  : Current Letter Vertice
 *
*/

exports.retrieveCurrentVericeMinMax = function (textContentArr, currentIndex) {

    var currentVerticeMin = 999999;
    var currentVerticeMax = 0;

    for (var currentVertice of textContentArr[currentIndex].boundingPoly.vertices) {

        currentVerticeMin = (currentVerticeMin > currentVertice.y)
            ? currentVertice.y : currentVerticeMin;
        currentVerticeMax = (currentVerticeMax < currentVertice.y)
            ? currentVertice.y : currentVerticeMax;
    }

    var currentVertice = new Object();

    currentVertice.yMin = currentVerticeMin;
    currentVertice.yMax = currentVerticeMax;

    return currentVertice;
}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Array} visitedNodes  : Array of indexes with visited nodes marked
 * @param {Number} allowedVerticeMin  : Allowed Minimum line vertice
 * @param {Number} allowedVerticeMax  : Allowed Maximum line vertice
 *
 * @returns {Array} disbursedVertices  : Array of remaining indexes in current line
 *
*/

exports.retrieveRemainingVerticesOfCurrentLine = function (textContentArr, visitedNodes, allowedVerticeMin, allowedVerticeMax) {

    var disbursedVertices = new Array();

    for (var currentIndex = 0; currentIndex < textContentArr.length; currentIndex++) {

        var currentVertice = ImageJSHelperUtilsModule.retrieveCurrentVericeMinMax(textContentArr, currentIndex);

        if (currentVertice.yMin >= allowedVerticeMin && currentVertice.yMax <= allowedVerticeMax && visitedNodes[currentIndex] == false) {

            disbursedVertices.push(currentIndex);
        }
    }

    return disbursedVertices;

}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Array} lineMarkingsArray  : Array of line index arrays
 *
 * @returns {Array} sortedImageFileLines  : Array of sorted lines of the image content
 *
*/

exports.sortImageContentLines = function (textContentArr, lineMarkingsArray) {

    var sortedImageFileLines = new Array();

    for (var currentLineIndexArr of lineMarkingsArray) {

        var currentLineContents = new Array();

        for (var currentIndex of currentLineIndexArr) {

            currentLineContents.push(textContentArr[currentIndex]);
        }

        currentLineContents = sortCurrentLineColumnsWise(currentLineContents);
        sortedImageFileLines.push(currentLineContents);

    }

    return sortedImageFileLines;
}


/**
 * 
 * @param {Array} currentLineContents  : Array of Current Line Contents
 *
 * @returns {Array} currentLineContents  : Array of sorted line Contents
 *
*/

function sortCurrentLineColumnsWise(currentLineContents) {

    for (var currentIndex = 0; currentIndex < currentLineContents.length; currentIndex++) {

        currentLineContents = sortVerticesOfCurrentContentColumnWise(currentLineContents, currentIndex);
    }

    for (var i = 0; i < currentLineContents.length; i++) {

        for (var j = i + 1; j < currentLineContents.length; j++) {

            if ( ((currentLineContents[i].boundingPoly.vertices[0].x + currentLineContents[i].boundingPoly.vertices[1].x) / 2) >
                 (currentLineContents[j].boundingPoly.vertices[0].x + currentLineContents[j].boundingPoly.vertices[1].x) / 2) {

                var tempHolder = currentLineContents[i];
                currentLineContents[i] = currentLineContents[j];
                currentLineContents[j] = tempHolder;
            }
        }
    }

    return currentLineContents;
}


/**
 * 
 * @param {Array} textContentArr  : Array of Parsed File contents including Meta_Data
 * @param {Number} currentIndex  : Current Index of text data for processing
 *
 * @returns {Array} textContentArr  : Array of text contents of current lines
 *
*/

function sortVerticesOfCurrentContentColumnWise(textContentArr, currentIndex) {

    if (GlobalsForServiceModule.bDebug == true) {

        console.debug("ImageJSHelperUtils.sortVerticesOfCurrentContentColumnWise => Before sorting the vertices of current Content");
        ImageJSHelperUtilsModule.printImageLineContent(textContentArr[currentIndex]);
    }

    for (var i = 0; i < textContentArr[currentIndex].boundingPoly.vertices.length; i++) {

        for (var j = i + 1; j < textContentArr[currentIndex].boundingPoly.vertices.length; j++) {

            if (textContentArr[currentIndex].boundingPoly.vertices[i].x > textContentArr[currentIndex].boundingPoly.vertices[j].x) {

                // To Do : Exchange at CoOrdinate level instead of Vertice Level
                var tempHolder = textContentArr[currentIndex].boundingPoly.vertices[i];
                textContentArr[currentIndex].boundingPoly.vertices[i] = textContentArr[currentIndex].boundingPoly.vertices[j];
                textContentArr[currentIndex].boundingPoly.vertices[j] = tempHolder;
            }

        }

    }

    if (GlobalsForServiceModule.bDebug == true) {

        console.debug("ImageJSHelperUtils.sortVerticesOfCurrentContentColumnWise => After sorting the vertices of current Content");
        ImageJSHelperUtilsModule.printImageLineContent(textContentArr[currentIndex]);
    }

    return textContentArr;
}


/**
 * 
 * @param {Array} printImageLines  : Array of sorted lines of the image content
 *
*/

exports.printImageLines = function (sortedImageFileLines) {

    for (var currentIndex = 0; currentIndex < sortedImageFileLines.length; currentIndex++) {

        ImageJSHelperUtilsModule.printImageLine(sortedImageFileLines, currentIndex);
    }
}

/**
 * 
 * @param {Object} printImageLine  : Single line of sorted image content
 *
*/

exports.printImageLine = function (sortedImageFileLines, currentIndex) {

    var currentLineText = "New Line : ";

    for (var currentLineContent of sortedImageFileLines[currentIndex]) {

        currentLineText += currentLineContent.description;
        currentLineText += " ,";
    }

    console.debug(currentLineText);
}

/**
 * 
 * @param {Object} currentLineContent  : Current Line content object
 *
*/

exports.printImageLineContent = function (currentLineContent) {

    console.log(currentLineContent.description);

    for (var currentObject of currentLineContent.boundingPoly.vertices) {

        console.log(HelperUtilsModule.returnObjectString(currentObject));
    }
}


