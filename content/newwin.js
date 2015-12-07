Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");


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
    var r = [], hash = {};
    for(var i=0, elem; (elem = this[i]) != null; i++)  {
        if (!hash[elem])
        {
            r.push(elem);
            hash[elem] = true;
        }
    }
    return r;
}

Array.prototype.props = function() {
	var r = [];
	for (i = 0; i < arr.length; i++) {
		r.push(arr[i][prop]);
	}
	return r;
}

function prop2arr(arr, prop) {
	var r = [];
	for (i = 0; i < arr.length; i++) {
		r.push(arr[i][prop]);
	}
	return r;
}

var cts = {
	data: [],

	tabletags: [],

	alphafilter: "",

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
				tel: statement.row.Tel,
				initcap: statement.row.initcap
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
		this.settab();
		mytree.view = new treeView(this.table);
	},

	settab: function() {
		var initcaparr = [];
		initcaparr = prop2arr(this.table, "initcap");
		var uni_initcap = initcaparr.unique();
		var allalpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		for (i = 0; i < allalpha.length; i++) {
			if (uni_initcap.contains(allalpha[i])) {
				document.getElementById("tab" + allalpha[i]).setAttribute("hidden", "false");
			} else {
				document.getElementById("tab" + allalpha[i]).setAttribute("hidden", "true");
			}
		}
		document.getElementById("tablist").selectedIndex = 0;
	},

	refresh: function(whr) {
		var mytree = document.getElementById("mytree");
		switch (whr) {
			case "tags":
				this.table = [];
				for (let i = 0; i < this.data.length; i++) {
					var istaged = this.tagfilter.contains(this.data[i].old_id);
					if (istaged) {
						this.table.push(this.data[i]);
					}
				}
				this.alphafilter = "";
				this.settab();
				break;
			case "alphas":
				this.table = [];
				for (let i = 0; i < this.data.length; i++) {
					var istaged = this.tagfilter.contains(this.data[i].old_id);
					if (this.alphafilter == "") {
						var isalphaed = true;
					} else if (this.data[i].initcap.indexOf(this.alphafilter) >= 0) {
						var isalphaed = true;
					} else {
						var isalphaed = false;
					}
					if (istaged && isalphaed) {
						this.table.push(this.data[i]);
					}
				}
				break;
			default:
				break;
		}
		mytree.view = new treeView(this.table);

	},

	addnew: function() {
		var selectrecord = "";
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore',
			'chrome,width=600,height=300', selectrecord);
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
	var mytree = document.getElementById("mytree");
	mytree.addEventListener("dblclick", function(event) {
		var selectrecord = (mytree.view.getCellText(mytree.currentIndex, mytree.columns.getColumnAt(0)));
		window.openDialog('chrome://myContacts/content/update.xul', 'showmore', 'chrome,width=600,height=300', selectrecord);
	}, true);

	var mylist = document.getElementById("mylist");
	mylist.addEventListener("click", function(event) {
		// set tagfilter
		let selectedTag = mylist.selectedItems[0].getAttribute("label");
		if (selectedTag === "All") {
			cts.tagfilter = [];
		} else {
			cts.tagfilter = cts.tagidx[selectedTag];
		}
		cts.refresh('tags');
	}, true);
})();