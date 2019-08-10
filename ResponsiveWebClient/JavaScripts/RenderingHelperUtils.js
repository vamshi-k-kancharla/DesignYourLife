
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
     * @param {string} elementType  : Id of main content window
     * @param {string} elementId  : Id of Left Side Navigator
     * @param {string} elementClass  : Id of Right Side Navigator
     * @param {string} elementStyle  : Id of Header Navigator
     * 
     * @returns {DOMElement} currentElement : Returns newly created Element
     * 
     */

    function createNewElementWithAttributes(elementType, elementId, elementClass, elementStyle) {

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

        return currentElement;
    }


    /****************************************************************************************
        Reveal private methods & variables
    *****************************************************************************************/

    return {

        changeHeightOfSideNavigators: changeHeightOfSideNavigators,
        addExpenseDetailContainer: addExpenseDetailContainer,
        createNewElementWithAttributes: createNewElementWithAttributes,

    };

})();
