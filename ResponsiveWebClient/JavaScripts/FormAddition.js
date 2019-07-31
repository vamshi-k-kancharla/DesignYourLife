var addLabelsModule = (function(){

	function addLabels() {
		 var node = document.createElement("label",);
  		 var textnode = document.createTextNode("label:");
  		 var input = document.createElement("input");
  		 var list = document.createElement("li");
  		 node.appendChild(textnode);
  		 node.appendChild(input);
  		 list.appendChild(node);
  		 document.getElementById('new_division').appendChild(list);
};
function removeLabels() {
 var label = document.getElementById('new_division');
 label.removeChild(label.childNodes[0]);
};
return {
	addLabels : addLabels,
	removeLabels : removeLabels
}
}) ();


