import Elysia, { t } from "elysia";
import { authServices, instructionService } from "../../application/instance";
import {
	ApplicationError,
	AuthorizationError,
} from "../../infrastructure/entity/error";
import { ResponseDTO } from "../../application/dtos/responseDTO";

export const instructionRouter = new Elysia({ prefix: "/v1" })

	.guard(
		{
			headers: t.Object({
				authorization: t.TemplateLiteral("Bearer ${string}"),
				"api-key": t.String(),
			}),

			beforeHandle: async ({ headers }) => {
				const sessionId = headers.authorization?.split(" ")[1];
				if (!sessionId) throw new AuthorizationError("Unauthorized");

				const { user } = await authServices.decodeSession(sessionId);
				if (user.role !== "ADMIN")
					throw new AuthorizationError("You are not allow");
			},
		},
		(app) =>
			app

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

							set.status = 201;
							return ResponseDTO.success(
								"create an instruction successfully",
								201,
								newInstruction,
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Instructions"],
							description: "Create a new instruction (Admin only)",
						},

						body: t.Object({
							recipeId: t.String(),
							stepNumber: t.Number(),
							text: t.String(),
						}),
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
									stepNumber: body.stepNumber,
									text: body.text,
								},
							);

							set.status = 200;
							return ResponseDTO.success(
								"update instruction successfully",
								200,
								updatedInstruction,
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Instructions"],
							description: "Update an instruction (Admin only).",
						},

						params: t.Object({
							instructionId: t.String(),
						}),

						body: t.Object({
							stepNumber: t.Number(),
							text: t.String(),
						}),
					},
				)

				// * Delete an instruction
				.delete(
					"/instructions/:instructionId",
					async ({ set, params }) => {
						try {
							await instructionService.delete(params.instructionId);

							set.status = 200;
							return ResponseDTO.success(
								"delete instruction successfully",
								200,
								{ message: "success" },
							);
						} catch (error) {
							if (error instanceof ApplicationError) {
								set.status = error.status;
								return ResponseDTO.error(error.message, error.status);
							}

							set.status = 500;
							const errorMessage =
								error instanceof Error
									? error.message
									: "Something went wrong!";
							return ResponseDTO.error(errorMessage, set.status);
						}
					},
					{
						detail: {
							tags: ["Instructions"],
							description: "Delete an instruction (Admin only).",
						},

						params: t.Object({
							instructionId: t.String(),
						}),
					},
				),
	)

	// * Get all instructions
	.get(
		"/instructions",
		async ({ set }) => {
			try {
				const allInstructions = await instructionService.getAll();

				set.status = 200;
				return ResponseDTO.success(
					"get all instruction successfuly",
					200,
					allInstructions,
				);
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
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

				set.status = 200;
				return ResponseDTO.success(
					"get all instruction recipe successfuly",
					200,
					instructions,
				);
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
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

				set.status = 200;
				return ResponseDTO.success("get instruction", 200, instruction);
			} catch (error) {
				if (error instanceof ApplicationError) {
					set.status = error.status;
					return ResponseDTO.error(error.message, error.status);
				}

				set.status = 500;
				const errorMessage =
					error instanceof Error ? error.message : "Something went wrong!";
				return ResponseDTO.error(errorMessage, set.status);
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
	);
