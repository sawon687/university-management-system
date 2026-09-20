import { Router } from "express";

import adminController from "./admin.controller";
import { auth } from "../../midileware/auth";
import { validationReq } from "../../midileware/validationReq";
import { adminValidation } from "./admin.validation";

const router = Router();

router.post(
  "/department",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createDepartmentValidationSchema),
  adminController.CreateDepartment,
);
router.post(
  "/create-teacher",
  auth("ADMIN"),
  validationReq.validate(adminValidation.instructorcreateValidationSchema),
  adminController.teacherCreate,
);
router.post(
  "/create-program",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createProgramValidationSchema),
  adminController.createProgram,
);
router.patch(
  "/admissions/:id/status",
  auth("ADMIN"),
  validationReq.validate(
    adminValidation.updateApplicationStatusValidationSchema,
  ),
  adminController.updateApplicationStatus,
);
router.get("/department", adminController.getAllDepartment);
router.get("/users", adminController.getAllUser);
router.patch(
  "/users/:id/status",
  auth("ADMIN"),
  validationReq.validate(adminValidation.updateUserStatusValidationSchema),
  adminController.updateStatus,
);
router.post(
  "/create-course",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createCourseValidationSchema),
  adminController.createCourse,
);
router.post(
  "/create-prerequisite",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createPrerequisiteValidationSchema),
  adminController.createPrerequisite,
);
router.post(
  "/create-semester",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createSemesterValidationSchema),
  adminController.createSemester,
);
router.patch(
  "/update-semester/:id",
  auth("ADMIN"),
  adminController.updateSemester,
);
router.get(
  "/studentadmissionsApplication",
  auth("ADMIN"),
  adminController.getAllStudenApplication,
);
router.post("/course/:id/assign", adminController.courseTeacherAssign);
router.get("/all-course", auth("ADMIN"), adminController.getALLcourse);
router.get("/all-semester", adminController.getALLSemester);
router.get("/dashboard-stats", auth("ADMIN"), adminController.dashboardStats);
router.patch("/users/:id/role", auth("ADMIN"), adminController.userUpdateRole);
router.delete("/users/:id", auth("ADMIN"), adminController.userDelete);
router.get("/audit-logs", auth("ADMIN"), adminController.auditlog);

export const adminRouter = router;
