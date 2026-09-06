import { Router } from 'express';
import studentController from './student.controller';
import { auth } from '../../midileware/auth';



const router=Router()

router.patch('/me',auth("STUDENT"),studentController.updateme)
// router.get('/me',studentController)


export const studentRouter=router