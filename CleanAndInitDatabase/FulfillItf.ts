/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../scripts/core/Logger.ts" />

/**
 * Fulfill Interface
 *
 * @class FulfillItf
 */
class FulfillItf {

	/**
	 * Method to fulfill database with some Model instances.
	 *
	 * @method fulfill
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	fulfill(successCallback : Function = null, failCallback : Function = null) {
		Logger.error("FulfillItf - fulfill : Method need to be implemented.");
	}
}