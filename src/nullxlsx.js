/* eslint no-unused-vars: off, max-len: off */
import { NullDownloader } from './nulldownloader';
import { NullZipArchive } from './nullzip';

const baseContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml',
	schemaBaseUrl = 'http://schemas.openxmlformats.org',
	mainSpreadSheetSchema = `${ schemaBaseUrl }/spreadsheetml/2006/main`,
	packageSchema = `${ schemaBaseUrl }/package/2006`,
	officeDocumentRelationshipsSchema = `${ schemaBaseUrl }/officeDocument/2006/relationships`,
	numFmts = [{
		id: 164,
		code: 'yyyy&quot;-&quot;mm&quot;-&quot;dd'
	}, {
		id: 165,
		code: 'yyyy&quot;-&quot;mm&quot;-&quot;dd&quot; &quot;h&quot;:&quot;mm&quot;:&quot;ss'
	}];

export class NullXlsx extends NullDownloader {
	/**
	 * Creates a new xlsx file
	 * @param {string} filename Name of file once generated
	 * @param {Object} options Settings
	 */
	constructor(filename, options) {
		super(filename, `${ baseContentType }.sheet`);
		/** @type {Array<{id:number, name:string, data:Array<Array<*>>}>} */
		this.sheets = [];
		this.frozen = !!(options && options['frozen']);
		this.autoFilter = !!(options && options['filter']);
	}

	/**
	 * Create a spreadsheet from an array of arrays of data
	 * @param {Array<Array<*>>} data Cell values
	 * @param {string} name Name of sheet
	 * @return {NullXlsx} Returns itself for method chaining
	 */
	addSheetFromData(data, name) {
		const i = this.sheets.length + 1;
		this.sheets.push({
			id: i,
			name: this.escapeXml(name || 'Sheet' + i),
			data
		});
		return this;
	}

	/**
	 * Generates the xlsx file
	 * @return {ArrayBuffer} Array buffer containing the xlsx
	 */
	generate() {
		const headerXml = [{
				name: 'xl/styles.xml',
				xml: `<styleSheet xmlns="${ mainSpreadSheetSchema }" xmlns:mc="${ schemaBaseUrl }/markup-compatibility/2006">`
					+ `<numFmts count="${ numFmts.length }">${ numFmts.map(f => `<numFmt numFmtId="${ f.id }" formatCode="${ f.code }" />`) }</numFmts>`
					+ '<fonts count="2"><font><sz val="10.0"/><color rgb="FF000000"/><name val="Arial"/></font><font><b/></font></fonts>'
					+ '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="lightGray"/></fill></fills>'
					+ '<borders count="1"><border><left/><right/><top/><bottom/></border></borders>'
					+ '<cellStyleXfs count="1"><xf borderId="0" fillId="0" fontId="0" numFmtId="0" applyAlignment="1" applyFont="1"/></cellStyleXfs>'
					+ '<cellXfs>'
					+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment/></xf>'
					+ '<xf borderId="0" fillId="0" fontId="1" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment/></xf>'
					+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="164" xfId="0" applyAlignment="1" applyFont="1" applyNumberFormat="1"><alignment /></xf>'
					+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="165" xfId="0" applyAlignment="1" applyFont="1" applyNumberFormat="1"><alignment /></xf>'
					+ '</cellXfs><cellStyles count="1"><cellStyle xfId="0" name="Normal" builtinId="0"/></cellStyles><dxfs count="0"/></styleSheet>'
			}, {
				name: 'xl/sharedStrings.xml',
				xml: `<sst xmlns="${ mainSpreadSheetSchema }" count="2" uniqueCount="2"><si><t>text here</t></si></sst>`
			}, {
				name: 'xl/workbook.xml',
				xml: `<workbook xmlns="${ mainSpreadSheetSchema }" xmlns:r="${ officeDocumentRelationshipsSchema }"><workbookPr/><sheets>`
					+ this.sheets.map(sheet => `<sheet state="visible" name="${ sheet.name }" sheetId="${ sheet.id }" r:id="rId${ sheet.id + 2 }"/>`).join('')
					+ '</sheets><definedNames/><calcPr/></workbook>'
			}, {
				name: 'xl/_rels/workbook.xml.rels',
				xml: `<Relationships xmlns="${ packageSchema }/relationships">`
					+ `<Relationship Id="rId1" Type="${ officeDocumentRelationshipsSchema }/styles" Target="styles.xml" />`
					+ `<Relationship Id="rId2" Type="${ officeDocumentRelationshipsSchema }/sharedStrings" Target="sharedStrings.xml"/>`
					+ this.sheets.map(sheet => `<Relationship Id="rId${ sheet.id + 2 }" Type="${ officeDocumentRelationshipsSchema }/worksheet" Target="worksheets/sheet${ sheet.id }.xml"/>`).join('')
					+ '</Relationships>'
			}, {
				name: '[Content_Types].xml',
				xml: `<Types xmlns="${ packageSchema }/content-types"><Default ContentType="application/xml" Extension="xml"/>`
					+ '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>'
					+ this.sheets.map(sheet => `<Override ContentType="${ baseContentType }.worksheet+xml" PartName="/xl/worksheets/sheet${ sheet.id }.xml"/>`).join('')
					+ `<Override ContentType="${ baseContentType }.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>`
					+ `<Override ContentType="${ baseContentType }.styles+xml" PartName="/xl/styles.xml" />`
					+ `<Override ContentType="${ baseContentType }.sheet.main+xml" PartName="/xl/workbook.xml"/></Types>`
			}, {
				name: '_rels/.rels',
				xml: `<Relationships xmlns="${ packageSchema }/relationships"><Relationship Id="rId1" Type="${ officeDocumentRelationshipsSchema }/officeDocument" Target="xl/workbook.xml"/></Relationships>`
			}],
			sheetsXml = this.sheets.map(sheet => {
				let maxLength = 0;

				const rows = sheet.data.map((row, rowIndex) => {
					const style = this.frozen && rowIndex === 0 ? ' s="1"' : '';
					if (row.length > maxLength) {
						maxLength = row.length;
					}
					const cells = row.map((cell, cellIndex) => {
						const cellName = this.colName(cellIndex) + (rowIndex + 1);
						if (typeof cell === 'number') {
							return `<c r="${ cellName }"${ style }><v>${ cell }</v></c>`;
						}
						if (cell instanceof Date) {
							const dateStyle = cell.getHours() || cell.getMinutes() || cell.getSeconds() ? 3 : 2;
							return `<c s="${ dateStyle }"><v>${ this.dateToExcelDate(cell) }</v></c>`;
						}
						return `<c t="inlineStr"${ style }><is><t>${ this.escapeXml(cell.toString()) }</t></is></c>`;
					});
					return `<row r="${ rowIndex + 1 }">${ cells.join('') }</row>`;
				});
				return {
					name: `xl/worksheets/sheet${ sheet.id }.xml`,
					xml: `<worksheet xmlns="${ mainSpreadSheetSchema }"><sheetViews><sheetView workbookViewId="0"`
						+ (this.frozen ? ' tabSelected="1"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView>' : '/>')
						+ '</sheetViews><sheetFormatPr customHeight="1" defaultColWidth="17.5" defaultRowHeight="15.75"/>'
						+ `<sheetData>${ rows.join('') }</sheetData>`
						+ (this.autoFilter ? `<autoFilter ref="A1:${ this.colName(maxLength) }${ sheet.data.length }"/>` : '')
						+ '</worksheet>'
				};
			}),

			// Add all to zip
			zip = new NullZipArchive(this._filename, false);

		[...headerXml,	...sheetsXml].forEach(f => zip.addFileFromString(f.name, f.xml));

		this.buffer = zip.generate();
		return this.buffer;
	}

	/**
		 * Convert column number to Excel name ('A', 'BA' etc)
		 * @private
		 * @param {number} i Column number
		 * @returns {string} Column name
		 */
	colName(i) {
		return i < 26 ? String.fromCharCode(i + 65) : String.fromCharCode(Math.floor(i / 26 + 64)) + String.fromCharCode(Math.floor(i % 26 + 65));
	}

	/**
		 * Escapes reserved xml characters in a string
		 * @param {string} unsafe Text with (possibly) unsafe characters
		 * @return {string} Escaped string
		 */
	escapeXml(unsafe) {
		return unsafe.replace(/[<>&'"]/gu, c =>
			['&lt;', '&gt;', '&amp;', '&apos;', '&quot;']['<>&\'"'.indexOf(c)]
		);
	}

	/**
		 * Creates Excel-dates
		 * @param {Object} date Date object
		 * @return {number} Date in Sxcel format
		 */
	dateToExcelDate(date) {
		const minute = 60 * 1000,
			oneDay = minute * 60 * 24;
		return 25569.0 + (date.getTime() - date.getTimezoneOffset() * minute) / oneDay;
	}
}
