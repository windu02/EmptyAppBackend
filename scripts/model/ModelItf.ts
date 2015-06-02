/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../core/Logger.ts" />
/// <reference path="../exceptions/ModelException.ts" />

/**
 * Model Interface
 *
 * @class ModelItf
 */
class ModelItf {

	/**
	 * ID property.
	 *
	 * @property _id
	 * @type number
	 */
	_id : number;

	/**
	 * CreatedAt property.
	 *
	 * @property _createdAt
	 * @type string
	 */
	_createdAt : string;

	/**
	 * UpdatedAt property.
	 *
	 * @property _updatedAt
	 * @type string
	 */
	_updatedAt : string;

	/**
	 * Constructor.
	 *
	 * @param {number} id - The model ID.
	 * @param {string} createdAt - The model createdAt.
	 * @param {string} updatedAt - The model updatedAt.
	 */
	constructor(id : number = null, createdAt : string = null, updatedAt : string = null) {
		if (!id && id !== null) {
			throw new ModelException("The ID cannot be undefined");
		}
		this._id = id;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	/**
	 * Returns ID of model.
	 *
	 * @method getId
	 * @return {number} The model's ID.
	 */
	getId() : number {
		return this._id;
	}

	/**
	 * Returns CreatedAt property of model.
	 *
	 * @method getCreatedAt
	 * @return {string} The model's CreatedAt property.
	 */
	getCreatedAt() : string {
		return this._createdAt;
	}

	/**
	 * Returns UpdatedAt property of model.
	 *
	 * @method getUpdatedAt
	 * @return {string} The model's UpdatedAt property.
	 */
	getUpdatedAt() : string {
		return this._updatedAt;
	}

	/**
	 * Create model in database.
	 *
	 * @method create
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	create(successCallback : Function, failCallback : Function) {
		Logger.error("ModelItf - create : Method need to be implemented.");
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
		Logger.error("ModelItf - read : Method need to be implemented.");
	}

	/**
	 * Update in database the model with current id.
	 *
	 * @method update
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	update(successCallback : Function, failCallback : Function) {
		Logger.error("ModelItf - update : Method need to be implemented.");
	}

	/**
	 * Delete in database the model with current id.
	 *
	 * @method delete
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	delete(successCallback : Function, failCallback : Function) {
		Logger.error("ModelItf - delete : Method need to be implemented.");
	}

	/**
	 * Retrieve all models from database and create corresponding model instances.
	 *
	 * @method all
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.

	 */
	static all(successCallback : Function, failCallback : Function) {
		Logger.error("ModelItf - all : Method need to be implemented.");
	}

	/**
	 * Return a ModelItf instance as a JSON Object
	 *
	 * @method toJSONObject
	 * @returns {Object} a JSON Object representing the instance
	 */
	toJSONObject() : Object {
		var data = {
			"id": this.getId(),
			"createdAt" : this.getCreatedAt(),
			"updatedAt" : this.getUpdatedAt()
		};
		return data;
	}
}