/* Copyright (c) 2006 YourNameHere
   See the file LICENSE.txt for licensing information. */

var updatew = {
    tId: "",

    record: {},

    textboxs: new Array("fullname", "tel"),

    buttonSwitch: {
        on: "edit",
        off: "lock"
    },

    textboxSwitch: {
        on: "edit_style",
        off: "read_style"
    },

    selectRecordById: function(id) {
        var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
        var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
        var statement = dbConn.createStatement("select * from text where old_id= :id");
        statement.params.id = id;
        while (statement.executeStep()) {
            this.record.old_id = statement.row.old_id;
            this.record.FullName = statement.row.FullName;
            this.record.Tel = statement.row.Tel;
            this.record.initcap = statement.row.initcap;
        }
        statement.finalize();
    },

    init: function() {
        tId = window.arguments[0];
        if (tId == "") {
            // insert record;
            $$("tid").value = "This is new one, the record id is undefine.";
            for (let i = 0; i < textboxs.length; i++) {
                $$(textboxs[i]).setAttribute("class", textboxSwitch.on);
            }
            $$("switchRead").setAttribute("label", buttonSwitch.off);
        } else {
            // update record;
            selectRecordById(tId)
            $$("tid").value = "The record id is " + record.old_id;
            $$("fullname").value = record.FullName;
            $$("tel").value = record.Tel;
            for (let i = 0; i < textboxs.length; i++) {
                $$(textboxs[i]).readOnly = true;
                $$(textboxs[i]).setAttribute("class", textboxSwitch.off);
            }
            $$("switchRead").setAttribute("label", buttonSwitch.on);
        }
    }

};

function doOK() {
    record.FullName = $$("fullname").value;
    record.Tel = $$("tel").value;
    var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
    var fieldname = new Array();
    var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
    if (tId == "") {
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
    opener.mainw.refresh();
    return true;
}

function doCancel() {
    console.log("You pressed Cancel!");
    opener.cancelOperation();
    return true;
}

function switchStatus() {
    for (let i = 0; i < textboxs.length; i++) {
        $$(textboxs[i]).readOnly = !($$(textboxs[i]).readOnly);
        switchAttr($$(textboxs[i]), "class", textboxSwitch);
    }
    switchAttr($$("switchRead"), "label", buttonSwitch);
}

function switchAttr(obj, attr, status_obj) {
    if (obj.getAttribute(attr) == status_obj.on) {
        obj.setAttribute(attr, status_obj.off);
    } else if (obj.getAttribute(attr) == status_obj.off) {
        obj.setAttribute(attr, status_obj.on);
    }
}