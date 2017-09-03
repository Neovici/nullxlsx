
var nz = require('./index.js');

console.info(nz);
console.info(nz.NullZipArchive);

var zip = new nz.NullZipArchive('zipfile.zip');
console.info(zip);
zip.addFileFromString('text.txt', 'This is content');
var buffer = zip.generate();

console.info('zip file ' + buffer.length);