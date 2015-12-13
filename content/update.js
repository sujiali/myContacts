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
        statement.params.id = this.tId;
        while (statement.executeStep()) {
            this.record.old_id = statement.row.old_id;
            this.record.FullName = statement.row.FullName;
            this.record.Tel = statement.row.Tel;
            this.record.initcap = statement.row.initcap;
        }
        statement.finalize();
    },

    init: function() {
        this.tId = window.arguments[0];
        if (this.tId == "") {
            // insert record;
            $$("tid").value = "This is new one, the record id is undefine.";
            for (let i = 0; i < this.textboxs.length; i++) {
                $$(this.textboxs[i]).setAttribute("class", this.textboxSwitch.on);
            }
            $$("switchRead").setAttribute("label", this.buttonSwitch.off);
        } else {
            // update record;
            this.selectRecordById();
            $$("tid").value = "The record id is " + this.record.old_id;
            $$("fullname").value = this.record.FullName;
            $$("tel").value = this.record.Tel;
            for (let i = 0; i < this.textboxs.length; i++) {
                $$(this.textboxs[i]).readOnly = true;
                $$(this.textboxs[i]).setAttribute("class", this.textboxSwitch.off);
            }
            $$("switchRead").setAttribute("label", this.buttonSwitch.on);
        }
    },

    switchStatus: function() {
        for (let i = 0; i < this.textboxs.length; i++) {
            $$(this.textboxs[i]).readOnly = !($$(this.textboxs[i]).readOnly);
            switchAttr($$(this.textboxs[i]), "class", this.textboxSwitch);
        }
        switchAttr($$("switchRead"), "label", this.buttonSwitch);
    },

    doOK: function() {
        this.record.FullName = $$("fullname").value;
        this.record.Tel = $$("tel").value;
        var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
        var fieldname = new Array();
        var dbConn = Services.storage.openDatabase(file); // Will also create the file if it does not exist
        if (this.tId == "") {
            // new one
            var statement = dbConn.createStatement("insert into text (FullName, Tel) values (:fn, :tel)");
        } else {
            // already exsit
            var statement = dbConn.createStatement("update text set FullName = :fn, Tel = :tel where old_id = :id");
            statement.params.id = this.record.old_id;
        }
        statement.params.fn = this.record.FullName;
        statement.params.tel = this.record.Tel;
        statement.execute();
        statement.finalize();
        opener.mainw.refresh();
        return true;
    },

    doCancel: function() {
        console.log("You pressed Cancel!");
        opener.mainw.updateCancelled();
        return true;
    }

};