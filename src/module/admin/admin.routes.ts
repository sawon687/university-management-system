import { Router } from 'express';


import adminController from './admin.controller';
import { auth } from '../../midileware/auth';



const router=Router()

router.post('/department',adminController.CreateDepartment)
router.post('/create-teacher',adminController.teacherCreate)
router.post('/create-program',adminController.createProgram)
router.patch('/admissions/:id/status',adminController.updateApplicationStatus)
router.get('/department',adminController.getAllDepartment)
router.get('/users',adminController.getAllUser)
router.patch('/users/:id/status',adminController.updateStatus)
router.post('/create-course',adminController.createCourse)
router.post('/create-prerequisite', adminController.createPrerequisite)
router.post('/create-semester',adminController.createSemester)
router.patch('/update-semester/:id',adminController.updateSemester)
router.get('/studentadmissionsApplication',adminController.getAllStudenApplication)
router.post('/course/:id/assign',adminController.courseTeacherAssign)
router.get('/all-course', adminController.getALLcourse)
router.get('/all-semester',adminController.getALLSemester)
router.get('/dashboard-stats',auth('ADMIN'),adminController.dashboardStats)



export const adminRouter=router