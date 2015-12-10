Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
	.getService(Components.interfaces.nsIClipboardHelper);

function $$(sId) {
	return document.getElementById(sId);
}

Array.prototype.contains = function(obj) {
	if (this.length == 0) {
		return true;
	} else {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
	}
	return false;
}

Array.prototype.unique = function() {
	var r = [];
	var hash = {};
	for (let i = 0, elem;
	(elem = this[i]) != null; i++) {
		if (!hash[elem]) {
			r.push(elem);
			hash[elem] = true;
		}
	}
	return r;
}

Array.prototype.objprops = function(prop) {
	var r = [];
	for (let i = 0; i < this.length; i++) {
		r.push(this[i][prop]);
	}
	return r;
}

var cts = {
	data: [],

	tagdata: [],

	alphadata: [],

	table: [],

	alphafilter: "",

	tagfilter: [],

	tagidx: [],

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
		var mytree = $$("mytree")
		var start = new Object();
		var end = new Object();
		var r = "";
		var numRanges = mytree.view.selection.getRangeCount();
		for (var t = 0; t < numRanges; t++) {
			mytree.view.selection.getRangeAt(t, start, end);
			for (var v = start.value; v <= end.value; v++) {
				r = r + mytree.view.getCellText(v, mytree.columns.getColumnAt(0));
				for (let i = 1; i < mytree.columns.count; i++) {
					r = r + "\t" + mytree.view.getCellText(v, mytree.columns.getColumnAt(i));
				}
				r = r + "\r\n";
			}
		}
		gClipboardHelper.copyString(r);
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
				for (let i = 0; i < mytree.columns.count; i++) {
					r.push(mytree.view.getCellText(v, mytree.columns.getColumnAt(i)));
				}
				rs = rs + r.toString() + "\r\n"
			}
		}
		gClipboardHelper.copyString(rs);
	},
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
	mytree.addEventListener("dblclick", function(event) {
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