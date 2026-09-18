import { Router } from "express";
import authController from "./auth.controller";
import { validationReq } from "../../midileware/validationReq";
import { authValidation } from "./auth.validation";
import { authLimiter } from '../../lib/express-authLimite';



const router = Router();

router.post(
	"/register",
	validationReq.validate(authValidation.userRegisterValidationSchema),
	authController.createStudent,
);
router.post("/verified-email",authLimiter, authController.verifayAccount);
router.post("/login",authLimiter, authController.login);
router.post("/google-login", authController.googleLogin);

export const authRouter = router;
