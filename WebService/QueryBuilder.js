
'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Query Builder Utilities
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var QueryBuilderModule = require('./QueryBuilder');


/**
 * 
 * @param {Array} keyList  : List of Keys for which query object needs to be built
 * @param {Object} matchObject  : Match Object containing target values
 *
 * @returns {Array} queryList  : Query List built from KeyList & Values
 *
*/

exports.buildQueryListFromInputKeysAndValues = function (keyList, matchObject) {

    var queryList = new Array();

    // Build query Object from input query list

    for (var currentKey of keyList) {

        var currentQuery = new Object();

        if (HelperUtilsModule.valueDefined(matchObject[currentKey])) {

            currentQuery[currentKey] = matchObject[currentKey];
        }

        queryList.push(currentQuery);
    }

    return queryList;
}


/**
 * 
 * @param {Array} keyList  : List of Keys to match values against
 * @param {Object} matchObject  : Match Object containing target values
 * 
 * @returns {Array} queryObject  : Returns query that matches any input field value
 * 
*/

exports.buildQuery_MatchAnyField = function (keyList, matchObject) {

    var queryObject = new Object();
    var queryList = QueryBuilderModule.buildQueryListFromInputKeysAndValues(keyList, matchObject);

    queryObject.$or = queryList;

    return queryObject;
}


/**
 * 
 * @param {Array} keyList  : List of Keys to match values against
 * @param {Object} matchObject  : Match Object containing target values
 * 
 * @returns {Array} queryObject  : Returns query that matches all input field values
 *
*/

exports.buildQuery_MatchAllFields = function (keyList, matchObject) {

    var queryObject = new Object();
    var queryList = QueryBuilderModule.buildQueryListFromInputKeysAndValues(keyList, matchObject);

    queryObject.$and = queryList;

    return queryObject;
}


/**
 * 
 * @param {Array} keyList1  : List of Keys for first Set
 * @param {Array} keyList2  : List of Keys for second Set
 * @param {Object} matchObject  : Match Object containing target values
 * @param {String} logicalQueryOperation  : One of logical query operators as string input => "$and", "$or", "$nor", "$not"
 *
 * @returns {Array} queryObject  : Returns query that joins two queries with LogicalQueryOperator
 * 
*/

exports.buildSpecificLogicalQueryBasedOnKeyLists = function (keyList1, keyList2, matchObject, logicalQueryOperation) {

    // Retrieve Query Objects corresponding to input Lists

    var queryObject1 = QueryBuilderModule.buildQuery_MatchAllFields(keyList1, matchObject);
    var queryObject2 = QueryBuilderModule.buildQuery_MatchAllFields(keyList2, matchObject);

    var queryList = new Array();

    queryList.push(queryObject1);
    queryList.push(queryObject2);

    // Build & Return Query Object

    var queryObject = new Object();

    queryObject[logicalQueryOperation] = queryList;
    return queryObject;
}


/**
 * 
 * @param {Object} matchObject  : Match Object containing target values
 * @param {String} logicalQueryOperation  : One of logical query operators as string input => "$and", "$or", "$nor", "$not"
 *
 * @returns {Array} queryObject  : Returns query that joins two queries with LogicalQueryOperator
 * 
*/

exports.buildSpecificLogicalQueryBasedOnQueryObjects = function (queryObject1, queryObject2, logicalQueryOperation) {

    var queryList = new Array();

    queryList.push(queryObject1);
    queryList.push(queryObject2);

    // Build & Return Query Object

    var queryObject = new Object();

    queryObject[logicalQueryOperation] = queryList;
    return queryObject;
}

