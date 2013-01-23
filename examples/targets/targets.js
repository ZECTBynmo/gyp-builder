var ares = require("ares").ares;

var builder = require("../../gyp-builder").createBuilder( "test", false );

var firstTarget = {
	'target_name': 'testTarget1',
  	'type': '<(library)'
}

var secondTarget = {
	'target_name': 'testTarget2',
  	'type': 'executable'
}

// Set our targets
builder.setTarget( firstTarget );
builder.setTarget( secondTarget );

// Write the gyp file to disk
// With no arguments, this creates the file in the current working directory
builder.writeGypFile( __dirname + "/test/" );

// Build the gyp stuff!
builder.build();