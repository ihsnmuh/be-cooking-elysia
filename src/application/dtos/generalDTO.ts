export class generalDTO<T> {
	private status: "success" | "error";
	private message: string;
	private code: number;
	private data: T;

	constructor(
		status: "success" | "error",
		message: string,
		code: number,
		data: T,
	) {
		this.status = status;
		this.message = message;
		this.code = code;
		this.data = data;
	}

	dataResult() {
		return {
			status: this.status,
			message: this.message,
			code: this.code,
			data: this.data,
		};
	}
}
