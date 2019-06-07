import * as nz from '../';
const zip = new nz.NullZipArchive('test.xlsx');

console.info(nz);
console.info(nz.NullZipArchive);
console.info(zip);

zip.addFileFromString('text.txt', 'This is content');
const buffer = zip.generate();

console.info('zip file ' + buffer.byteLength);
