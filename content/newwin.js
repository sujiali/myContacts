//Components.utils.import("resource://gre/modules/Services.jsm");
//Components.utils.import("resource://gre/modules/FileUtils.jsm");

data = [];
data.push({
	old_id: "Leonardo",
	fullname: "Leader",
	tel: "Dual katanas"
});
data.push({
	old_id: "Michaelangelo",
	fullname: "Party dude",
	tel: "Nunchaku"
});
data.push({
	old_id: "Donatello",
	fullname: "Does machines",
	tel: "Bo"
});
data.push({
	old_id: "Raphael",
	fullname: "Cool, but rude",
	tel: "Sai"
});
data.push({
	old_id: "Splinter",
	fullname: "Rat",
	tel: "Walking stick"
});
data.push({
	old_id: "Shredder",
	fullname: "Armored man",
	tel: "Blades"
});
data.push({
	old_id: "Casey Jones",
	fullname: "Goalie masked man",
	tel: "Hockey stick"
});
data.push({
	old_id: "April O'Neil",
	fullname: "Journalist",
	tel: "None"
});

//
//function loaddata(_callback) {
//	var adata = new Array();
//	// let selectedTag = mylist.selectedItems[0].getAttribute("label");
//	var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
//	var dbConn = Services.storage.openDatabase(file); // Will also create the
//	// file if it does not
//	// exist
//	var statement = dbConn.createStatement("select * from text");
//	statement.executeAsync({
//		handleResult: function(aResultSet) {
//			for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
//				adata.push({
//					old_id: row.getResultByName("old_id"),
//					fullname: row.getResultByName("FullName"),
//					tel: row.getResultByName("Tel")
//				});
//			}
//		},
//		handleError: function(aError) {
//			console.log("Error: " + aError.message);
//		},
//		handleCompletion: function(aReason) {
//			if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
//				console.log("Query canceled or aborted!");
//			}
//			_callback(adata);
//		}
//	});
//	statement.finalize();
//}

//function addnew() {
//	var selectrecord = "";
//	window.openDialog('chrome://myContacts/content/update.xul', 'showmore',
//		'chrome,width=600,height=300', selectrecord);
//}



//function setd(data) {
//	mytree.view = new treeView(table);
//}
//
//function init() {
//	loaddata(setd);
//	mytree.addEventListener("dblclick", function(event) {
//		var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
//		window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
//	}, true);
//}

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
	this.getRowProperties = function(row, props) {};
	this.getCellProperties = function(row, col, props) {};
	this.getColumnProperties = function(colid, col, props) {};
}

var mytree = document.getElementById("mytree")
mytree.view = new treeView(data);

data.push({
	old_id: "April O'Neil",
	fullname: "Journalist",
	tel: "None"
});

mytree.view = new treeView(data);