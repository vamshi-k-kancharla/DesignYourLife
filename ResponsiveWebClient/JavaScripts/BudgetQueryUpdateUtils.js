
var BudgetQueryUpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of Budget Record Addition
    *
    */

    function addBudgetRecordFromUserInput(){

        var uniqueBudgetId = "BudgetId_" + HelperUtilsModule.returnUniqueIdBasedOnCurrentTime();

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
            alert("userNameValue => " + userNameValue);
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("AddBudget", budgetRecordDataMap,
            postBudgetAddition_SuccessCallback, postBudgetAddition_FailureCallback, budgetRecordDataMap);
    }

    /**
    * 
    * Post processing call backs after Web Client Requests
    *
    */

    function postBudgetAddition_SuccessCallback(webReqResponse, budgetRecordDataMap) {

        alert("User input budget record addition successful : " + webReqResponse);
        window.localStorage.setItem(GlobalWebClientModule.currentBudget_Id_Key, budgetRecordDataMap.get("Budget_Id"));

        if (GlobalWebClientModule.bDebug == true) {

            alert("Budget_Id stored in Local Cache: " + window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key));
        }

        document.location.replace("./AddBudget.html");
    }

    function postBudgetAddition_FailureCallback(webReqResponse, budgetRecordDataMap) {

        alert("User input budget record addition failed : " + webReqResponse);
        alert("Budget_Id : " + budgetRecordDataMap.get("Budget_Id"));
        document.location.replace("./AddBudget.html");
    }

    /**
    * 
    * Takes care of Budget Details Query for Current User
    * 
    * @param {Function} postBudgetRecordsQuery_SuccessCallback  : Success Callback Function of Budget Records Query
    * @param {Function} postBudgetRecordsQuery_FailureCallback  : Failure Callback Function of Budget Records Query
    *
    */

    function retrieveBudgetDetailsForCurrentUser(postBudgetRecordsQuery_SuccessCallback, postBudgetRecordsQuery_FailureCallback) {

        var BudgetRecordsQueryMap = new Map();

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);

        BudgetRecordsQueryMap.set("UserName", userNameValue);

        // Web Client Request for Retrieving Budget Records for Current User

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveBudgetDetails", BudgetRecordsQueryMap,
            postBudgetRecordsQuery_SuccessCallback, postBudgetRecordsQuery_FailureCallback);
    }

    /**
    * 
    * Takes care of Retrieving budget names & Types from Budget Record Objects
    * 
    * @param {JSON} jsonObject_BudgetRecords  : Budget Records retrieved from Server Response
    * @param {Array} budgetNames  : Names of Budget Records retrieved from Server Response
    * @param {Array} budgetTypes  : Types of Budget Records retrieved from Server Response
    *
    */

    function retrieveBudgetNamesAndTypes(jsonObject_BudgetRecords, budgetNames, budgetTypes) {

        for (var currentObject of jsonObject_BudgetRecords) {

            budgetNames.push(currentObject.BudgetName);

            if (currentObject.Budget_Type == "Recurring") {

                budgetTypes.push("monthly");

            } else {

                budgetTypes.push(currentObject.Budget_Type);
            }

        }

    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addBudgetRecordFromUserInput: addBudgetRecordFromUserInput,
        retrieveBudgetDetailsForCurrentUser: retrieveBudgetDetailsForCurrentUser,
        retrieveBudgetNamesAndTypes: retrieveBudgetNamesAndTypes,
    }

})();
