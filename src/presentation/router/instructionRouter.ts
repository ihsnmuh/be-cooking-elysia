import Elysia, { t } from "elysia";
import { authServices, instructionService } from "../../application/instance";
import { AuthorizationError } from "../../infrastructure/entity/error";

export const InstructionRouter = new Elysia({ prefix: "/v1" })

	// * Get all instructions
	.get(
		"/instructions",
		async ({ set }) => {
			try {
				const allInstructions = await instructionService.getAll();

				return allInstructions;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Fetch all instructions.",
			},
		},
	)

	// * Get all instructions by recipe id
	.get(
		"/instructions/recipe",
		async ({ set, query }) => {
			try {
				const instructions = await instructionService.getAllByRecipeId(
					query.recipeId,
				);

				return instructions;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Fetch all instructions for a given recipe ID.",
			},

			query: t.Object({
				recipeId: t.String(),
			}),
		},
	)

	// * Get one instruction
	.get(
		"/instructions/:instructionId",
		async ({ set, params }) => {
			try {
				const instruction = await instructionService.getOne(
					params.instructionId,
				);

				return instruction;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Fetch one instruction.",
			},

			params: t.Object({
				instructionId: t.String(),
			}),
		},
	)

	// * Create an instruction
	.post(
		"/instructions",
		async ({ set, body }) => {
			try {
				const newInstruction = await instructionService.create({
					recipeId: body.recipeId,
					stepNumber: body.stepNumber,
					text: body.text,
				});

				return newInstruction;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Create a new instruction (Admin only)",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			body: t.Object({
				recipeId: t.String(),
				stepNumber: t.Number(),
				text: t.String(),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	)

	// * Update an instruction
	.patch(
		"/instructions/:instructionId",
		async ({ set, params, body }) => {
			try {
				const updatedInstruction = await instructionService.update(
					params.instructionId,
					{
						stepNumber: body.step,
						text: body.text,
					},
				);

				return updatedInstruction;
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Update an instruction (Admin only).",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			params: t.Object({
				instructionId: t.String(),
			}),

			body: t.Object({
				step: t.Number(),
				text: t.String(),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	)

	// * Delete an instruction
	.delete(
		"/instructions/:instructionId",
		async ({ set, params }) => {
			try {
				await instructionService.delete(params.instructionId);
			} catch (error) {
				set.status = 500;

				if (error instanceof Error) {
					throw new Error(error.message);
				}

				throw new Error("Something went wrong!");
			}
		},
		{
			detail: {
				tags: ["Instructions"],
				description: "Delete an instruction (Admin only).",
			},

			headers: t.Object({
				authorization: t.String({ description: "Bearer token" }),
			}),

			params: t.Object({
				instructionId: t.String(),
			}),

			// * Middleware
			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];

				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);

				if (user.role !== "ADMIN") throw new AuthorizationError("Unauthorized");
			},
		},
	);
