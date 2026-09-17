import { Router } from "express";
import studentController from "./student.controller";
import { auth } from "../../midileware/auth";
import { validationReq } from "../../midileware/validationReq";
import { studentValidation } from "./stuent.validation";

const router = Router();

router.patch(
	"/me",
	auth("STUDENT"),
	validationReq.validate(studentValidation.studentProfileValidationSchema),
	studentController.updateme,
);
router.get("/me", auth("STUDENT"), studentController.getStudentProfile);
router.post(
	"/application-admission",
	auth("STUDENT"),
	validationReq.validate(studentValidation.admissionBodySchema),
	studentController.admissionApplication,
);
router.get("/all-Program", studentController.getAllProgramg);
router.get("/my-application", auth("STUDENT"), studentController.myApplication);
router.post(
	"/student-enrolement",
	auth("STUDENT"),
	validationReq.validate(studentValidation.studentEnrollmentValidationSchema),
	studentController.studentEnrolement,
);
router.get("/all-courses", auth("STUDENT"), studentController.getAllcourses);
router.get(
	"/myInstalmentFee",
	auth("STUDENT"),
	studentController.getFeeInstalment,
);
router.get("/my-enrolement", auth("STUDENT"), studentController.myEnrolement);
router.post("/my-gpa", auth("STUDENT"), studentController.mygpa);
export const studentRouter = router;
