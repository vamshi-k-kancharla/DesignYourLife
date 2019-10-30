
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * GlobalsForFileService : Module that handles Globals for FileService
 * 
**************************************************************************/

// Global variables

var bDebug = false;
var bCurrentDebugFlag = true;

var fileUploadService_Port = process.env.PORT || 4501;

// Logging

var uploadedFileDestination = "./DesignYourLife-UploadedFiles/";
var uploadedFilePropertiesForLogging = ["destination", "fieldname", "filename", "location", "mimetype", "path", "size"];


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Export Globals
 * 
 **************************************************************************
 **************************************************************************
 */

exports.bDebug = bDebug;
exports.bCurrentDebugFlag = bCurrentDebugFlag;

exports.fileUploadService_Port = fileUploadService_Port;

exports.uploadedFileDestination = uploadedFileDestination;
exports.uploadedFilePropertiesForLogging = uploadedFilePropertiesForLogging;


