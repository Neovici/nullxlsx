console.info('Starting compiling of all 3 distributables...');

var zlib = require('zlib');
var fs = require('fs');
var ClosureCompiler = require('google-closure-compiler').compiler;
const { Transform } = require('stream');

// Simple stream to count data
class Counter extends Transform {
	constructor(options) {
		super(options);
		this.count=0;
	}
	_transform(data, encoding, callback) {
		this.count+=data.byteLength;	  
		callback(null,data);
	}
}

function Report(name){
	return function showResult(exitCode, stdOut, stdErr) {
		if (exitCode === 0) {
			console.info(name+': Success');
			if (stdOut)
				console.info('=== Output recorded ===:\n' + stdOut);
			if (stdOut)
				console.info('=== Warnings recorded ===:\n' + stdErr);			
			
			// gzip just to see "real" size
			var minSize = fs.statSync('./dist/'+name+'.min.js').size;
			var gzip = zlib.createGzip();
			var r = fs.createReadStream('./dist/'+name+'.min.js');
			var w = new Counter();
			w.on('finish', () => console.log(name+': size minified: '+minSize+' bytes (gz: '+w.count+')'));
			r.pipe(gzip).pipe(w);
		} else {
			console.info(name+': Exit code: ' + exitCode);
			console.info(stdOut + '\n' + stdErr);
		}
	};
}

// Kick of 3 compilers
new ClosureCompiler([
	'--warning_level=VERBOSE',
	'--jscomp_warning=lintChecks',
	'--compilation_level=ADVANCED',
	'--js=src/nullzip.js',
	'--js=src/nullxlsx.js',
	'--js=exports/nullzip-exports.js',
	'--js=exports/nullxlsx-exports.js',
	'--js_output_file=dist/nullxlsx.min.js',
	'--create_source_map=sourcemap/nullxlsx.min.js.map',
]).run(Report('nullxlsx'));

new ClosureCompiler([
	'--jscomp_warning=lintChecks',
	'--compilation_level=ADVANCED',
	'--js=src/nullzip.js',
	'--js=exports/nullzip-exports.js',
	'--js_output_file=dist/nullzip.min.js',
	'--create_source_map=sourcemap/nullzip.min.js.map',
]).run(Report('nullzip'));

new ClosureCompiler([
	'--jscomp_warning=lintChecks',
	'--compilation_level=ADVANCED',
	'--js=src/nullzip.js',
	'--js=src/nullxlsx.js',
	'--js=exports/nullxlsx-exports.js',
	'--js_output_file=dist/nullxlsxonly.min.js',
	'--create_source_map=sourcemap/nullxlsxonly.min.js.map',
]).run(Report('nullxlsxonly'));
