
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

            default:

                if (GlobalWebClientModule.bDebug == true) {

                    alert("Inappropriate CacheValueType passed : ");
                }
                break;
        }

    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        storeValueInLocalCache: storeValueInLocalCache,

    };

})();
