/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="./ModelItf.ts" />

/// <reference path="../core/BackendConfig.ts" />
/// <reference path="../exceptions/ModelException.ts" />

var UserSchema : any = require('./database/models/user.js').schema;

var crypto : any = require('crypto');

/**
 * Model : User
 *
 * @class User
 * @extends ModelItf
 */
class User extends ModelItf {

	/**
	 * Username property.
	 *
	 * @property _username
	 * @type string
	 */
	private _username : string;

	/**
	 * Email property.
	 *
	 * @property _email
	 * @type string
	 */
	private _email : string;

	/**
	 * Token property.
	 *
	 * @property _token
	 * @type string
	 */
	private _token : string;

	/**
	 * LastIp property.
	 *
	 * @property _lastIp
	 * @type string
	 */
	private _lastIp : string;


	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {string} username - The User's username.
	 * @param {string} email - The User's email.
	 * @param {string} createdAt - The Twist's createdAt.
	 * @param {string} updatedAt - The Twist's updatedAt.
	 */
	constructor(username : string = "", email : string = "", id : number = null, createdAt : string = null, updatedAt : string = null) {
		super(id, createdAt, updatedAt);

		this.setUsername(username);
		this.setEmail(email);

		this._token = null;
		this._lastIp = null;
	}

	/**
	 * Set the User's username.
	 *
	 * @method setUsername
	 */
	setUsername(username : string) {
		this._username = username;
	}

	/**
	 * Return the User's username.
	 *
	 * @method username
	 */
	username() {
		return this._username;
	}

	/**
	 * Set the User's email.
	 *
	 * @method setEmail
	 */
	setEmail(email : string) {
		this._email = email;
	}

	/**
	 * Return the User's email.
	 *
	 * @method email
	 */
	email() {
		return this._email;
	}

	/**
	 * Set the User's token.
	 *
	 * @method setToken
	 */
	setToken(token : string) {
		this._token = token;
	}

	/**
	 * Return the User's token.
	 *
	 * @method token
	 */
	token() {
		return this._token;
	}

	/**
	 * Set the User's lastIp.
	 *
	 * @method setLastIp
	 */
	setLastIp(lastIp : string) {
		this._lastIp = lastIp;
	}

	/**
	 * Return the User's lastIp.
	 *
	 * @method lastIp
	 */
	lastIp() {
		return this._lastIp;
	}

	//////////////////// Methods managing model. ///////////////////////////

	/**
	 * Return a User instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt(),
			"username": this.username(),
			"email": this.email(),
			"token": this.token(),
			"lastIp": this.lastIp()
		};
		return data;
	}

	/**
	 * Return a User instance as a JSON Object with its password
	 *
	 * @method toJSONObjectWithPwd
	 * @param {string} password - The password to set in JSON Object description
	 * @returns {Object} a JSON Object representing the instance
	 */
	private toJSONObjectWithPwd(password : string) : Object {
		var data = this.toJSONObject();
		data["password"] = password;
		return data;
	}

	/**
	 * Set a new password to the User and save it in the database.
	 *
	 * @method setPassword
	 * @param {string} password - The new password.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	setPassword(password : string, successCallback : Function, failCallback : Function) {
		if(! (!!password)) {
			failCallback(new ModelException("The password must not be null or undefined or an empty string."));
			return;
		}

		// if the object does not exist yet, we need to create it instead updating!
		if(!this.getId()) {
			failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(this.toJSONObject())));
			return;
		}

		var self = this;


		// search for known ids
		UserSchema.findById(this.getId())
			.then(function(user) {

				var encryptedPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

				user.updateAttributes({"password" : encryptedPwd})
					.then(function() {

						user.save()
							.then(function() {
								successCallback(self);
							})
							.error(function(error) {
								failCallback(error);
							});

					})
					.error(function(error) {
						failCallback(error);
					});

			});
	}

	/**
	 * Check password of the User against password retrieved from the database.
	 *
	 * @method checkPassword
	 * @param {string} password - Password to check.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	checkPassword(password : string, successCallback : Function, failCallback : Function) {
		if(! (!!password)) {
			failCallback(new ModelException("The password must not be null or undefined or an empty string."));
			return;
		}

		// if the object does not exist yet, we need to create it instead updating!
		if(!this.getId()) {
			failCallback(new ModelException("The object does not exist yet. It can't be update. Datas: "+JSON.stringify(this.toJSONObject())));
			return;
		}

		var self = this;

		// search for known ids
		UserSchema.findById(this.getId())
			.then(function(user) {

				var encryptedGivenPwd = crypto.createHash('sha256').update(BackendConfig.getJWTSecret() + password).digest("hex");

				if(!!user.dataValues.password) {
					if(encryptedGivenPwd == user.dataValues.password) {
						var uObject = User.fromJSONObject(user.dataValues);
						successCallback(uObject);
					} else {
						failCallback(new ModelException("Given password is not correct."));
					}
				} else {
					failCallback(new ModelException("The response is a success but the data appears to be erroneous when reading an object \nResponse data: "+JSON.stringify(user.dataValues)));
				}

			})
			.error(function(error) {
				failCallback(error);
			});

	}

	/**
	 * Create model in database.
	 *
	 * @method create
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	create(successCallback : Function, failCallback : Function) {
		var self = this;

		if(this.getId() == null) {
			UserSchema.create(this.toJSONObject())
				.then(function (user) {
					var uObject = User.fromJSONObject(user.dataValues);
					self._id = uObject.getId();

					successCallback(uObject);
				})
				.error(function (error) {
					failCallback(error);
				});
		} else {
			failCallback(new ModelException("User already exists."));
		}
	}

	/**
	 * Retrieve model description from database and create model instance.
	 *
	 * @method read
	 * @static
	 * @param {number} id - The model instance's id.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	static read(id : number, successCallback : Function, failCallback : Function) {
		// search for known ids
		UserSchema.findById(id)
			.then(function(user) {
				var uObject = User.fromJSONObject(user.dataValues);
				successCallback(uObject);
			})
			.error(function(error) {
				failCallback(error);
			});
	}

	/**
	 * Update in database the model with current id.
	 *
	 * @method update
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	update(successCallback : Function, failCallback : Function) {
		var self = this;

		if(this.getId() != null) {
			// search for known ids
			UserSchema.findById(this.getId())
				.then(function (user) {

					user.updateAttributes(self.toJSONObject())
						.then(function () {

							user.save()
								.then(function () {
									successCallback(self);
								})
								.error(function (error) {
									failCallback(error);
								});

						})
						.error(function (error) {
							failCallback(error);
						});

				});
		} else {
			failCallback(new ModelException("You need to create User before to update it."));
		}
	}

	/**
	 * Delete in database the model with current id.
	 *
	 * @method delete
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	delete(successCallback : Function, failCallback : Function) {
		var self = this;

		if(this.getId() != null) {
			UserSchema.findById(this.getId())
				.then(function (user) {

					user.destroy()
						.then(function () {
							var destroyId = self.getId();
							self._id = null;

							successCallback({"id" : destroyId});
						})
						.error(function (error) {
							failCallback(error);
						});

				});
		} else {
			failCallback(new ModelException("You need to create User before to delete it..."));
		}
	}

	/**
	 * Retrieve all models from database and create corresponding model instances.
	 *
	 * @method all
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	static all(successCallback : Function, failCallback : Function) {
		//ModelItf.all(UserSchema, successCallback, failCallback);


		// find multiple entries
		UserSchema.all()
			.then(function(users) {
				var allUsers : Array<User> = new Array<User>();

				users.forEach(function(user : any) {
					allUsers.push(User.fromJSONObject(user.dataValues));
				});

				successCallback(allUsers);
			})
			.error(function(e) {
				failCallback(e);
			});
	}

	/**
	 * Find One User by username.
	 *
	 * @method findOneByUsername
	 * @param {string} username - The User's username
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	static findOneByUsername(username : string, successCallback : Function, failCallback : Function) {

		// search for attributes
		UserSchema.findOne({ where: {"username": username} })
			.then(function(user) {
				var uObject = User.fromJSONObject(user.dataValues);
				successCallback(uObject);
			})
			.error(function(e) {
				failCallback(e);
			});
	}

	/**
	 * Find One User by email.
	 *
	 * @method findOneByEmail
	 * @param {string} email - The User's email
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	static findOneByEmail(email : string, successCallback : Function, failCallback : Function) {
		// search for attributes
		UserSchema.findOne({ where: {"email": email} })
			.then(function(user) {
				var uObject = User.fromJSONObject(user.dataValues);
				successCallback(uObject);
			})
			.error(function(e) {
				failCallback(e);
			});
	}

	/**
	 * Find One User by token.
	 *
	 * @method findOneByToken
	 * @param {string} token - The User's token
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 */
	static findOneByToken(token : string, successCallback : Function, failCallback : Function) {
		// search for attributes
		UserSchema.findOne({ where: {"token": token} })
			.then(function(user) {
				var uObject = User.fromJSONObject(user.dataValues);
				successCallback(uObject);
			})
			.error(function(e) {
				failCallback(e);
			});
	}

	/**
	 * Return a User instance from a JSON string.
	 *
	 * @method parseJSON
	 * @static
	 * @param {string} json - The JSON string
	 * @return {SDI} The model instance.
	 */
	static parseJSON(jsonString : string) : User {
		return User.fromJSONObject(JSON.parse(jsonString));
	}

	/**
	 * Return a User instance from a JSON Object.
	 *
	 * @method fromJSONObject
	 * @static
	 * @param {JSONObject} json - The JSON Object
	 * @return {SDI} The model instance.
	 */
	static fromJSONObject(jsonObject : any) : User {
		var user = new User(jsonObject.username, jsonObject.email, jsonObject.id, jsonObject.createdAt, jsonObject.updatedAt);

		if(!!jsonObject.token) {
			user.setToken(jsonObject.token);
		}

		if(!!jsonObject.lastIp) {
			user.setLastIp(jsonObject.lastIp);
		}

		return user;
	}
}