//Components.utils.import("resource://gre/modules/Services.jsm");
//Components.utils.import("resource://gre/modules/FileUtils.jsm");

function dosql() {
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
	var fieldname = new Array();
	var mylist = document.getElementById("mylist");
	for (let i = 1; i < mylist.childNodes.length; i++) {
		if (mylist.childNodes[i].getAttribute("checked") == "true") {
			fieldname.push(mylist.childNodes[i].getAttribute("label"));
		}

	}


	// update tree
	var mycols = document.getElementById("mycols");
	var mycells = document.getElementById("mycells");
	removeAllChild(mycols);
	removeAllChild(mycells);

	for (let i = 0; i < fieldname.length; i++) {
		let tcol = document.createElement("treecol");
		tcol.setAttribute("label", fieldname[i]);
		tcol.setAttribute("flex", i);
		mycols.appendChild(tcol);
		let tcell = document.createElement("treecell");
		tcell.setAttribute("label", "?" + fieldname[i]);
		mycells.appendChild(tcell);
	}
	document.getElementById("photosList").builder.rebuild();
}

function removeAllChild(obj) {
	while (obj.hasChildNodes()) {
		obj.removeChild(obj.firstChild);
	}
}