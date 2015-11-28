function openlist() {
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
	document.getElementById("mytree").builder.rebuild();
}

function removeAllChild(obj) {
	while (obj.hasChildNodes()) {
		obj.removeChild(obj.firstChild);
	}
}

var mytree = document.getElementById("mytree");
mytree.addEventListener("dblclick", function(event) {
	var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
}, true);

function addnew() {
	var selectrecord="";
	window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
}