/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="./RouterItf.ts" />

/// <reference path="../core/BackendConfig.ts" />
/// <reference path="../model/User.ts" />

var jwt : any = require('jsonwebtoken');
var get_ip : any = require('ipware')().get_ip;

/**
 * UsersRouter class.
 *
 * @class UsersRouter
 * @extends RouterItf
 */
class UsersRouter extends RouterItf {

	/**
	 * Constructor.
	 */
	constructor() {
		super();
	}

	/**
	 * Method called during Router creation.
	 *
	 * @method buildRouter
	 */
	buildRouter() {
		this.router.param('userId', function(req, res, next, userId) {
			var success = function(user) {
				req.user = user;
				next();
			};

			var fail = function(err) {
				next(new Error('Failed to load user'));
			}

			User.read(userId, success, fail);
		});

		this.router.get('/', this.listUsers);

		// define the '/login' route
		this.router.post('/login', this.login);
		// define the '/loginFromToken' route
		this.router.post('/loginFromToken', this.loginFromToken);

		this.router.post('/:userId/', this.updateUser);
	}

	/**
	 * Update a User.
	 *
	 * @method updateUser
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	updateUser(req : any, res : any) {

		if(typeof(req.body.username) != "undefined" && req.body.username != "") {
			req.user.setUsername(req.body.username);

			var success = function(user) {
				res.json(user.toJSONObject());
			};

			var fail = function(error) {
				res.status(500).send({ 'error': JSON.stringify(error) });
			};

			req.user.update(success, fail);
		}

	}

	/**
	 * List Users.
	 *
	 * @method listUsers
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	listUsers(req : any, res : any) {
		Logger.debug("listUsers");

		var success = function(users : Array<User>) {

			var jsonResp = [];

			users.forEach(function(user : User) {
				jsonResp.push(user.toJSONObject());
			});

			res.json(jsonResp);
		};

		var fail = function(error) {
			res.status(500).send({ 'error': JSON.stringify(error) });
		}

		User.all(success, fail);
	}

	/**
	 * User login.
	 *
	 * @method login
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	login(req : any, res : any) {
		var success = function(user) {

			var successCheck = function() {
				var ip_info = get_ip(req);
				// { clientIp: '127.0.0.1', clientIpRoutable: false }
				var clientIp = ip_info.clientIp;

				var profile = {
					username: user.username(),
					ip: clientIp,
					id: user.getId(),
					data: new Date()
				};

				// we are sending the profile in the token
				var token = jwt.sign(profile, BackendConfig.getJWTSecret());

				var successUpdate = function() {
					var jsonResp = {
						token: token,
						user: user.toJSONObject()
					}
					res.json(jsonResp);
				};

				var failUpdate = function(error) {
					res.status(500).send({ 'error': JSON.stringify(error) });
				};

				user.setLastIp(clientIp);
				user.setToken(token);

				user.update(successUpdate, failUpdate);
			};

			var failCheck = function(error) {
				res.status(401).send({ 'error': JSON.stringify(error) });
			};

			user.checkPassword(req.body.password, successCheck, failCheck);
		};

		var fail = function() {

			var fail2 = function (error) {
				res.status(404).send({'error': JSON.stringify(error)});
			};

			User.findOneByEmail(req.body.usernameOrEmail, success, fail2);
		};

		User.findOneByUsername(req.body.usernameOrEmail, success, fail);
	}

	/**
	 * User login from Token.
	 *
	 * @method loginFromToken
	 * @param {Express.Request} req - Request object.
	 * @param {Express.Response} res - Response object.
	 */
	loginFromToken(req : any, res : any) {
		var success = function(user) {

			var now : any = new Date();
			var lastUserUpdated : any = new Date(user.getUpdatedAt());
			var diffDate = now - lastUserUpdated;

			if( !req.body.tmp || ( diffDate <= 1000*60*60*2 ) ) {

				var ip_info = get_ip(req);
				// { clientIp: '127.0.0.1', clientIpRoutable: false }
				var clientIp = ip_info.clientIp;

				var profile = {
					username: user.username(),
					ip: clientIp,
					id: user.getId(),
					data: new Date()
				};

				// we are sending the profile in the token
				var token = jwt.sign(profile, BackendConfig.getJWTSecret());

				var successUpdate = function () {
					var jsonResp = {
						token: token,
						user: user.toJSONObject()
					}
					res.json(jsonResp);
				};

				var failUpdate = function (error) {
					res.status(500).send({'error': JSON.stringify(error)});
				};

				user.setLastIp(clientIp);
				user.setToken(token);

				user.update(successUpdate, failUpdate);
			} else {
				res.status(401).send({'error': 'Session expired.'});
			}
		};

		var fail = function(error) {
			res.status(404).send({ 'error': JSON.stringify(error) });
		}

		User.findOneByToken(req.body.token, success, fail);
	}
}