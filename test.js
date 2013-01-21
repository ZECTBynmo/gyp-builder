var builder = require("./gyp-builder").createBuilder( "test", false );

// Write the gyp file to disk
// With no arguments, this creates the file in the current working directory
builder.writeGypFile();