import type {
	Category,
	Favorite,
	Ingredient,
	Instruction,
	Receipt,
	ReceiptCategory,
	ReceiptIngredient,
	Session,
	User,
} from "@prisma/client";

export type TCreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateUser = Omit<User, "id">;

export type TCreateReceipt = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateReceipt = Omit<User, "id">;

export type TCreateIngredient = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateIngredient = Omit<User, "id">;

export type TCreateReceiptIngredient = Omit<
	User,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateReceiptIngredient = Omit<User, "id">;

export type TCreateInstruction = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateInstruction = Omit<User, "id">;

export type TCreateCategory = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateCategory = Omit<User, "id">;

export type TCreateReceiptCategory = Omit<
	User,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateReceiptCategory = Omit<User, "id">;

export type TCreateFavorite = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateFavorite = Omit<User, "id">;

//* IUser
export interface IUser {
	getAll: () => Promise<User[]>;
	getOne: (id: string) => Promise<User | null>;
	create: (data: TCreateUser) => Promise<User>;
	update: (id: string, data: TUpdateUser) => Promise<User>;
	delete: (id: string) => Promise<void>;
}

//* ISession
export interface ISession {
	getOne: (sessionId: string) => Promise<Session | null>;
	create: (userId: string) => Promise<Session>;
	delete: (sessionId: string) => Promise<void>;
}

//* IReceipt
export interface IReceipt {
	getAll: () => Promise<Receipt[]>;
	getAllbyUser: (userId: string) => Promise<Receipt[]>;
	getOne: (id: string) => Promise<Receipt>;
	getOnebyUser: (id: string, userId: string) => Promise<Receipt>;
	getIngredients: (receiptId: string) => Promise<Ingredient[]>;
	create: (data: TCreateReceipt) => Promise<Receipt>;
	update: (id: string, data: TUpdateReceipt) => Promise<Receipt>;
	delete: (id: string) => Promise<void>;
}

//* IIngredient
export interface IIngredient {
	getAll: () => Promise<Ingredient[]>;
	getOne: (id: string) => Promise<Ingredient>;
	getReceipts: (ingredientId: string) => Promise<Receipt[]>;
	create: (data: TCreateIngredient) => Promise<Ingredient>;
	update: (id: string, data: TUpdateIngredient) => Promise<Ingredient>;
	delete: (id: string) => Promise<void>;
}

//* IReceiptIngredient
export interface IReceiptIngredient {
	getAll: () => Promise<ReceiptIngredient[]>;
	getOne: (id: string) => Promise<ReceiptIngredient>;
	getByReceipt: (receiptId: string) => Promise<ReceiptIngredient[]>; // Semua relasi berdasarkan resep
	getByIngredient: (ingredientId: string) => Promise<ReceiptIngredient[]>; // Semua relasi berdasarkan bahan
	create: (data: TCreateReceiptIngredient) => Promise<ReceiptIngredient>;
	update: (
		id: string,
		data: TUpdateReceiptIngredient,
	) => Promise<ReceiptIngredient>;
	delete: (id: string) => Promise<void>;
}

//* Instruction
export interface IInstruction {
	getAll: () => Promise<Instruction[]>;
	getAllByReceiptId: (receiptId: string) => Promise<Instruction[]>;
	getOne: (id: string) => Promise<Instruction>;
	create: (data: TCreateInstruction) => Promise<Instruction>;
	update: (id: string, data: TUpdateInstruction) => Promise<Instruction>;
	delete: (id: string) => Promise<void>;
}

//* Category
export interface ICategory {
	getAll: () => Promise<Category[]>;
	getAllByReceiptId: (receiptId: string) => Promise<Category[] | undefined>;
	getOne: (id: string) => Promise<Category>;
	create: (data: TCreateCategory) => Promise<Category>;
	update: (id: string, data: TUpdateCategory) => Promise<Category>;
	delete: (id: string) => Promise<void>;
}

//* RecipeCategory
export interface IReceiptCategory {
	getAll: () => Promise<ReceiptCategory[]>;
	getOne: (id: string) => Promise<ReceiptCategory>;
	getByReceiptId: (receiptId: string) => Promise<ReceiptCategory[]>;
	getByCategoryId: (categoryId: string) => Promise<ReceiptCategory[]>;
	create: (data: TCreateReceiptCategory) => Promise<ReceiptCategory>;
	update: (
		id: string,
		data: TUpdateReceiptCategory,
	) => Promise<ReceiptCategory>;
	delete: (id: string) => Promise<void>;
}

//* Favorite
export interface IFavorite {
	getAll: () => Promise<Favorite[]>;
	getByUserId: (userId: string) => Promise<Favorite[]>;
	getByRecipeId: (recipeId: string) => Promise<Favorite[]>;
	getOne: (id: string) => Promise<Favorite>;
	create: (data: TCreateFavorite) => Promise<Favorite>;
	update: (id: string, data: TUpdateFavorite) => Promise<Favorite>;
	delete: (id: string) => Promise<void>;
}
