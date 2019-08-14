
var RenderingHelperWrapperUtilsModule = (function () {

    /**
     *
     * @param {Array} categoryNames : Array of all Category/SubCategory Names
     * @param {Array} categoryPageNames : Array of all Category/SubCategory Page Names
     *
     * @returns {Map} categoryToPageMap: Returns Map of <Names, PageNames>
     *
     */

    function fillCategoryToPageMap(categoryNames, categoryPageNames) {

        var numberOfCategories = categoryNames.length;
        var categoryToPageMap = new Map();

        for (var currentCategoryNum = 0; currentCategoryNum < numberOfCategories; currentCategoryNum++) {

            if (categoryPageNames.length == 1) {

                categoryToPageMap.set(categoryNames[currentCategoryNum],
                    categoryPageNames[0]);

            } else {

                categoryToPageMap.set(categoryNames[currentCategoryNum],
                    categoryPageNames[currentCategoryNum]);

            }
        }

        return categoryToPageMap;
    }

    /**
     *
     * @param {int} noOfCategories : Number of Category/SubCategory Names
     * @param {int} noOfCategorySummaryDetails : Number of Category/SubCategory Summary Details
     * @param {String} mainContentWindowId : Main Content Window Id
     * @param {Array} categoryContainer_ImageNames : Array of all Category/SubCategory Image Names
     * @param {Array} resultObject_SummaryDetails : Category/SubCategory Summary Object Details
     * @param {Array} categoryNames : Array of all Category/SubCategory Names
     * @param {Array} categoryPageNames : Array of all Category/SubCategory Page Names
     * 
     */

    function retrieveCategoryDetailsAndRenderDynamicContent(noOfCategories, noOfCategorySummaryDetails, mainContentWindowId,
        categoryContainer_ImageNames, resultObject_SummaryDetails, categoryNames, categoryPageNames) {

        for (var currentContainerNum = 1; currentContainerNum <= noOfCategories; currentContainerNum += 2) {

            var textAlignmentArray = ["left", "right", "right", "right"];
            var numOfContainers = (currentContainerNum == noOfCategories) ? 1 : 2;

            RenderingHelperUtilsModule.addCategoryDetailsContainer(mainContentWindowId, currentContainerNum, numOfContainers,
                textAlignmentArray[(currentContainerNum - 1) % 4], noOfCategorySummaryDetails, categoryNames, categoryPageNames);
        }

        // Now that dynamic rendering of Category Details happened, display all the category summary details

        displayCategoryContainerDetails(noOfCategories, noOfCategorySummaryDetails, categoryContainer_ImageNames,
            resultObject_SummaryDetails);

    }

    /**
     *
     * @param {int} noOfCategories : Number of Category/SubCategory Names
     * @param {int} noOfCategorySummaryDetails : Number of Category/SubCategory Summary Details
     * @param {Array} categoryContainer_ImageNames : Array of all Category/SubCategory Image Names
     * @param {Array} resultObject_SummaryDetails : Category/SubCategory Summary Object Details
     *
     */

    function displayCategoryContainerDetails(noOfCategories, noOfCategorySummaryDetails, categoryContainer_ImageNames,
        resultObject_SummaryDetails) {

        for (var currentCategoryNum = 1; currentCategoryNum <= noOfCategories; currentCategoryNum++) {

            var imageSource = GlobalWebClientModule.imageResourcePath +
                categoryContainer_ImageNames[currentCategoryNum - 1];

            var keyIdArray = keyValueMapModule.deduceExpenseKeyValueIdArray("containerNode", currentCategoryNum,
                noOfCategorySummaryDetails, "id");
            var valueIdArray = keyValueMapModule.deduceExpenseKeyValueIdArray("containerNode", currentCategoryNum,
                noOfCategorySummaryDetails, "value");

            var keyValueMap = keyValueMapModule.deduceExpenseKeyValueMap("containerNode", currentCategoryNum, imageSource, keyIdArray,
                valueIdArray, resultObject_SummaryDetails);

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

        fillCategoryToPageMap: fillCategoryToPageMap,
        retrieveCategoryDetailsAndRenderDynamicContent: retrieveCategoryDetailsAndRenderDynamicContent,
        displayCategoryContainerDetails: displayCategoryContainerDetails,

    };

})();
