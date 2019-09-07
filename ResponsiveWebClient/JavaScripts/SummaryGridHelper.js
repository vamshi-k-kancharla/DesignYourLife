
var SummaryGridHelperModule = (function () {

    /**
     *
     * @param {string} mainContentWindowId  : Id of main content window
     * @param {JSON} jsonObjectResponse  : JSON Object Response from Server
     *
     */

    function displaySummaryGridForCurrentInfo(mainContentWindowId, jsonObjectResponse) {

        var subCategorySummaryGridDisplayObjectList = ObjectUtilsForRenderingModule.getAllSubCategorySummaryGridObjectsForDisplay(
            jsonObjectResponse, GlobalWebClientModule.categoryNames);

        var totalNumberOfSummaryGridContainers = Object.keys(subCategorySummaryGridDisplayObjectList).length;
        var totalNumberOfTableRows = 2;

        if (totalNumberOfSummaryGridContainers <= 4) {

            totalNumberOfTableRows = 2;

        } else if (totalNumberOfSummaryGridContainers <= 8) {

            totalNumberOfTableRows = 4;

        } else {

            totalNumberOfTableRows = 4 + (totalNumberOfSummaryGridContainers - 8) / 2;
        }

        if (GlobalWebClientModule.bDebug == true) {

            alert("totalNumberOfSummaryGridContainers = " + totalNumberOfSummaryGridContainers);
            alert("totalNumberOfTableRows = " + totalNumberOfTableRows);
        }

        renderSummaryGridTable(mainContentWindowId, subCategorySummaryGridDisplayObjectList, totalNumberOfTableRows);
    }


    /**
    *
    * @param {string} mainContentWindowId  : Id of main content window of Summary grid
    * @param {Array} subCategorySummaryGridDisplayObjectList  : Array of Summary Grid Sub Category containers from Server response
    * @param {int} totalNumberOfRows  : Total number of rows in the Summary grid table 
    *
    */

    function renderSummaryGridTable(mainContentWindowId, subCategorySummaryGridDisplayObjectList, totalNumberOfRows) {

        var tableId = "tableSummaryGridNode";
        var mainContentWindow = document.getElementById(mainContentWindowId);
        var noOfColumns = 6;

        var rowIdArray = new Array();
        var tableCellId_2D_Array = new Array();

        // Table Node

        var tableNode = RenderingHelperUtilsModule.createNewElementWithAttributes("TABLE", tableId, "table table-border col-sm-12", null);
        {

            for (var currentRowIndex = 0; currentRowIndex < totalNumberOfRows; currentRowIndex++) {

                var currentRowId = tableNode.insertRow(currentRowIndex);
                rowIdArray.push(currentRowId);

                var currentRowCellIdArray = new Array();

                for (var column = 0; column < noOfColumns; column++) {

                    var currentCellId = currentRowId.insertCell(column);

                    var currentCellAttributeMap = new Map();

                    currentCellAttributeMap.set("class", "col-sm-2");
                    RenderingHelperUtilsModule.setElementWithAttributeMap(currentCellId, currentCellAttributeMap);

                    currentRowCellIdArray.push(currentCellId);
                }

                tableCellId_2D_Array.push(currentRowCellIdArray);
            }

        }
        mainContentWindow.appendChild(tableNode);

        // Display content in Summary Grid

        displaySummaryGridData(subCategorySummaryGridDisplayObjectList, tableCellId_2D_Array);

        // Rendering Adjustments

        var sideNavigatorsBottomBufferHeight = (.05 / totalNumberOfRows);
        RenderingHelperUtilsModule.changeHeightOfSideNavigators("mainContentWindow", "leftSideNavigator",
            "rightSideNavigator", "headerNav", "footerNav", 1 + sideNavigatorsBottomBufferHeight);

    }

    /**
     *  Displays Summary Grid Data values based on retrieved input Data
     *
     * @param {Array} subCategorySummaryGridDisplayObjectList  : Array of Summary Grid Sub Category containers from Server response
     * @param {Array} tableCellId_2D_Array  : 2D Array of cells in the table
     *
     */

    function displaySummaryGridData(subCategorySummaryGridObjectList, tableCellId_2D_Array) {

        // display images in summary grid

        displayPicturesInSummaryGrid(subCategorySummaryGridObjectList, tableCellId_2D_Array);

        // display container values in summary grid

        var currentRow = 1;
        var currentColumn = 1;

        for (var currentSummaryGridSubCategoryObject of subCategorySummaryGridObjectList) {

            var currentCellId = tableCellId_2D_Array[currentRow][currentColumn];
            var textAlignment = "center";
            var totalNumberOfDetails = Object.keys(currentSummaryGridSubCategoryObject).length;

            if (currentColumn == 1) {

                textAlignment = "left";

            } else if (currentColumn == 4) {

                textAlignment = "right";
            }

            RenderingHelperUtilsModule.renderIdValuePairParagraphChildNode(currentCellId, currentRow, currentColumn,
                totalNumberOfDetails, textAlignment)

            if (GlobalWebClientModule.bDebug == true) {

                alert("currentRow for image = " + currentRow + ", current Coloumn = " + currentColumn);
            }

            var keyIdArray = keyValueMapModule.deduceSummaryGridKeyValueIdArray(currentRow, currentColumn,
                totalNumberOfDetails, "id");
            var valueIdArray = keyValueMapModule.deduceSummaryGridKeyValueIdArray(currentRow, currentColumn,
                totalNumberOfDetails, "value");

            var keyValueMap = keyValueMapModule.deduceKeyValueMap(keyIdArray, valueIdArray, currentSummaryGridSubCategoryObject);

            if (GlobalWebClientModule.bDebug == true) {

                alert("keyIdArray : " + keyIdArray);
                alert("valueIdArray : " + valueIdArray);
                alert("keyValueMap : " + keyValueMap);
            }

            keyValueMapModule.displaySingleContainerValues(keyIdArray, valueIdArray, keyValueMap);

            if (currentColumn == 4) {

                currentRow += 1;
                currentColumn = 1;

            } else {

                if (currentRow == 1 || (tableCellId_2D_Array.length > 4 && currentRow == tableCellId_2D_Array.length - 2) ) {

                    currentColumn++;

                } else {

                    currentColumn = 4;

                }
            }
        }
    }

    /**
     *  Displays Pictures in Summary Grid based on Retrieved Server Response Sub Category values
     *
     * @param {Array} subCategorySummaryGridDisplayObjectList  : Array of Summary Grid Sub Category containers from Server response
     * @param {Array} tableCellId_2D_Array  : 2D Array of cells in the table
     *
     */

    function displayPicturesInSummaryGrid(subCategorySummaryGridObjectList, tableCellId_2D_Array) {

        var subCategoryNamesToImageMap = ObjectUtilsForRenderingModule.buildSubCategoryToImageMapForGivenCategories(
            GlobalWebClientModule.categoryNames);

        if (GlobalWebClientModule.bDebug == true) {

            for (var currentRow = 0; currentRow < tableCellId_2D_Array.length; currentRow++) {

                var currentRowCellIdArray = tableCellId_2D_Array[currentRow];

                for (var currentColumn = 0; currentColumn < currentRowCellIdArray.length; currentColumn++) {

                    var currentCellId = currentRowCellIdArray[currentColumn];
                    var currentCellNum = (currentRow + 1) * (currentColumn + 1);
                    currentCellId.innerHTML = "currentCellNumber : " + currentCellNum;
                }
            }
        }

        var currentRow = 0;
        var currentColumn = 1;

        for (var currentSummaryGridSubCategoryObject of subCategorySummaryGridObjectList) {

            if (GlobalWebClientModule.bDebug == true) {

                alert("currentRow for image = " + currentRow + ", current Coloumn = " + currentColumn);
            }

            var currentSubCategoryName = currentSummaryGridSubCategoryObject.SubCategoryName;
            var currentSubCategoryImageName = subCategoryNamesToImageMap.get(currentSubCategoryName);
            var currentImageSource = GlobalWebClientModule.imageResourcePath + currentSubCategoryImageName;

            var currentCellId = tableCellId_2D_Array[currentRow][currentColumn];

            var currentCellAttributeMap = new Map();
            currentCellAttributeMap.set("src", currentImageSource);
            currentCellAttributeMap.set("style", "height: 100%; width: 100%");

            var currentImageElement = RenderingHelperUtilsModule.createNewElementWithAttributeMap("IMG", currentCellAttributeMap);
            currentCellId.appendChild(currentImageElement);

            if (currentRow == 0 || (tableCellId_2D_Array.length > 4 && currentRow == (tableCellId_2D_Array.length - 1) ) ) {

                if (currentColumn < 4) {

                    currentColumn++;

                } else if (currentColumn == 4) {

                    currentRow += 2;
                    currentColumn = 0;
                }

            } else {

                if (tableCellId_2D_Array.length == 4 || currentRow < tableCellId_2D_Array.length - 3) {

                    if (currentColumn == 0) {

                        currentColumn = 5;

                    } else if (currentColumn == 5) {

                        currentColumn = 0;
                        currentRow += 1;

                    } 

                } else if (currentRow == tableCellId_2D_Array.length - 3) {

                    if (currentColumn == 0) {

                        currentColumn = 5;

                    } else if (currentColumn == 5) {

                        currentColumn = 1;
                        currentRow += 2;

                    }

                }

            } 
            
        }

    }

    /**
     * 
     * Expose Helper functions for Global Access
     * 
     */

    return {

        displaySummaryGridForCurrentInfo: displaySummaryGridForCurrentInfo,
        renderSummaryGridTable: renderSummaryGridTable,
        displayPicturesInSummaryGrid: displayPicturesInSummaryGrid,
        renderSummaryGridTable: renderSummaryGridTable,

    }

})();
