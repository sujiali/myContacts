Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

function loaddata() {
	var adata = new Array();
	//let selectedTag = mylist.selectedItems[0].getAttribute("label");
	var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
	var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
	var statement = dbConn.createStatement("select * from text");
	statement.executeAsync({
		handleResult: function(aResultSet) {
			for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
				adata.push({
					id: row.getResultByName("old_id"),
					name: row.getResultByName("FullName"),
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
			console.log(adata);
		}
	});
	statement.finalize();
}






function addnew() {
	var selectrecord = "";
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
}
var mytree = document.getElementById("mytree");
mytree.addEventListener("dblclick", function(event) {
	var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
}, true);

var mylist = document.getElementById("mylist");
mylist.addEventListener("click", function(event) {
	var atextid = new Array();
	let selectedTag = mylist.selectedItems[0].getAttribute("label");
	var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
	var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
	var statement = dbConn.createStatement("SELECT relation.textid from relation, tags where (tags.id=relation.tagid) and (tags.tagname= :tn)");
	statement.params.tn = selectedTag;
	statement.executeAsync({
		handleResult: function(aResultSet) {
			for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
				atextid.push(row.getResultByName("textid"));
			}
		},
		handleError: function(aError) {
			console.log("Error: " + aError.message);
		},
		handleCompletion: function(aReason) {
			if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
				console.log("Query canceled or aborted!");
			}
			console.log(atextid);
			var t = document.getElementById("mytree");
			console.log(t.view.getCellText(0, t.columns.getNamedColumn('id')));
		}
	});
	statement.finalize();

	//var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
	//var fieldname = new Array();
	//var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
	//
	//// get field name
	//var statement = dbConn.createStatement("PRAGMA table_info([text])");
	//while (statement.executeStep()) {
	//	fieldname.push(statement.row.name);
	//}

	// var fieldname = ["old_id", "FullName", "Tel"];
	// console.log(fieldname);
	// console.log(fieldname.length);

	// define
	//let selectedTag = mylist.selectedItems[0].getAttribute("label");
	//let mytemplate = document.getElementById("mytemplate");
	//let myquery1 = document.getElementById("myquery");
	//let myaction = document.getElementById("myaction");
	//
	//// clear
	//mytemplate.removeChild(myquery1);
	//
	//// insert new query
	//if (selectedTag == "All") {
	//	let myquery2 = document.createElement("query");
	//	myquery2.setAttribute("id", "myquery");
	//	let statement = 'SELECT * FROM text'
	//	myquery2.textContent = statement;
	//	mytemplate.insertBefore(myquery2, myaction);
	//} else {
	//	let myquery2 = document.createElement("query");
	//	myquery2.setAttribute("id", "myquery");
	//	let statement = 'SELECT * FROM text where old_id in (select textid from relation where tagid in (select id from tags where tagname = :ss))'
	//	myquery2.textContent = statement;
	//	mytemplate.insertBefore(myquery2, myaction);
	//
	//	var myquery = document.getElementById("myquery");
	//	let myparam = document.createElement("param");
	//	myparam.setAttribute("name", "ss");
	//	myparam.textContent = selectedTag;
	//	myquery.appendChild(myparam);
	//}
	document.getElementById("mytree").builder.rebuild();
	// var statement2 = 'SELECT * FROM text where old_id in (select textid from relation where tagid in (select id from tags where tagname = :s))'
}, true);