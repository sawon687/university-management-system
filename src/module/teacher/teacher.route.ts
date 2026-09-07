import { Router } from 'express';
import teachersController from './teachers.controller';
import { auth } from '../../midileware/auth';
import teachersService from './teachers.service';





const router=Router()

router.patch('/set-password',teachersController.setPassoword)
router.patch('/update-teacher-profile',auth('TEACHER'),teachersController.updateTeacherProfile)


export const teacherRouter=router