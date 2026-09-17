import { Router } from "express";
import teachersController from "./teachers.controller";
import { auth } from "../../midileware/auth";
import teachersService from "./teachers.service";
import { validationReq } from "../../midileware/validationReq";
import { teacherValidation } from "./teacherrs.validation";

const router = Router();

router.patch(
	"/set-password",
	validationReq.validate(teacherValidation.setPasswordValidationSchema),
	teachersController.setPassoword,
);
router.patch(
	"/update-teacher-profile",
	auth("INSTRUCTOR"),
	validationReq.validate(
		teacherValidation.updateTeacherProfileValidationSchema,
	),
	teachersController.updateTeacherProfile,
);
router.post(
	"/mycourse/:id/exam",
	auth("INSTRUCTOR"),
	validationReq.validate(teacherValidation.createExamValidationSchema),
	teachersController.myCoursesExamCreated,
);
router.get(
	"/course/my-assigned",
	auth("INSTRUCTOR"),
	teachersController.myCouresAssign,
);
router.post(
	"/corse-marks/:id",
	auth("INSTRUCTOR"),
	validationReq.validate(teacherValidation.courseMarksValidationSchema),
	teachersController.courseMarks,
);
export const teacherRouter = router;
