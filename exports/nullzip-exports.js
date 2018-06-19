window['NullZipArchive'] = NullZipArchive;
const NullZipProto = NullZipArchive.prototype;
NullZipProto['createDownloadLink'] = NullZipProto.createDownloadLink;
NullZipProto['createDownloadUrl'] = NullZipProto.createDownloadUrl;
NullZipProto['generate'] = NullZipProto.generate;
NullZipProto['addFileFromString'] = NullZipProto.addFileFromString;
NullZipProto['addFileFromUint8Array'] = NullZipProto.addFileFromUint8Array;

