function treeView(ttable) {
    this.rowCount = ttable.length;
    this.getCellText = function(row, col) {
        return ttable[row][col.id];
    };
    this.getCellValue = function(row, col) {
        return ttable[row][col.id];
    };
    this.setCellValue = function(row, col) {
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

    this.isEditable = function(row, col) {
        if (col.id == "selectbox") {
            return true;
        } else {
            return false;
        }
    }

    this.getLevel = function(row) {
        return 0;
    };
    this.getImageSrc = function(row, col) {
        return null;
    };
    this.getRowProperties = function(row, props) {};
    this.getCellProperties = function(row, col, props) {};
    this.getColumnProperties = function(colid, col, props) {};
};

var tt = [{
        selectbox: "true",
        namecol: "abc",
        datecol: "13943298432"
    }, {
        selectbox: "true",
        namecol: "abc",
        datecol: "13943298432"
    }
];

function $$(sId) {
    return document.getElementById(sId);
};

function setview() {
    $$("my-tree").view = new treeView(tt);
}

var mytree = $$("my-tree");
var mytreechildren = $$("mytreechildren");
mytreechildren.addEventListener("click", function(event) {
    var b = this.parentNode.treeBoxObject;
    var cell = b.getCellAt(event.clientX, event.clientY);
    // console.log(cell);
    var status = mytree.view.getCellText(cell.row, mytree.columns.getNamedColumn("selectbox"));
    if (cell.col.id == "selectbox") {
        if (status == "true") {
            tt[cell.row]["selectbox"] = "false";
        } else if (status == "false") {
            tt[cell.row]["selectbox"] = "true";
        }
    }
}, true);