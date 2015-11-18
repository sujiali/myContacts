Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

var file = FileUtils.getFile("ProfD", ["test1.sqlite"]);
var dbConn = Services.storage.openDatabase(file); // Will also create the file
// if it does not exist
var statement = dbConn.createStatement("SELECT * FROM text");
statement.executeAsync({
	handleResult : function(aResultSet) {
		// add comment
		console.log(aResultSet);
		for (let row = aResultSet.getNextRow(); row; row = aResultSet
				.getNextRow()) {
			var value = row.getResultByName("Tel");
			console.log(value);
		}
	},

	handleError : function(aError) {
		print("Error: " + aError.message);
	},

	handleCompletion : function(aReason) {
		if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
			print("Query canceled or aborted!");
	}
});

// console.log(statement.getColumnName());
