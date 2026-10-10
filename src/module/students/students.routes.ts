import { Router } from "express";
import studentController from "./student.controller";
import { auth } from "../../midileware/auth";
import { validationReq } from "../../midileware/validationReq";
import { studentValidation } from "./stuent.validation";
import { upload } from '../../lib/multer';

const router = Router();

router.patch(
  "/me",
  auth("STUDENT"),
  validationReq.validate(studentValidation.studentProfileValidationSchema),
  studentController.updateme,
);
router.post(
  "/application-admission",
    auth("STUDENT"),
   upload.fields([
    {name:'sscResult', maxCount:1},
    {name:'hscResult',maxCount:1},
     {name:'diplomaResult',maxCount:1}
   ]),

 
  studentController.admissionApplication
);
router.get("/all-Program", studentController.getAllProgramg);
router.get('/all-Program/:id',studentController.getDetailsProgram)
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
router.get("/my-enrolement/:id", auth("STUDENT"), studentController.myEnrolement);
router.get('/my-semester',auth('STUDENT'),studentController.mySemester)
router.post("/my-gpa", auth("STUDENT"), studentController.mygpa);
router.get(
  "/dashboard",
  auth("STUDENT"),
  studentController.getDasbhoard,
);
export const studentRouter = router;
