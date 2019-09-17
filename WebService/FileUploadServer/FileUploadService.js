
/**************************************************************************************
 * 
 * 
 * Web Service to upload Files for Design Your Life Service using Express Framework 
 * 
 * 
 **************************************************************************************/

'use strict';


/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables ( External )
 * 
**************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var fileSystem = require('fs');

var multer = require('multer');

var application = express();


/*************************************************************************
 * 
 * Global Code Execution
 * 
**************************************************************************/

application.use(bodyParser.text());


/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables ( Internal )
 * 
**************************************************************************/

var HelperUtilsModule = require('../HelperUtils');
var FileServiceHelperUtilsModule = require('./FileServiceHelperUtils');
var GlobalsForFileServiceModule = require('./GlobalsForFileService');

var uploadFiles = multer({ dest: GlobalsForFileServiceModule.uploadedFileDestination });

/**************************************************************************
 **************************************************************************
 * 
 *  Main Service Module : DesignYourLife FileUploadService Web Service
 *  
 *  Start DesignYourLife FileUploadService Web Server and upload files from web client
 *
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {XMLHttpRequest} http_request  : Handle HTTP GET Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.get('/', function (http_request, http_response) {

    console.log("Parsing http_request GET from Client");
    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    if (http_request.url == null || http_request.url == "/favicon.ico") {

        console.log("unexpected http_request.url : " + http_request.url);
        return;
    }

    console.log("Allowing cross origin request initiation policy");
    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log("==============================================================================");
    console.log("http_request.body : " + http_request.body);
    console.log("==============================================================================");

    var successMessage = "FileUploadService.GETRequest : Successful Response for Simple GET Request";
    HelperUtilsModule.buildSuccessResponse_Generic("GETRequest", successMessage, http_response);

})

/**
 * 
 * @param {XMLHttpRequest} http_request  : Handle HTTP File upload Request from client ( POST )
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.post('/CustomUploadFile_Fetch_FormData', uploadFiles.single("FileData"), function (http_request, http_response) {

    console.log("Parsing http_request(CustomUploadFile_Fetch_FormData) POST from Client ( File Upload Request )");
    console.log("http_request.url : " + http_request.url);

    console.log("Allowing cross origin request initiation policy");
    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    FileServiceHelperUtilsModule.logUploadedFileProperties(http_request.file);

    console.log("Uploaded file properties are displayed...Now onto displaying http_request.body : ");
    console.log(FileServiceHelperUtilsModule.printRecursiveObjectString(http_request.body));

    var uploadedFileNameFromInput = (http_request.body != null) ? (http_request.body.filename) : null;

    if (GlobalsForFileServiceModule.bCurrentDebugFlag == true) {

        console.log("http_request.body.filename : " + http_request.body.filename);
        console.log("uploadedFileNameFromInput : " + uploadedFileNameFromInput);
    }

    if (HelperUtilsModule.valueDefined(uploadedFileNameFromInput)) {

        var currentFileName = http_request.file.destination + http_request.file.filename;
        var newFileName = http_request.file.destination + uploadedFileNameFromInput;

        fileSystem.rename(currentFileName, newFileName, function (err) {

            if (err) {


                var failureMessage = "File uploaded..But rename to filename input was not successful";
                console.error(failureMessage);
                HelperUtilsModule.logInternalServerError("CustomUploadFile_Fetch_FormData", failureMessage, http_response);

            } else {

                var successMessage = "File uploaded..and uploaded file got renamed to filename input";
                console.log(successMessage);
                HelperUtilsModule.buildSuccessResponse_Generic("CustomUploadFile_Fetch_FormData", successMessage, http_response);

            }

        });

        return;
    }

    var successMessage = "File uploaded but Name couldn't be changed due to absence of filename input";
    console.log(successMessage);
    HelperUtilsModule.buildSuccessResponse_Generic("CustomUploadFile_Fetch_FormData", successMessage, http_response);

})

/**
 * 
 * @param {XMLHttpRequest} http_request  : Handle HTTP Multiple File uploads from client ( POST ) 
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.post('/CustomUpload_MultipleFiles_Fetch_FormData', uploadFiles.any(), function (http_request, http_response) {

    console.log("Parsing http_request(CustomUploadFile_Fetch_FormData) POST from Client ( File Upload Request )");
    console.log("http_request.url : " + http_request.url);

    console.log("Allowing cross origin request initiation policy");
    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    for (var currentFile of http_request.files) {

        FileServiceHelperUtilsModule.logUploadedFileProperties(currentFile);
    }

    console.log("http_request.body : " + FileServiceHelperUtilsModule.printRecursiveObjectString(http_request.body));

    var successMessage = "Successful Response for File Uploads POST Request";
    console.log(successMessage);
    HelperUtilsModule.buildSuccessResponse_Generic("CustomUpload_MultipleFiles_Fetch_FormData", successMessage, http_response);
})


/**
 * 
 * @param {XMLHttpRequest} http_request  : Handle HTTP File upload Request from client through JSON Data ( POST )
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.post('/CustomUploadFile_Fetch_JsonData', function (http_request, http_response) {

    console.log("http_request.url : " + http_request.url);

    console.log("Allowing cross origin request initiation policy");
    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (GlobalsForFileServiceModule.bCurrentDebugFlag == true) {

        console.debug("Displaying http_request.body : ");
        console.debug(FileServiceHelperUtilsModule.printRecursiveObjectString(JSON.parse(http_request.body)));
    }

    var uploadedFileDataObject = JSON.parse(http_request.body);
    var uploadedFileName = (HelperUtilsModule.valueDefined(uploadedFileDataObject)) ? (uploadedFileDataObject.fileName) : null;
    var uploadedFileData = (HelperUtilsModule.valueDefined(uploadedFileDataObject)) ? (uploadedFileDataObject.fileData) : null;

    if (!HelperUtilsModule.valueDefined(uploadedFileDataObject) || !HelperUtilsModule.valueDefined(uploadedFileName) || 
        !HelperUtilsModule.valueDefined(uploadedFileData)) {

        console.error("FileUploadService.CustomUploadFile_Fetch_JsonData : (FileName || FileData) are missing from uploaded file: ");

        var failureMessage = "FileUploadService.CustomUploadFile_Fetch_JsonData : (FileName || FileData) are missing from uploaded file: ";
        HelperUtilsModule.logInternalServerError("CustomUploadFile_Fetch_JsonData", failureMessage, http_response);
    }

    // Create uploaded File

    FileServiceHelperUtilsModule.createFileUsingCustomEncodedFileData(uploadedFileName, uploadedFileData, http_response);
})


/**
 * 
 * @param {XMLHttpRequest} http_request  : Handle Generic HTTP POST Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.post('/GenericRequest', function (http_request, http_response) {

    console.log("Parsing Generic http_request POST from Client");
    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    console.log("Allowing cross origin request initiation policy");
    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log("http_request.body length: " + http_request.body.length);

    console.log("==============================================================================");
    console.log("http_request.body : " + http_request.body);
    console.log("==============================================================================");

    console.log("==============================================================================");
    console.log("Printing POST request object from client");
    FileServiceHelperUtilsModule.printRecursiveObjectString(http_request);
    console.log("==============================================================================");

    var successMessage = "Successful Response for Generic POST Request";
    console.log(successMessage);
    HelperUtilsModule.buildSuccessResponse_Generic("GenericRequest", successMessage, http_response);
})


/**
 * 
 * @param {String} port  : Port to listen for web client requests
 * 
*/

application.listen(GlobalsForFileServiceModule.fileUploadService_Port, function () {

    console.log("Listening on Server address : " + this.address().address);
    console.log("Listening on Server port : " + this.address().port);

});

