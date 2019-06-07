window['NullXlsx'] = NullXlsx;
const NullXlsxProto = NullXlsx.prototype;
NullXlsxProto['createDownloadUrl'] = NullXlsxProto.createDownloadUrl;
NullXlsxProto['createDownloadLink'] = NullXlsxProto.createDownloadLink;
NullXlsxProto['generate'] = NullXlsxProto.generate;
NullXlsxProto['addSheetFromData'] = NullXlsxProto.addSheetFromData;
