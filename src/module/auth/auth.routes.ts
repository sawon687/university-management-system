import { Router } from 'express';
import authController from './auth.controller';
import { validationReq } from '../../midileware/validationReq';
import { authValidation } from './auth.validation';


const router=Router()

router.post('/register',validationReq.validate(authValidation.userLoginValidationSchema),authController.createStudent)
router.post('/verified-email',authController.verifayAccount)
router.post('/login',authController.login)

export const authRouter=router