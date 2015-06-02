/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

var express : any = require("express");

/**
 * Router Interface
 *
 * @class RouterItf
 */
class RouterItf {

	/**
	 * Router property.
	 *
	 * @property router
	 * @type any
	 */
	router : any;

	/**
	 * Constructor.
	 */
	constructor() {
		this.router = express.Router();

		// middleware specific to this router
		/*this.router.use(function timeLog(req, res, next) {
			console.log('Time: ', Date.now());
			next();
		});*/

		this.buildRouter();
	}

	/**
	 * Return router.
	 *
	 * @method getRouter
	 */
	getRouter() {
		return this.router;
	}

	/**
	 * Method called during Router creation.
	 *
	 * @method buildRouter
	 */
	buildRouter() {
		Logger.warn("RouterItf - buildRouter : Method need to be implemented.");
	}
}