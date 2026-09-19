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
              resource_type: "image",
              folder: "university-management/profile",
            },
            (error, result) => {
              if (error) {
                console.log("Cloudinary upload error:", error);
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

    console.log("Cloudinary result:", {
      public_id: cloudinaryResult.public_id,
      secure_url: cloudinaryResult.secure_url,
      resource_type: cloudinaryResult.resource_type,
      format: cloudinaryResult.format,
      version: cloudinaryResult.version,
    });

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

    if (currentUser?.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(currentUser.imagePublicId, {
          resource_type: "image",
        });
      } catch (error) {
        console.log("Old image delete failed:", error);
      }
    }

    return updateUser;
  }
}

export default new UserService();
