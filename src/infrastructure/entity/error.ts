export class DBError extends Error {
	public status: number;
	public code: "DB_ERROR";

	constructor(message: string) {
		super(message);
		this.status = 500;
		this.code = "DB_ERROR";
	}
}
