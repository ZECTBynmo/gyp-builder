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

var skeliton = require( __dirname + "/emptySkeliton.js").skeliton,
	fs = require("fs"),
	ask = require("stdask").ask;


//////////////////////////////////////////////////////////////////////////
// Constructor
function Builder( name, isNode ) {
	this.gypObject = skeliton;
	this.isNode = isNode;
	this.name = name;

	//log( this.gypObject );
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
Builder.prototype.writeGypFile = function( dir ) {
	var _this = this;

	if( dir === undefined ) {
		dir = __dirname + "/" + this.name + "/";
	}

	var path = dir;

	if( this.isNode ) {
		path += "binding.gyp";
	} else {
		path += this.name + ".gyp";
	}

	var strGypObject = JSON.stringify( this.gypObject, null, 4 );
	
	var writeFile = function(filePath) {
		log( "Writing gyp file " + filePath );
		fs.writeFile( filePath, strGypObject, function(error) {
		    if( error ) {
		        log( error );
		    } else {
		        log( "The file was saved!" );
		    }
		});
	}

	// Figure out whether a directory already exists for this
	// module. If not, create it.
	try {
	    // Query the entry
	    stats = fs.lstatSync( dir );

	    log( "Project folder already exists" );

	    // Is it a directory?
	    if( stats.isDirectory() ) {
	        writeFile( path );
	    }
	} catch( error ) {
		// Create the directory
		fs.mkdir( __dirname + "/" + this.name, function(error) {
			if( error === null ) {
				writeFile( path );
			}
		});
	}	
} // end writeGypFile()