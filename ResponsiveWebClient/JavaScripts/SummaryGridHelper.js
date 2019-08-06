
var tableDataModule = (function () {

    /**
     * 
     * Fill Summary Grid Table Data columns 
     * 
     */

    function tableData() {

        var table = document.getElementById("mytable");
        var row = table.insertRow(2);
        var col1 = row.insertCell(0);
        var col2 = row.insertCell(1);
        var col3 = row.insertCell(2);
        var col4 = row.insertCell(3);
        var col5 = row.insertCell(4);
        var col6 = row.insertCell(5);
        col1.innerHTML = "<img src='img2.jpg' height='100px' width='100%'/>";
        col2.innerHTML = "<p>name1:value1</p><p>name2:value2</p><p>name3:value3</p>";
        col3.innerHTML = "";
        col4.innerHTML = "";
        col5.innerHTML = "<p>name1:value1</p><p>name2:value2</p><p>name3:value3</p>";
        col6.innerHTML = "<img src='img4.jpg' height='100px' width='100%'/>";

    }

    /**
     * 
     * Delete Table data
     * ToDo: Change the Table data display to dynamic based on input requirement
     * 
     */

    function delete_table_data() {

        document.getElementById("mytable").deleteRow(2);

    }

    /**
     * 
     * Expose Helper functions for Global Access
     * 
     */

    return {

	    delete_table_data : delete_table_data,
	    tableData : tableData
    }

})();
