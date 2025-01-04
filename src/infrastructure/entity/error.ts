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

export class DBError extends ApplicationError {
	constructor(message: string) {
		super(message, 500, "DB_ERROR");
	}
}

export class ValidationError extends ApplicationError {
	constructor(message: string) {
		super(message, 400, "VALIDATION_ERROR");
	}
}

export class UploadError extends ApplicationError {
	constructor(message: string) {
		super(message, 409, "UPLOAD_ERROR");
	}
}
