import { Router } from 'express';
import superAdminController from './super-admin.controller';

const router=Router()

router.post('/department',superAdminController.CreateDepartment)

router.get('/department',superAdminController.getAllDepartment)
router.get('/users',superAdminController.getAllUser)
router.patch('/users/:id/status',superAdminController.updateStatus)
router.patch('/department-admin/:id/assign',superAdminController.departmetnAdminAssign)
export const superAdminRouter=router