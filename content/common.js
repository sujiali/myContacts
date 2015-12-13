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
// get unique value from an array
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

//// the array prototype of getting the spprop value from all obj in this array; 
Array.prototype.getobjprops = function(prop) {
    return this.map(function(obj) {
	return obj[prop]
    });
}

// the array prototype of setting same prop value to all obj in this array; 
Array.prototype.setobjprops = function(prop, v) {
    this.map(function(obj) {
	obj[prop] = v;
    })
}

function switchAttr(obj, attr, status_obj) {
    if (obj.getAttribute(attr) == status_obj.on) {
	obj.setAttribute(attr, status_obj.off);
    } else if (obj.getAttribute(attr) == status_obj.off) {
	obj.setAttribute(attr, status_obj.on);
    }
}

function prepareForComparison(obj) {
    if (typeof obj == "string") {
	return obj.toLowerCase();
    } else {
	return obj.toString();
    }
    return obj;
}