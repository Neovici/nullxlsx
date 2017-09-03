# NullXlsx



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

To prepare, just clone then `npm install`.  
Edit the files in src/

To compile run `node build.js`

#### Tests

No automatic tests yet, but check out the "demo" directory. All those pages should work. 