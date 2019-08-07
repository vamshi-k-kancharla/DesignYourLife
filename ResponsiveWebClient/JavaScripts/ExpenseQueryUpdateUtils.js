
var ExpenseQueryUpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of Expense Record Addition
    *
    */

    function addExpenseRecordFromUserInput() {

        var uniqueExpenseId = "ExpenseId_" + HelperUtilsModule.returnUniqueIdBasedCurrentTime();

        var expenseRecordDataMap = FormDataInputHelperUtilsModule.processFormInputData(uniqueExpenseId,
            GlobalWebClientModule.expenseRecordData_InputIds, GlobalWebClientModule.expenseRecordData_Keys);

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var expenseCategoryValue = window.localStorage.getItem(GlobalWebClientModule.currentExpense_Category_Key);
        var expenseSubCategoryValue = window.localStorage.getItem(GlobalWebClientModule.currentExpense_SubCategory_Key);

        expenseRecordDataMap.set("Expense_Category", expenseCategoryValue);
        expenseRecordDataMap.set("Expense_SubCategory", expenseSubCategoryValue);
        expenseRecordDataMap.set("UserName", userNameValue);

        // Check for required input values

        if (FormDataInputHelperUtilsModule.checkForRequiredInputData(expenseRecordDataMap,
            GlobalWebClientModule.expenseRecordData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing from Form data..Please enter required expense input data");
            return;
        }

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("AddExpense", expenseRecordDataMap,
            postExpenseAddition_SuccessCallback, postExpenseAddition_FailureCallback);
    }

    /**
    * 
    * Post processing call backs after Web Client Requests
    *
    */

    function postExpenseAddition_SuccessCallback(webReqResponse) {

        alert("User input expense record addition successful : " + webReqResponse);
        document.location.replace("./AddExpense.html");
    }

    function postExpenseAddition_FailureCallback(webReqResponse) {

        alert("User input expense record addition failed : " + webReqResponse);
        document.location.replace("./AddExpense.html");
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addExpenseRecordFromUserInput: addExpenseRecordFromUserInput,
    }

})();
