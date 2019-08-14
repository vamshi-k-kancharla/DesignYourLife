
var UserRegistrationModule = (function () {

    /**
    * 
    * Takes care of User Registration
    *
    */

    function userRegistration(){

        var uniqueUserId = "UserId_" + HelperUtilsModule.returnUniqueIdBasedOnCurrentTime();

        var userRegistrationDataMap = FormDataInputHelperUtilsModule.processFormInputData( uniqueUserId,
            GlobalWebClientModule.userRegistrationData_InputIds, GlobalWebClientModule.userRegistrationData_Keys );

        if (GlobalWebClientModule.bDebug == true) {

            alert("userRegistrationDataMap.length = " + userRegistrationDataMap.size);
        }

        // Check for required input values

        if (userRegistrationDataMap.get("Password") != userRegistrationDataMap.get("Repeat-Password")) {

            alert("Entered Passwords didn't match..Please ReEnter Details");
            return;
        }

        // Check for required input values

        if (FormDataInputHelperUtilsModule.checkForRequiredInputData(userRegistrationDataMap,
            GlobalWebClientModule.userRegistrationData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing in Form data..Please enter all the required user registration data");
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("UserRegistration", userRegistrationDataMap,
            postUserSignup_SuccessCallback, postUserSignup_FailureCallback);
    }

    /**
    * 
    * Post processing Callbacks after Web Client Requests
    *
    */

    function postUserSignup_SuccessCallback(webReqResponse) {

        alert("User Registration was successful : " + webReqResponse);
        document.location.replace("./HomePage.html");
    }

    function postUserSignup_FailureCallback(webReqResponse) {

        alert("User Registration has failed : " + webReqResponse);
        document.location.replace("./SignUpPage.html");
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        userRegistration : userRegistration,
    }

})();
