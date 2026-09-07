import { Router } from 'express';

import { auth } from '../../midileware/auth';
import adminController from './admin.controller';



const router=Router()

router.post('/department',adminController.CreateDepartment)
router.post('/create-teacher',adminController.teacherCreate)


export const adminRouter=router