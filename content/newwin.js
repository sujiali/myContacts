var cts = {
	data: [],

	tagdata: [],

	alphadata: [],

	table: [],

	alphafilter: "",

	tagfilter: [],

	tagidx: [],

	init: function() {
		// set data
		this.loadData();
		this.genTagIdx();

		// set tags
		this.tagfilter = [];
		this.genTagData();
		var mylist = $$("mylist");
		mylist.selectedIndex = 0;

		// set tabs
		this.alphafilter = "";
		this.genAlphaData();
		this.setTabs();
		var tablist = $$("tablist");
		tablist.selectedIndex = 0;
		this.table = this.alphadata;

		// show tree
		var mytree = $$("mytree");
		mytree.view = new treeView(this.table);
	},

	loadData: function() {
		this.data = [];
		var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
		var statement = dbConn.createStatement("select * from text");
		while (statement.executeStep()) {
			this.data.push({
				old_id: statement.row.old_id,
				fullname: statement.row.FullName,
				tel: statement.row.Tel,
				initcap: statement.row.initcap
			});
		}
		statement.finalize();
	},

	genTagIdx: function() {
		this.tagidx = [];
		var tags = new Array();
		var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist

		// get tags
		var statement = dbConn.createStatement("SELECT tagname from tags");
		while (statement.executeStep()) {
			tags.push(statement.row.tagname);
		}

		// get tagidx
		for (let i = 0; i < tags.length; i++) {
			statement.reset();
			var tgrp = new Array();
			var statement = dbConn.createStatement("SELECT relation.textid from relation, tags where (tags.id=relation.tagid) and (tags.tagname= :tn)");
			statement.params.tn = tags[i];
			while (statement.executeStep()) {
				tgrp.push(statement.row.textid);
			}
			this.tagidx[tags[i]] = tgrp;
		}
		statement.finalize();
	},

	genTagData: function() {
		this.tagdata = [];
		for (let i = 0; i < this.data.length; i++) {
			var istaged = this.tagfilter.contains(this.data[i].old_id);
			if (istaged) {
				this.tagdata.push(this.data[i]);
			}
		}
	},

	genAlphaData: function() {
		this.alphadata = [];
		for (let i = 0; i < this.tagdata.length; i++) {
			if ((this.alphafilter == "") || (this.tagdata[i].initcap.indexOf(this.alphafilter) >= 0)) {
				var isalphaed = true;
			} else {
				var isalphaed = false;
			}
			if (isalphaed) {
				this.alphadata.push(this.tagdata[i]);
			}
		}
	},

	setTabs: function() {
		var initcaparr = this.tagdata.objprops("initcap");
		var uni_initcap = initcaparr.unique();
		var allalpha = new function() {
				var r = [];
				for (let i = 65; i < 91; i++) {
					r.push(String.fromCharCode(i));
				}
				return r;
			}
		for (let i = 0; i < allalpha.length; i++) {
			if (uni_initcap.contains(allalpha[i])) {
				$$("tab" + allalpha[i]).setAttribute("hidden", "false");
			} else {
				$$("tab" + allalpha[i]).setAttribute("hidden", "true");
			}
		}
	},



	tagview: function() {
		this.genTagData();

		this.alphafilter = "";
		this.genAlphaData();
		this.setTabs();
		var tablist = $$("tablist");
		tablist.selectedIndex = 0;
		this.table = this.alphadata;

		// show tree
		var mytree = $$("mytree");
		mytree.view = new treeView(this.table);
	},

	alphaview: function() {
		this.genAlphaData();
		this.table = this.alphadata;
		// show tree
		var mytree = $$("mytree");
		mytree.view = new treeView(this.table);
	},

	refresh: function() {
		this.loadData();
		this.genTagIdx();

		// set tags
		this.genTagData();

		// set tabs
		this.genAlphaData();
		this.setTabs();
		this.table = this.alphadata;

		// show tree
		var mytree = $$("mytree");
		mytree.view = new treeView(this.table);
	},
	
	copyToExcel: function() {
		var mytree = $$("mytree");
		var start = new Object();
		var end = new Object();
		var rs = [];
		var numRanges = mytree.view.selection.getRangeCount();
		for (var t = 0; t < numRanges; t++) {
			mytree.view.selection.getRangeAt(t, start, end);
			for (var v = start.value; v <= end.value; v++) {
				var r = [];
				var tColumn = mytree.columns.getFirstColumn();
				while (tColumn) {
					if ($$(tColumn.id).getAttribute("hidden") != "true") {
						r.push(mytree.view.getCellText(v, tColumn));
					}
					tColumn = tColumn.getNext();
				}
				rs.push(r.join("\t"));
			}
		}
		gClipboardHelper.copyString(rs.join("\r\n"));
	},

	copyWithComma: function() {
		var mytree = $$("mytree")
		var start = new Object();
		var end = new Object();
		var rs = "";
		var numRanges = mytree.view.selection.getRangeCount();
		for (var t = 0; t < numRanges; t++) {
			mytree.view.selection.getRangeAt(t, start, end);
			for (var v = start.value; v <= end.value; v++) {
				var r = [];
				var tColumn = mytree.columns.getFirstColumn();
				while (tColumn) {
					if ($$(tColumn.id).getAttribute("hidden") != "true") {
						r.push(mytree.view.getCellText(v, tColumn));
					}
					tColumn = tColumn.getNext();
				}
				rs.push(r.join("\t"));
			}
		}
		gClipboardHelper.copyString(rs.join("\r\n"));
	},

	tableSort: function(column) {
		var mytree = $$("mytree")
		var columnName;
		var order = mytree.getAttribute("sortDirection") == "ascending" ? 1 : -1;
		//if the column is passed and it's already sorted by that column, reverse sort
		if (column) {
			columnName = column.id;
			if (mytree.getAttribute("sortResource") == columnName) {
				order *= -1;
			}
		} else {
			columnName = mytree.getAttribute("sortResource");
		}

		function customSort(a, b) {
			var s1 = prepareForComparison(a[columnName]);
			var s2 = prepareForComparison(b[columnName]);
			var r = 0;
			if ((typeof s1 == "string") && (typeof s2 == "string")) {
				if (s1.localeCompare(s2) > 0) {
					r = 1 * order;
				} else if (s1.localeCompare(s2) < 0) {
					r = -1 * order;
				} else if (s1.localeCompare(s2) == 0) {
					r = 0 * order;
				}
			} else {
				if (s1 > s2) {
					r = 1 * order;
				} else if (s1 < s2) {
					r = -1 * order;
				} else if (s1 == s2) {
					r = 0 * order;
				}
			}
			return r;
		}
		this.table.sort(customSort);
		//setting these will make the sort option persist
		mytree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
		mytree.setAttribute("sortResource", columnName);
		mytree.view = new treeView(this.table);
		//set the appropriate attributes to show to indicator
		var cols = mytree.getElementsByTagName("treecol");
		for (var i = 0; i < cols.length; i++) {
			cols[i].removeAttribute("sortDirection");
		}
		$$(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
	},

	//prepares an object for easy comparison against another. for strings, lowercases them


};

function treeView(ttable) {
	this.rowCount = ttable.length;
	this.getCellText = function(row, col) {
		return ttable[row][col.id];
	};
	this.getCellValue = function(row, col) {
		return ttable[row][col.id];
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

(function() {
	var mytree = $$("mytree");
	var mytreechildren = $$("mytreechildren");
	mytreechildren.addEventListener("dblclick", function(event) {
		var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
	}, true);

	var mylist = $$("mylist");
	mylist.addEventListener("click", function(event) {
		var selectedTag = mylist.selectedItems[0].getAttribute("label");
		if (selectedTag === "All") {
			cts.tagfilter = [];
		} else {
			cts.tagfilter = cts.tagidx[selectedTag];
		}
		cts.tagview();
	}, true);

	var newbtn = $$("newbtn");
	newbtn.addEventListener("command", function(event) {
		var selectrecord = "";
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore',
			'chrome,width=600,height=300', selectrecord);
	}, true);

	var reload = $$("reload");
	reload.addEventListener("command", function(event) {
		cts.init();
	}, true);
})();

function cancelOperation() {
	console.log("update is cancelled");
}