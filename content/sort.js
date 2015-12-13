var table = null;
var data = null;
var tree;
var filterText = "";

function init() {
	tree = document.getElementById("tree");
	loadTable();
}

//this function is called every time the tree is sorted, filtered, or reloaded

function loadTable() {
	//remember scroll position. this is useful if this is an editable table
	//to prevent the user from losing the row they edited
	var topVisibleRow = null;
	if (table) {
		topVisibleRow = getTopVisibleRow();
	}
	if (data == null) {
		//put object loading code here. for our purposes, we'll hard code it.
		data = [];
		//the property names match the column ids in the xul. this way, we don't have to deal with
		//mapping between the two
		data.push({
			name: "Leonardo",
			description: "Leader",
			weapon: "Dual katanas"
		});
		data.push({
			name: "Michaelangelo",
			description: "Party dude",
			weapon: "Nunchaku"
		});
		data.push({
			name: "Donatello",
			description: "Does machines",
			weapon: "Bo"
		});
		data.push({
			name: "Raphael",
			description: "Cool, but rude",
			weapon: "Sai"
		});
		data.push({
			name: "Splinter",
			description: "Rat",
			weapon: "Walking stick"
		});
		data.push({
			name: "Shredder",
			description: "Armored man",
			weapon: "Blades"
		});
		data.push({
			name: "Casey Jones",
			description: "Goalie masked man",
			weapon: "Hockey stick"
		});
		data.push({
			name: "April O'Neil",
			description: "Journalist",
			weapon: "None"
		});
	}
	if (filterText == "") {
		//show all of them
		table = data;
	} else {
		//filter out the ones we want to display
		table = [];
		data.forEach(function(element) {
			//we'll match on every property
			for (var i in element) {
				if (prepareForComparison(element[i]).indexOf(filterText) != -1) {
					table.push(element);
					break;
				}
			}
		});
	}

	sort();
	//restore scroll position
	if (topVisibleRow) {
		setTopVisibleRow(topVisibleRow);
	}
}

//generic custom tree view stuff

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
	this.isEditable = function(row, col) {
		return col.editable;
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
	this.cycleHeader = function(col, elem) {};
}

function sort(column) {
	var columnName;
	var order = tree.getAttribute("sortDirection") == "ascending" ? 1 : -1;
	//if the column is passed and it's already sorted by that column, reverse sort
	if (column) {
		columnName = column.id;
		if (tree.getAttribute("sortResource") == columnName) {
			order *= -1;
		}
	} else {
		columnName = tree.getAttribute("sortResource");
	}

	function columnSort(a, b) {
		if (prepareForComparison(a[columnName]) > prepareForComparison(b[columnName])) return 1 * order;
		if (prepareForComparison(a[columnName]) < prepareForComparison(b[columnName])) return -1 * order;
		//tie breaker: name ascending is the second level sort
		if (columnName != "name") {
			if (prepareForComparison(a["name"]) > prepareForComparison(b["name"])) return 1;
			if (prepareForComparison(a["name"]) < prepareForComparison(b["name"])) return -1;
		}
		return 0;
	}
	table.sort(columnSort);
	//setting these will make the sort option persist
	tree.setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
	tree.setAttribute("sortResource", columnName);
	tree.view = new treeView(table);
	//set the appropriate attributes to show to indicator
	var cols = tree.getElementsByTagName("treecol");
	for (var i = 0; i < cols.length; i++) {
		cols[i].removeAttribute("sortDirection");
	}
	document.getElementById(columnName).setAttribute("sortDirection", order == 1 ? "ascending" : "descending");
}

//prepares an object for easy comparison against another. for strings, lowercases them

function prepareForComparison(o) {
	if (typeof o == "string") {
		return o.toLowerCase();
	}
	return o;
}

function getTopVisibleRow() {
	return tree.treeBoxObject.getFirstVisibleRow();
}

function setTopVisibleRow(topVisibleRow) {
	return tree.treeBoxObject.scrollToRow(topVisibleRow);
}


function inputFilter(event) {
	//do this now rather than doing it at every comparison
	var value = prepareForComparison(event.target.value);
	setFilter(value);
	document.getElementById("clearFilter").disabled = value.length == 0;
}

function clearFilter() {
	document.getElementById("clearFilter").disabled = true;
	var filterElement = document.getElementById("filter");
	filterElement.focus();
	filterElement.value = "";
	setFilter("");
}

function setFilter(text) {
	filterText = text;
	loadTable();
}