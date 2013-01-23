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
exports.createBuilder = function( name, isNode, outputPath ) { return new Builder(name, isNode, outputPath); }

//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var DEBUG = true,
	log = function( text, isImportant ) { 
		if(DEBUG && isImportant) {
			console.log("\n******************************************")
			console.log("* " + text)
			console.log("******************************************\n")
		} else if(DEBUG) {
			console.log(text); };
		}			

var emptySkeliton = require( __dirname + "/emptySkeliton.js").skeliton,
	fs = require("fs"),
	ares = require("ares").ares;
	ask = require("stdask").ask;


//////////////////////////////////////////////////////////////////////////
// Constructor
function Builder( name, isNode, outputPath ) {
	this.gypObject = emptySkeliton;
	this.isNode = isNode || false;		// Default to non-node configs
	this.name = name || "binding";		// Default our name to binding for node.js
	this.outputPath = outputPath || process.cwd() + "/" + this.name + "/";
} // end builder()


//////////////////////////////////////////////////////////////////////////
// Reset the current gyp object from a skeliton 
Builder.prototype.setSkeliton = function( skeliton ) {
	this.gypObject = skeliton;
} // end setSkeliton()


//////////////////////////////////////////////////////////////////////////
// Replace the current value of some part of the gyp object
// NOTE: This function's arguments are parsed within Builder.getTargetEntry()
Builder.prototype.set = function( /*key1, key2...keyn, value*/ ) {
	// Grab the piece of the git object that we're trying to access
	this.modifyGitObject( arguments, true );
} // end set()


//////////////////////////////////////////////////////////////////////////
// Add a value to some part of the gyp object
// NOTE: This function's arguments are parsed within Builder.getTargetEntry()
Builder.prototype.add = function( /*key1, key2...keyn, value*/ ) {
	// Grab the piece of the git object that we're trying to access
	this.modifyGitObject( arguments, false );
} // end add()


//////////////////////////////////////////////////////////////////////////
// Returns a copy of the target matching some name
Builder.prototype.getTarget = function( name ) {
	var targets = this.gypObject["targets"];

	for( var iTarget=0; iTarget<targets.length; ++iTarget ) {
		if( targets[iTarget]["target_name"] == name )
			return targets[iTarget];
	}
} // end getTarget()


//////////////////////////////////////////////////////////////////////////
// Returns a copy of the target matching some name
Builder.prototype.build = function() {
	log( "CALLING INTO PYTHON GYP SCRIPTS", true );

	var strCommand = "python " 
					+ __dirname + "/gyp_file.py " 	// Script
					+ this.name + " " 				// Project (output) name
					+ process.cwd() + "/" + this.name;	// Location of gyp file

	log( "Calling gyp_file.py with: " + strCommand );
	
	ares( strCommand, DEBUG );
} // end build()


//////////////////////////////////////////////////////////////////////////
// Returns a copy of the target matching some name
Builder.prototype.setTarget = function( target ) {
	var targets = this.gypObject["targets"],
		hasFoundTarget = false;

	for( var iTarget=0; iTarget<targets.length; ++iTarget ) {
		if( targets[iTarget]["target_name"] == target["target_name"] ) {
			targets[iTarget] = target;
			hasFoundTarget
		}
	}

	// If the target didn't already exist, push a new one onto our targets
	if( !hasFoundTarget )
		this.gypObject["targets"].push( target );
} // end setTarget()


//////////////////////////////////////////////////////////////////////////
// Write a gyp file to disk 
Builder.prototype.writeGypFile = function() {
	var _this = this;

	var path = this.outputPath;

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
	    stats = fs.lstatSync( _this.outputPath );

	    log( "Project folder already exists" );

	    // Is it a directory?
	    if( stats.isDirectory() ) {
	        writeFile( path );
	    }
	} catch( error ) {
		log( "Creating directory: " + _this.outputPath );

		// Create the directory
		fs.mkdir( _this.outputPath, function(error) {
			if( error === null ) {
				writeFile( path );
			} else { 
				log(error); 
			}
		});
	}
} // end writeGypFile()


//////////////////////////////////////////////////////////////////////////
// Traverses the gyp object tree and returns a reference to
// the intended value
Builder.prototype.modifyGitObject = function( arguments, shouldOverwrite ) {
	// The last argument is the value we're assigning, so the depth
	// of the value inside the object tree is number of args minus 1
	var depth = arguments.length - 1,
		value = arguments[arguments.length-1];

	switch(arguments.length) {
	case 1:
	  	log( "Gyp object key not provided" );
	  	break;

	case 2:
		if( shouldOverwrite || this.gypObject[ arguments[0] ] === undefined ) {
			this.gypObject[ arguments[0] ] = value;
		} else {
			this.gypObject[ arguments[0] ].push( value );
		}
		break;

	case 3:
		if( shouldOverwrite || this.gypObject[ arguments[0] ][ arguments[1] ] === undefined ) {
			this.gypObject[ arguments[0] ][ arguments[1] ] = value;
		} else {
			this.gypObject[ arguments[0] ][ arguments[1] ].push( value );
		}
		break;

	default:
	  	log( depth + " arguments not handled. Edit Builder.getTargetEntry to add another override");
	  	return;
	}
} // end modifyGitObject()