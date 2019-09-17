
var FileUploadToServerUtilsModule = (function () {

    /**
    * 
    * Uploads the file to Server based on Regular HTTP Request URL method
    *
    * @param {string} uploadFileContent  :  Content of file to be uploaded/read
    * @param {string} uploadFileName     :  Name of file to be uploaded
    * @param {string} uploadFileType     :  MIME type of file to be uploaded
    *
    */

    function uploadFileToServer_HttpURLRequestMethod(uploadFileContent, uploadFileName, uploadFileType) {

        var FileUploadURLRequestMap = new Map();

        FileUploadURLRequestMap.set("FileName", uploadFileName);
        FileUploadURLRequestMap.set("FileType", uploadFileType);
        FileUploadURLRequestMap.set("FileData", uploadFileContent);

        // Web Client Request for file upload

        WebClientRequestHelperModule.webClientRequestAPIWrapper("CustomUploadFile", FileUploadURLRequestMap);
    }

    /**
    * 
    * Uploads the file to Server based on HTTP Request POST method with URL + JSON Content for file data
    *
    * @param {string} uploadFileContent  :  Content of file to be uploaded/read
    * @param {string} uploadFileName     :  Name of file to be uploaded
    * @param {string} uploadFileType     :  MIME type of file to be uploaded
    *
    */

    function uploadFileToServer_HttpRequestMethodWithJSONContent(uploadFileContent, uploadFileName, uploadFileType) {

        var FileUploadURLRequestMap = new Map();

        FileUploadURLRequestMap.set("FileName", uploadFileName);

        var fileUploadObject = new Object();

        fileUploadObject.FileType = uploadFileType;
        fileUploadObject.FileData = uploadFileContent;

        var fileUploadJSONString = JSONRecordUtilsModule.buildJSONRecord(fileUploadObject,
            GlobalWebClientModule.uploadFileContent_RequiredFields);

        // Web Client Request for file upload

        WebClientRequestHelperModule.webClientRequestAPIWrapper_JSONContent("CustomUploadFileWithJSONData", FileUploadURLRequestMap,
            fileUploadJSONString);
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        uploadFileToServer_HttpURLRequestMethod: uploadFileToServer_HttpURLRequestMethod,
        uploadFileToServer_HttpRequestMethodWithJSONContent: uploadFileToServer_HttpRequestMethodWithJSONContent,
    }

})();
