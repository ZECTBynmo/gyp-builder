gyp-builder allows you to generate and build gyp files (for node or python) programmatically. It's useful for projects where you have some boilerplate code, and you want to create a new project with a specially configured gyp file.

Installation
```
npm install gyp-builder
```

Usage
```JavaScript
// We want to create a new project in a folder. We need to settle on a 
// project name, so that the builder can setup files and folders accordingly
var projectName = "TestProject"

// First we need to create our builder. It comes with an empty gyp 'skeliton' loaded.
var builder = require("gyp-builder").createBuilder( projectName, false );

// Create two target objects
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
builder.writeGypFile( __dirname + "/" + projectName + "/" );

// Build the gyp stuff!
builder.build();
```