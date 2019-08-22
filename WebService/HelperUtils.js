
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
        var regExpr = /%20/gi;
        currentValue = currentValue.replace(regExpr, " ");

        inputMap.set(currentKey, currentValue);
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
    console.log("ParseWebClientRequest : ClientRequest Collection =>")
    console.log(clientRequestCollection);

    for (var index = 0; index < clientRequestCollection.length; index++) {

        var currentKeyValuePair = clientRequestCollection[index].split("=");
        webClientRequestParamsMap = webClientRequestParamsMap.set(currentKeyValuePair[0], currentKeyValuePair[1]);
    }

    return webClientRequestParamsMap;
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

