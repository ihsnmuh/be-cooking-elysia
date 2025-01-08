import Elysia, { t } from "elysia";
import { v2 as cloudinary } from "cloudinary";
import {
	ApplicationError,
	UploadError,
} from "../../infrastructure/entity/error";
import { unlink } from "node:fs/promises";
import { ResponseDTO } from "../../application/dtos/responseDTO";

export const uploadRouter = new Elysia({ prefix: "/v1" })

	// * Upload Image on Cloudinary
	.post(
		"/upload",
		async ({ set, body }) => {
			try {
				const { image, location } = body;
				const imageName = image.name.toLowerCase();
				const imageSize = image.size;
				const imageType = image.type;

				// Validate file type
				if (
					imageType !== "image/png" &&
					imageType !== "image/jpeg" &&
					imageType !== "image/jpg"
				) {
					set.status = 415;
					throw new UploadError("Image type not supported");
				}

				// Validate file size
				if (imageSize > 200000) {
					throw new UploadError("Size exceeds 500KB");
				}

				const uploadPath = `./public/images/${imageName}`;

				// Save the file
				await Bun.write(uploadPath, image);

				// * Upload image to cloudinary from local storage
				const result = await cloudinary.uploader.upload(uploadPath, {
					folder: `images/${location}`,
					overwrite: true,
					use_filename: true,
				});

				if (result) {
					//* Delete the file from local storage
					await unlink(uploadPath);
				}

				return ResponseDTO.success("Image uploaded successfully", 200, {
					url: result.secure_url,
				});
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
			body: t.Object({
				image: t.File(),
				location: t.String(),
			}),
		},
	);
