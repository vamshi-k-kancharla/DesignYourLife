
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

        for (var currentText of textContentArr) {

            console.log(currentText.description);

            for (var currentObject of currentText.boundingPoly.vertices) {

                console.log(HelperUtilsModule.returnObjectString(currentObject));
            }
        }

        textContentArr = textContentArr.slice(1, textContentArr.length - 1);
        var minMaxCoordinate = ImageJSHelperUtilsModule.findMinMaxCoordinatesImageContent(textContentArr);

        console.debug("Text description of starting content  => " + textContentArr[0].description +
            " ,Text description of ending content  => " + textContentArr[textContentArr.length-1].description);
        console.debug("Min Max Coordinates => xMin : " + minMaxCoordinate.xMin + " ,xMax : " + minMaxCoordinate.xMax +
            " ,yMin : " + minMaxCoordinate.yMin + " ,yMax : " + minMaxCoordinate.yMax);
        console.debug("Letter heights => letterMinHeight : " + minMaxCoordinate.letterMinHeight + " ,letterMaxHeight : " +
            minMaxCoordinate.letterMaxHeight + " ,letterAvgHeight : " + minMaxCoordinate.letterAvgHeight);

        var lineMarkingObjects = ImageJSHelperUtilsModule.segregateImageContentIntoLines(textContentArr, minMaxCoordinate);

        console.debug("Image content segregated into lines :=> ");

        for (var currentObject of lineMarkingObjects) {

            var currentLineText = "New Line : ";

            for (var currentIndex = currentObject.startIndex; currentIndex <= currentObject.endIndex; currentIndex++) {

                currentLineText += textContentArr[currentIndex].description;
                currentLineText += "   ,";
            }

            console.debug(currentLineText);
        }

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

    var lineHeightBuffer = 5;
    var lineMarkingsObjArr = new Array();
    var bNewLine = true;
    var allowedVerticeMin = 0;
    var allowedVerticeMax = 0;
    var currentLineStartIndex = 0;
    var currentLineEndIndex = 0;

    for (var currentIndex = 0; currentIndex < textContentArr.length; currentIndex++) {

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

                    var currentLineObj = new Object();

                    currentLineObj.startIndex = currentLineStartIndex;
                    currentLineObj.endIndex = currentLineEndIndex;

                    lineMarkingsObjArr.push(currentLineObj);
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


