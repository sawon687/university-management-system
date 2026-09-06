import { Router } from 'express';
import authController from './auth.controller';


const router=Router()

router.post('/register',authController.createStudent)
router.post('/verified-email',authController.verifayAccount)
router.post('/login',authController.login)

export const authRouter=router