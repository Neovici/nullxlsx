NullXlsx
========

[![Build Status](https://travis-ci.org/Neovici/nullxlsx.svg?branch=master)](https://travis-ci.org/Neovici/nullxlsx)
[![Maintainability](https://api.codeclimate.com/v1/badges/64979759c180a78e9a77/maintainability)](https://codeclimate.com/github/Neovici/nullxlsx/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/64979759c180a78e9a77/test_coverage)](https://codeclimate.com/github/Neovici/nullxlsx/test_coverage)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-not_published-red.svg)](https://www.webcomponents.org/element/Neovici/nullxlsx)

Minimal JavaScript library to create XLSX spreadsheet and ZIP archive files.

No dependencies, focused on library size only. Weights 10k minimized, 3k zipped.

### Example usage

```javascript
// Data should be array of arrays
var data = [['Title 1', 'Title 2'], 
	['Carl', 12.4, new Date(2017, 7 - 1, 10)], 
	['Mia', 678, new Date()]
];

// Create xlsx
var xlsx = new NullXlsx('test.xlsx')
	.addSheetFromData(data, 'Sheet name');

// Generate a link to download the file
document.body.appendChild(xlsx.createDownloadLink('Download test.xlsx'));
```

### Distributables
The "dist" directory has three files:  

File | Size (gz) |  Description
--- | --- | ---
nullzip.min.js | 4k (1.7k) | ZIP creator only
nullxlsxonly.min.js | 9.9k (3.3k) | XLSX creator only (ZIP parts are there but not exposed)
nullxlsx.min.js | 10k (3.4k) | Both

### Development

Currently this is a node module, only to get closure compiler neatly integrated.

There is a doubt that this works with "require".

Make a clone and then run `yarn` to prepare.

Edit the files in src/.

Compile again by re-running `yarn`.

#### Tests

To run tests locally, run `yarn test`.
