/* Copyright (c) 2006 YourNameHere
   See the file LICENSE.txt for licensing information. */
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
    .getService(Components.interfaces.nsIClipboardHelper);

function $$(sId) {
    return document.getElementById(sId);
}

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
	var r = [];
	var hash = {};
	for (let i = 0, elem;
	(elem = this[i]) != null; i++) {
		if (!hash[elem]) {
			r.push(elem);
			hash[elem] = true;
		}
	}
	return r;
}

Array.prototype.objprops = function(prop) {
	var r = [];
	for (let i = 0; i < this.length; i++) {
		r.push(this[i][prop]);
	}
	return r;
}

function prepareForComparison(o) {
	if (typeof o == "string") {
		return o.toLowerCase();
	}
	return o;
}