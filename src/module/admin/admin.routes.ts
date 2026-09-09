import { Router } from 'express';

import { auth } from '../../midileware/auth';
import adminController from './admin.controller';



const router=Router()

router.post('/department',adminController.CreateDepartment)
router.post('/create-teacher',adminController.teacherCreate)
router.post('/create-program',adminController.createProgram)
router.patch('/admissions/:id/status',adminController.updateApplicationStatus)
router.get('/department',adminController.getAllDepartment)
router.get('/users',adminController.getAllUser)
router.patch('/users/:id/status',adminController.updateStatus)
router.post('/create-course',adminController.createCourse)
// router.post('/course')


export const adminRouter=router