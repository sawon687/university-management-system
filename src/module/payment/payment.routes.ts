import { Router } from 'express';
import PaymentController from './Payment.controller';
import { auth } from '../../midileware/auth';






const router=Router()

router.post('/initiate',auth("STUDENT"),PaymentController.createPayment)

export const paymentRouter=router