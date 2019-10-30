
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * Copy Rights Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

var CacheHelperUtilsModule = (function () {

    /**
     *
     * @param {string} cacheValueType : Type of Cache value to be stored
     * @param {string} cacheItemValue : Value of item to be stored in Cache
     *
     */

    function storeValueInLocalCache(cacheValueType, cacheItemValue) {

        switch (cacheValueType) {

            case "category":

                window.localStorage.setItem(GlobalWebClientModule.currentExpense_Category_Key, cacheItemValue);

                if (GlobalWebClientModule.bDebug == true) {

                    alert("storeValueInLocalCache : stored the value in cache => " +
                        window.localStorage.getItem(GlobalWebClientModule.currentExpense_Category_Key));
                }
                break;

            case "subcategory":

                window.localStorage.setItem(GlobalWebClientModule.currentExpense_SubCategory_Key, cacheItemValue);

                if (GlobalWebClientModule.bDebug == true) {

                    alert("storeValueInLocalCache : stored the value in cache => " +
                        window.localStorage.getItem(GlobalWebClientModule.currentExpense_SubCategory_Key));
                }
                break;

            case "budgetId":

                window.localStorage.setItem(GlobalWebClientModule.currentBudget_Id_Key, cacheItemValue);
                break;

            default:

                if (GlobalWebClientModule.bDebug == true) {

                    alert("Inappropriate CacheValueType passed : ");
                }
                break;
        }

    }

    /**
     *
     * Reset Local User context upon Logout
     *
     */

    function resetUserContextInLocalCache() {

        window.localStorage.setItem(GlobalWebClientModule.currentUserName_Key, "");
        window.localStorage.setItem(GlobalWebClientModule.currentBudget_Id_Key, "");
        window.localStorage.setItem(GlobalWebClientModule.currentExpense_Category_Key, "");
        window.localStorage.setItem(GlobalWebClientModule.currentExpense_SubCategory_Key, "");

    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        storeValueInLocalCache: storeValueInLocalCache,
        resetUserContextInLocalCache: resetUserContextInLocalCache,

    };

})();
