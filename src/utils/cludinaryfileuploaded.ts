import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary";

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
    resourceType: UploadApiOptions["resource_type"] = "auto",
): Promise<{ url: string; publicId: string }> => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder,
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          if (!uploadResult) {
            return reject(new Error("No result returned from Cloudinary"));
          }
          resolve(uploadResult);
        },
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};
