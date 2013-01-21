//////////////////////////////////////////////////////////////////////////
// gyp-builder - Server Side
//////////////////////////////////////////////////////////////////////////
//
// Main module for gyp-builder
//
/* ----------------------------------------------------------------------
                                                    Object Structures
-------------------------------------------------------------------------

	
*/
//////////////////////////////////////////////////////////////////////////
// Node.js Exports
exports.createBuilder = function( name, isNode ) { return new Builder(name, isNode); }

//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var DEBUG = true;
var log = function( text ) { if(DEBUG) console.log(text); };

var skeliton = require("./emptySkeliton").skeliton,
	fs = require("fs");


//////////////////////////////////////////////////////////////////////////
// Constructor
function Builder( name, isNode ) {
	this.gypObject = skeliton;
	this.isNode = isNode;
	this.name = name;

	log( this.gypObject );
} // end builder()


//////////////////////////////////////////////////////////////////////////
// Reset the current gyp object from a skeliton 
Builder.prototype.setSkeliton = function( skeliton ) {
	this.gypObject = skeliton;
} // end setSkeliton()


//////////////////////////////////////////////////////////////////////////
//  Replace the current value of some part of the gyp object
Builder.prototype.set = function( key, value ) {

} // end set()


//////////////////////////////////////////////////////////////////////////
//  Add a value to some part of the gyp object
Builder.prototype.add = function( key, value ) {
	
} // end add()


//////////////////////////////////////////////////////////////////////////
// Write a gyp file to disk 
Builder.prototype.writeGypFile = function( filepath ) {
	var path;

	if( filepath === undefined ) {
		path = "./";
	} else {
		path = filepath;
	}

	console.log("name: " + this.name );

	if( this.isNode ) {
		path += this.name + ".gyp";
	} else {
		path += this.name + ".gyp";
	}
	

	var strGypObject = JSON.stringify( this.gypObject, null, 4 );

	fs.writeFile( path, strGypObject, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 
} // end writeGypFile()