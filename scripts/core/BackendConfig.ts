/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../libsdef/node.d.ts" />
/// <reference path="./Logger.ts" />

var fs = require('fs');

/**
 * Contains Backend Configuration information.
 *
 * @class BackendConfig
 */
class BackendConfig {

    /**
     * JWT Secret key.
     *
     * @property jwtSecret
     * @type string
     * @static
     */
    static jwtSecret : string = "";

    /**
     * Retrieve configuration information from file description.
     *
     * @method retrieveConfigurationInformation
     * @static
     */
    static retrieveConfigurationInformation() {
        if(BackendConfig.jwtSecret == "") {
            var file = __dirname + '/backend_config.json';

			if(process.env.JWT_SECRET) {
				BackendConfig.jwtSecret = process.env.JWT_SECRET;
			} else {
				try {
					var configInfos = JSON.parse(fs.readFileSync(file, 'utf8'));
					BackendConfig.jwtSecret = configInfos.jwtSecret;
				} catch (e) {
					Logger.error("Backend configuration file can't be read.");
					Logger.debug(e);
				}
			}
        }
    }

    /**
     * Return JWT Secret key.
     *
     * @method getJWTSecret
     * @static
     * @return {string} - JWT Secret key.
     */
    static getJWTSecret() : string {
        BackendConfig.retrieveConfigurationInformation();
        return BackendConfig.jwtSecret;
    }
}