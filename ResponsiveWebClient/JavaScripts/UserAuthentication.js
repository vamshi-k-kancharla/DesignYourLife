
var UserAuthenticationModule = (function () {

    /**
    * 
    * Takes care of User Authentication
    *
    */

    function processUserLogin(){

        var userAuthenticationDataMap = FormDataInputHelperUtilsModule.processFormInputData( null,
            GlobalWebClientModule.userAuthenticationData_InputIds, GlobalWebClientModule.userAuthenticationData_Keys );

        // Check for required input values

        if (FormDataInputHelperUtilsModule.checkForRequiredInputData(userAuthenticationDataMap,
            GlobalWebClientModule.userAuthenticationData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing from Form data..Please enter required user authentication data");
            return;
        }

        // Web Client Request for User Authentication

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UserAuthentication", userAuthenticationDataMap,
            postUserAuthentication_SuccessCallback, postUserAuthentication_FailureCallback);
    }

    /**
    * 
    * Post processing call backs after Web Client Request
    *
    */

    function postUserAuthentication_SuccessCallback(webReqResponse) {

        alert("User Authentication successful : " + webReqResponse);
        document.location.replace("./Categories.html");
    }

    function postUserAuthentication_FailureCallback(webReqResponse) {

        alert("User Authentication failed : " + webReqResponse);
        document.location.replace("./HomePage.html");
    }

    /**
     *
     *  Reset Local User Context and Logout
     *
     */

    function resetUserContextAndLogout() {

        CacheHelperUtilsModule.resetUserContextInLocalCache();
        document.location.replace("./HomePage.html");
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        processUserLogin: processUserLogin,
        resetUserContextAndLogout: resetUserContextAndLogout,
    }

})();
