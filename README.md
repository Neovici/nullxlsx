# NullXlsx

[![Build Status](https://travis-ci.org/Neovici/nullxlsx.svg?branch=master)](https://travis-ci.org/Neovici/nullxlsx)
[![Maintainability](https://api.codeclimate.com/v1/badges/64979759c180a78e9a77/maintainability)](https://codeclimate.com/github/Neovici/nullxlsx/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/64979759c180a78e9a77/test_coverage)](https://codeclimate.com/github/Neovici/nullxlsx/test_coverage)

Minimal javascript library to create xlsx files and zip archives

No dependencies, focused on library size only.  
Minimized it's 10k, 3K when zipped.


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
nullzip.min.js | 4k (1.7k) | Only the zip archive creator
nullxlsxonly.min.js | 9.9k (3.3k) | Only the xlsl file creator (the zip parts are in there but not exposed)
nullxlsx.min.js | 10k (3.4k) | Both


### Development

Currently this is a node module, only to get closure compiler neatly integrated. I seriously doubt this would work with "require"...

To prepare, just clone then run `yarn`
Edit the files in src/

To compile run `yarn` again

#### Tests

To run tests locally, run `yarn test`
