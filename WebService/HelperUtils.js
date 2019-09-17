
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_StatusCode : Http Status code based on type of Error
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.buildErrorResponse_Generic = function (clientRequest, failureMessage, http_StatusCode, http_Response) {

    // build Error Response and attach it to Http_Response

    var responseObject = null;

    responseObject = { Request: clientRequest, Status: failureMessage };
    var builtResponse = JSON.stringify(responseObject);

    http_Response.writeHead(http_StatusCode, { 'Content-Type': 'application/json' });
    http_Response.end(builtResponse);
}

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.logInternalServerError = function (clientRequest, failureMessage, http_Response) {

    console.error(failureMessage);

    var http_StatusCode = 500;
    HelperUtilsModule.buildErrorResponse_Generic(clientRequest, failureMessage, http_StatusCode, http_Response);
}

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.logBadHttpRequestError = function (clientRequest, failureMessage, http_Response) {

    console.error(failureMessage);

    var http_StatusCode = 400;
    HelperUtilsModule.buildErrorResponse_Generic(clientRequest, failureMessage, http_StatusCode, http_Response);
}

/**
 * 
 * @param {any} successMessage  : Success Message Content
 * @param {any} webClientRequest  : Client Request Name
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.buildSuccessResponse_Generic = function (successMessage, webClientRequest, http_response) {

    // Build success Response for Client Request

    var responseObject = null;

    responseObject = { Request: webClientRequest, Status: successMessage };
    var genericResponse = JSON.stringify(responseObject);

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(genericResponse);
}

/**
 * 
 * @param {any} queryResult : query Result from mongo DB
 * 
 * @returns     queryResult_WithoutURLSpaces : queryResult with all values minus URL spaces
 * 
*/

exports.removeUrlSpacesFromObjectValues = function (queryResult) {

    // Modify the Values to remove URL Spaces

    var keys = Object.keys(queryResult);
    var values = Object.values(queryResult);

    for (var i = 0; i < values.length; i++) {

        var currentValue = String(values[i]);

        if (currentValue.includes("object")) {

            continue;
        }

        var regExpr = /%20/gi;
        currentValue = currentValue.replace(regExpr, " ");

        queryResult[keys[i]] = currentValue;
    }

    return queryResult;
}


/**
 * 
 * @param {any} inputMap : any map whose values need to be replaced without url space literals
 * 
 * @returns     inputMap : output Map with all values minus URL spaces
 * 
*/

exports.removeUrlSpacesFromMapValues = function (inputMap) {

    // Modify the Values to remove URL Spaces

    var keys = inputMap.keys();

    for (var currentKey of keys) {

        var currentValue = inputMap.get(currentKey);

        if (HelperUtilsModule.valueDefined(currentValue)) {

            var regExpr = /%20/gi;
            currentValue = currentValue.replace(regExpr, " ");

            inputMap.set(currentKey, currentValue);
        }
    }

    return inputMap;
}


/**
 * 
 * @param {any} inputObject : input Object that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     inputObject : Modified object with "values - "Starting & Trailing" spaces" 
 * 
*/

exports.removeStartingAndTrailingSpacesFromObjectValues = function (inputObject) {

    // Modify the Values to remove URL Spaces

    var keys = Object.keys(inputObject);
    var values = Object.values(inputObject);

    for (var i = 0; i < values.length; i++) {

        /*****************************************************
         *
         * To do : Give exception for password value depending on Password guidelines
         *
         
        if (keys[i] == "Password") {

            continue;
        }

        *****************************************************/

        var newValueWithoutSpaces = removeStartingAndTrailingSpacesFromString(values[i]);
        inputObject[keys[i]] = newValueWithoutSpaces;
    }

    return inputObject;
}


/**
 * 
 * @param {any} currentValue : String that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     newValueWithoutSpaces : Modified String with "value - "Starting & Trailing" spaces"
 * 
*/

function removeStartingAndTrailingSpacesFromString(currentValue) {

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromString => CurrentValue : " + currentValue);
    }

    // Remove Spaces at "Start & End"

    var startPointer = 0;
    var endPointer = 0;

    for (var j = 0; j < currentValue.length; j++) {

        if (currentValue[j] != ' ') {
            startPointer = j;
            break;
        }
    }

    for (var j = currentValue.length - 1; j >= 0; j--) {

        if (currentValue[j] != ' ') {
            endPointer = j;
            break;
        }
    }

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("startPointer : " + startPointer + ", endPointer : " + endPointer);
    }

    var newValueWithoutSpaces = "";

    for (var j = startPointer; j <= endPointer; j++) {

        newValueWithoutSpaces = newValueWithoutSpaces + currentValue.substring(j, j + 1);
    }

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromString => newValueWithoutSpaces : " + newValueWithoutSpaces);
    }

    return newValueWithoutSpaces;
}


/**
 * 
 * @param {any} inputMap : input Object that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     inputMap : Modified object with "values - "Starting & Trailing" spaces"
 * 
*/

exports.removeStartingAndTrailingSpacesFromMapValues = function (inputMap) {

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromMapValues of length => " + inputMap.keys().length);
    }

    // Modify the Values to remove URL Spaces

    var keys = inputMap.keys();

    for (var currentKey of keys) {

        var currentValue = inputMap.get(currentKey);

        var newValueWithoutSpaces = removeStartingAndTrailingSpacesFromString(currentValue);
        inputMap.set(currentKey, newValueWithoutSpaces);
    }

    return inputMap;
}


/**
 * 
 * @param {any} inputValue : Value whose definition needs to be verified
 * 
 * @returns {boolean}  true/false  : True if value is defined, false otherwise
 * 
*/

exports.valueDefined = function (inputValue) {


    if (inputValue == null || inputValue == undefined) {

        return false;
    }

    return true;
}


/**
 * 
 * @param {String} clientRequestCollection  : List of <K,V> pairs from input http_request "k=v" format
 * 
 * @returns {Map} webClientRequestParamsMap  : Map of <K,V> pairs that were obtained from input request
 * 
 */

exports.parseWebClientRequest = function (clientRequestCollection) {

    var webClientRequestParamsMap = new Map();
    var bFileUploadRequests = false;

    console.log("ParseWebClientRequest : ClientRequest Collection =>")
    console.log(clientRequestCollection);

    for (var index = 0; index < clientRequestCollection.length; index++) {

        var currentKeyValuePair = clientRequestCollection[index].split("=");

        // Parse the File upload requests separately

        if (index == 0 && currentKeyValuePair[0] == "Client_Request" && currentKeyValuePair[1] == "CustomUploadFile") {

            bFileUploadRequests = true;
            break;
        }

        webClientRequestParamsMap = webClientRequestParamsMap.set(currentKeyValuePair[0], currentKeyValuePair[1]);
    }

    if (bFileUploadRequests == true) {

        webClientRequestParamsMap = HelperUtilsModule.parseFileUploadClientRequests(clientRequestCollection);
    }

    return webClientRequestParamsMap;
}


/**
 * 
 * @param {String} clientRequestCollection  : List of <K,V> pairs from input http_request "k=v" format
 * 
 * @returns {Map} webClientRequestParamsMap  : Map of <K,V> pairs that were obtained from input request
 * 
 */

exports.parseFileUploadClientRequests = function (clientRequestCollection) {

    var webClientRequestParamsMap = new Map();

    console.log("parseFileUploadClientRequests : ClientRequest Collection =>")
    console.log(clientRequestCollection);

    for (var index = 0; index < clientRequestCollection.length; index++) {

        var currentKeyValuePair = clientRequestCollection[index].split("=");
        var currentValue = currentKeyValuePair[1];

        // File data may have special characters of URL String parser separators
        // Works without condition as well

        if (currentKeyValuePair[0] == "FileData" && currentKeyValuePair.length > 2) {

            for (var valueIndex = 2; valueIndex < currentKeyValuePair.length; valueIndex++) {

                currentValue += "=";
                currentValue += currentKeyValuePair[valueIndex];
            }

        }

        webClientRequestParamsMap = webClientRequestParamsMap.set(currentKeyValuePair[0], currentValue);
    }

    return webClientRequestParamsMap;
}


/**
 * 
 * @param {String} clientRequestCollection  : List of <K,V> pairs from input http_request "k=v" format
 * 
 * @returns {Array} resultRequestCollection  : List of <K,V> pairs of input http_request in "k=v" format with special characters(&) 
 *                                             of file data taken care of
 * 
 */

exports.handleSpecialCharacters_FileUploadRequests = function (clientRequestCollection) {

    console.log("handleSpecialCharacters_FileUploadRequests : ClientRequest Collection =>")
    console.log(clientRequestCollection);

    var resultRequestCollection = new Array();

    for (var index = 0; index < clientRequestCollection.length; index++) {

        var currentKeyValuePair = clientRequestCollection[index].split("=");

        // File data may have special characters(&) to be taken care of with sincere care

        if (currentKeyValuePair[0] == "FileData") {

            var currentValue = clientRequestCollection[index];

            for (var currentIndex = index + 1; currentIndex < clientRequestCollection.length; currentIndex++) {

                currentValue += "&";
                currentValue += clientRequestCollection[currentIndex];
            }

            resultRequestCollection.push(currentValue);

            break;

        } else {

            resultRequestCollection.push(clientRequestCollection[index]);
        }
    }

    return resultRequestCollection;
}


/**
 * 
 * @param {Object} inputObject  : Input Object which needs to be converted to Map
 * 
 * @returns {Map} outputMap  : Output Map of <K,V> pairs of input Object
 * 
 */

exports.buildMapFromObject = function (inputObject) {

    var outputMap = new Map();

    for (var currentProperty in inputObject) {

        outputMap.set(currentProperty, inputObject[currentProperty]);
    }

    return outputMap;
}


/**
 * 
 * @param {any} inputValue : Value whose definition needs to be verified
 * 
 * @returns {boolean}  true/false  : True if value is defined, false otherwise
 * 
*/

exports.doesValueExistInArray = function (inputArray, findValue) {

    for (var currentValue of inputArray) {

        if (currentValue == findValue) {

            return true;
        }
    }

    return false;
}

/**
 * 
 * @param {String} inputFloatValue : Value to be checked for floating point number
 * 
 * @returns {boolean}  true/false  : True if value is floating point number, false otherwise
 * 
*/

exports.isFloatingNumber = function (inputFloatValue) {

    if (!HelperUtilsModule.valueDefined(inputFloatValue)) {

        return false;
    }

    var inputFloatValueArray = inputFloatValue.split(".");

    if (inputFloatValueArray.length == 2 && Number.isInteger(parseInt(inputFloatValueArray[0])) &&
        Number.isInteger(parseInt(inputFloatValueArray[1]))) {

        return true;
    }

    return false;
}

/**
 * 
 * @param {String} inputValue : Value to be checked for floating point or decimal integer
 * 
 * @returns {boolean}  true/false  : True if inputValue is floating point or  decimal integer, false otherwise
 * 
*/

exports.isNumberOrFloat = function (inputValue) {

    console.log("HelperUtils.isNumberOrFloat => inputValue : " + inputValue);

    if (HelperUtilsModule.valueDefined(inputValue) &&
        (Number.isInteger(parseInt(inputValue)) || HelperUtilsModule.isFloatingNumber(inputValue))) {

        return true;
    }

    return false;
}

/**
 * 
 * @param {String} customEncodedInputData : Custom encoded string from Typed_Array_Data of input file at web Client
 * 
 * @returns {Uint8Array}  resultUint8TypedArray  : Uint8 Typed Array derived from Custom Encoded input data
 * 
*/

exports.convertCustomEncodedStringDataToUint8TypedArray = function (customEncodedInputData) {

    console.log("HelperUtils.convertStringDataToUint8TypedArray => customEncodedInputData : " + customEncodedInputData);

    var inputDataBytes = customEncodedInputData.split(",");
    var resultUint8TypedArray = new Uint8Array(inputDataBytes.length);
    var currentPos = 0;

    for (var currentByteStr of inputDataBytes) {

        if (currentPos < 5) {

            console.log("currentByteStr : " + currentByteStr + ", currentByteNumber : " + Number(currentByteStr) );
        }

        resultUint8TypedArray[currentPos++] = Number(currentByteStr);
    }

    return resultUint8TypedArray;
}

/**
 *
 * @param {ArrayBuffer} inputArrayBuffer : Input array buffer to be converted to String
 * 
 * @returns {string} resultStr: Returns string corresponding to input Array Buffer
 *
*/

exports.returnStringFromArrayBuffer = function (inputArrayBuffer) {

    var resultStr = "";
    var currentArrayBufferContent = new Uint8Array(inputArrayBuffer);

    for (var currentByte of currentArrayBufferContent) {

        resultStr += currentByte;
    }

    return resultStr;
}

/**
 *
 * @param {Object} inputObject  : Input Object to be converted to String Display format
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.returnObjectString = function (inputObject) {

    var objectStr = "{";
    var currentPosition = 0;

    for (var currentKey in inputObject) {

        objectStr += currentKey + " : " + inputObject[currentKey];

        if (currentPosition != (Object.keys(inputObject).length - 1)) {

            objectStr += ",";
        }
        ++currentPosition;
    }
    objectStr += "}";

    return objectStr;
}

/**
 *
 * @param {Object} inputObject  : Input Object to be converted to String Display format
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.returnRecursiveObjectString = function (inputObject) {

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

