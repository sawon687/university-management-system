import { Router } from 'express';
import teachersController from './teachers.controller';
import { auth } from '../../midileware/auth';
import teachersService from './teachers.service';





const router=Router()

router.patch('/set-password',teachersController.setPassoword)
router.patch('/update-teacher-profile',auth("INSTRUCTOR"),teachersController.updateTeacherProfile)
router.post('/mycourse/:id/exam',auth("INSTRUCTOR"),teachersController.myCoursesExamCreated)
router.get('/course/my-assigned',auth('INSTRUCTOR'),teachersController.myCouresAssign)

export const teacherRouter=router