export class ResponseDTO<T> {
	private readonly status: "success" | "error";
	private readonly message: string;
	private readonly code: number;
	private readonly data: T | null;

	constructor(
		status: "success" | "error",
		message: string,
		code: number,
		data: T | null = null,
	) {
		this.status = status;
		this.message = message;
		this.code = code;
		this.data = data;
	}

	static success<T>(message: string, code: number, data: T) {
		return new ResponseDTO("success", message, code, data).toJSON();
	}

	static error(message: string, code: number) {
		return new ResponseDTO("error", message, code, null).toJSON();
	}

	private toJSON() {
		return {
			status: this.status,
			message: this.message,
			code: this.code,
			data: this.data,
		};
	}
}
