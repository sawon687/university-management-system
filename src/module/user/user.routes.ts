import { Router } from 'express';
import { upload } from '../../lib/multer';
import userController from './user.controller';
import { auth } from '../../midileware/auth';

const router = Router();

router.patch(
	"/profile-image",
       auth('ADMIN','INSTRUCTOR','STUDENT'),
	upload.single("profileImage"),
	userController.uploadeProfileImage
);

export const UserRoutes = router;