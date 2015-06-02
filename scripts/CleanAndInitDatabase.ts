/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="./core/Logger.ts" />
/// <reference path="./core/LoggerLevel.ts" />

/// <reference path="./model/ModelItf.ts" />
/// <reference path="./model/User.ts" />

//////////////// BEGIN: MANAGE COLORS LIB FOR LOGGER ///////////////////

var colors : any;

try {
	colors = require('colors');
} catch(e) {
	var returnFunc = function (str) {
		return str;
	};

	String.prototype["green"] = returnFunc;
	String.prototype["blue"] = returnFunc;
	String.prototype["orange"] = returnFunc;
	String.prototype["red"] = returnFunc;
}

//////////////// END:   MANAGE COLORS LIB FOR LOGGER ///////////////////

var crypto : any = require('crypto');

/**
 * Class to clean and Initialise Database with some data.
 *
 * @class CleanAndInitDatabase
 */
class CleanAndInitDatabase {

	static toCleanUsers : Array<any> = [User];

	/**
	 * Method to clean and fulfill database with some data.
	 *
	 * @method run
	 * @param (Array<String>) runParams - Params to configure steps to do during Database Initialization
	 */
	run(runParams : Array<string>) {
		var self = this;

		var success = function() {
			Logger.info("Good job Rogue group!");
		};

		var fail = function(err) {
			Logger.error("Une erreur est survenue...");

			if(err) {
				Logger.error(err);
			}

			process.exit(0);
		};

		if(runParams.length > 2) {
			for(var i = 2; i < runParams.length; i++) {
				var param = runParams[i];
				var keyVal = param.split("=");
				if (keyVal.length > 1) {
					if (keyVal[0] == "step") {
						switch (keyVal[1]) {
							case "users" :
								self.cleanAndInitForUsers(success, fail);
								break;
							case "all" :
									self.cleanAndInitForUsers(success, fail);
								break;
							default :
								Logger.info("Nothing to do !?");
						}
						break;
					}
				}
			}
		} else {
			Logger.error("Missing some arguments !?");
		}
	}

	/**
	 * Method to clean and init database for users.
	 *
	 * @method cleanAndInitForUsers
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	cleanAndInitForUsers(successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var success = function() {
			successCallback();
		};

		var fail = function(err) {
			failCallback(err);
		};

		var successCleanAllUsers = function() {
			self.fulfillUsers(success, fail);
		};
		self.cleanAll(CleanAndInitDatabase.toCleanUsers, successCleanAllUsers, fail);
	}

	/**
	 * Method to fulfill database with users.
	 *
	 * @method fulfillUsers
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	fulfillUsers(successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var usersNb = 0;

		var users : any = require("../dbInitFiles/users.json");

		if(users.length == 0) {
			Logger.info("No users to create.");
			successCallback();
			return;
		}

		users.forEach(function(userDesc : any) {

			var fail = function (err) {
				failCallback(err);
			};

			var user = new User(userDesc.username, userDesc.email);

			var successSetPassword = function() {
				Logger.info("User set password successfully.");
				usersNb = usersNb + 1;

				if(usersNb == users.length) {
					successCallback();
				}
			};

			var successUserCreate = function() {
				Logger.info("User create successfully.");

				var encryptedPwd = crypto.createHash('sha256').update(userDesc.password).digest("hex");

				user.setPassword(encryptedPwd, successSetPassword, fail);
			};

			user.create(successUserCreate, fail);

		});
	}

	/**
	 * Method to retrieve User.
	 *
	 * @method retrieveUser
	 * @param {JSON Object} userDesc - The User's description
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	retrieveUser(userDesc : any, successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		var fail = function (err) {
			failCallback(err);
		};

		var successAll = function(allUsers) {
			var user = null;
			allUsers.forEach(function(u : User) {
				if(u.username() == userDesc.username) {
					user = u;
				}
			});

			if(user == null) {
				failCallback(new Error("The User '" + userDesc.username + "' doesn't exist !"));
			} else {
				successCallback(user);
			}
		};

		User.all(successAll, fail);
	}

	/**
	 * Method to clean selected tables in database.
	 *
	 * @method cleanAll
	 * @params (Array<any>) models - models to clean.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	cleanAll(models : Array<any>, successCallback : Function = null, failCallback : Function = null) {
		var self = this;

		if(models.length == 0) {
			Logger.info("No models to clean.");
			successCallback();
			return;
		}

		var nbModels = 0;

		var fail = function (err) {
			failCallback(err);
		};

		var successAll = function(instances) {

			if(instances.length == 0) {
				Logger.info("Nothing to clean.");
				nbModels = nbModels + 1;

				if(nbModels == models.length) {
					Logger.info("All models were clean.");
					successCallback();
				}
			} else {

				var nbInstances = 0;
				instances.forEach(function (toDelete : any) {
					var deleteSuccess = function () {
						Logger.info("Instance delete successfully.");
						nbInstances = nbInstances + 1;

						if(nbInstances == instances.length) {
							Logger.info("Model clean !");
							nbModels = nbModels + 1;

							if(nbModels == models.length) {
								Logger.info("All models were clean.");
								successCallback();
							}
						}
					};

					toDelete.delete(deleteSuccess, fail);
				});
			}
		};

		Logger.info("Iterating on models to clean");
		models.forEach(function(modelToClean) {
			Logger.info("Cleaning : " + modelToClean.getTableName());

			modelToClean.all(successAll, fail);
		});
	}
}

try {
	var logLevel = LoggerLevel.Error;

	if(process.argv.length > 2) {
		for(var i = 2; i < process.argv.length; i++) {
			var param = process.argv[i];
			var keyVal = param.split("=");
			if (keyVal.length > 1) {
				if (keyVal[0] == "loglevel") {
					switch (keyVal[1]) {
						case "error" :
							logLevel = LoggerLevel.Error;
							break;
						case "warning" :
							logLevel = LoggerLevel.Warning;
							break;
						case "info" :
							logLevel = LoggerLevel.Info;
							break;
						case "debug" :
							logLevel = LoggerLevel.Debug;
							break;
						default :
							logLevel = LoggerLevel.Error;
					}
				}
				if(keyVal[0] == "dbhost") {
					process.env["BGU_DATABASE_HOST"] = keyVal[1];
				}
			}
		}
	}

	Logger.setLevel(logLevel);

	var caid = new CleanAndInitDatabase();
	caid.run(process.argv);
} catch (e) {
	console.log(e);
	throw e;
}
