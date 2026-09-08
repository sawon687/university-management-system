import { Router } from 'express';

import { auth } from '../../midileware/auth';
import adminController from './admin.controller';



const router=Router()


router.post('/create-teacher',adminController.teacherCreate)
router.post('/create-program',adminController.createProgram)
router.patch('/admissions/:id/status',adminController.updateApplicationStatus)
// router.post('/course')


export const adminRouter=router