/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

class ModelException implements Error {
	name:string;
	message:string;

	constructor(message: string) {
		this.name = "ModelException";
		this.message = message;
	}
}