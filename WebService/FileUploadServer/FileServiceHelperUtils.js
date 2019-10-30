
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

/**************************************************************************************************
 **************************************************************************************************
 * 
 *  File Service Helper Utils Module : All the helper Utils specific to File Upload Server 
 *
 **************************************************************************************************
 **************************************************************************************************
 */

'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables
 * 
 *************************************************************************/

var fileSystem = require('fs');

var HelperUtilsModule = require('../HelperUtils');
var GlobalsForFileServiceModule = require('./GlobalsForFileService');


/**
 *
 * @param {Object} inputObject  : Input Object to be converted to String Display format ( including recursion )
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.printRecursiveObjectString = function (inputObject) {

    for (var currentProperty in inputObject) {

        console.log("==============================================================================");

        if (HelperUtilsModule.valueDefined(inputObject[currentProperty])) {

            if ((typeof inputObject[currentProperty]) == "object") {

                console.log("currentProperty => " + currentProperty + ", currentValue => " + "Object");

            } else {

                console.log("Type => " + (typeof inputObject[currentProperty]));
                console.log("currentProperty => " + currentProperty + ", currentValue => " + inputObject[currentProperty]);
            }
        }

        console.log("==============================================================================");
    }

}


/**
 *
 * @param {File} inputFile  : Multer Input File Object to extract & log information 
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.logUploadedFileProperties = function (inputFile) {

    for (var currentProperty of GlobalsForFileServiceModule.uploadedFilePropertiesForLogging) {

        console.log("currentFile." + currentProperty + " : " + inputFile[currentProperty]);
    }

}


/**
 *
 * @param {String} uploadedFileName  : Name of uploaded file
 * @param {String} encodedFileData  : Custom encoded uploaded File data
 * @param {XMLHTTPResponse} http_response  : HTTP_Response to be built based on File Create request processing
 *
*/

exports.createFileUsingCustomEncodedFileData = function (uploadedFileName, encodedFileData, http_response) {

    var currentFileDataTypedArray = HelperUtilsModule.convertCustomEncodedStringDataToUint8TypedArray(encodedFileData);

    fileSystem.writeFile(GlobalsForFileServiceModule.uploadedFileDestination + uploadedFileName, currentFileDataTypedArray,
        function (err) {

            if (err) {

                console.error("FileServiceHelperUtils.createFileUsingCustomEncodedFileData : Error while creating uploaded file: "
                    + uploadedFileName);

                var failureMessage = "FileServiceHelperUtils.createFileUsingCustomEncodedFileData : Error while creating uploaded file: "
                    + uploadedFileName;
                HelperUtilsModule.logInternalServerError("createFileUsingCustomEncodedFileData",
                    failureMessage, http_response);

                return;

            } else {

                console.log("FileServiceHelperUtils.createFileUsingCustomEncodedFileData : Successfully created uploaded file: "
                    + uploadedFileName);

                var successMessage = "FileServiceHelperUtils.createFileUsingCustomEncodedFileData : Successfully created uploaded file: "
                    + uploadedFileName;
                HelperUtilsModule.buildSuccessResponse_Generic("createFileUsingCustomEncodedFileData",
                    successMessage, http_response);

                return;

            }

        });
}

