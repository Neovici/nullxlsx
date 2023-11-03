import { NullXlsx } from '..';
import { spy, assert as sinonAssert } from 'sinon';
import { assert } from '@open-wc/testing';

suite('basic', () => {
	test('adds sheet from simple data', () => {
		// Creates a test file
		const xlsx = new NullXlsx('test.xlsx');
		xlsx.addSheetFromData([
			['Name', 'Number', 'Date'],
			['Carl', 12.4, new Date('2012-01-01')],
			['Mia', 678, new Date('2019-12-31')],
		]);
		assert.deepEqual(xlsx.sheets[0].data[0], ['Name', 'Number', 'Date']);
		assert.deepEqual(xlsx.sheets[0].data[1], [
			'Carl',
			12.4,
			new Date('2012-01-01'),
		]);
		assert.deepEqual(xlsx.sheets[0].data[2], [
			'Mia',
			678,
			new Date('2019-12-31'),
		]);
	});

	test('createDownloadLink calls generate', () => {
		// Creates a test file
		const xlsx = new NullXlsx('test.xlsx');
		xlsx.addSheetFromData([
			['Name', 'Number', 'Date'],
			['Carl', 12.4, new Date('2012-01-01')],
			['Mia', 678, new Date('2019-12-31')],
		]);

		const spyGenerate = spy(xlsx, 'generate'),
			link = xlsx.createDownloadLink('Download test.xlsx');

		sinonAssert.calledOnce(spyGenerate);
		assert.equal(link.download, 'test.xlsx');
	});
});
