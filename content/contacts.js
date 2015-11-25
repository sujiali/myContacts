Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
var fieldname = new Array();
var dbConn = Services.storage.openDatabase(file); // Will also create the file
// if it does not exist
var statement = dbConn.createStatement("PRAGMA table_info([text])");

while (statement.executeStep()) {
	fieldname.push(statement.row.name);
}

// var fieldname = ["old_id", "FullName", "Tel"];
// console.log(fieldname);
// console.log(fieldname.length);

for (let i = 0; i < fieldname.length; i++) {
	let tcol = document.createElement("treecol");
	tcol.setAttribute("label", fieldname[i]);
	tcol.setAttribute("flex", i);
	document.getElementById("mycols").appendChild(tcol);
	//console.log(fieldname[i]);
	let tcell = document.createElement("treecell");
	tcell.setAttribute("label", "?" + fieldname[i]);
	document.getElementById("mycells").appendChild(tcell);
}