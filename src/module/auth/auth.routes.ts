import { Router } from "express";
import authController from "./auth.controller";
import { validationReq } from "../../midileware/validationReq";
import { authValidation } from "./auth.validation";
import { authLimiter } from "../../lib/express-authLimite";
import { auth } from '../../midileware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post(
  "/register",
  validationReq.validate(authValidation.userRegisterValidationSchema),
  authController.createStudent,
);
router.post("/verified-email",  authController.verifayAccount);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.get('/getme',auth(Role.STUDENT,Role.INSTRUCTOR,Role.ADMIN), authController.getMe)
router.patch('/update-password',validationReq.validate(authValidation.resetPasswordSchema),authController.updatePassword)
router.post('/logout',authController.logout)


export const authRouter = router; 
