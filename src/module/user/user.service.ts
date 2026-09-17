import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../lib/cloudinary";
import { prisma } from "../../lib/pirsma";

class UserService {
	async uploadeProfieImageDB(buffer: Buffer, userId: string) {
		const currentUser = await prisma.users.findUnique({
			where: { id: userId },
			select: {
				imageUrl: true,
				imagePublicId: true,
			},
		});
		const cloudinaryResult = await new Promise<UploadApiResponse>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: "auto",
						},

						async (error, result) => {
							if (error) {
								return reject(error);
							}

							if (!result) {
								return reject(new Error("No result returned from Cloudinary"));
							}

							resolve(result);
						},
					)
					.end(buffer);
			},
		);
		const updateUser = await prisma.users.update({
			where: { id: userId },
			data: {
				imageUrl: cloudinaryResult.secure_url,
				imagePublicId: cloudinaryResult.public_id,
			},
			omit: {
				password: true,
			},
		});

		if (currentUser?.imageUrl && currentUser.imagePublicId) {
			await cloudinary.uploader.destroy(currentUser.imagePublicId);
		}

		return updateUser;
	}
}

export default new UserService();
