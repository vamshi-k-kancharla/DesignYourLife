
var addLabelsModule = (function () {

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
     * Expose the helper functions of add Labels module
     * 
     */

    return {
           
        addInputListItemToDivision: addInputListItemToDivision,
        removeFirstChildOfDivElement: removeFirstChildOfDivElement

    }

}) ();


