
var UserRegistrationModule = (function () {

    /**
    * 
    * Takes care of User Registration
    *
    */

    function userRegistration(){

        var uniqueUserId = "UserId_" + HelperUtilsModule.returnUniqueIdBasedCurrentTime();

        var userRegistrationDataMap = FormDataInputHelperUtilsModule.processFormInputData( uniqueUserId,
            GlobalWebClientModule.userRegistrationData_InputIds, GlobalWebClientModule.userRegistrationData_Keys );

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

        WebClientRequestHelperModule.webClientRequestAPIWrapper("UserRegistration", userRegistrationDataMap);
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
