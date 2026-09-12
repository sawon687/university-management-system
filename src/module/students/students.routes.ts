import { Router } from 'express';
import studentController from './student.controller';
import { auth } from '../../midileware/auth';


const router=Router()

router.patch('/me',auth("STUDENT"),studentController.updateme)
router.get('/me',auth('STUDENT'),studentController.getStudentProfile)
router.post('/application-admission',auth("STUDENT"),studentController.admissionApplication)
router.get('/all-Program',studentController.getAllProgramg)
router.get('/my-application',auth('STUDENT'),studentController.myApplication)
router.post('/student-enrolement',auth('STUDENT'),studentController.studentEnrolement)
router.get('/department/:id/courses',studentController.getAllcourse)

export const studentRouter=router