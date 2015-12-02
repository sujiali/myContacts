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
	// define
	let selectedTag = mylist.selectedItems[0].getAttribute("label");
	let mytemplate = document.getElementById("mytemplate");
	let myquery1 = document.getElementById("myquery");
	let myaction = document.getElementById("myaction");
	
	// clear
	mytemplate.removeChild(myquery1);

	// insert new query
	if (selectedTag == "All") {
		let myquery2 = document.createElement("query");
		myquery2.setAttribute("id", "myquery");
		let statement = 'SELECT * FROM text'
		myquery2.textContent = statement;
		mytemplate.insertBefore(myquery2, myaction);
	} else {
		let myquery2 = document.createElement("query");
		myquery2.setAttribute("id", "myquery");
		let statement = 'SELECT * FROM text where old_id in (select textid from relation where tagid in (select id from tags where tagname = :ss))'
		myquery2.textContent = statement;
		mytemplate.insertBefore(myquery2, myaction);

		var myquery = document.getElementById("myquery");
		let myparam = document.createElement("param");
		myparam.setAttribute("name", "ss");
		myparam.textContent = selectedTag;
		myquery.appendChild(myparam);
	}
	document.getElementById("mytree").builder.rebuild();
	// var statement2 = 'SELECT * FROM text where old_id in (select textid from relation where tagid in (select id from tags where tagname = :s))'
}, true);