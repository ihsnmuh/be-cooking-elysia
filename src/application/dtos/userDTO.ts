import type { User } from "@prisma/client";

//? DTO is intermediate layer between bussines logic and presentation,
//? usualy we use for filter privacy data and return it

export class userDTO {
	private user: User;

	constructor(user: User) {
		this.user = user;
	}

	fromEntity() {
		return {
			id: this.user.id,
			name: this.user.name,
			email: this.user.email,
			avatar: this.user.avatar,
		};
	}
}
