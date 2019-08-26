
var RenderingHelperWrapperUtilsModule = (function () {

    /**
     *
     * @param {Array} categoryNames : Array of all Category/SubCategory Names
     * @param {Array} categoryDetailNames : Array of all Category/SubCategory Detail Names
     *
     * @returns {Map} categoryToDetailMap: Returns Map of <Category/SubCategory Names, DetailNames>
     *
     */

    function fillCategoryToDetailMap(categoryNames, categoryDetailNames) {

        var numberOfCategories = categoryNames.length;
        var categoryToDetailMap = new Map();

        for (var currentCategoryNum = 0; currentCategoryNum < numberOfCategories; currentCategoryNum++) {

            if (categoryDetailNames.length == 1) {

                categoryToDetailMap.set(categoryNames[currentCategoryNum],
                    categoryDetailNames[0]);

            } else {

                categoryToDetailMap.set(categoryNames[currentCategoryNum],
                    categoryDetailNames[currentCategoryNum]);

            }
        }

        return categoryToDetailMap;
    }

    /**
     *
     * @param {JSON} jsonObjectResponse : JSON Object response from server
     * @param {String} currentCategoryName : Current category name
     * @param {Array} currentSubCategoryNames : Array of Sub categories for current Category
     * @param {Map} categoryToImageMap : Map of Category to Image Names
     * @param {Map} categoryToPageMap : Map of Category to Page Names
     * @param {String} mainContentWindowId : Main Content Window Id
     *
     */

    function subCategorizeServerResponseAndRenderDynamically(jsonObjectResponse, currentCategoryName, currentSubCategoryNames,
        categoryToImageMap, categoryToPageMap, mainContentWindowId) {

        // categorize analytics

        var subCategoryLevelSummaryListForDisplay = ObjectUtilsForRenderingModule.buildSubCategoryLevelSummaryListForDisplay(
            jsonObjectResponse, currentCategoryName, currentSubCategoryNames);

        var subCategoryNamesForDisplay = ObjectUtilsForRenderingModule.buildSubCategoryDetailsForCurrentBudget(
            jsonObjectResponse, currentCategoryName, currentSubCategoryNames, currentSubCategoryNames);

        if (GlobalWebClientModule.bDebug == true) {

            alert("subCategoryNamesForDisplay : " + subCategoryNamesForDisplay.toString());
            alert("categoryToImageMap =  : " + HelperUtilsModule.returnMapString(categoryToImageMap));
            alert("categoryToPageMap =  : " + HelperUtilsModule.returnMapString(categoryToPageMap));
        }

        var subCategoryImageNamesForDisplay = HelperUtilsModule.retrieveValuesFromMap(subCategoryNamesForDisplay, categoryToImageMap);
        var subCategoryPageNamesForDisplay = HelperUtilsModule.retrieveValuesFromMap(subCategoryNamesForDisplay, categoryToPageMap);

        if (GlobalWebClientModule.bDebug == true) {

            alert("subCategoryImageNamesForDisplay : " + subCategoryImageNamesForDisplay.toString());
        }

        renderSubCategoryLevelDynamicContent(subCategoryLevelSummaryListForDisplay, subCategoryNamesForDisplay,
            subCategoryImageNamesForDisplay, subCategoryPageNamesForDisplay, mainContentWindowId);
    }

    /**
     *
     *  Render Sub Category level dynamic content
     *
     * @param {Array} subCategoryLevelSummaryListForDisplay  : Array of Sub Category Level Summary details objects
     * @param {Array} subCategoryNames  : Array of SubCategory names to be rendered
     * @param {Array} subCategoryImageNames  : Array of SubCategory Image names to be rendered
     * @param {Array} subCategoryPageNames  : Array of SubCategory Page names to be rendered
     * @param {String} mainContentWindowId : Main Content Window Id
     *
     */

    function renderSubCategoryLevelDynamicContent(subCategoryLevelSummaryListForDisplay, subCategoryNames, subCategoryImageNames,
        subCategoryPageNames, mainContentWindowId) {

        if (GlobalWebClientModule.bDebug == true) {

            alert("Current UserName : " + window.localStorage.getItem(GlobalWebClientModule.currentUserName_Key));
            alert("Current Budget Id : " + window.localStorage.getItem(GlobalWebClientModule.currentBudget_Id_Key));
        }

        noOfSubCategories = subCategoryLevelSummaryListForDisplay.length;

        // Render Content Dynamically

        RenderingHelperWrapperUtilsModule.retrieveCategoryDetailsAndRenderDynamicContent(noOfSubCategories, mainContentWindowId,
            subCategoryImageNames, subCategoryLevelSummaryListForDisplay, subCategoryNames, subCategoryPageNames);

    }

    /**
     *
     * @param {int} noOfCategories : Number of Category/SubCategory Names
     * @param {String} mainContentWindowId : Main Content Window Id
     * @param {Array} categoryContainer_ImageNames : Array of all Category/SubCategory Image Names
     * @param {Array} resultObject_SummaryDetailsArray : Array of Category/SubCategory Summary Object Details
     * @param {Array} categoryNames : Array of all Category/SubCategory Names
     * @param {Array} categoryPageNames : Array of all Category/SubCategory Page Names
     * 
     */

    function retrieveCategoryDetailsAndRenderDynamicContent(noOfCategories, mainContentWindowId,
        categoryContainer_ImageNames, resultObject_SummaryDetailsArray, categoryNames, categoryPageNames) {

        for (var currentContainerNum = 1; currentContainerNum <= noOfCategories; currentContainerNum += 2) {

            var textAlignmentArray = ["left", "right", "right", "right"];
            var numOfContainers = (currentContainerNum == noOfCategories) ? 1 : 2;

            if (GlobalWebClientModule.bDebug == true) {

                alert("Category Summary Details Object : " + HelperUtilsModule.returnObjectString(
                    resultObject_SummaryDetailsArray[currentContainerNum - 1]));
                alert("Number of Category Summary Details : " + Object.keys(resultObject_SummaryDetailsArray[currentContainerNum - 1]).length);

            }

            var noOfCategorySummaryDetails = Object.keys(resultObject_SummaryDetailsArray[currentContainerNum - 1]).length;

            if (ObjectUtilsForRenderingModule.isResultBudgetRecordObject(resultObject_SummaryDetailsArray[currentContainerNum - 1])) {

                var currentContainerBudgetId = resultObject_SummaryDetailsArray[currentContainerNum - 1].Budget_Id;

                if (GlobalWebClientModule.bDebug == true) {

                    alert("Current Budget Object Record before deleting Budget_Id : " + HelperUtilsModule.returnObjectString(
                        resultObject_SummaryDetailsArray[currentContainerNum - 1]));
                }

                delete resultObject_SummaryDetailsArray[currentContainerNum - 1].Budget_Id;

                /*
                var exclusionObjectKeys = ["Budget_Id"];
                resultObject_SummaryDetailsArray[currentContainerNum - 1] = ObjectUtilsForRenderingModule.buildObjectForDisplay(
                    resultObject_SummaryDetailsArray[currentContainerNum - 1], GlobalWebClientModule.budgetRecordKeys_ForDisplay,
                    exclusionObjectKeys);
                */

                if (GlobalWebClientModule.bDebug == true) {

                    alert("Current Budget Object Record after deleting Budget_Id : " + HelperUtilsModule.returnObjectString(
                        resultObject_SummaryDetailsArray[currentContainerNum - 1]));
                }

                noOfCategorySummaryDetails = Object.keys(resultObject_SummaryDetailsArray[currentContainerNum - 1]).length;
                RenderingHelperUtilsModule.addCategoryDetailsContainer(mainContentWindowId, currentContainerNum, numOfContainers,
                    textAlignmentArray[(currentContainerNum - 1) % 4], noOfCategorySummaryDetails, categoryNames, categoryPageNames,
                    currentContainerBudgetId);

            } else {

                RenderingHelperUtilsModule.addCategoryDetailsContainer(mainContentWindowId, currentContainerNum, numOfContainers,
                    textAlignmentArray[(currentContainerNum - 1) % 4], noOfCategorySummaryDetails, categoryNames, categoryPageNames);

            }

        }

        // Now that dynamic rendering of Category Details happened, display all the category summary details

        displayCategoryContainerDetails(noOfCategories, noOfCategorySummaryDetails, categoryContainer_ImageNames,
            resultObject_SummaryDetailsArray);

    }

    /**
     *
     * @param {int} noOfCategories : Number of Category/SubCategory Names
     * @param {int} noOfCategorySummaryDetails : Number of Category/SubCategory Summary Details
     * @param {Array} categoryContainer_ImageNames : Array of all Category/SubCategory Image Names
     * @param {Array} resultObject_SummaryDetailsArray : Array of Category/SubCategory Summary Object Details
     *
     */

    function displayCategoryContainerDetails(noOfCategories, noOfCategorySummaryDetails, categoryContainer_ImageNames,
        resultObject_SummaryDetailsArray) {

        for (var currentCategoryNum = 1; currentCategoryNum <= noOfCategories; currentCategoryNum++) {

            var imageSource = GlobalWebClientModule.imageResourcePath +
                categoryContainer_ImageNames[currentCategoryNum - 1];

            var keyIdArray = keyValueMapModule.deduceExpenseKeyValueIdArray("containerNode", currentCategoryNum,
                noOfCategorySummaryDetails, "id");
            var valueIdArray = keyValueMapModule.deduceExpenseKeyValueIdArray("containerNode", currentCategoryNum,
                noOfCategorySummaryDetails, "value");

            var keyValueMap = keyValueMapModule.deduceExpenseKeyValueMap("containerNode", currentCategoryNum, imageSource, keyIdArray,
                valueIdArray, resultObject_SummaryDetailsArray[currentCategoryNum-1]);

            if (GlobalWebClientModule.bDebug == true) {

                alert("keyIdArray : " + keyIdArray);
                alert("valueIdArray : " + valueIdArray);
                alert("keyValueMap : " + keyValueMap);
            }

            keyValueMapModule.displaySingleContainerValues(keyIdArray, valueIdArray, keyValueMap);
        }
    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        fillCategoryToDetailMap: fillCategoryToDetailMap,
        retrieveCategoryDetailsAndRenderDynamicContent: retrieveCategoryDetailsAndRenderDynamicContent,
        displayCategoryContainerDetails: displayCategoryContainerDetails,
        subCategorizeServerResponseAndRenderDynamically: subCategorizeServerResponseAndRenderDynamically,

    };

})();
