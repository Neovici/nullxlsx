/*
 * THIS IS NOT A NODE MODULE!
 * 
 * This file is just here so it can kind of work as one if absolutely needed.
 */

var fs = require('fs');

// Faking some browser stuff 
if(typeof window === "undefined")	
 window = {};

if(!("TextEncoder" in window))
  TextEncoder = function(){
	this.encode = function (str){
		var ret=[];
		for(var i=0;i<str.length;i++){
			var code = str.codePointAt(i);
			if(code < 0x80) ret.push(code);
			else if(code >= 0x10000) ret.push(0xF0 | (code>>18), 0x80 | ((code >> 12) & 63),  0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
			else if(code >= 0x800) ret.push(0xE0 | (code>>12),  0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
			else ret.push(0xC0 | (code>>6), 0x80 | (code & 63));
		}
		return new Uint8Array( ret);
	}
}

// file is included here:
eval(fs.readFileSync('dist/nullboth.min.js')+'');

module.exports = {
	NullXlsx:window.NullXlsx,
	NullZipArchive:window.NullZipArchive
};