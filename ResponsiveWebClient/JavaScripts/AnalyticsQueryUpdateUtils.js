
var AnalyticsQueryUpdateUtilsModule = (function () {

    /**
    * 
    * Retrieves Analytics Details for Current Combination of Query Inputs
    *
    * @param {Function} postBudgetLevelAnalyticsQuery_SuccessCallback : Success Callback Function of Budget Level Analytics Details Query
    * @param {Function} postBudgetLevelAnalyticsQuery_FailureCallback : Failure Callback Function of Budget Level Analytics Details Query
    *
    */

    function retrieveBudgetLevelAnalytics(postBudgetLevelAnalyticsQuery_SuccessCallback, postBudgetLevelAnalyticsQuery_FailureCallback) {

        var BudgetAnalyticsQueryMap = new Map();

        var userNameValue = window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key);
        var budgetIdValue = window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key);

        BudgetAnalyticsQueryMap.set("Budget_Id", budgetIdValue);
        BudgetAnalyticsQueryMap.set("UserName", userNameValue);

        // Web Client Request for User Registration

        WebClientRequestHelperModule.webClientRequestAPIWrapperWithCallback("RetrieveBudgetAnalytics", BudgetAnalyticsQueryMap,
            postBudgetLevelAnalyticsQuery_SuccessCallback, postBudgetLevelAnalyticsQuery_FailureCallback);
    }

    /**
    * 
    * Reveal Private methods & variables
    *
    */

    return {

        retrieveBudgetLevelAnalytics: retrieveBudgetLevelAnalytics,
    }

})();
