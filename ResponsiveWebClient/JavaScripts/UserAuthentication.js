
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
            postUserAuthentication_SuccessCallback, postUserAuthentication_FailureCallback, userAuthenticationDataMap);
    }

    /**
    * 
    * Post processing call backs after Web Client Request
    *
    */

    function postUserAuthentication_SuccessCallback(webReqResponse, userAuthenticationDataMap) {

        alert("User Authentication successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentUserName_Key, userAuthenticationDataMap.get("UserName"));
        window.localStorage.setItem(GlobalWebClientModule.currentBudget_Id_Key, GlobalWebClientModule.currentBudgetId_Dummy);
        
        if (GlobalWebClientModule.bDebug == true) {

            alert("UserName stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key));
            alert("Current BudgetId Stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key));
        }

        document.location.replace("./UserBudgets.html");
    }

    function postUserAuthentication_FailureCallback(webReqResponse, userAuthenticationDataMap) {

        alert("User Authentication failed : " + webReqResponse);
        alert("UserName : " + userAuthenticationDataMap.get("UserName"));
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
