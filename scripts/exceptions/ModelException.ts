/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

class ModelException implements Error {
	name:string;
	message:string;

	constructor(message: string) {
		this.message = message;
	}
}