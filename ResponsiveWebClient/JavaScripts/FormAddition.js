
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * Copy Rights Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

var FormAdditionModule = (function () {

    /**
     * 
     * Adds a new label as list element in a division 
     * 
     */

    function addInputListItemToDivision(divElementId, textNodeContent) {

        var node = document.createElement("label");
        var textnode = document.createTextNode(textNodeContent);
        var input = document.createElement("input");
        node.appendChild(textnode);
        node.appendChild(input);

        var list = document.createElement("li");
        list.appendChild(node);
        document.getElementById(divElementId).appendChild(list);

    };

    /**
     * 
     * Removes the first child of a Div Element
     * 
     */

    function removeFirstChildOfDivElement(divElementId) {

        var divElement = document.getElementById(divElementId);
        divElement.removeChild(divElement.childNodes[0]);

    };

    /**
    *
    * @param {string} mainContentWindowId  : Id of main content window of Summary grid
    * @param {string} formId  : Input form Id to be used while creation
    * @param {Array} formLayoutRatio  : Array with "Label : Input" ratio information
    * @param {Array} formInputIdArray  : Array of form input Ids
    * @param {Array} formInputTypeArray  : Array of form input Types
    * @param {Array} formInputLabelArray  : Array of form input Labels
    * @param {String} submitInvokeFunction  : Function to be invoked on Submit Button Click
    * @param {Array} formInputOnChangeInvokeFunctions  : Array of functions to be invoked on change of selected form input
    *
    */

    function renderInputFormDynamically(mainContentWindowId, formId, formLayoutRatio, formInputIdArray, formInputTypeArray, formInputLabelArray,
        submitInvokeFunction, formInputOnChangeInvokeFunctions) {

        var mainContentWindow = document.getElementById(mainContentWindowId);

        // Form Node

        var formNode = RenderingHelperUtilsModule.createNewElementWithAttributes("FORM", formId, "form-horizontal", "align-items: center;");
        {
            var currentIndex = 0;

            for (var currentInputId of formInputIdArray) {

                RenderingHelperUtilsModule.renderFormInputNode(formNode, formInputTypeArray[currentIndex],
                    formInputLabelArray[currentIndex], currentInputId, formLayoutRatio, formInputOnChangeInvokeFunctions[currentIndex]);

                currentIndex++;
            }

        }

        mainContentWindow.appendChild(formNode);

        // Form Submission Node

        RenderingHelperUtilsModule.renderFormSubmissionNode(mainContentWindow, submitInvokeFunction, formLayoutRatio[2]);

    }

    /**
     * 
     * Expose the helper functions of add Labels module
     * 
     */

    return {
           
        addInputListItemToDivision: addInputListItemToDivision,
        removeFirstChildOfDivElement: removeFirstChildOfDivElement,
        renderInputFormDynamically: renderInputFormDynamically,

    }

}) ();


