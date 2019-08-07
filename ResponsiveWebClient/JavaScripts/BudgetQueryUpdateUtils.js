
var BudgetQueryUpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of Budget Record Addition
    *
    */

    function addBudgetRecordFromUserInput(){

        var uniqueBudgetId = "BudgetId_" + HelperUtilsModule.returnUniqueIdBasedCurrentTime();

        var budgetRecordDataMap = FormDataInputHelperUtilsModule.processFormInputData(uniqueBudgetId,
            GlobalWebClientModule.budgetRecordData_InputIds, GlobalWebClientModule.budgetRecordData_Keys );
        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        budgetRecordDataMap.set("UserName", userNameValue);

        // Check for required input values

        if (FormDataInputHelperUtilsModule.checkForRequiredInputData(budgetRecordDataMap,
            GlobalWebClientModule.budgetRecordData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing from Form data..Please enter required budget input data");
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("AddBudget", budgetRecordDataMap,
            postBudgetAddition_SuccessCallback, postBudgetAddition_FailureCallback);
    }

    /**
    * 
    * Post processing call backs after Web Client Requests
    *
    */

    function postBudgetAddition_SuccessCallback(webReqResponse) {

        alert("User input budget record addition successful : " + webReqResponse);
        document.location.replace("./AddBudget.html");
    }

    function postBudgetAddition_FailureCallback(webReqResponse) {

        alert("User input budget record addition failed : " + webReqResponse);
        document.location.replace("./AddBudget.html");
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addBudgetRecordFromUserInput: addBudgetRecordFromUserInput,
    }

})();
