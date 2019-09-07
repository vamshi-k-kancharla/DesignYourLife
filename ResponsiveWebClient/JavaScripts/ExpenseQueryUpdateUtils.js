
var ExpenseQueryUpdateUtilsModule = (function () {

    /**
    * 
    * Takes care of Expense Record Addition
    *
    */

    function addExpenseRecordFromUserInput() {

        var uniqueExpenseId = "ExpenseId_" + HelperUtilsModule.returnUniqueIdBasedOnCurrentTime();

        var expenseRecordDataMap = FormDataInputHelperUtilsModule.processFormInputData(uniqueExpenseId,
            GlobalWebClientModule.expenseRecordData_InputIds, GlobalWebClientModule.expenseRecordData_Keys);

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var budgetIdValue = window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key);

        expenseRecordDataMap.set("Budget_Id", budgetIdValue);
        expenseRecordDataMap.set("UserName", userNameValue);

        // Check for required input values

        if (HelperUtilsModule.valueDefined(expenseRecordDataMap) && 
            FormDataInputHelperUtilsModule.checkForRequiredInputData(expenseRecordDataMap,
            GlobalWebClientModule.expenseRecordData_RequiredKeys)) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("All the Required Input Values are Present in Form data..Proceeding further");
            }

        } else {

            alert("One of the Required Input Values are missing from Form data..Please enter required expense input data");
            return;
        }

        // Web Client Request for Expense Record Addition

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
    * Retrieves expense Details for Current Combination of Query Inputs
    *
    * @param {Function} postExpenseDetailsQuery_SuccessCallback : Success Callback Function of Expense Details Query
    * @param {Function} postExpenseDetailsQuery_FailureCallback : Failure Callback Function of Expense Details Query
    *
    */

    function retrieveExpenseDetails(postExpenseDetailsQuery_SuccessCallback, postExpenseDetailsQuery_FailureCallback) {

        var expenseDetailsQueryDataMap = new Map();

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var budgetIdValue = window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key);
        var expenseCategoryValue = window.localStorage.getItem(GlobalWebClientModule.currentExpense_Category_Key);
        var expenseSubCategoryValue = window.localStorage.getItem(GlobalWebClientModule.currentExpense_SubCategory_Key);

        expenseDetailsQueryDataMap.set("Expense_Category", expenseCategoryValue);
        expenseDetailsQueryDataMap.set("Budget_Id", budgetIdValue);
        expenseDetailsQueryDataMap.set("Expense_SubCategory", expenseSubCategoryValue);
        expenseDetailsQueryDataMap.set("UserName", userNameValue);

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveExpenseDetails", expenseDetailsQueryDataMap,
            postExpenseDetailsQuery_SuccessCallback, postExpenseDetailsQuery_FailureCallback);
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        addExpenseRecordFromUserInput: addExpenseRecordFromUserInput,
        retrieveExpenseDetails: retrieveExpenseDetails,
    }

})();
