import type {
	Category,
	Favorite,
	Ingredient,
	Instruction,
	Recipe,
	RecipeCategory,
	RecipeIngredient,
	Session,
	User,
} from "@prisma/client";

export type TCreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type TUpdateUser = Partial<User>;

export type TCreateRecipe = Omit<Recipe, "id" | "createdAt" | "updatedAt">;
export type TUpdateRecipe = Omit<Recipe, "id">;

export type TCreateIngredient = Omit<
	Ingredient,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateIngredient = Partial<Ingredient>;

export type TCreateRecipeIngredient = Omit<
	RecipeIngredient,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateRecipeIngredient = Partial<RecipeIngredient>;

export type TCreateInstruction = Omit<
	Instruction,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateInstruction = Partial<Instruction>;

export type TCreateCategory = Omit<Category, "id" | "createdAt" | "updatedAt">;
export type TUpdateCategory = Partial<Category>;

export type TCreateRecipeCategory = Omit<
	RecipeCategory,
	"id" | "createdAt" | "updatedAt"
>;
export type TUpdateRecipeCategory = Partial<RecipeCategory>;

export type TCreateFavorite = Omit<Favorite, "id" | "createdAt" | "updatedAt">;
export type TUpdateFavorite = Partial<Favorite>;

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

//* IRecipe
export interface IRecipe {
	getAll: () => Promise<Recipe[]>;
	getAllbyUser: (userId: string) => Promise<Recipe[]>;
	getOne: (id: string) => Promise<Recipe>;
	getOnebyUser: (id: string, userId: string) => Promise<Recipe>;
	getIngredients: (recipeId: string) => Promise<Ingredient[]>;
	create: (data: TCreateRecipe) => Promise<Recipe>;
	update: (id: string, data: TUpdateRecipe) => Promise<Recipe>;
	delete: (id: string) => Promise<void>;
}

//* IIngredient
export interface IIngredient {
	getAll: () => Promise<Ingredient[]>;
	getOne: (id: string) => Promise<Ingredient>;
	getRecipes: (ingredientId: string) => Promise<Recipe[]>;
	create: (data: TCreateIngredient) => Promise<Ingredient>;
	update: (id: string, data: TUpdateIngredient) => Promise<Ingredient>;
	delete: (id: string) => Promise<void>;
}

//* IRecipeIngredient
export interface IRecipeIngredient {
	getAll: () => Promise<RecipeIngredient[]>;
	getOne: (id: string) => Promise<RecipeIngredient>;
	getByRecipe: (recipeId: string) => Promise<RecipeIngredient[]>; // Semua relasi berdasarkan resep
	getByIngredient: (ingredientId: string) => Promise<RecipeIngredient[]>; // Semua relasi berdasarkan bahan
	create: (data: TCreateRecipeIngredient) => Promise<RecipeIngredient>;
	update: (
		id: string,
		data: TUpdateRecipeIngredient,
	) => Promise<RecipeIngredient>;
	delete: (id: string) => Promise<void>;
}

//* Instruction
export interface IInstruction {
	getAll: () => Promise<Instruction[]>;
	getAllByRecipeId: (recipeId: string) => Promise<Instruction[]>;
	getOne: (id: string) => Promise<Instruction>;
	create: (data: TCreateInstruction) => Promise<Instruction>;
	update: (id: string, data: TUpdateInstruction) => Promise<Instruction>;
	delete: (id: string) => Promise<void>;
}

//* Category
export interface ICategory {
	getAll: () => Promise<Category[]>;
	getAllByRecipeId: (recipeId: string) => Promise<Category[] | undefined>;
	getOne: (id: string) => Promise<Category>;
	create: (data: TCreateCategory) => Promise<Category>;
	update: (id: string, data: TUpdateCategory) => Promise<Category>;
	delete: (id: string) => Promise<void>;
}

//* RecipeCategory
export interface IRecipeCategory {
	getAll: () => Promise<RecipeCategory[]>;
	getOne: (id: string) => Promise<RecipeCategory>;
	getByRecipeId: (recipeId: string) => Promise<RecipeCategory[]>;
	getByCategoryId: (categoryId: string) => Promise<RecipeCategory[]>;
	create: (data: TCreateRecipeCategory) => Promise<RecipeCategory>;
	update: (id: string, data: TUpdateRecipeCategory) => Promise<RecipeCategory>;
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