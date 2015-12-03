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

	if (data == null) {
		//put object loading code here. for our purposes, we'll hard code it.
		data = [];
		//the property names match the column ids in the xul. this way, we don't have to deal with
		//mapping between the two
		data.push({name: "Leonardo", description: "Leader", weapon: "Dual katanas"});
		data.push({name: "Michaelangelo", description: "Party dude", weapon: "Nunchaku"});
		data.push({name: "Donatello", description: "Does machines", weapon: "Bo"});
		data.push({name: "Raphael", description: "Cool, but rude", weapon: "Sai"});
		data.push({name: "Splinter", description: "Rat", weapon: "Walking stick"});
		data.push({name: "Shredder", description: "Armored man", weapon: "Blades"});
		data.push({name: "Casey Jones", description: "Goalie masked man", weapon: "Hockey stick"});
		data.push({name: "April O'Neil", description: "Journalist", weapon: "None"});	
	}
	if (filterText == "") {
		//show all of them
		table = data;
	} else {

	}
	
	tree.view = new treeView(table);
	//restore scroll position

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
	this.isContainer = function(row){ return false; };
	this.isSeparator = function(row){ return false; };
	this.isSorted = function(){ return false; };
	this.getLevel = function(row){ return 0; };
	this.getImageSrc = function(row,col){ return null; };
	this.getRowProperties = function(row,props){};
	this.getCellProperties = function(row,col,props){};
	this.getColumnProperties = function(colid,col,props){};
	this.cycleHeader = function(col, elem) {};
}

