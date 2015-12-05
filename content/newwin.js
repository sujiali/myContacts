Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
var cts = {
	data: [],

	table: [],

	tagfilter: [],

	tagidx: [],

	loaddata: function() {
		var adata = new Array();
		// let selectedTag = mylist.selectedItems[0].getAttribute("label");
		var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
		var statement = dbConn.createStatement("select * from text");
		while (statement.executeStep()) {
			adata.push({
				old_id: statement.row.old_id,
				fullname: statement.row.FullName,
				tel: statement.row.Tel
			});
		}
		statement.finalize();
		return adata;
	},

	gentagidx: function() {
		var tags = new Array();
		var adata = {};
		// let selectedTag = mylist.selectedItems[0].getAttribute("label");
		var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
		var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist

		var statement = dbConn.createStatement("SELECT tagname from tags");
		while (statement.executeStep()) {
			tags.push(statement.row.tagname);
		}

		for (let i = 0; i < tags.length; i++) {
			statement.reset();
			var tgrp = new Array();
			var statement = dbConn.createStatement("SELECT relation.textid from relation, tags where (tags.id=relation.tagid) and (tags.tagname= :tn)");
			statement.params.tn = tags[i];
			while (statement.executeStep()) {
				tgrp.push(statement.row.textid);
			}
			adata[tags[i]] = tgrp;
		}
		statement.finalize();
		return adata;
	},

	init: function() {
		this.tagidx = this.gentagidx();
		var mytree = document.getElementById("mytree");
		this.data = this.loaddata();
		this.table = this.data;
		mytree.view = new treeView(this.table);
	},

	refresh: function() {
		var mytree = document.getElementById("mytree");
		if (this.tagfilter.length == 0) {
			this.table = this.data;
		} else {
			this.table = [];
			for (i = 0; i < this.data.length; i++) {
				if (this.tagfilter.contains(this.data[i].old_id)) {
					this.table.push(this.data[i]);
				}
			}
		}
		mytree.view = new treeView(this.table);
	},

	addnew: function() {
		var selectrecord = "";
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore',
			'chrome,width=600,height=300', selectrecord);
	}

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
	var mytree = document.getElementById("mytree");
	mytree.addEventListener("dblclick", function(event) {
		var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
	}, true);

	var mylist = document.getElementById("mylist");
	mylist.addEventListener("click", function(event) {
		let selectedTag = mylist.selectedItems[0].getAttribute("label");
		if (selectedTag === "All") {
			cts.tagfilter = [];
		} else {
			cts.tagfilter = cts.tagidx[selectedTag];
		}
		cts.refresh();
	}, true);

	cts.init();
})();

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}