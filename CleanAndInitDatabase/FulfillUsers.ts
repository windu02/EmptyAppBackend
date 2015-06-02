/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../scripts/core/Logger.ts" />

/// <reference path="./FulfillItf.ts" />

/// <reference path="../scripts/model/User.ts" />

var crypto : any = require('crypto');

/**
 * Fulfill Users
 *
 * @class FulfillUsers
 * @extends FulfillItf
 */
class FulfillUsers extends FulfillItf {

	/**
	 * Method to fulfill database with some users.
	 *
	 * @method fulfill
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	fulfill(successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var usersNb = 0;

		var users : any = require("./dbInitFiles/users.json");

		if(users.length == 0) {
			Logger.info("No users to create.");
			successCallback();
			return;
		}

		users.forEach(function(userDesc : any) {

			var user = new User(userDesc.username, userDesc.email);

			var successSetPassword = function() {
				Logger.info("User  '" + user.username() + "' : set password successfully.");
				usersNb = usersNb + 1;

				if(usersNb == users.length) {
					successCallback();
				}
			};

			var successUserCreate = function() {
				Logger.info("User '" + user.username() + "' : create successfully. Id : " + user.getId());

				var encryptedPwd = crypto.createHash('sha256').update(userDesc.password).digest("hex");

				user.setPassword(encryptedPwd, successSetPassword, failCallback);
			};

			user.create(successUserCreate, failCallback);
		});
	}

}