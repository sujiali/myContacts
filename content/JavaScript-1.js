var t = document.getElementById('mytree');
var treeView = {
    rowCount : 10000, //设置总行数
    getCellText : function(row,column){//设置数据
      if (column.id == "namecol") return "Row "+row;
      else return "February 18";
    },
    setTree: function(treebox){ this.treebox = treebox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col){ return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){},
    getColumnProperties: function(colid,col,props){}
};
t.view = treeView;
console.log(t.view.getCellText(1,t.columns.getNamedColumn('lastname')));