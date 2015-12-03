Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
function loaddata(_callback) {
	var adata = new Array();
	// let selectedTag = mylist.selectedItems[0].getAttribute("label");
	var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
	var dbConn = Services.storage.openDatabase(file); // Will also create the
														// file if it does not
														// exist
	var statement = dbConn.createStatement("select * from text");
	statement.executeAsync({
		handleResult: function(aResultSet) {
			for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
				adata.push({
					old_id: row.getResultByName("old_id"),
					fullname: row.getResultByName("FullName"),
					tel: row.getResultByName("Tel")
				});
			}
		},
		handleError: function(aError) {
			console.log("Error: " + aError.message);
		},
		handleCompletion: function(aReason) {
			if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
				console.log("Query canceled or aborted!");
			}
			_callback(adata);
		}
	});
	statement.finalize();
}
function addnew() {
	var selectrecord = "";
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore',
			'chrome,width=600,height=300', selectrecord);
}

var mytree = document.getElementById("mytree");


var table = new Array();
function setd(data){
	table = data;
	mytree.view = new treeView(table);
}
function init() {
	loaddata(setd);
	mytree.addEventListener("dblclick", function(event) {
	var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
}, true);
}

// generic custom tree view stuff
function treeView(table) {
	this.rowCount = table.length;
	this.getCellText = function(row, col) {
		return table[row][col.id];
	};
	this.getCellValue = function(row, col) {
		return table[row][col.id];
	};
	this.setTree = function(treebox) {
		this.treebox = treebox;
	};
	this.isEditable = function(row, col) {
		return col.editable;
	};
	this.isContainer = function(row) {
		return false;
	};
	this.isSeparator = function(row) {
		return false;
	};
	this.isSorted = function() {
		return false;
	};
	this.getLevel = function(row) {
		return 0;
	};
	this.getImageSrc = function(row, col) {
		return null;
	};
	this.getRowProperties = function(row, props) {
	};
	this.getCellProperties = function(row, col, props) {
	};
	this.getColumnProperties = function(colid, col, props) {
	};
	this.cycleHeader = function(col, elem) {
	};
}
