import { NullXlsx } from '..';
import {
	spy,
	assert as sinonAssert
} from 'sinon';
import { assert } from '@open-wc/testing';

suite('basic', () => {
	test('adds sheet from simple data', () => {
		// Creates a test file
		const xlsx = new NullXlsx('test.xlsx');
		xlsx.addSheetFromData([['Title 1', 'Title 2'], ['Carl', 12.4], ['Mia', 678]]);
		assert.deepEqual(xlsx.sheets[0].data[0], ['Title 1', 'Title 2']);
		assert.deepEqual(xlsx.sheets[0].data[1], ['Carl', 12.4]);
		assert.deepEqual(xlsx.sheets[0].data[2], ['Mia', 678]);
	});

	test('createDownloadLink calls generate', () => {
		// Creates a test file
		const xlsx = new NullXlsx('test.xlsx');
		xlsx.addSheetFromData([['Title 1', 'Title 2'], ['Carl', 12.4], ['Mia', 678]]);

		const spyGenerate = spy(xlsx, 'generate'),
			link = xlsx.createDownloadLink('Download test.xlsx');

		sinonAssert.calledOnce(spyGenerate);
		assert.equal(link.download, 'test.xlsx');
	});
});
