/* eslint no-global-assign: off */

/**
 * @param {string} o some log message
 * @returns {void}
 */
export const trace = function (o) {
	if (o) {
		// eslint-disable-next-line no-console
		console.log(o);
	}
};
