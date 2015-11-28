/* Copyright (c) 2006 YourNameHere
   See the file LICENSE.txt for licensing information. */

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
var recordId = window.arguments[0];
var record = {};
var textboxs = new Array("fullname", "tel");
var buttonSwitch = {
    on: "edit",
    off: "lock"
};
var textboxSwitch = {
    on: "edit_style",
    off: "read_style"
};
if (recordId == "") {
    // new one;
    document.getElementById("tid").value = "This is new one, the record id is undefine.";
    for (let i = 0; i < textboxs.length; i++) {
        document.getElementById(textboxs[i]).setAttribute("class", textboxSwitch.on);
    }
    document.getElementById("switchRead").setAttribute("label", buttonSwitch.off);
} else {
    // already exsit
    getbyid(window.arguments[0], function(rows) {
        record = rows;
        document.getElementById("tid").value = "The record id is " + record.old_id;
        document.getElementById("fullname").value = record.FullName;
        document.getElementById("tel").value = record.Tel;
        for (let i = 0; i < textboxs.length; i++) {
            document.getElementById(textboxs[i]).readOnly = true;
            document.getElementById(textboxs[i]).setAttribute("class", textboxSwitch.off);
        }
        document.getElementById("switchRead").setAttribute("label", buttonSwitch.on);
    });
}

function getbyid(id, _callback) {
    var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
    var record = {};
    var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
    // var statement = dbConn.createStatement("update text set FullName='susu', Tel='123' where old_id='70'");
    var statement = dbConn.createStatement("select * from text where old_id= :id");
    statement.params.id = id;
    statement.executeAsync({
        handleResult: function(aResultSet) {
            for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
                record.old_id = row.getResultByName("old_id");
                record.FullName = row.getResultByName("FullName");
                record.Tel = row.getResultByName("Tel");
            }
        },
        handleError: function(aError) {
            console.log("Error: " + aError.message);
        },
        handleCompletion: function(aReason) {
            if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                console.log("Query canceled or aborted!");
            }
            _callback(record);
        }
    });
    statement.finalize();
}

function statusChange() {
    for (let i = 0; i < textboxs.length; i++) {
        document.getElementById(textboxs[i]).readOnly = !(document.getElementById(textboxs[i]).readOnly);
        switchAttr(document.getElementById(textboxs[i]), "class", textboxSwitch);
    }
    switchAttr(document.getElementById("switchRead"), "label", buttonSwitch);
}

function doOK() {
    record.FullName = document.getElementById("fullname").value;
    record.Tel = document.getElementById("tel").value;
    
    var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
    var fieldname = new Array();
    var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
    if (recordId == "") {
        // new one
        var statement = dbConn.createStatement("insert into text (FullName, Tel) values (:fn, :tel)");
    } else {
        // already exsit
        var statement = dbConn.createStatement("update text set FullName = :fn, Tel = :tel where old_id = :id");
        statement.params.id = record.old_id;
    }
    statement.params.fn = record.FullName;
    statement.params.tel = record.Tel;
    statement.execute();
    statement.finalize();
    return true;
}

function doCancel() {
    console.log("You pressed Cancel!");
    return true;
}

function switchAttr(obj, attr, status_obj) {
    if (obj.getAttribute(attr) == status_obj.on) {
        obj.setAttribute(attr, status_obj.off);
    } else if (obj.getAttribute(attr) == status_obj.off) {
        obj.setAttribute(attr, status_obj.on);
    }
}