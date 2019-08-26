
var RenderingHelperUtilsModule = (function () {

    /**
     *
     * Dynamically adjust the height of Side Navigators based on main window container height
     *  
     * @param {string} mainContentWindowId  : Id of main content window
     * @param {string} leftNavigatorId  : Id of Left Side Navigator
     * @param {string} rightNavigatorId  : Id of Right Side Navigator
     * @param {string} headerNavId  : Id of Header Navigator
     * @param {string} footerNavId  : Id of Footer Navigator
     * @param {string} bottomBufferFactor  : Buffer height of Side Navigators as a factor of content window
     *
     */

    function changeHeightOfSideNavigators(mainContentWindowId, leftNavigatorId, rightNavigatorId, headerNavId,
        footerNavId, bottomBufferFactor) {

        if (GlobalWebClientModule.bDebug == true) {

            alert("screen.height : " + screen.height + "; screen.width : " + screen.width);
            alert("mainContentWindow.clientHeight : " + document.getElementById(mainContentWindowId).clientHeight);
            alert("document.height : " + $(document).height() + "; document.width : " + $(document).width());
        }

        var sideNavigatorHeightWithPadding = 0;
        var currentPageHeight = $(document).height();

        if ((document.getElementById(headerNavId).clientHeight +
            document.getElementById(footerNavId).clientHeight +
            document.getElementById(mainContentWindowId).clientHeight) < currentPageHeight) {

            sideNavigatorHeightWithPadding = (currentPageHeight - document.getElementById(headerNavId).clientHeight -
                document.getElementById(footerNavId).clientHeight) * bottomBufferFactor;

        } else {

            sideNavigatorHeightWithPadding = document.getElementById(mainContentWindowId).clientHeight * bottomBufferFactor;
        }

        var navigatorHeight = sideNavigatorHeightWithPadding.toString() + "px";
        document.getElementById(leftNavigatorId).style.height = navigatorHeight;
        document.getElementById(rightNavigatorId).style.height = navigatorHeight;

    }

    /**
     *
     * @param {string} mainContentWindowId  : Id of main content window
     * @param {int} containerNumber  : Expense detail container Number
     * @param {string} expenseDetailAlignment  : Expense Detail alignment : left/right
     * @param {int} numOfDetails  : Number of expense details
     *
     */

    function addExpenseDetailContainer(mainContentWindowId, containerNumber, expenseDetailAlignment, numOfDetails) {

        var mainContentWindow = document.getElementById(mainContentWindowId);

        // Buffer Node

        var bufferNode = createNewElementWithAttributes("DIV", null, "col-sm-12", "height:15px;");
        mainContentWindow.appendChild(bufferNode);

        if (GlobalWebClientModule.bDebug == true) {

            alert("addExpenseDetailContainer: buffer Node Added : mainContentWindowId => " + mainContentWindowId)
        }

        var containerId = "containerNode" + containerNumber.toString();

        // Container Node

        var containerNode = createNewElementWithAttributes("DIV", containerId, "col-sm-12", null);
        {

            if (expenseDetailAlignment == "left") {

                var imageDetailNode = createNewElementWithAttributes("DIV", containerId + "_ImageDetailNode", "col-sm-3", null);
                {
                    var imageNode = createNewElementWithAttributes("IMG", "containerNode" + containerNumber.toString() + "_img",
                        null, "width:100%;");
                    imageDetailNode.appendChild(imageNode);

                    if (GlobalWebClientModule.bDebug == true) {

                        var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                        labelNode.innerHTML = "newExpense_Image";
                        imageDetailNode.appendChild(labelNode);
                    }
                }

                containerNode.appendChild(imageDetailNode);
            }

            var expenseDetailNode = createNewElementWithAttributes("DIV", containerId + "_ExpenseDetailNode", "col-sm-9", null);
            {

                var innerBufferNode = createNewElementWithAttributes("DIV", null, null, "padding: 10px;");
                expenseDetailNode.appendChild(innerBufferNode);

                if (GlobalWebClientModule.bDebug == true) {

                    alert("addExpenseDetailContainer: P.Style => " + "text-align:" +
                        expenseDetailAlignment + ";")
                }

                var expenseParagraphNode = createNewElementWithAttributes("P", null, null, "text-align:" +
                    expenseDetailAlignment + ";");
                {

                    var paragraphContent = "";

                    for (var detailNum = 1; detailNum <= numOfDetails; detailNum++) {

                        var currentExpenseDetailKeyId = "containerNode" + containerNumber.toString() + "_" + "id" + detailNum.toString();
                        var currentExpenseDetailValueId = "containerNode" + containerNumber.toString() + "_" + "value" + detailNum.toString();

                        paragraphContent += "<span id=" + currentExpenseDetailKeyId + "></span> : <span id=" +
                            currentExpenseDetailValueId + "></span>";

                        if (detailNum != numOfDetails) {

                            paragraphContent += " ,";
                        }
                    }

                    if (GlobalWebClientModule.bDebug == true) {

                        alert("addExpenseDetailContainer: paragraphContent => " + paragraphContent);
                    }

                    expenseParagraphNode.innerHTML = paragraphContent;
                }

                expenseDetailNode.appendChild(expenseParagraphNode);

                if (GlobalWebClientModule.bDebug == true) {

                    var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                    labelNode.innerHTML = "newExpense_Detail";
                    expenseDetailNode.appendChild(labelNode);
                }

            }
            containerNode.appendChild(expenseDetailNode);

            if (expenseDetailAlignment == "right") {

                var imageDetailNode = createNewElementWithAttributes("DIV", containerId + "_ImageDetailNode", "col-sm-3", null);
                {
                    var imageNode = createNewElementWithAttributes("IMG", "containerNode" + containerNumber.toString() + "_" + "img",
                        null, "width:100%;");
                    imageDetailNode.appendChild(imageNode);
                }

                containerNode.appendChild(imageDetailNode);

                if (GlobalWebClientModule.bDebug == true) {

                    var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                    labelNode.innerHTML = "newExpense_Image";
                    imageDetailNode.appendChild(labelNode);
                }
            }
        }

        mainContentWindow.appendChild(containerNode);

        if (GlobalWebClientModule.bDebug == true) {

            alert("addExpenseDetailContainer: Expense detail container Added")
        }

    }


    /**
     *
     * @param {string} mainContentWindowId  : Id of main content window
     * @param {int} containerNumber  : Category details container Number
     * @param {string} categoryDetailsAlignment  : Category Details alignment : left/right
     * @param {int} numOfDetails  : Number of Category Summary details
     * @param {int} categoryNames  : Array of Category Names
     * @param {int} categoryPageNames  : Array of Category Page Names
     * @param {String} currentContainerBudgetId  : Budget_Id of Current Container to be stored in local cache
     *
     */

    function addCategoryDetailsContainer(mainContentWindowId, containerNumber, numOfContainers, categoryDetailsAlignment, numOfDetails,
        categoryNames, categoryPageNames) {

        addCategoryDetailsContainer(mainContentWindowId, containerNumber, numOfContainers, categoryDetailsAlignment, numOfDetails,
            categoryNames, categoryPageNames, null);
    }

    function addCategoryDetailsContainer(mainContentWindowId, containerNumber, numOfContainers, categoryDetailsAlignment, numOfDetails,
        categoryNames, categoryPageNames, currentContainerBudgetId) {

        var mainContentWindow = document.getElementById(mainContentWindowId);

        if (numOfContainers != 1 && numOfContainers != 2) {

            alert("Current dynamic rendering only supports a max of 2 containers in each row");
            return;
        }

        // Buffer Node

        var bufferNode = createNewElementWithAttributes("DIV", null, "col-sm-12", "height:40px;");
        mainContentWindow.appendChild(bufferNode);

        // Fill Left Side of Container 

        fillCategoryDetailsContainer(mainContentWindowId, containerNumber, categoryDetailsAlignment, numOfDetails,
            categoryNames, categoryPageNames, currentContainerBudgetId);

        // Fill Right Side of Container 

        if (numOfContainers == 2) {

            containerNumber++;

            if (categoryDetailsAlignment == "left") {

                categoryDetailsAlignment = "right";

            } else {

                categoryDetailsAlignment = "left";
            }

            fillCategoryDetailsContainer(mainContentWindowId, containerNumber, categoryDetailsAlignment, numOfDetails,
                categoryNames, categoryPageNames, currentContainerBudgetId);
        }
    }


    /**
    *
    * @param {string} mainContentWindowId  : Id of main content window
    * @param {int} containerNumber  : Category details container Number
    * @param {string} categoryDetailAlignment  : Category Details alignment : left/right
    * @param {int} numOfDetails  : Number of Category Summary details
    * @param {int} categoryNames  : Array of Category Names
    * @param {int} categoryPageNames  : Array of Category Page Names
    * @param {String} currentContainerBudgetId  : Budget_Id of Current Container to be stored in local cache
    *
    */

    function fillCategoryDetailsContainer(mainContentWindowId, containerNumber, categoryDetailAlignment, numOfDetails,
        categoryNames, categoryPageNames, currentContainerBudgetId) {

        var containerId = "containerNode" + containerNumber.toString();

        var mainContentWindow = document.getElementById(mainContentWindowId);

        var traveToNextPageFunction = (currentContainerBudgetId) ? "traverseToNextPage('" + currentContainerBudgetId + "')" :
            "traverseToNextPage('" + categoryNames[containerNumber - 1] + "')";

        var attributeMap_HyperLinkNode = new Map();

        if (categoryPageNames.length == 1) {

            attributeMap_HyperLinkNode.set("href", categoryPageNames[0]);

        } else {

            attributeMap_HyperLinkNode.set("href", categoryPageNames[containerNumber - 1]);

        }
        attributeMap_HyperLinkNode.set("onclick", traveToNextPageFunction);

        // Container Node

        var containerNode = createNewElementWithAttributes("DIV", containerId, "col-sm-6", null);
        {

            if (categoryDetailAlignment == "left") {

                var pageTraversalHyperLinkNode = createNewElementWithAttributeMap("A", attributeMap_HyperLinkNode);
                {

                    var imageDetailNode = createNewElementWithAttributes("DIV", containerId + "_ImageDetailNode", "col-sm-6", null,
                        traveToNextPageFunction);
                    {
                        var imageNode = createNewElementWithAttributes("IMG", "containerNode" + containerNumber.toString() + "_img",
                            "img-thumbnail", "width:100%; height:150px");
                        imageDetailNode.appendChild(imageNode);

                    }
                    pageTraversalHyperLinkNode.appendChild(imageDetailNode);

                    // Debug Node Info

                    if (GlobalWebClientModule.bDebug == true) {

                        var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                        labelNode.innerHTML = "newExpense_Image";
                        imageDetailNode.appendChild(labelNode);
                    }
                }
                containerNode.appendChild(pageTraversalHyperLinkNode);
            }

            var categoryDetailNode = createNewElementWithAttributes("DIV", containerId + "_CategoryDetailNode", "col-sm-6", null);
            {

                var innerBufferNode = createNewElementWithAttributes("DIV", null, null, "padding: 10px;");
                categoryDetailNode.appendChild(innerBufferNode);

                var pageTraversalHyperLinkTextNode = createNewElementWithAttributeMap("A", attributeMap_HyperLinkNode);
                pageTraversalHyperLinkTextNode.innerHTML = categoryNames[containerNumber - 1];

                var categoryParagraphNode = createNewElementWithAttributes("P", null, null, "text-align:" +
                    categoryDetailAlignment + ";");
                {

                    var paragraphContent = "";

                    for (var detailNum = 1; detailNum <= numOfDetails; detailNum++) {

                        var currentCategoryDetailKeyId = "containerNode" + containerNumber.toString() + "_" + "id" + detailNum.toString();
                        var currentCategoryDetailValueId = "containerNode" + containerNumber.toString() + "_" + "value" + detailNum.toString();

                        paragraphContent += "<span id=" + currentCategoryDetailKeyId + "></span> : <span id=" +
                            currentCategoryDetailValueId + "></span>";

                        if (detailNum != numOfDetails) {

                            paragraphContent += " ,";
                        }
                    }

                    if (GlobalWebClientModule.bDebug == true) {

                        alert("fillCategoryDetailsContainer: paragraphContent => " + paragraphContent);
                    }

                    categoryParagraphNode.innerHTML = paragraphContent;
                }

                categoryDetailNode.appendChild(pageTraversalHyperLinkTextNode);
                categoryDetailNode.appendChild(categoryParagraphNode);

                if (GlobalWebClientModule.bDebug == true) {

                    var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                    labelNode.innerHTML = "newCategory_Detail";
                    categoryDetailNode.appendChild(labelNode);
                }

            }
            containerNode.appendChild(categoryDetailNode);

            if (categoryDetailAlignment == "right") {

                var pageTraversalHyperLinkNode = createNewElementWithAttributeMap("A", attributeMap_HyperLinkNode);
                {

                    var imageDetailNode = createNewElementWithAttributes("DIV", containerId + "_ImageDetailNode", "col-sm-6", null);
                    {
                        var imageNode = createNewElementWithAttributes("IMG", "containerNode" + containerNumber.toString() + "_" + "img",
                            "img-thumbnail", "width:100%; height:150px");
                        imageDetailNode.appendChild(imageNode);
                    }

                    pageTraversalHyperLinkNode.appendChild(imageDetailNode);
                }

                containerNode.appendChild(pageTraversalHyperLinkNode);

                if (GlobalWebClientModule.bDebug == true) {

                    var labelNode = createNewElementWithAttributes("LABEL", null, null, "padding: 25px;");
                    labelNode.innerHTML = "newCategory_Image";
                    imageDetailNode.appendChild(labelNode);
                }
            }

        }

        mainContentWindow.appendChild(containerNode);

        if (GlobalWebClientModule.bDebug == true) {

            alert("fillCategoryDetailsContainer: Category detail container Added")
        }

    }

    /**
     *
     * @param {string} elementType  : Id of main content window
     * @param {string} elementId  : Id of Left Side Navigator
     * @param {string} elementClass  : Id of Right Side Navigator
     * @param {string} elementStyle  : Id of Header Navigator
     * @param {string} elementOnClickFunction  : Function that should be called upon onClick event
     *
     * @returns {DOMElement} currentElement : Returns newly created Element
     * 
     */

    function createNewElementWithAttributes(elementType, elementId, elementClass, elementStyle) {

        createNewElementWithAttributes(elementType, elementId, elementClass, elementStyle, null);
    }

    function createNewElementWithAttributes(elementType, elementId, elementClass, elementStyle, elementOnClickFunction) {

        var currentElement = document.createElement(elementType);

        if (HelperUtilsModule.valueDefined(elementClass)) {

            currentElement.setAttribute("class", elementClass);
        }
        if (HelperUtilsModule.valueDefined(elementId)) {

            currentElement.setAttribute("id", elementId);
        }
        if (HelperUtilsModule.valueDefined(elementStyle)) {

            currentElement.setAttribute("style", elementStyle);
        }
        if (HelperUtilsModule.valueDefined(elementOnClickFunction)) {

            currentElement.setAttribute("onclick", elementOnClickFunction);
        }

        return currentElement;
    }

    /**
     *
     * @param {string} elementType  : Id of main content window
     * @param {string} elementAttributeMap  : Attribute Map with all the input attributes
     *
     * @returns {DOMElement} currentElement : Returns newly created Element
     * 
     */

    function createNewElementWithAttributeMap(elementType, elementAttributeMap) {

        var currentElement = document.createElement(elementType);
        var elementAttributeKeys = elementAttributeMap.keys();

        for (var currentKey of elementAttributeKeys) {

            currentElement.setAttribute(currentKey, elementAttributeMap.get(currentKey));
        }

        return currentElement;
    }

    /**
     *
     * @param {string} optionText  : Value of Option to be added to Select Element
     *
     * @returns {DOMElement} currentElement : Returns newly created Element
     * 
     */

    function createOptionForSelectElement(optionText) {

        var currentElement = document.createElement("option");
        currentElement.text = optionText;
        return currentElement;
    }

    /**
     *
     * @param {DOMElement} selectOptionElement  : Select Element to be cleaned up
     *
     */

    function removeOptionsFromSelectElement(selectOptionElement) {

        var noOfOptions = selectOptionElement.length;

        for (var currentIndex = noOfOptions - 1; currentIndex > 0; currentIndex--) {

            selectOptionElement.remove(currentIndex);
        }

    }

    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        changeHeightOfSideNavigators: changeHeightOfSideNavigators,
        addExpenseDetailContainer: addExpenseDetailContainer,
        createNewElementWithAttributes: createNewElementWithAttributes,
        createNewElementWithAttributeMap: createNewElementWithAttributeMap,
        addCategoryDetailsContainer: addCategoryDetailsContainer,
        createOptionForSelectElement: createOptionForSelectElement,
        removeOptionsFromSelectElement: removeOptionsFromSelectElement,

    };

})();
