/* eslint no-global-assign: off, no-unused-vars: off */

/**
 * @param {string} o some log message
 * @returns {void}
 */
export const trace = function (o) {
	if (o) {
		console.log(o);
	}
};
