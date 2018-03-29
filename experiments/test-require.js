
const nz = require('./index.js'),
	zip = new nz.NullZipArchive('zipfile.zip');

console.info(nz);
console.info(nz.NullZipArchive);
console.info(zip);

zip.addFileFromString('text.txt', 'This is content');
const buffer = zip.generate();

console.info('zip file ' + buffer.length);
