export class DBError extends Error {
	public status: number;
	public code: "DB_ERROR";

	constructor(message: string) {
		super(message);
		this.status = 500;
		this.code = "DB_ERROR";
	}
}

export class ApplicationError extends Error {
	public status: number;
	public code: string;

	constructor(message: string, status: number, code: string) {
		super(message);
		this.status = status;
		this.code = code;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export class AuthorizationError extends ApplicationError {
	constructor(message: string) {
		super(message, 401, "AUTHORIZATION_ERROR");
	}
}

export class NotFoundError extends ApplicationError {
	constructor(message: string) {
		super(message, 404, "NOTFOUND_ERROR");
	}
}
