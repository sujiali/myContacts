/* Copyright (c) 2006 YourNameHere
   See the file LICENSE.txt for licensing information. */

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
var record = {};
getbyid(window.arguments[0], function(rows) {
    record = rows;
});

function getbyid(id, _callback) {
    var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
    var trecord = {};
    var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
    // var statement = dbConn.createStatement("update text set FullName='susu', Tel='123' where old_id='70'");
    var statement = dbConn.createStatement("select * from text where old_id= :id");
    statement.params.id = id;
    statement.executeAsync({
        handleResult: function(aResultSet) {
            for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
                trecord.old_id = row.getResultByName("old_id");
                trecord.FullName = row.getResultByName("FullName");
                trecord.Tel = row.getResultByName("Tel");
            }
        },
        handleError: function(aError) {
            console.log("Error: " + aError.message);
        },
        handleCompletion: function(aReason) {
            if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                console.log("Query canceled or aborted!");
            }
            document.getElementById("tid").setAttribute("value", "The record id is " + trecord.old_id);
            document.getElementById("fullname").setAttribute("value", trecord.FullName);
            document.getElementById("tel").setAttribute("value", trecord.Tel);
            _callback(trecord);
        }
    });
    statement.finalize();
}

function doOK() {
    var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
    var fieldname = new Array();
    var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
    record.FullName = document.getElementById("fullname").value;
    record.Tel = document.getElementById("tel").value;
    var statement = dbConn.createStatement("update text set FullName = :fn, Tel = :tel where old_id = :id");
    statement.params.fn = record.FullName;
    statement.params.tel = record.Tel;
    statement.params.id = record.old_id;
    statement.execute();
    statement.finalize();
    return true;
}

function doCancel() {
    console.log("You pressed Cancel!");
    return true;
}