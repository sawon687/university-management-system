import { v2 as cloudinary } from "cloudinary";

import config from "../config";

cloudinary.config({
<<<<<<< HEAD
    cloud_name: config.cloudinary_cloud_name,
	api_key: config.cloudinary_api_key,
	api_secret: config.cloudinary_api_secret,
=======
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
>>>>>>> 7ce9eb1 (accepts admissiotn condition)
});

export default cloudinary;