import { Router } from 'express';


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
router.post('/create-prerequisite', adminController.createPrerequisite)
router.post('/create-semester',adminController.createSemester)
router.patch('/update-semester/:id',adminController.updateSemester)
router.get('/studentadmissionsApplication',adminController.getAllStudenApplication)




export const adminRouter=router