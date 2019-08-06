
var addLabelsModule = (function () {

    /**
     * 
     * Adds a new label as list element in a division 
     * 
     */

	function addLabels() {

        var node = document.createElement("label");
        var textnode = document.createTextNode("label:");
        var input = document.createElement("input");
        var list = document.createElement("li");
        node.appendChild(textnode);
        node.appendChild(input);
        list.appendChild(node);
        document.getElementById('new_division').appendChild(list);

    };

    /**
     * 
     * Removes the Lables in a division 
     * 
     */

    function removeLabels() {

        var label = document.getElementById('new_division');
        label.removeChild(label.childNodes[0]);

    };

    /**
     * 
     * Expose the helper functions of add Labels module
     * 
     */

    return {

	    addLabels : addLabels,
        removeLabels: removeLabels

    }

}) ();


