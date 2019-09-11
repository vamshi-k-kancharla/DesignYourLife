
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

            if (GlobalWebClientModule.bCurrentDebugFlag == true) {

                alert("FileReaderHelperUtils.readFromFileObjectWithCallback : Reading task completed..Current Ready State : "
                    + fileReader.readyState);
            }
            return handleSuccessResponse(fileReader.result, inputFileObject.name, inputFileObject.type);
        }

        fileReader.readAsBinaryString(inputFileObject);
    }

    /****************************************************************************************
        Reveal private methods
    *****************************************************************************************/

    return {

        readFromFileObjectWithCallback: readFromFileObjectWithCallback,
    };

})();


