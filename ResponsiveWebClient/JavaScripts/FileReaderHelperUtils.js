
var FileReaderHelperUtilsModule = (function () {

    /**
     * 
     * @param {File} inputFileObject : Input file object of file to be read/uploaded
     * @param {Function} handleSuccessResponse : Callback function to handle Successful file read
     * @param {Function} handleFailureResponse : Callback function to handle Failure file read
     *
    */

    function readFromFileObjectWithCallback(inputFileObject, handleSuccessResponse, handleFailureResponse) {

        var fileReader = new FileReader();

        if (GlobalWebClientModule.bCurrentDebugFlag == true) {

            alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Before starting reading task...Current Ready State : "
                + fileReader.readyState);
        }

        fileReader.onabort = function () {

            alert("Uploading of file has been aborted...Current Ready State : " + fileReader.readyState);
            return handleFailureResponse(inputFileObject.name, inputFileObject.type);
        }

        fileReader.onerror = function () {

            alert("Error occurred while Uploading file..Current Ready State : " + fileReader.readyState + " , Error : " +
                fileReader.error.message);
            fileReader.abort();
        }

        fileReader.onprogress = function () {

            if (GlobalWebClientModule.bCurrentDebugFlag == true) {

                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Reading task in progress..Current Ready State : "
                    + fileReader.readyState);
            }
        }

        fileReader.onload = function () {

            var base64EncodedString = btoa(fileReader.result);
            var fileContentArrayBufferString = HelperUtilsModule.returnStringFromArrayBuffer(fileReader.result);

            if (GlobalWebClientModule.bCurrentDebugFlag == true) {

                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Reading task completed..Current Ready State : "
                    + fileReader.readyState);
                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Array buffer Value Read : "
                    + HelperUtilsModule.returnStringFromArrayBuffer(fileReader.result));
                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Base64 Encoded String of input file content : "
                    + base64EncodedString);
                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : After decoding encoded string : "
                    + HelperUtilsModule.returnStringFromArrayBuffer(atob(base64EncodedString)));
            }

            return handleSuccessResponse(fileContentArrayBufferString, inputFileObject.name, inputFileObject.type);
        }

        fileReader.readAsArrayBuffer(inputFileObject);
    }

    /****************************************************************************************
        Reveal private methods
    *****************************************************************************************/

    return {

        readFromFileObjectWithCallback: readFromFileObjectWithCallback,
    };

})();


