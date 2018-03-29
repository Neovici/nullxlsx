trace = trace || function (o) {};

class NullXlsx {
	/**
		 * Creates a new xlsx file
		 * @param {string} filename Name of file once generated
		 * @param {Object} options Settings
		 */
	constructor(filename, options) {
		this.filename = filename;
		/** @type {Array<{id:number, name:string, data:Array<Array<*>>}>} */
		this.sheets = [];
		this.frozen = !!(options && options['frozen']);
		this.autoFilter = !!(options && options['filter']);
		this.buffer = null;
		this.lastDownloadBlobUrl = null;
	}

	/**
		 * Create a spreadsheet from an array of arrays of data
		 * @param {Array<Array<*>>} data Cell values
		 * @param {string} name Name of sheet
		 * @return {NullXlsx} Returns itself for method chaining
		 */
	addSheetFromData(data, name) {
		var i = this.sheets.length + 1;
		this.sheets.push({ id: i, name: this.escapeXml(name || 'Sheet' + i), data: data });
		return this;
	}

	/**
		 * Generates the xlsx file
		 * @return {ArrayBuffer} Array buffer containing the xlsx
		 */
	generate() {
		var files = [],
			f,
			zip = new NullZipArchive(this.filename, false),
			xmlh = '';

		files.push(f = {name: 'xl/styles.xml'});
		f.xml = xmlh + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
						+ '<numFmts count="2"><numFmt numFmtId="164" formatCode="yyyy&quot;-&quot;mm&quot;-&quot;dd" /><numFmt numFmtId="165" formatCode="yyyy&quot;-&quot;mm&quot;-&quot;dd&quot; &quot;h&quot;:&quot;mm&quot;:&quot;ss" /></numFmts>'
						+ '<fonts count="2"><font><sz val="10.0"/><color rgb="FF000000"/><name val="Arial"/></font><font><b/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="lightGray"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/></border></borders>'
						+ '<cellStyleXfs count="1"><xf borderId="0" fillId="0" fontId="0" numFmtId="0" applyAlignment="1" applyFont="1"/></cellStyleXfs>'
						+ '<cellXfs>'
						+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment/></xf>'
						+ '<xf borderId="0" fillId="0" fontId="1" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment/></xf>'
						+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="164" xfId="0" applyAlignment="1" applyFont="1" applyNumberFormat="1"><alignment /></xf>'
						+ '<xf borderId="0" fillId="0" fontId="0" numFmtId="165" xfId="0" applyAlignment="1" applyFont="1" applyNumberFormat="1"><alignment /></xf>'
						+ '</cellXfs><cellStyles count="1"><cellStyle xfId="0" name="Normal" builtinId="0"/></cellStyles><dxfs count="0"/></styleSheet>';

		files.push(f = {name: 'xl/sharedStrings.xml'});
		f.xml = xmlh + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">'
						+ '<si><t>text here</t></si>'
						+ '</sst>';

		files.push(f = {name: 'xl/workbook.xml'});
		f.xml = xmlh + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><workbookPr/><sheets>'
						+ this.sheets.map(x => `<sheet state="visible" name="${x.name}" sheetId="${x.id}" r:id="rId${x.id + 2}"/>`).join('')
				+ '</sheets><definedNames/><calcPr/></workbook>';

		files.push(f = {name: 'xl/_rels/workbook.xml.rels'});
		f.xml = xmlh + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
						+ '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml" />'
						+ '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
						+ this.sheets.map(x => `<Relationship Id="rId${x.id + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${x.id}.xml"/>`).join('')
						+ '</Relationships>';

		files.push(f = {name: '[Content_Types].xml'});
		f.xml = xmlh + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default ContentType="application/xml" Extension="xml"/>'
						+ '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>'
						+ this.sheets.map(x => `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${x.id}.xml"/>`).join('')
						+ '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/>'
						+ '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml" />'
						+ '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/></Types>';

		files.push(f = {name: '_rels/.rels'});
		f.xml = xmlh + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';

		for (let x of this.sheets) {
			let maxLength = 0;
			files.push(f = { name: `xl/worksheets/sheet${x.id}.xml` });
			f.xml = xmlh + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"'
								+ (this.frozen ? ' tabSelected="1"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView>' : '/>')
								+ '</sheetViews><sheetFormatPr customHeight="1" defaultColWidth="17.5" defaultRowHeight="15.75"/><sheetData>';
			const data = x.data;
			for (let r = 1; r <= data.length; r++) {
				f.xml += '<row r="' + r + '">';
				const style = this.frozen && r === 1 ? ' s="1"' : '',
					row = data[r - 1];
				if (row.length > maxLength) {
					maxLength = row.length;
				}
				for (let c = 0; c < row.length; c++) {
					const value = row[c],
						cellName = this.colName(c) + r;
					if (typeof value === 'number') {
						f.xml += `<c r="${cellName}"${style}><v>${value}</v></c>`;
					} else if (value instanceof Date) {
						let dateStyle = value.getHours() || value.getMinutes() || value.getSeconds() ? 3 : 2;
						f.xml += `<c s="${dateStyle}"><v>${this.dateToExcelDate(value)}</v></c>`;
					} else {
						f.xml += `<c t="inlineStr"${style}><is><t>${this.escapeXml(value.toString())}</t></is></c>`;
					}
				}
				f.xml += '</row>';
			}
			f.xml += '</sheetData>';
			if (this.autoFilter) {
				f.xml += `<autoFilter ref="A1:${this.colName(maxLength)}${data.length}"/>`;
			}
			f.xml += '</worksheet>';
		}

		// Add all to zip
		files.forEach(function (f) {
			zip.addFileFromString(f.name, f.xml);
		});

		this.buffer = zip.generate();
		return this.buffer;
	}

	/**
		 * Creates an ObjectURL blob containing the generated xlsx
		 * @return {?string} ObjectURL to xlsx
		 */
	createDownloadUrl() {
		if (!this.buffer) {
			this.generate();
		}
		var downloadBlob = new Blob([this.buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		if (this.lastDownloadBlobUrl) {
			window.URL.revokeObjectURL(this.lastDownloadBlobUrl);
		}
		this.lastDownloadBlobUrl = URL.createObjectURL(downloadBlob);
		return this.lastDownloadBlobUrl;
	}

	/** Create download <a> (or update existing)
		* @param {(string|Element)} linkText Existing link object or text to set on new link
		* @return {!Element} Link object */
	createDownloadLink(linkText) {
		var link = linkText instanceof HTMLAnchorElement ? linkText : document.createElement('a');
		if (typeof linkText === 'string') {
			link.innerHTML = linkText;
		}
		link.href = this.createDownloadUrl();
		link.download = this.filename;
		if (!link.hasChildNodes) {
			link.innerText = this.filename;
		}
		trace('Link created for file ' + this.filename);
		return link;
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
		return unsafe.replace(/[<>&'"]/g, function (c) {
			return ['&lt;', '&gt;', '&amp;', '&apos;', '&quot;']['<>&\'"'.indexOf(c)];
		});
	}

	/**
		 * Creates Excel-dates
		 * @param {Object} date Date object
		 * @return {number} Date in Sxcel format
		 */
	dateToExcelDate(date) {
		return 25569.0 + (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24);
	}
}
