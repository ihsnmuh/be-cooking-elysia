import { faker } from "@faker-js/faker";
import { beforeEach, describe, expect, test } from "bun:test";
import { ApiApp } from "..";

describe("API Auth Tests", () => {
	// Test data setup
	const testUsers = {
		valid: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: "USER",
			username: faker.internet.username(),
			password: "ValidPass123!",
		},
		admin: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			role: "ADMIN",
			username: faker.internet.username(),
			password: "AdminPass123!",
		},
	};

	const apiHeaders = {
		"Content-Type": "application/json",
		"api-key": process.env.API_KEY || "default-api-key",
	};

	// Helper function for making requests
	const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
		const url = `http://localhost/api/v1${endpoint}`;
		const defaultOptions = {
			headers: apiHeaders,
			...options,
		};

		if (options.body) {
			defaultOptions.body = options.body;
		}

		return await ApiApp.handle(new Request(url, defaultOptions));
	};

	describe("Authentication - Registration", () => {
		test("should successfully register a new user", async () => {
			const response = await makeRequest("/register", {
				method: "POST",
				body: JSON.stringify(testUsers.valid),
			});

			const result = await response.json();
			expect(response.status).toBe(201);
			expect(result).toEqual({
				status: "success",
				message: "Registered successfully",
				code: 201,
				data: expect.objectContaining({
					id: expect.any(String),
					name: testUsers.valid.name,
					email: testUsers.valid.email,
					avatar: expect.any(String),
				}),
			});
		});

		test("should fail registration with existing email", async () => {
			// First registration
			await makeRequest("/register", {
				method: "POST",
				body: JSON.stringify(testUsers.valid),
			});

			// Attempt duplicate registration
			const response = await makeRequest("/register", {
				method: "POST",
				body: JSON.stringify({
					...testUsers.valid,
					username: faker.internet.username(), // Different username
				}),
			});

			const result = await response.json();
			expect(response.status).toBe(400);
			expect(result).toEqual({
				status: "error",
				message: expect.stringContaining("User Already Register"),
				code: 400,
				data: null,
			});
		});
	});

	describe("Authentication - Login", () => {
		beforeEach(async () => {
			// Create a test user before each login test
			await makeRequest("/register", {
				method: "POST",
				body: JSON.stringify(testUsers.valid),
			});
		});

		test("should successfully login with email", async () => {
			const response = await makeRequest("/login", {
				method: "POST",
				body: JSON.stringify({
					emailOrUsername: testUsers.valid.email,
					password: testUsers.valid.password,
				}),
			});

			const result = await response.json();
			expect(response.status).toBe(200);
			expect(result).toEqual({
				status: "success",
				message: "Login successfully",
				code: 200,
				data: expect.objectContaining({
					sessionId: expect.any(String),
				}),
			});
		});

		test("should successfully login with username", async () => {
			const response = await makeRequest("/login", {
				method: "POST",
				body: JSON.stringify({
					emailOrUsername: testUsers.valid.username,
					password: testUsers.valid.password,
				}),
			});

			const result = await response.json();
			expect(response.status).toBe(200);
			expect(result).toEqual({
				status: "success",
				message: "Login successfully",
				code: 200,
				data: expect.objectContaining({
					sessionId: expect.any(String),
				}),
			});
		});

		test("should fail login with incorrect password", async () => {
			const response = await makeRequest("/login", {
				method: "POST",
				body: JSON.stringify({
					emailOrUsername: testUsers.valid.email,
					password: "falsePass",
				}),
			});

			const result = await response.json();
			expect(response.status).toBe(401);
			expect(result.status).toBe("error");
			expect(result.message).toContain("Invalid Credential");
		});

		test("should fail login with non-existent user", async () => {
			const response = await makeRequest("/login", {
				method: "POST",
				body: JSON.stringify({
					emailOrUsername: "otherUsername",
					password: testUsers.valid.password,
				}),
			});

			const result = await response.json();
			expect(response.status).toBe(404);
			expect(result.status).toBe("error");
			expect(result.message).toBe("User not Found");
		});
	});
});
