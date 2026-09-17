var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cookie from "cookie-parser";

// src/module/auth/auth.routes.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var BaseController = class {
  handle(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  }
};

// src/lib/redis.ts
import { createClient } from "redis";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  appurl: process.env.APP_URL,
  bycriptHashRound: process.env.BCRYPT_SALT_ROUNDS,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  jwt_access_Expires: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_Expires: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_Key: process.env.STRIPE_SECRET_KEY,
  redis_user: process.env.REDIS_USERNAME,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDISHOST,
  redis_port: process.env.REDISPORT,
  smt_user: process.env.SMT_USER,
  smt_password: process.env.SMT_PASSWORD,
  admin_name: process.env.ADMIN_NAME,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_email: process.env.ADMIN_EMAIL,
  stripeWebhookSecret: process.env.STRIP_WEB_KEY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  node_env: process.env.NODE_ENV,
  google_client_id: process.env.GOOGLE_CLIENT_ID
};
var config_default = config;

// src/lib/redis.ts
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/module/auth/auth.service.ts
import randomInt from "random-int";
import bcrypt from "bcrypt";

// src/lib/pirsma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AdmissionApplication {\n  id        String @id @default(uuid())\n  userId    String @unique\n  programId String\n\n  previousInstitution String?\n  previousDegree      String?\n  sscResult           Float?\n  hscResult           Float?\n  diplomaResult       Float?\n\n  status AdmissionStatus @default(PENDING)\n\n  submittedAt     DateTime  @default(now())\n  reviewedAt      DateTime?\n  reviewedBy      String?\n  rejectionReason String?\n\n  user    Users   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  program Program @relation(fields: [programId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  payments  Payment?\n\n  @@index([userId])\n  @@index([programId])\n  @@index([status])\n}\n\nmodel AuditLog {\n  id String @id @default(uuid())\n\n  userId     String?\n  action     String\n  resource   String\n  resourceId String?\n\n  oldData Json?\n  newData Json?\n\n  ipAddress String?\n  userAgent String?\n\n  createdAt DateTime @default(now())\n\n  user Users? @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([resource])\n  @@index([action])\n  @@index([createdAt])\n}\n\nmodel Course {\n  id          String @id @default(uuid())\n  title       String\n  code        String @unique\n  description String\n  credit      Float\n\n  semesterNumber Int // 1 = First, 2 = Second, 3 = Third\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)\n\n  programId String\n  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)\n\n  createdAt        DateTime               @default(now())\n  updatedAt        DateTime               @updatedAt\n  status           CourseAssignmentStatus @default(UNASSIGNED)\n  prerequisites    PrerequisiteCourse[]   @relation("CoursePrerequisites")\n  prerequisiteFor  PrerequisiteCourse[]   @relation("PrerequisiteForCourses")\n  courseEnrollment CourseEnrollment[]\n  courseAssign     CourseAssignt[]\n  exam             Exam[]\n  coursReuslt      CourseMarks[]\n\n  @@index([programId])\n  @@index([departmentId])\n  @@index([semesterNumber])\n  @@index([programId, semesterNumber])\n}\n\nmodel CourseAssignt {\n  id String @id @default(uuid())\n\n  courseId     String\n  instructorId String\n  semesterId   String\n\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  instructor Users @relation(fields: [instructorId], references: [id], onDelete: Cascade)\n\n  semester Semester @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseId, semesterId])\n  @@index([courseId])\n  @@index([instructorId])\n  @@index([semesterId])\n}\n\nmodel CourseEnrollment {\n  id           String @id @default(uuid())\n  enrollmentId String\n  courseId     String\n\n  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)\n\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@unique([enrollmentId, courseId])\n  @@index([courseId])\n}\n\nmodel CourseMarks {\n  id String @id @default(uuid())\n\n  studentId  String\n  courseId   String\n  semesterId String\n\n  attendanceMarks Float @default(0)\n  assignmentMarks Float @default(0)\n  midMarks        Float @default(0)\n  finalExamMarks  Float @default(0)\n\n  student  Users    @relation("studentCourseResult", fields: [studentId], references: [id])\n  course   Course   @relation(fields: [courseId], references: [id])\n  semester Semester @relation(fields: [semesterId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, courseId, semesterId])\n  @@index([studentId])\n  @@index([courseId])\n  @@index([semesterId])\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  code        String  @unique\n  description String?\n\n  students  StudentProfile[]\n  teachers  InstructorProfile[]\n  program   Program[]\n  course    Course[]\n  user      Users[]\n  createdAt DateTime            @default(now())\n  updatedAt DateTime            @updatedAt\n}\n\nmodel Enrollment {\n  id         String @id @default(uuid())\n  studentId  String\n  semesterId String\n\n  semester          Semester           @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n  student           Users              @relation(fields: [studentId], references: [id], onUpdate: Cascade)\n  Enrolementcourses CourseEnrollment[]\n  fees              Fee?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n}\n\nenum Role {\n  STUDENT\n  INSTRUCTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  PENDING\n  GRADUATED\n  SUSPENDED\n  DROPPED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n}\n\nenum AdmissionStatus {\n  PENDING\n  UNDER_REVIEW\n  ACCEPTED\n  REJECTED\n  PAID\n}\n\nenum SemesterType {\n  TRI_SEMESTER\n  BI_SEMESTER\n}\n\nenum DegreeType {\n  BSC\n  MSC\n  BBA\n  MBA\n  BA\n}\n\nenum SemesterCode {\n  SPRING\n  SUMMER\n  FALL\n}\n\nenum PaymentType {\n  ADMISSION_FEE\n  SEMESTER_FEE\n}\n\nenum PaymentMethod {\n  STRIPE\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum ExamType {\n  MIDTERM\n  FINAL\n}\n\nenum CourseAssignmentStatus {\n  ASSIGNED\n  UNASSIGNED\n}\n\nenum AuthProvider {\n  CREDENTIAL\n  GOOGLE\n}\n\nmodel Exam {\n  id           String @id @default(uuid())\n  courseId     String\n  semesterId   String\n  instructorId String\n\n  examType   ExamType\n  examDate   DateTime\n  totalMarks Float\n\n  course     Course   @relation(fields: [courseId], references: [id])\n  semester   Semester @relation(fields: [semesterId], references: [id])\n  instructor Users    @relation("InstructorExams", fields: [instructorId], references: [id])\n\n  results Result[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseId, semesterId, examType])\n  @@index([courseId])\n  @@index([semesterId])\n  @@index([instructorId])\n}\n\nmodel Fee {\n  id String @id @default(uuid())\n\n  studentId    String\n  semesterId   String\n  enroleMentId String @unique\n\n  feeType PaymentType\n\n  totalCredit   Decimal\n  perCreditRate Decimal\n\n  // Original/full fee amount\n  totalAmount Decimal\n\n  // Total unpaid amount\n  remainingAmount Decimal\n\n  // 1st installment\n  firstInstallmentAmount          Decimal\n  firstInstallmentRemainingAmount Decimal\n  firstInstallmentStatus          PaymentStatus @default(PENDING)\n\n  // 2nd installment\n  secondInstallmentAmount          Decimal\n  secondInstallmentRemainingAmount Decimal\n  secondInstallmentStatus          PaymentStatus @default(PENDING)\n\n  // 3rd installment\n  thirdInstallmentAmount          Decimal\n  thirdInstallmentRemainingAmount Decimal\n  thirdInstallmentStatus          PaymentStatus @default(PENDING)\n\n  student Users @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  semester Semester @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n\n  enroleMent Enrollment @relation(fields: [enroleMentId], references: [id], onDelete: Cascade)\n\n  payments Payment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n}\n\nmodel GPAResult {\n  id         String @id @default(uuid())\n  studentId  String\n  semesterId String\n\n  totalCredits Float\n  totalPoints  Float\n  gpa          Float\n\n  student  Users    @relation(fields: [studentId], references: [id])\n  semester Semester @relation(fields: [semesterId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n  @@map("gpaResult")\n}\n\nmodel Payment {\n  id     String  @id @default(uuid())\n  userId String\n  feeId  String?\n\n  amount        Float\n  paymentType   PaymentType\n  paymentMethod PaymentMethod\n  paymentStatus PaymentStatus @default(PENDING)\n\n  transactionId String?   @unique\n  admissionId   String?   @unique\n  paidAt        DateTime?\n\n  user      Users                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  fee       Fee?                  @relation(fields: [feeId], references: [id])\n  admission AdmissionApplication? @relation(fields: [admissionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([feeId])\n  @@index([paymentType])\n  @@index([paymentStatus])\n}\n\nmodel PrerequisiteCourse {\n  id                   String @id @default(uuid())\n  courseId             String\n  prerequisiteCourseId String\n\n  course Course @relation("CoursePrerequisites", fields: [courseId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  prerequisiteCourse Course   @relation("PrerequisiteForCourses", fields: [prerequisiteCourseId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  createdAt          DateTime @default(now())\n  updatedAt          DateTime @updatedAt\n\n  @@unique([courseId, prerequisiteCourseId])\n  @@index([courseId])\n  @@index([prerequisiteCourseId])\n}\n\nmodel Program {\n  id           String                 @id @default(uuid())\n  departmentId String\n  name         String\n  degreeType   DegreeType\n  duration     Int\n  totalCredits Float\n  semester     Int\n  semesterType SemesterType\n  description  String\n  admissionFee Float\n  tuitionFee   Float\n  isActive     Boolean                @default(true)\n  perCreditFee Float\n  totalFee     Float\n  department   Department             @relation(fields: [departmentId], references: [id])\n  courses      Course[]\n  applications AdmissionApplication[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([departmentId])\n  @@index([degreeType])\n  @@index([name])\n}\n\nmodel Result {\n  id         String @id @default(uuid())\n  examId     String\n  studentId  String\n  totalMarks Float\n  grade      String\n  gradePoint Float\n\n  exam    Exam  @relation(fields: [examId], references: [id])\n  student Users @relation("StudentResults", fields: [studentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([examId, studentId])\n  @@index([examId])\n  @@index([studentId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Semester {\n  id               String       @id @default(uuid())\n  name             SemesterCode\n  year             Int // 2026\n  startDate        DateTime\n  endDate          DateTime\n  registrationOpen Boolean      @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  fees         Fee[]\n  enrollments  Enrollment[]\n  CourseAssign CourseAssignt[]\n  exam         Exam[]\n  gpaResult    GPAResult[]\n  courseResult CourseMarks[]\n\n  @@unique([name, year])\n}\n\nmodel StudentProfile {\n  id           String     @id @default(uuid())\n  phone        String\n  dateOfBirth  String\n  gender       String\n  address      String\n  profilePhoto String?\n  studentId    String     @unique\n  user         Users      @relation("studentProfile", fields: [studentId], references: [id], onDelete: Cascade)\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n\n  @@map("studentProfile")\n}\n\nmodel InstructorProfile {\n  id           String @id @default(uuid())\n  userId       String @unique\n  teacherCode  String @unique\n  departmentId String @unique\n\n  phone          String?\n  gender         String?\n  dateOfBirth    DateTime?\n  address        String?\n  designation    String?\n  bio            String?\n  specialization String?\n  qualification  String?\n  experience     String?\n  profilePhoto   String?\n\n  user       Users      @relation("instructorProfile", fields: [userId], references: [id], onDelete: Cascade)\n  department Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Users {\n  id String @id @default(uuid())\n\n  name              String\n  email             String                @unique\n  password          String?\n  emailVerified     Boolean               @default(false)\n  role              Role                  @default(STUDENT)\n  userStatus        UserStatus            @default(PENDING)\n  authProvider      AuthProvider          @default(CREDENTIAL)\n  imageUrl          String                @default("")\n  imagePublicId     String                @default("")\n  studentProfile    StudentProfile?       @relation("studentProfile")\n  instructorProfile InstructorProfile?    @relation("instructorProfile")\n  googleId          String?\n  departmentId      String?\n  isEnrolled        Boolean?\n  department        Department?           @relation(fields: [departmentId], references: [id])\n  createdAt         DateTime              @default(now())\n  updatedAt         DateTime              @updatedAt\n  payments          Payment[]\n  application       AdmissionApplication?\n  courseAssignments CourseAssignt[]\n  fees              Fee[]\n  instructorExams   Exam[]                @relation("InstructorExams")\n  studentResults    Result[]              @relation("StudentResults")\n  gpaResult         GPAResult[]\n  corseResult       CourseMarks[]         @relation("studentCourseResult")\n  enrolledment      Enrollment[]\n  auditLog          AuditLog[]\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"AdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"previousInstitution","kind":"scalar","type":"String"},{"name":"previousDegree","kind":"scalar","type":"String"},{"name":"sscResult","kind":"scalar","type":"Float"},{"name":"hscResult","kind":"scalar","type":"Float"},{"name":"diplomaResult","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"AdmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedBy","kind":"scalar","type":"String"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"AdmissionApplicationToUsers"},{"name":"program","kind":"object","type":"Program","relationName":"AdmissionApplicationToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"AdmissionApplicationToPayment"}],"dbName":null,"schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"oldData","kind":"scalar","type":"Json"},{"name":"newData","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"Users","relationName":"AuditLogToUsers"}],"dbName":null,"schema":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credit","kind":"scalar","type":"Float"},{"name":"semesterNumber","kind":"scalar","type":"Int"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"CourseAssignmentStatus"},{"name":"prerequisites","kind":"object","type":"PrerequisiteCourse","relationName":"CoursePrerequisites"},{"name":"prerequisiteFor","kind":"object","type":"PrerequisiteCourse","relationName":"PrerequisiteForCourses"},{"name":"courseEnrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"courseAssign","kind":"object","type":"CourseAssignt","relationName":"CourseToCourseAssignt"},{"name":"exam","kind":"object","type":"Exam","relationName":"CourseToExam"},{"name":"coursReuslt","kind":"object","type":"CourseMarks","relationName":"CourseToCourseMarks"}],"dbName":null,"schema":null},"CourseAssignt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"instructorId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseAssignt"},{"name":"instructor","kind":"object","type":"Users","relationName":"CourseAssigntToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseAssigntToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"enrollment","kind":"object","type":"Enrollment","relationName":"CourseEnrollmentToEnrollment"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"}],"dbName":null,"schema":null},"CourseMarks":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"attendanceMarks","kind":"scalar","type":"Float"},{"name":"assignmentMarks","kind":"scalar","type":"Float"},{"name":"midMarks","kind":"scalar","type":"Float"},{"name":"finalExamMarks","kind":"scalar","type":"Float"},{"name":"student","kind":"object","type":"Users","relationName":"studentCourseResult"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMarks"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseMarksToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"students","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"teachers","kind":"object","type":"InstructorProfile","relationName":"DepartmentToInstructorProfile"},{"name":"program","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"user","kind":"object","type":"Users","relationName":"DepartmentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Enrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"EnrollmentToSemester"},{"name":"student","kind":"object","type":"Users","relationName":"EnrollmentToUsers"},{"name":"Enrolementcourses","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToEnrollment"},{"name":"fees","kind":"object","type":"Fee","relationName":"EnrollmentToFee"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Exam":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"instructorId","kind":"scalar","type":"String"},{"name":"examType","kind":"enum","type":"ExamType"},{"name":"examDate","kind":"scalar","type":"DateTime"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToExam"},{"name":"semester","kind":"object","type":"Semester","relationName":"ExamToSemester"},{"name":"instructor","kind":"object","type":"Users","relationName":"InstructorExams"},{"name":"results","kind":"object","type":"Result","relationName":"ExamToResult"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Fee":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"enroleMentId","kind":"scalar","type":"String"},{"name":"feeType","kind":"enum","type":"PaymentType"},{"name":"totalCredit","kind":"scalar","type":"Decimal"},{"name":"perCreditRate","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"remainingAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"secondInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"secondInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"secondInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"thirdInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"thirdInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"thirdInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"student","kind":"object","type":"Users","relationName":"FeeToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"FeeToSemester"},{"name":"enroleMent","kind":"object","type":"Enrollment","relationName":"EnrollmentToFee"},{"name":"payments","kind":"object","type":"Payment","relationName":"FeeToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"GPAResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"totalCredits","kind":"scalar","type":"Float"},{"name":"totalPoints","kind":"scalar","type":"Float"},{"name":"gpa","kind":"scalar","type":"Float"},{"name":"student","kind":"object","type":"Users","relationName":"GPAResultToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"GPAResultToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"gpaResult","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"feeId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentType","kind":"enum","type":"PaymentType"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"admissionId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"Users","relationName":"PaymentToUsers"},{"name":"fee","kind":"object","type":"Fee","relationName":"FeeToPayment"},{"name":"admission","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"PrerequisiteCourse":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"prerequisiteCourseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CoursePrerequisites"},{"name":"prerequisiteCourse","kind":"object","type":"Course","relationName":"PrerequisiteForCourses"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"degreeType","kind":"enum","type":"DegreeType"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalCredits","kind":"scalar","type":"Float"},{"name":"semester","kind":"scalar","type":"Int"},{"name":"semesterType","kind":"enum","type":"SemesterType"},{"name":"description","kind":"scalar","type":"String"},{"name":"admissionFee","kind":"scalar","type":"Float"},{"name":"tuitionFee","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"perCreditFee","kind":"scalar","type":"Float"},{"name":"totalFee","kind":"scalar","type":"Float"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"applications","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Result":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"grade","kind":"scalar","type":"String"},{"name":"gradePoint","kind":"scalar","type":"Float"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToResult"},{"name":"student","kind":"object","type":"Users","relationName":"StudentResults"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"enum","type":"SemesterCode"},{"name":"year","kind":"scalar","type":"Int"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"registrationOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"fees","kind":"object","type":"Fee","relationName":"FeeToSemester"},{"name":"enrollments","kind":"object","type":"Enrollment","relationName":"EnrollmentToSemester"},{"name":"CourseAssign","kind":"object","type":"CourseAssignt","relationName":"CourseAssigntToSemester"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToSemester"},{"name":"gpaResult","kind":"object","type":"GPAResult","relationName":"GPAResultToSemester"},{"name":"courseResult","kind":"object","type":"CourseMarks","relationName":"CourseMarksToSemester"}],"dbName":null,"schema":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"studentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"studentProfile","schema":null},"InstructorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"teacherCode","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"instructorProfile"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToInstructorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"userStatus","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"studentProfile"},{"name":"instructorProfile","kind":"object","type":"InstructorProfile","relationName":"instructorProfile"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"isEnrolled","kind":"scalar","type":"Boolean"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUsers"},{"name":"application","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToUsers"},{"name":"courseAssignments","kind":"object","type":"CourseAssignt","relationName":"CourseAssigntToUsers"},{"name":"fees","kind":"object","type":"Fee","relationName":"FeeToUsers"},{"name":"instructorExams","kind":"object","type":"Exam","relationName":"InstructorExams"},{"name":"studentResults","kind":"object","type":"Result","relationName":"StudentResults"},{"name":"gpaResult","kind":"object","type":"GPAResult","relationName":"GPAResultToUsers"},{"name":"corseResult","kind":"object","type":"CourseMarks","relationName":"studentCourseResult"},{"name":"enrolledment","kind":"object","type":"Enrollment","relationName":"EnrollmentToUsers"},{"name":"auditLog","kind":"object","type":"AuditLog","relationName":"AuditLogToUsers"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","students","department","teachers","program","course","prerequisiteCourse","prerequisites","prerequisiteFor","student","semester","enroleMent","fee","admission","payments","_count","fees","enrollments","instructor","CourseAssign","exam","results","gpaResult","courseResult","Enrolementcourses","enrollment","courseEnrollment","courseAssign","coursReuslt","courses","applications","studentProfile","instructorProfile","application","courseAssignments","instructorExams","studentResults","corseResult","enrolledment","auditLog","AdmissionApplication.findUnique","AdmissionApplication.findUniqueOrThrow","AdmissionApplication.findFirst","AdmissionApplication.findFirstOrThrow","AdmissionApplication.findMany","data","AdmissionApplication.createOne","AdmissionApplication.createMany","AdmissionApplication.createManyAndReturn","AdmissionApplication.updateOne","AdmissionApplication.updateMany","AdmissionApplication.updateManyAndReturn","create","update","AdmissionApplication.upsertOne","AdmissionApplication.deleteOne","AdmissionApplication.deleteMany","having","_avg","_sum","_min","_max","AdmissionApplication.groupBy","AdmissionApplication.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseAssignt.findUnique","CourseAssignt.findUniqueOrThrow","CourseAssignt.findFirst","CourseAssignt.findFirstOrThrow","CourseAssignt.findMany","CourseAssignt.createOne","CourseAssignt.createMany","CourseAssignt.createManyAndReturn","CourseAssignt.updateOne","CourseAssignt.updateMany","CourseAssignt.updateManyAndReturn","CourseAssignt.upsertOne","CourseAssignt.deleteOne","CourseAssignt.deleteMany","CourseAssignt.groupBy","CourseAssignt.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","CourseMarks.findUnique","CourseMarks.findUniqueOrThrow","CourseMarks.findFirst","CourseMarks.findFirstOrThrow","CourseMarks.findMany","CourseMarks.createOne","CourseMarks.createMany","CourseMarks.createManyAndReturn","CourseMarks.updateOne","CourseMarks.updateMany","CourseMarks.updateManyAndReturn","CourseMarks.upsertOne","CourseMarks.deleteOne","CourseMarks.deleteMany","CourseMarks.groupBy","CourseMarks.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Enrollment.findUnique","Enrollment.findUniqueOrThrow","Enrollment.findFirst","Enrollment.findFirstOrThrow","Enrollment.findMany","Enrollment.createOne","Enrollment.createMany","Enrollment.createManyAndReturn","Enrollment.updateOne","Enrollment.updateMany","Enrollment.updateManyAndReturn","Enrollment.upsertOne","Enrollment.deleteOne","Enrollment.deleteMany","Enrollment.groupBy","Enrollment.aggregate","Exam.findUnique","Exam.findUniqueOrThrow","Exam.findFirst","Exam.findFirstOrThrow","Exam.findMany","Exam.createOne","Exam.createMany","Exam.createManyAndReturn","Exam.updateOne","Exam.updateMany","Exam.updateManyAndReturn","Exam.upsertOne","Exam.deleteOne","Exam.deleteMany","Exam.groupBy","Exam.aggregate","Fee.findUnique","Fee.findUniqueOrThrow","Fee.findFirst","Fee.findFirstOrThrow","Fee.findMany","Fee.createOne","Fee.createMany","Fee.createManyAndReturn","Fee.updateOne","Fee.updateMany","Fee.updateManyAndReturn","Fee.upsertOne","Fee.deleteOne","Fee.deleteMany","Fee.groupBy","Fee.aggregate","GPAResult.findUnique","GPAResult.findUniqueOrThrow","GPAResult.findFirst","GPAResult.findFirstOrThrow","GPAResult.findMany","GPAResult.createOne","GPAResult.createMany","GPAResult.createManyAndReturn","GPAResult.updateOne","GPAResult.updateMany","GPAResult.updateManyAndReturn","GPAResult.upsertOne","GPAResult.deleteOne","GPAResult.deleteMany","GPAResult.groupBy","GPAResult.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PrerequisiteCourse.findUnique","PrerequisiteCourse.findUniqueOrThrow","PrerequisiteCourse.findFirst","PrerequisiteCourse.findFirstOrThrow","PrerequisiteCourse.findMany","PrerequisiteCourse.createOne","PrerequisiteCourse.createMany","PrerequisiteCourse.createManyAndReturn","PrerequisiteCourse.updateOne","PrerequisiteCourse.updateMany","PrerequisiteCourse.updateManyAndReturn","PrerequisiteCourse.upsertOne","PrerequisiteCourse.deleteOne","PrerequisiteCourse.deleteMany","PrerequisiteCourse.groupBy","PrerequisiteCourse.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Result.findUnique","Result.findUniqueOrThrow","Result.findFirst","Result.findFirstOrThrow","Result.findMany","Result.createOne","Result.createMany","Result.createManyAndReturn","Result.updateOne","Result.updateMany","Result.updateManyAndReturn","Result.upsertOne","Result.deleteOne","Result.deleteMany","Result.groupBy","Result.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstructorProfile.findUnique","InstructorProfile.findUniqueOrThrow","InstructorProfile.findFirst","InstructorProfile.findFirstOrThrow","InstructorProfile.findMany","InstructorProfile.createOne","InstructorProfile.createMany","InstructorProfile.createManyAndReturn","InstructorProfile.updateOne","InstructorProfile.updateMany","InstructorProfile.updateManyAndReturn","InstructorProfile.upsertOne","InstructorProfile.deleteOne","InstructorProfile.deleteMany","InstructorProfile.groupBy","InstructorProfile.aggregate","Users.findUnique","Users.findUniqueOrThrow","Users.findFirst","Users.findFirstOrThrow","Users.findMany","Users.createOne","Users.createMany","Users.createManyAndReturn","Users.updateOne","Users.updateMany","Users.updateManyAndReturn","Users.upsertOne","Users.deleteOne","Users.deleteMany","Users.groupBy","Users.aggregate","AND","OR","NOT","id","name","email","password","emailVerified","Role","role","UserStatus","userStatus","AuthProvider","authProvider","imageUrl","imagePublicId","googleId","departmentId","isEnrolled","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","teacherCode","phone","gender","dateOfBirth","address","designation","bio","specialization","qualification","experience","profilePhoto","studentId","SemesterCode","year","startDate","endDate","registrationOpen","every","some","none","name_year","examId","totalMarks","grade","gradePoint","DegreeType","degreeType","duration","totalCredits","SemesterType","semesterType","description","admissionFee","tuitionFee","isActive","perCreditFee","totalFee","courseId","prerequisiteCourseId","feeId","amount","PaymentType","paymentType","PaymentMethod","paymentMethod","PaymentStatus","paymentStatus","transactionId","admissionId","paidAt","semesterId","totalPoints","gpa","enroleMentId","feeType","totalCredit","perCreditRate","totalAmount","remainingAmount","firstInstallmentAmount","firstInstallmentRemainingAmount","firstInstallmentStatus","secondInstallmentAmount","secondInstallmentRemainingAmount","secondInstallmentStatus","thirdInstallmentAmount","thirdInstallmentRemainingAmount","thirdInstallmentStatus","instructorId","ExamType","examType","examDate","code","attendanceMarks","assignmentMarks","midMarks","finalExamMarks","enrollmentId","title","credit","semesterNumber","programId","CourseAssignmentStatus","status","action","resource","resourceId","oldData","newData","ipAddress","userAgent","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","previousInstitution","previousDegree","sscResult","hscResult","diplomaResult","AdmissionStatus","submittedAt","reviewedAt","reviewedBy","rejectionReason","studentId_courseId_semesterId","studentId_semesterId","examId_studentId","courseId_semesterId_examType","courseId_semesterId","enrollmentId_courseId","courseId_prerequisiteCourseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "nAy1AbACFQEAAKkFACAHAAC-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-ACACAAA_ADADAABAACADAAAAKQAgAgAAKgAwAwAAKwAgDgEAAJkFACDjAgAAlwUAMOQCAABuABDlAgAAlwUAMOYCAQDTBAAh9gJAANYEACGDAwEAgAUAIdgDAQDTBAAh2QMBANMEACHaAwEAgAUAIdsDAACYBQAg3AMAAJgFACDdAwEAgAUAId4DAQCABQAhBwEAALgKACCDAwAA1gUAINoDAADWBQAg2wMAANYFACDcAwAA1gUAIN0DAADWBQAg3gMAANYFACAOAQAAmQUAIOMCAACXBQAw5AIAAG4AEOUCAACXBQAw5gIBAAAAAfYCQADWBAAhgwMBAIAFACHYAwEA0wQAIdkDAQDTBAAh2gMBAIAFACHbAwAAmAUAINwDAACYBQAg3QMBAIAFACHeAwEAgAUAIQMAAABuACACAABvADADAABwACABAAAAWQAgAQAAACEAIAEAAAAtACABAAAAHQAgAQAAADEAIAEAAAA1ACABAAAAOgAgAQAAAD4AIAEAAAApACABAAAAbgAgAQAAACEAIAEAAAABACADAAAAJgAgAgAAVAAwAwAAAQAgAwAAACYAIAIAAFQAMAMAAAEAIAMAAAAmACACAABUADADAAABACASAQAA2QgAIAcAALQHACARAAC1BwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABgwMBAAAAAdUDAQAAAAHXAwAAAOsDAuUDAQAAAAHmAwEAAAAB5wMIAAAAAegDCAAAAAHpAwgAAAAB6wNAAAAAAewDQAAAAAHtAwEAAAAB7gMBAAAAAQEwAACBAQAgD-YCAQAAAAH2AkAAAAAB9wJAAAAAAYMDAQAAAAHVAwEAAAAB1wMAAADrAwLlAwEAAAAB5gMBAAAAAecDCAAAAAHoAwgAAAAB6QMIAAAAAesDQAAAAAHsA0AAAAAB7QMBAAAAAe4DAQAAAAEBMAAAgwEAMAEwAACDAQAwEgEAANcIACAHAACrBwAgEQAArAcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYMDAQDaBQAh1QMBANoFACHXAwAAqgfrAyLlAwEA2wUAIeYDAQDbBQAh5wMIAKkHACHoAwgAqQcAIekDCACpBwAh6wNAAOEFACHsA0AAoAYAIe0DAQDbBQAh7gMBANsFACECAAAAAQAgMAAAhgEAIA_mAgEA2gUAIfYCQADhBQAh9wJAAOEFACGDAwEA2gUAIdUDAQDaBQAh1wMAAKoH6wMi5QMBANsFACHmAwEA2wUAIecDCACpBwAh6AMIAKkHACHpAwgAqQcAIesDQADhBQAh7ANAAKAGACHtAwEA2wUAIe4DAQDbBQAhAgAAACYAIDAAAIgBACACAAAAJgAgMAAAiAEAIAMAAAABACA3AACBAQAgOAAAhgEAIAEAAAABACABAAAAJgAgDRIAALMKACA9AAC0CgAgPgAAtwoAID8AALYKACBAAAC1CgAg5QMAANYFACDmAwAA1gUAIOcDAADWBQAg6AMAANYFACDpAwAA1gUAIOwDAADWBQAg7QMAANYFACDuAwAA1gUAIBLjAgAAkAUAMOQCAACPAQAQ5QIAAJAFADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGDAwEArAQAIdUDAQCsBAAh1wMAAJIF6wMi5QMBAK0EACHmAwEArQQAIecDCACRBQAh6AMIAJEFACHpAwgAkQUAIesDQACzBAAh7ANAAMcEACHtAwEArQQAIe4DAQCtBAAhAwAAACYAIAIAAI4BADA8AACPAQAgAwAAACYAIAIAAFQAMAMAAAEAIAEAAABwACABAAAAcAAgAwAAAG4AIAIAAG8AMAMAAHAAIAMAAABuACACAABvADADAABwACADAAAAbgAgAgAAbwAwAwAAcAAgCwEAALIKACDmAgEAAAAB9gJAAAAAAYMDAQAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbA4AAAAAB3AOAAAAAAd0DAQAAAAHeAwEAAAABATAAAJcBACAK5gIBAAAAAfYCQAAAAAGDAwEAAAAB2AMBAAAAAdkDAQAAAAHaAwEAAAAB2wOAAAAAAdwDgAAAAAHdAwEAAAAB3gMBAAAAAQEwAACZAQAwATAAAJkBADABAAAAWQAgCwEAALEKACDmAgEA2gUAIfYCQADhBQAhgwMBANsFACHYAwEA2gUAIdkDAQDaBQAh2gMBANsFACHbA4AAAAAB3AOAAAAAAd0DAQDbBQAh3gMBANsFACECAAAAcAAgMAAAnQEAIArmAgEA2gUAIfYCQADhBQAhgwMBANsFACHYAwEA2gUAIdkDAQDaBQAh2gMBANsFACHbA4AAAAAB3AOAAAAAAd0DAQDbBQAh3gMBANsFACECAAAAbgAgMAAAnwEAIAIAAABuACAwAACfAQAgAQAAAFkAIAMAAABwACA3AACXAQAgOAAAnQEAIAEAAABwACABAAAAbgAgCRIAAK4KACA_AACwCgAgQAAArwoAIIMDAADWBQAg2gMAANYFACDbAwAA1gUAINwDAADWBQAg3QMAANYFACDeAwAA1gUAIA3jAgAAjQUAMOQCAACnAQAQ5QIAAI0FADDmAgEArAQAIfYCQACzBAAhgwMBAK0EACHYAwEArAQAIdkDAQCsBAAh2gMBAK0EACHbAwAAjgUAINwDAACOBQAg3QMBAK0EACHeAwEArQQAIQMAAABuACACAACmAQAwPAAApwEAIAMAAABuACACAABvADADAABwACABAAAAEgAgAQAAABIAIAMAAAAQACACAAARADADAAASACADAAAAEAAgAgAAEQAwAwAAEgAgAwAAABAAIAIAABEAMAMAABIAIBMFAACtCQAgBwAA7wkAIAoAAK4JACALAACvCQAgFwAAsgkAIB0AALAJACAeAACxCQAgHwAAswkAIOYCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGjAwEAAAABzAMBAAAAAdIDAQAAAAHTAwgAAAAB1AMCAAAAAdUDAQAAAAHXAwAAANcDAgEwAACvAQAgC-YCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGjAwEAAAABzAMBAAAAAdIDAQAAAAHTAwgAAAAB1AMCAAAAAdUDAQAAAAHXAwAAANcDAgEwAACxAQAwATAAALEBADATBQAA5ggAIAcAAO0JACAKAADnCAAgCwAA6AgAIBcAAOsIACAdAADpCAAgHgAA6ggAIB8AAOwIACDmAgEA2gUAIfQCAQDaBQAh9gJAAOEFACH3AkAA4QUAIaMDAQDaBQAhzAMBANoFACHSAwEA2gUAIdMDCACeBgAh1AMCAOoHACHVAwEA2gUAIdcDAADkCNcDIgIAAAASACAwAAC0AQAgC-YCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhowMBANoFACHMAwEA2gUAIdIDAQDaBQAh0wMIAJ4GACHUAwIA6gcAIdUDAQDaBQAh1wMAAOQI1wMiAgAAABAAIDAAALYBACACAAAAEAAgMAAAtgEAIAMAAAASACA3AACvAQAgOAAAtAEAIAEAAAASACABAAAAEAAgBRIAAKkKACA9AACqCgAgPgAArQoAID8AAKwKACBAAACrCgAgDuMCAACJBQAw5AIAAL0BABDlAgAAiQUAMOYCAQCsBAAh9AIBAKwEACH2AkAAswQAIfcCQACzBAAhowMBAKwEACHMAwEArAQAIdIDAQCsBAAh0wMIAOAEACHUAwIAzQQAIdUDAQCsBAAh1wMAAIoF1wMiAwAAABAAIAIAALwBADA8AAC9AQAgAwAAABAAIAIAABEAMAMAABIAIAEAAAAvACABAAAALwAgAwAAAC0AIAIAAC4AMAMAAC8AIAMAAAAtACACAAAuADADAAAvACADAAAALQAgAgAALgAwAwAALwAgCQgAAKIHACANAACjBwAgFQAAnAgAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAG2AwEAAAAByAMBAAAAAQEwAADFAQAgBuYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAG2AwEAAAAByAMBAAAAAQEwAADHAQAwATAAAMcBADAJCAAAnwcAIA0AAKAHACAVAACaCAAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqQMBANoFACG2AwEA2gUAIcgDAQDaBQAhAgAAAC8AIDAAAMoBACAG5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqQMBANoFACG2AwEA2gUAIcgDAQDaBQAhAgAAAC0AIDAAAMwBACACAAAALQAgMAAAzAEAIAMAAAAvACA3AADFAQAgOAAAygEAIAEAAAAvACABAAAALQAgAxIAAKYKACA_AACoCgAgQAAApwoAIAnjAgAAiAUAMOQCAADTAQAQ5QIAAIgFADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGpAwEArAQAIbYDAQCsBAAhyAMBAKwEACEDAAAALQAgAgAA0gEAMDwAANMBACADAAAALQAgAgAALgAwAwAALwAgAQAAABsAIAEAAAAbACADAAAAGQAgAgAAGgAwAwAAGwAgAwAAABkAIAIAABoAMAMAABsAIAMAAAAZACACAAAaADADAAAbACAFCAAAtwYAIBwAAJIJACDmAgEAAAABqQMBAAAAAdEDAQAAAAEBMAAA2wEAIAPmAgEAAAABqQMBAAAAAdEDAQAAAAEBMAAA3QEAMAEwAADdAQAwBQgAALUGACAcAACQCQAg5gIBANoFACGpAwEA2gUAIdEDAQDaBQAhAgAAABsAIDAAAOABACAD5gIBANoFACGpAwEA2gUAIdEDAQDaBQAhAgAAABkAIDAAAOIBACACAAAAGQAgMAAA4gEAIAMAAAAbACA3AADbAQAgOAAA4AEAIAEAAAAbACABAAAAGQAgAxIAAKMKACA_AAClCgAgQAAApAoAIAbjAgAAhwUAMOQCAADpAQAQ5QIAAIcFADDmAgEArAQAIakDAQCsBAAh0QMBAKwEACEDAAAAGQAgAgAA6AEAMDwAAOkBACADAAAAGQAgAgAAGgAwAwAAGwAgAQAAAEAAIAEAAABAACADAAAAPgAgAgAAPwAwAwAAQAAgAwAAAD4AIAIAAD8AMAMAAEAAIAMAAAA-ACACAAA_ADADAABAACANCAAAygYAIAwAAPsHACANAADLBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAakDAQAAAAG2AwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQEwAADxAQAgCuYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGpAwEAAAABtgMBAAAAAc0DCAAAAAHOAwgAAAABzwMIAAAAAdADCAAAAAEBMAAA8wEAMAEwAADzAQAwDQgAAMcGACAMAAD5BwAgDQAAyAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhqQMBANoFACG2AwEA2gUAIc0DCACeBgAhzgMIAJ4GACHPAwgAngYAIdADCACeBgAhAgAAAEAAIDAAAPYBACAK5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACGpAwEA2gUAIbYDAQDaBQAhzQMIAJ4GACHOAwgAngYAIc8DCACeBgAh0AMIAJ4GACECAAAAPgAgMAAA-AEAIAIAAAA-ACAwAAD4AQAgAwAAAEAAIDcAAPEBACA4AAD2AQAgAQAAAEAAIAEAAAA-ACAFEgAAngoAID0AAJ8KACA-AACiCgAgPwAAoQoAIEAAAKAKACAN4wIAAIYFADDkAgAA_wEAEOUCAACGBQAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhjwMBAKwEACGpAwEArAQAIbYDAQCsBAAhzQMIAOAEACHOAwgA4AQAIc8DCADgBAAh0AMIAOAEACEDAAAAPgAgAgAA_gEAMDwAAP8BACADAAAAPgAgAgAAPwAwAwAAQAAgDgEAAIUFACAEAACBBQAgBgAAggUAIAcAAIMFACAIAACEBQAg4wIAAP8EADDkAgAAYwAQ5QIAAP8EADDmAgEAAAAB5wIBAAAAAfYCQADWBAAh9wJAANYEACGjAwEAgAUAIcwDAQAAAAEBAAAAggIAIAEAAACCAgAgBgEAAJ0KACAEAACZCgAgBgAAmgoAIAcAAJsKACAIAACcCgAgowMAANYFACADAAAAYwAgAgAAhQIAMAMAAIICACADAAAAYwAgAgAAhQIAMAMAAIICACADAAAAYwAgAgAAhQIAMAMAAIICACALAQAAmAoAIAQAAJQKACAGAACVCgAgBwAAlgoAIAgAAJcKACDmAgEAAAAB5wIBAAAAAfYCQAAAAAH3AkAAAAABowMBAAAAAcwDAQAAAAEBMAAAiQIAIAbmAgEAAAAB5wIBAAAAAfYCQAAAAAH3AkAAAAABowMBAAAAAcwDAQAAAAEBMAAAiwIAMAEwAACLAgAwCwEAANgJACAEAADUCQAgBgAA1QkAIAcAANYJACAIAADXCQAg5gIBANoFACHnAgEA2gUAIfYCQADhBQAh9wJAAOEFACGjAwEA2wUAIcwDAQDaBQAhAgAAAIICACAwAACOAgAgBuYCAQDaBQAh5wIBANoFACH2AkAA4QUAIfcCQADhBQAhowMBANsFACHMAwEA2gUAIQIAAABjACAwAACQAgAgAgAAAGMAIDAAAJACACADAAAAggIAIDcAAIkCACA4AACOAgAgAQAAAIICACABAAAAYwAgBBIAANEJACA_AADTCQAgQAAA0gkAIKMDAADWBQAgCeMCAAD-BAAw5AIAAJcCABDlAgAA_gQAMOYCAQCsBAAh5wIBAKwEACH2AkAAswQAIfcCQACzBAAhowMBAK0EACHMAwEArAQAIQMAAABjACACAACWAgAwPAAAlwIAIAMAAABjACACAACFAgAwAwAAggIAIAEAAAArACABAAAAKwAgAwAAACkAIAIAACoAMAMAACsAIAMAAAApACACAAAqADADAAArACADAAAAKQAgAgAAKgAwAwAAKwAgCQwAAKcIACANAAC5BgAgEwAAuwYAIBsAALoGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABtgMBAAAAAQEwAACfAgAgBeYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAG2AwEAAAABATAAAKECADABMAAAoQIAMAkMAAClCAAgDQAAhgYAIBMAAIgGACAbAACHBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACG2AwEA2gUAIQIAAAArACAwAACkAgAgBeYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhtgMBANoFACECAAAAKQAgMAAApgIAIAIAAAApACAwAACmAgAgAwAAACsAIDcAAJ8CACA4AACkAgAgAQAAACsAIAEAAAApACADEgAAzgkAID8AANAJACBAAADPCQAgCOMCAAD9BAAw5AIAAK0CABDlAgAA_QQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIY8DAQCsBAAhtgMBAKwEACEDAAAAKQAgAgAArAIAMDwAAK0CACADAAAAKQAgAgAAKgAwAwAAKwAgAQAAADMAIAEAAAAzACADAAAAMQAgAgAAMgAwAwAAMwAgAwAAADEAIAIAADIAMAMAADMAIAMAAAAxACACAAAyADADAAAzACANCAAAgwcAIA0AAIQHACAVAACRCAAgGAAAhQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZoDCAAAAAGpAwEAAAABtgMBAAAAAcgDAQAAAAHKAwAAAMoDAssDQAAAAAEBMAAAtQIAIAnmAgEAAAAB9gJAAAAAAfcCQAAAAAGaAwgAAAABqQMBAAAAAbYDAQAAAAHIAwEAAAABygMAAADKAwLLA0AAAAABATAAALcCADABMAAAtwIAMA0IAAD0BgAgDQAA9QYAIBUAAI8IACAYAAD2BgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhmgMIAJ4GACGpAwEA2gUAIbYDAQDaBQAhyAMBANoFACHKAwAA8gbKAyLLA0AA4QUAIQIAAAAzACAwAAC6AgAgCeYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZoDCACeBgAhqQMBANoFACG2AwEA2gUAIcgDAQDaBQAhygMAAPIGygMiywNAAOEFACECAAAAMQAgMAAAvAIAIAIAAAAxACAwAAC8AgAgAwAAADMAIDcAALUCACA4AAC6AgAgAQAAADMAIAEAAAAxACAFEgAAyQkAID0AAMoJACA-AADNCQAgPwAAzAkAIEAAAMsJACAM4wIAAPkEADDkAgAAwwIAEOUCAAD5BAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhmgMIAOAEACGpAwEArAQAIbYDAQCsBAAhyAMBAKwEACHKAwAA-gTKAyLLA0AAswQAIQMAAAAxACACAADCAgAwPAAAwwIAIAMAAAAxACACAAAyADADAAAzACABAAAAHwAgAQAAAB8AIAMAAAAdACACAAAeADADAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIBgMAACnBgAgDQAAqAYAIA4AAJMHACARAACpBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAbYDAQAAAAG5AwEAAAABugMAAACuAwK7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAwAAALIDAsIDEAAAAAHDAxAAAAABxAMAAACyAwLFAxAAAAABxgMQAAAAAccDAAAAsgMCATAAAMsCACAU5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAbYDAQAAAAG5AwEAAAABugMAAACuAwK7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAwAAALIDAsIDEAAAAAHDAxAAAAABxAMAAACyAwLFAxAAAAABxgMQAAAAAccDAAAAsgMCATAAAM0CADABMAAAzQIAMBgMAACRBgAgDQAAkgYAIA4AAJEHACARAACTBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACG2AwEA2gUAIbkDAQDaBQAhugMAAI4GrgMiuwMQAI8GACG8AxAAjwYAIb0DEACPBgAhvgMQAI8GACG_AxAAjwYAIcADEACPBgAhwQMAAJAGsgMiwgMQAI8GACHDAxAAjwYAIcQDAACQBrIDIsUDEACPBgAhxgMQAI8GACHHAwAAkAayAyICAAAAHwAgMAAA0AIAIBTmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIbYDAQDaBQAhuQMBANoFACG6AwAAjgauAyK7AxAAjwYAIbwDEACPBgAhvQMQAI8GACG-AxAAjwYAIb8DEACPBgAhwAMQAI8GACHBAwAAkAayAyLCAxAAjwYAIcMDEACPBgAhxAMAAJAGsgMixQMQAI8GACHGAxAAjwYAIccDAACQBrIDIgIAAAAdACAwAADSAgAgAgAAAB0AIDAAANICACADAAAAHwAgNwAAywIAIDgAANACACABAAAAHwAgAQAAAB0AIAUSAADECQAgPQAAxQkAID4AAMgJACA_AADHCQAgQAAAxgkAIBfjAgAA9QQAMOQCAADZAgAQ5QIAAPUEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGPAwEArAQAIbYDAQCsBAAhuQMBAKwEACG6AwAA6wSuAyK7AxAA9gQAIbwDEAD2BAAhvQMQAPYEACG-AxAA9gQAIb8DEAD2BAAhwAMQAPYEACHBAwAA7QSyAyLCAxAA9gQAIcMDEAD2BAAhxAMAAO0EsgMixQMQAPYEACHGAxAA9gQAIccDAADtBLIDIgMAAAAdACACAADYAgAwPAAA2QIAIAMAAAAdACACAAAeADADAAAfACABAAAAPAAgAQAAADwAIAMAAAA6ACACAAA7ADADAAA8ACADAAAAOgAgAgAAOwAwAwAAPAAgAwAAADoAIAIAADsAMAMAADwAIAoMAACGCAAgDQAA2QYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGgAwgAAAABtgMBAAAAAbcDCAAAAAG4AwgAAAABATAAAOECACAI5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAaADCAAAAAG2AwEAAAABtwMIAAAAAbgDCAAAAAEBMAAA4wIAMAEwAADjAgAwCgwAAIQIACANAADXBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACGgAwgAngYAIbYDAQDaBQAhtwMIAJ4GACG4AwgAngYAIQIAAAA8ACAwAADmAgAgCOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhoAMIAJ4GACG2AwEA2gUAIbcDCACeBgAhuAMIAJ4GACECAAAAOgAgMAAA6AIAIAIAAAA6ACAwAADoAgAgAwAAADwAIDcAAOECACA4AADmAgAgAQAAADwAIAEAAAA6ACAFEgAAvwkAID0AAMAJACA-AADDCQAgPwAAwgkAIEAAAMEJACAL4wIAAPQEADDkAgAA7wIAEOUCAAD0BAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhjwMBAKwEACGgAwgA4AQAIbYDAQCsBAAhtwMIAOAEACG4AwgA4AQAIQMAAAA6ACACAADuAgAwPAAA7wIAIAMAAAA6ACACAAA7ADADAAA8ACABAAAAIwAgAQAAACMAIAMAAAAhACACAAAiADADAAAjACADAAAAIQAgAgAAIgAwAwAAIwAgAwAAACEAIAIAACIAMAMAACMAIA8BAAClBgAgDwAAswcAIBAAAKYGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGDAwEAAAABqwMBAAAAAawDCAAAAAGuAwAAAK4DArADAAAAsAMCsgMAAACyAwKzAwEAAAABtAMBAAAAAbUDQAAAAAEBMAAA9wIAIAzmAgEAAAAB9gJAAAAAAfcCQAAAAAGDAwEAAAABqwMBAAAAAawDCAAAAAGuAwAAAK4DArADAAAAsAMCsgMAAACyAwKzAwEAAAABtAMBAAAAAbUDQAAAAAEBMAAA-QIAMAEwAAD5AgAwAQAAAB0AIAEAAAAmACAPAQAAogYAIA8AALIHACAQAACjBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhgwMBANoFACGrAwEA2wUAIawDCACeBgAhrgMAAI4GrgMisAMAAJ8GsAMisgMAAJAGsgMiswMBANsFACG0AwEA2wUAIbUDQACgBgAhAgAAACMAIDAAAP4CACAM5gIBANoFACH2AkAA4QUAIfcCQADhBQAhgwMBANoFACGrAwEA2wUAIawDCACeBgAhrgMAAI4GrgMisAMAAJ8GsAMisgMAAJAGsgMiswMBANsFACG0AwEA2wUAIbUDQACgBgAhAgAAACEAIDAAAIADACACAAAAIQAgMAAAgAMAIAEAAAAdACABAAAAJgAgAwAAACMAIDcAAPcCACA4AAD-AgAgAQAAACMAIAEAAAAhACAJEgAAugkAID0AALsJACA-AAC-CQAgPwAAvQkAIEAAALwJACCrAwAA1gUAILMDAADWBQAgtAMAANYFACC1AwAA1gUAIA_jAgAA6gQAMOQCAACJAwAQ5QIAAOoEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGDAwEArAQAIasDAQCtBAAhrAMIAOAEACGuAwAA6wSuAyKwAwAA7ASwAyKyAwAA7QSyAyKzAwEArQQAIbQDAQCtBAAhtQNAAMcEACEDAAAAIQAgAgAAiAMAMDwAAIkDACADAAAAIQAgAgAAIgAwAwAAIwAgAQAAABYAIAEAAAAWACADAAAAFAAgAgAAFQAwAwAAFgAgAwAAABQAIAIAABUAMAMAABYAIAMAAAAUACACAAAVADADAAAWACAHCAAAoAkAIAkAAKsJACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGpAwEAAAABqgMBAAAAAQEwAACRAwAgBeYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAGqAwEAAAABATAAAJMDADABMAAAkwMAMAcIAACeCQAgCQAAqQkAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIakDAQDaBQAhqgMBANoFACECAAAAFgAgMAAAlgMAIAXmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGpAwEA2gUAIaoDAQDaBQAhAgAAABQAIDAAAJgDACACAAAAFAAgMAAAmAMAIAMAAAAWACA3AACRAwAgOAAAlgMAIAEAAAAWACABAAAAFAAgAxIAALcJACA_AAC5CQAgQAAAuAkAIAjjAgAA6QQAMOQCAACfAwAQ5QIAAOkEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGpAwEArAQAIaoDAQCsBAAhAwAAABQAIAIAAJ4DADA8AACfAwAgAwAAABQAIAIAABUAMAMAABYAIAEAAAAOACABAAAADgAgAwAAAAwAIAIAAA0AMAMAAA4AIAMAAAAMACACAAANADADAAAOACADAAAADAAgAgAADQAwAwAADgAgEwUAALQJACANAgAAAAEgAAC1CQAgIQAAtgkAIOYCAQAAAAHnAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABngMAAACeAwKfAwIAAAABoAMIAAAAAaIDAAAAogMCowMBAAAAAaQDCAAAAAGlAwgAAAABpgMgAAAAAacDCAAAAAGoAwgAAAABATAAAKcDACAQDQIAAAAB5gIBAAAAAecCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGeAwAAAJ4DAp8DAgAAAAGgAwgAAAABogMAAACiAwKjAwEAAAABpAMIAAAAAaUDCAAAAAGmAyAAAAABpwMIAAAAAagDCAAAAAEBMAAAqQMAMAEwAACpAwAwEwUAAMkIACANAgDqBwAhIAAAyggAICEAAMsIACDmAgEA2gUAIecCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhngMAAMcIngMinwMCAOoHACGgAwgAngYAIaIDAADICKIDIqMDAQDaBQAhpAMIAJ4GACGlAwgAngYAIaYDIADcBQAhpwMIAJ4GACGoAwgAngYAIQIAAAAOACAwAACsAwAgEA0CAOoHACHmAgEA2gUAIecCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhngMAAMcIngMinwMCAOoHACGgAwgAngYAIaIDAADICKIDIqMDAQDaBQAhpAMIAJ4GACGlAwgAngYAIaYDIADcBQAhpwMIAJ4GACGoAwgAngYAIQIAAAAMACAwAACuAwAgAgAAAAwAIDAAAK4DACADAAAADgAgNwAApwMAIDgAAKwDACABAAAADgAgAQAAAAwAIAUSAADCCAAgPQAAwwgAID4AAMYIACA_AADFCAAgQAAAxAgAIBMNAgDNBAAh4wIAAOIEADDkAgAAtQMAEOUCAADiBAAw5gIBAKwEACHnAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIZ4DAADjBJ4DIp8DAgDNBAAhoAMIAOAEACGiAwAA5ASiAyKjAwEArAQAIaQDCADgBAAhpQMIAOAEACGmAyAArgQAIacDCADgBAAhqAMIAOAEACEDAAAADAAgAgAAtAMAMDwAALUDACADAAAADAAgAgAADQAwAwAADgAgAQAAADcAIAEAAAA3ACADAAAANQAgAgAANgAwAwAANwAgAwAAADUAIAIAADYAMAMAADcAIAMAAAA1ACACAAA2ADADAAA3ACAKDAAAgQcAIBcAAOcGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABmQMBAAAAAZoDCAAAAAGbAwEAAAABnAMIAAAAAQEwAAC9AwAgCOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGZAwEAAAABmgMIAAAAAZsDAQAAAAGcAwgAAAABATAAAL8DADABMAAAvwMAMAoMAAD_BgAgFwAA5QYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhmQMBANoFACGaAwgAngYAIZsDAQDaBQAhnAMIAJ4GACECAAAANwAgMAAAwgMAIAjmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIZkDAQDaBQAhmgMIAJ4GACGbAwEA2gUAIZwDCACeBgAhAgAAADUAIDAAAMQDACACAAAANQAgMAAAxAMAIAMAAAA3ACA3AAC9AwAgOAAAwgMAIAEAAAA3ACABAAAANQAgBRIAAL0IACA9AAC-CAAgPgAAwQgAID8AAMAIACBAAAC_CAAgC-MCAADfBAAw5AIAAMsDABDlAgAA3wQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIY8DAQCsBAAhmQMBAKwEACGaAwgA4AQAIZsDAQCsBAAhnAMIAOAEACEDAAAANQAgAgAAygMAMDwAAMsDACADAAAANQAgAgAANgAwAwAANwAgEhMAANgEACAUAADZBAAgFgAA2gQAIBcAANsEACAZAADcBAAgGgAA3QQAIOMCAADSBAAw5AIAANEDABDlAgAA0gQAMOYCAQAAAAHnAgAA1ASRAyL2AkAA1gQAIfcCQADWBAAhkQMCANUEACGSA0AA1gQAIZMDQADWBAAhlAMgANcEACGYAwAA3gQAIAEAAADOAwAgAQAAAM4DACAREwAA2AQAIBQAANkEACAWAADaBAAgFwAA2wQAIBkAANwEACAaAADdBAAg4wIAANIEADDkAgAA0QMAEOUCAADSBAAw5gIBANMEACHnAgAA1ASRAyL2AkAA1gQAIfcCQADWBAAhkQMCANUEACGSA0AA1gQAIZMDQADWBAAhlAMgANcEACEGEwAAtwgAIBQAALgIACAWAAC5CAAgFwAAuggAIBkAALsIACAaAAC8CAAgAwAAANEDACACAADSAwAwAwAAzgMAIAMAAADRAwAgAgAA0gMAMAMAAM4DACADAAAA0QMAIAIAANIDADADAADOAwAgDhMAALEIACAUAACyCAAgFgAAswgAIBcAALQIACAZAAC1CAAgGgAAtggAIOYCAQAAAAHnAgAAAJEDAvYCQAAAAAH3AkAAAAABkQMCAAAAAZIDQAAAAAGTA0AAAAABlAMgAAAAAQEwAADWAwAgCOYCAQAAAAHnAgAAAJEDAvYCQAAAAAH3AkAAAAABkQMCAAAAAZIDQAAAAAGTA0AAAAABlAMgAAAAAQEwAADYAwAwATAAANgDADAOEwAA6wcAIBQAAOwHACAWAADtBwAgFwAA7gcAIBkAAO8HACAaAADwBwAg5gIBANoFACHnAgAA6QeRAyL2AkAA4QUAIfcCQADhBQAhkQMCAOoHACGSA0AA4QUAIZMDQADhBQAhlAMgANwFACECAAAAzgMAIDAAANsDACAI5gIBANoFACHnAgAA6QeRAyL2AkAA4QUAIfcCQADhBQAhkQMCAOoHACGSA0AA4QUAIZMDQADhBQAhlAMgANwFACECAAAA0QMAIDAAAN0DACACAAAA0QMAIDAAAN0DACADAAAAzgMAIDcAANYDACA4AADbAwAgAQAAAM4DACABAAAA0QMAIAUSAADkBwAgPQAA5QcAID4AAOgHACA_AADnBwAgQAAA5gcAIAvjAgAAywQAMOQCAADkAwAQ5QIAAMsEADDmAgEArAQAIecCAADMBJEDIvYCQACzBAAh9wJAALMEACGRAwIAzQQAIZIDQACzBAAhkwNAALMEACGUAyAArgQAIQMAAADRAwAgAgAA4wMAMDwAAOQDACADAAAA0QMAIAIAANIDADADAADOAwAgAQAAAAYAIAEAAAAGACADAAAAAwAgAgAABQAwAwAABgAgAwAAAAMAIAIAAAUAMAMAAAYAIAMAAAADACACAAAFADADAAAGACAMAQAA4wcAIAUAAMwHACDmAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAY4DAQAAAAGPAwEAAAABATAAAOwDACAK5gIBAAAAAfQCAQAAAAH2AkAAAAAB9wJAAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGOAwEAAAABjwMBAAAAAQEwAADuAwAwATAAAO4DADAMAQAA4gcAIAUAAMsHACDmAgEA2gUAIfQCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYUDAQDaBQAhhgMBANoFACGHAwEA2gUAIYgDAQDaBQAhjgMBANsFACGPAwEA2gUAIQIAAAAGACAwAADxAwAgCuYCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhhQMBANoFACGGAwEA2gUAIYcDAQDaBQAhiAMBANoFACGOAwEA2wUAIY8DAQDaBQAhAgAAAAMAIDAAAPMDACACAAAAAwAgMAAA8wMAIAMAAAAGACA3AADsAwAgOAAA8QMAIAEAAAAGACABAAAAAwAgBBIAAN8HACA_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-AIBAAAAAfkCAQAAAAT6AgEAAAAE-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQDEBAAhgAMBAAAAAYEDAQAAAAGCAwEAAAABDhIAALgEACA_AADDBAAgQAAAwwQAIPgCAQAAAAH5AgEAAAAF-gIBAAAABfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAwgQAIYADAQAAAAGBAwEAAAABggMBAAAAAQUSAAC1BAAgPwAAwQQAIEAAAMEEACD4AiAAAAAB_wIgAMAEACEHEgAAtQQAID8AAL8EACBAAAC_BAAg-AIAAADsAgL5AgAAAOwCCPoCAAAA7AII_wIAAL4E7AIiBxIAALUEACA_AAC9BAAgQAAAvQQAIPgCAAAA7gIC-QIAAADuAgj6AgAAAO4CCP8CAAC8BO4CIgcSAAC1BAAgPwAAuwQAIEAAALsEACD4AgAAAPACAvkCAAAA8AII-gIAAADwAgj_AgAAugTwAiIFEgAAuAQAID8AALkEACBAAAC5BAAg-AIgAAAAAf8CIAC3BAAhCxIAALUEACA_AAC2BAAgQAAAtgQAIPgCQAAAAAH5AkAAAAAE-gJAAAAABPsCQAAAAAH8AkAAAAAB_QJAAAAAAf4CQAAAAAH_AkAAtAQAIQsSAAC1BAAgPwAAtgQAIEAAALYEACD4AkAAAAAB-QJAAAAABPoCQAAAAAT7AkAAAAAB_AJAAAAAAf0CQAAAAAH-AkAAAAAB_wJAALQEACEI-AICAAAAAfkCAgAAAAT6AgIAAAAE-wICAAAAAfwCAgAAAAH9AgIAAAAB_gICAAAAAf8CAgC1BAAhCPgCQAAAAAH5AkAAAAAE-gJAAAAABPsCQAAAAAH8AkAAAAAB_QJAAAAAAf4CQAAAAAH_AkAAtgQAIQUSAAC4BAAgPwAAuQQAIEAAALkEACD4AiAAAAAB_wIgALcEACEI-AICAAAAAfkCAgAAAAX6AgIAAAAF-wICAAAAAfwCAgAAAAH9AgIAAAAB_gICAAAAAf8CAgC4BAAhAvgCIAAAAAH_AiAAuQQAIQcSAAC1BAAgPwAAuwQAIEAAALsEACD4AgAAAPACAvkCAAAA8AII-gIAAADwAgj_AgAAugTwAiIE-AIAAADwAgL5AgAAAPACCPoCAAAA8AII_wIAALsE8AIiBxIAALUEACA_AAC9BAAgQAAAvQQAIPgCAAAA7gIC-QIAAADuAgj6AgAAAO4CCP8CAAC8BO4CIgT4AgAAAO4CAvkCAAAA7gII-gIAAADuAgj_AgAAvQTuAiIHEgAAtQQAID8AAL8EACBAAAC_BAAg-AIAAADsAgL5AgAAAOwCCPoCAAAA7AII_wIAAL4E7AIiBPgCAAAA7AIC-QIAAADsAgj6AgAAAOwCCP8CAAC_BOwCIgUSAAC1BAAgPwAAwQQAIEAAAMEEACD4AiAAAAAB_wIgAMAEACEC-AIgAAAAAf8CIADBBAAhDhIAALgEACA_AADDBAAgQAAAwwQAIPgCAQAAAAH5AgEAAAAF-gIBAAAABfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAwgQAIYADAQAAAAGBAwEAAAABggMBAAAAAQv4AgEAAAAB-QIBAAAABfoCAQAAAAX7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wIBAMMEACGAAwEAAAABgQMBAAAAAYIDAQAAAAEOEgAAtQQAID8AAMUEACBAAADFBAAg-AIBAAAAAfkCAQAAAAT6AgEAAAAE-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQDEBAAhgAMBAAAAAYEDAQAAAAGCAwEAAAABC_gCAQAAAAH5AgEAAAAE-gIBAAAABPsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAxQQAIYADAQAAAAGBAwEAAAABggMBAAAAARPjAgAAxgQAMOQCAACQBAAQ5QIAAMYEADDmAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIYMDAQCsBAAhhAMBAKwEACGFAwEArQQAIYYDAQCtBAAhhwNAAMcEACGIAwEArQQAIYkDAQCtBAAhigMBAK0EACGLAwEArQQAIYwDAQCtBAAhjQMBAK0EACGOAwEArQQAIQsSAAC4BAAgPwAAyQQAIEAAAMkEACD4AkAAAAAB-QJAAAAABfoCQAAAAAX7AkAAAAAB_AJAAAAAAf0CQAAAAAH-AkAAAAAB_wJAAMgEACELEgAAuAQAID8AAMkEACBAAADJBAAg-AJAAAAAAfkCQAAAAAX6AkAAAAAF-wJAAAAAAfwCQAAAAAH9AkAAAAAB_gJAAAAAAf8CQADIBAAhCPgCQAAAAAH5AkAAAAAF-gJAAAAABfsCQAAAAAH8AkAAAAAB_QJAAAAAAf4CQAAAAAH_AkAAyQQAIQ3jAgAAygQAMOQCAAD6AwAQ5QIAAMoEADDmAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIYUDAQCsBAAhhgMBAKwEACGHAwEArAQAIYgDAQCsBAAhjgMBAK0EACGPAwEArAQAIQvjAgAAywQAMOQCAADkAwAQ5QIAAMsEADDmAgEArAQAIecCAADMBJEDIvYCQACzBAAh9wJAALMEACGRAwIAzQQAIZIDQACzBAAhkwNAALMEACGUAyAArgQAIQcSAAC1BAAgPwAA0QQAIEAAANEEACD4AgAAAJEDAvkCAAAAkQMI-gIAAACRAwj_AgAA0ASRAyINEgAAtQQAID0AAM8EACA-AAC1BAAgPwAAtQQAIEAAALUEACD4AgIAAAAB-QICAAAABPoCAgAAAAT7AgIAAAAB_AICAAAAAf0CAgAAAAH-AgIAAAAB_wICAM4EACENEgAAtQQAID0AAM8EACA-AAC1BAAgPwAAtQQAIEAAALUEACD4AgIAAAAB-QICAAAABPoCAgAAAAT7AgIAAAAB_AICAAAAAf0CAgAAAAH-AgIAAAAB_wICAM4EACEI-AIIAAAAAfkCCAAAAAT6AggAAAAE-wIIAAAAAfwCCAAAAAH9AggAAAAB_gIIAAAAAf8CCADPBAAhBxIAALUEACA_AADRBAAgQAAA0QQAIPgCAAAAkQMC-QIAAACRAwj6AgAAAJEDCP8CAADQBJEDIgT4AgAAAJEDAvkCAAAAkQMI-gIAAACRAwj_AgAA0QSRAyIREwAA2AQAIBQAANkEACAWAADaBAAgFwAA2wQAIBkAANwEACAaAADdBAAg4wIAANIEADDkAgAA0QMAEOUCAADSBAAw5gIBANMEACHnAgAA1ASRAyL2AkAA1gQAIfcCQADWBAAhkQMCANUEACGSA0AA1gQAIZMDQADWBAAhlAMgANcEACEL-AIBAAAAAfkCAQAAAAT6AgEAAAAE-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CAQDFBAAhgAMBAAAAAYEDAQAAAAGCAwEAAAABBPgCAAAAkQMC-QIAAACRAwj6AgAAAJEDCP8CAADRBJEDIgj4AgIAAAAB-QICAAAABPoCAgAAAAT7AgIAAAAB_AICAAAAAf0CAgAAAAH-AgIAAAAB_wICALUEACEI-AJAAAAAAfkCQAAAAAT6AkAAAAAE-wJAAAAAAfwCQAAAAAH9AkAAAAAB_gJAAAAAAf8CQAC2BAAhAvgCIAAAAAH_AiAAwQQAIQOVAwAAHQAglgMAAB0AIJcDAAAdACADlQMAACkAIJYDAAApACCXAwAAKQAgA5UDAAAtACCWAwAALQAglwMAAC0AIAOVAwAAMQAglgMAADEAIJcDAAAxACADlQMAADoAIJYDAAA6ACCXAwAAOgAgA5UDAAA-ACCWAwAAPgAglwMAAD4AIALnAgAAAJEDApEDAgAAAAEL4wIAAN8EADDkAgAAywMAEOUCAADfBAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhjwMBAKwEACGZAwEArAQAIZoDCADgBAAhmwMBAKwEACGcAwgA4AQAIQ0SAAC1BAAgPQAAzwQAID4AAM8EACA_AADPBAAgQAAAzwQAIPgCCAAAAAH5AggAAAAE-gIIAAAABPsCCAAAAAH8AggAAAAB_QIIAAAAAf4CCAAAAAH_AggA4QQAIQ0SAAC1BAAgPQAAzwQAID4AAM8EACA_AADPBAAgQAAAzwQAIPgCCAAAAAH5AggAAAAE-gIIAAAABPsCCAAAAAH8AggAAAAB_QIIAAAAAf4CCAAAAAH_AggA4QQAIRMNAgDNBAAh4wIAAOIEADDkAgAAtQMAEOUCAADiBAAw5gIBAKwEACHnAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIZ4DAADjBJ4DIp8DAgDNBAAhoAMIAOAEACGiAwAA5ASiAyKjAwEArAQAIaQDCADgBAAhpQMIAOAEACGmAyAArgQAIacDCADgBAAhqAMIAOAEACEHEgAAtQQAID8AAOgEACBAAADoBAAg-AIAAACeAwL5AgAAAJ4DCPoCAAAAngMI_wIAAOcEngMiBxIAALUEACA_AADmBAAgQAAA5gQAIPgCAAAAogMC-QIAAACiAwj6AgAAAKIDCP8CAADlBKIDIgcSAAC1BAAgPwAA5gQAIEAAAOYEACD4AgAAAKIDAvkCAAAAogMI-gIAAACiAwj_AgAA5QSiAyIE-AIAAACiAwL5AgAAAKIDCPoCAAAAogMI_wIAAOYEogMiBxIAALUEACA_AADoBAAgQAAA6AQAIPgCAAAAngMC-QIAAACeAwj6AgAAAJ4DCP8CAADnBJ4DIgT4AgAAAJ4DAvkCAAAAngMI-gIAAACeAwj_AgAA6ASeAyII4wIAAOkEADDkAgAAnwMAEOUCAADpBAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhqQMBAKwEACGqAwEArAQAIQ_jAgAA6gQAMOQCAACJAwAQ5QIAAOoEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGDAwEArAQAIasDAQCtBAAhrAMIAOAEACGuAwAA6wSuAyKwAwAA7ASwAyKyAwAA7QSyAyKzAwEArQQAIbQDAQCtBAAhtQNAAMcEACEHEgAAtQQAID8AAPMEACBAAADzBAAg-AIAAACuAwL5AgAAAK4DCPoCAAAArgMI_wIAAPIErgMiBxIAALUEACA_AADxBAAgQAAA8QQAIPgCAAAAsAMC-QIAAACwAwj6AgAAALADCP8CAADwBLADIgcSAAC1BAAgPwAA7wQAIEAAAO8EACD4AgAAALIDAvkCAAAAsgMI-gIAAACyAwj_AgAA7gSyAyIHEgAAtQQAID8AAO8EACBAAADvBAAg-AIAAACyAwL5AgAAALIDCPoCAAAAsgMI_wIAAO4EsgMiBPgCAAAAsgMC-QIAAACyAwj6AgAAALIDCP8CAADvBLIDIgcSAAC1BAAgPwAA8QQAIEAAAPEEACD4AgAAALADAvkCAAAAsAMI-gIAAACwAwj_AgAA8ASwAyIE-AIAAACwAwL5AgAAALADCPoCAAAAsAMI_wIAAPEEsAMiBxIAALUEACA_AADzBAAgQAAA8wQAIPgCAAAArgMC-QIAAACuAwj6AgAAAK4DCP8CAADyBK4DIgT4AgAAAK4DAvkCAAAArgMI-gIAAACuAwj_AgAA8wSuAyIL4wIAAPQEADDkAgAA7wIAEOUCAAD0BAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhjwMBAKwEACGgAwgA4AQAIbYDAQCsBAAhtwMIAOAEACG4AwgA4AQAIRfjAgAA9QQAMOQCAADZAgAQ5QIAAPUEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGPAwEArAQAIbYDAQCsBAAhuQMBAKwEACG6AwAA6wSuAyK7AxAA9gQAIbwDEAD2BAAhvQMQAPYEACG-AxAA9gQAIb8DEAD2BAAhwAMQAPYEACHBAwAA7QSyAyLCAxAA9gQAIcMDEAD2BAAhxAMAAO0EsgMixQMQAPYEACHGAxAA9gQAIccDAADtBLIDIg0SAAC1BAAgPQAA-AQAID4AAPgEACA_AAD4BAAgQAAA-AQAIPgCEAAAAAH5AhAAAAAE-gIQAAAABPsCEAAAAAH8AhAAAAAB_QIQAAAAAf4CEAAAAAH_AhAA9wQAIQ0SAAC1BAAgPQAA-AQAID4AAPgEACA_AAD4BAAgQAAA-AQAIPgCEAAAAAH5AhAAAAAE-gIQAAAABPsCEAAAAAH8AhAAAAAB_QIQAAAAAf4CEAAAAAH_AhAA9wQAIQj4AhAAAAAB-QIQAAAABPoCEAAAAAT7AhAAAAAB_AIQAAAAAf0CEAAAAAH-AhAAAAAB_wIQAPgEACEM4wIAAPkEADDkAgAAwwIAEOUCAAD5BAAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhmgMIAOAEACGpAwEArAQAIbYDAQCsBAAhyAMBAKwEACHKAwAA-gTKAyLLA0AAswQAIQcSAAC1BAAgPwAA_AQAIEAAAPwEACD4AgAAAMoDAvkCAAAAygMI-gIAAADKAwj_AgAA-wTKAyIHEgAAtQQAID8AAPwEACBAAAD8BAAg-AIAAADKAwL5AgAAAMoDCPoCAAAAygMI_wIAAPsEygMiBPgCAAAAygMC-QIAAADKAwj6AgAAAMoDCP8CAAD8BMoDIgjjAgAA_QQAMOQCAACtAgAQ5QIAAP0EADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGPAwEArAQAIbYDAQCsBAAhCeMCAAD-BAAw5AIAAJcCABDlAgAA_gQAMOYCAQCsBAAh5wIBAKwEACH2AkAAswQAIfcCQACzBAAhowMBAK0EACHMAwEArAQAIQ4BAACFBQAgBAAAgQUAIAYAAIIFACAHAACDBQAgCAAAhAUAIOMCAAD_BAAw5AIAAGMAEOUCAAD_BAAw5gIBANMEACHnAgEA0wQAIfYCQADWBAAh9wJAANYEACGjAwEAgAUAIcwDAQDTBAAhC_gCAQAAAAH5AgEAAAAF-gIBAAAABfsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQAAAAH_AgEAwwQAIYADAQAAAAGBAwEAAAABggMBAAAAAQOVAwAAAwAglgMAAAMAIJcDAAADACADlQMAAAgAIJYDAAAIACCXAwAACAAgA5UDAAAMACCWAwAADAAglwMAAAwAIAOVAwAAEAAglgMAABAAIJcDAAAQACADlQMAAFkAIJYDAABZACCXAwAAWQAgDeMCAACGBQAw5AIAAP8BABDlAgAAhgUAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIY8DAQCsBAAhqQMBAKwEACG2AwEArAQAIc0DCADgBAAhzgMIAOAEACHPAwgA4AQAIdADCADgBAAhBuMCAACHBQAw5AIAAOkBABDlAgAAhwUAMOYCAQCsBAAhqQMBAKwEACHRAwEArAQAIQnjAgAAiAUAMOQCAADTAQAQ5QIAAIgFADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGpAwEArAQAIbYDAQCsBAAhyAMBAKwEACEO4wIAAIkFADDkAgAAvQEAEOUCAACJBQAw5gIBAKwEACH0AgEArAQAIfYCQACzBAAh9wJAALMEACGjAwEArAQAIcwDAQCsBAAh0gMBAKwEACHTAwgA4AQAIdQDAgDNBAAh1QMBAKwEACHXAwAAigXXAyIHEgAAtQQAID8AAIwFACBAAACMBQAg-AIAAADXAwL5AgAAANcDCPoCAAAA1wMI_wIAAIsF1wMiBxIAALUEACA_AACMBQAgQAAAjAUAIPgCAAAA1wMC-QIAAADXAwj6AgAAANcDCP8CAACLBdcDIgT4AgAAANcDAvkCAAAA1wMI-gIAAADXAwj_AgAAjAXXAyIN4wIAAI0FADDkAgAApwEAEOUCAACNBQAw5gIBAKwEACH2AkAAswQAIYMDAQCtBAAh2AMBAKwEACHZAwEArAQAIdoDAQCtBAAh2wMAAI4FACDcAwAAjgUAIN0DAQCtBAAh3gMBAK0EACEPEgAAuAQAID8AAI8FACBAAACPBQAg-AKAAAAAAfsCgAAAAAH8AoAAAAAB_QKAAAAAAf4CgAAAAAH_AoAAAAAB3wMBAAAAAeADAQAAAAHhAwEAAAAB4gOAAAAAAeMDgAAAAAHkA4AAAAABDPgCgAAAAAH7AoAAAAAB_AKAAAAAAf0CgAAAAAH-AoAAAAAB_wKAAAAAAd8DAQAAAAHgAwEAAAAB4QMBAAAAAeIDgAAAAAHjA4AAAAAB5AOAAAAAARLjAgAAkAUAMOQCAACPAQAQ5QIAAJAFADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGDAwEArAQAIdUDAQCsBAAh1wMAAJIF6wMi5QMBAK0EACHmAwEArQQAIecDCACRBQAh6AMIAJEFACHpAwgAkQUAIesDQACzBAAh7ANAAMcEACHtAwEArQQAIe4DAQCtBAAhDRIAALgEACA9AACWBQAgPgAAlgUAID8AAJYFACBAAACWBQAg-AIIAAAAAfkCCAAAAAX6AggAAAAF-wIIAAAAAfwCCAAAAAH9AggAAAAB_gIIAAAAAf8CCACVBQAhBxIAALUEACA_AACUBQAgQAAAlAUAIPgCAAAA6wMC-QIAAADrAwj6AgAAAOsDCP8CAACTBesDIgcSAAC1BAAgPwAAlAUAIEAAAJQFACD4AgAAAOsDAvkCAAAA6wMI-gIAAADrAwj_AgAAkwXrAyIE-AIAAADrAwL5AgAAAOsDCPoCAAAA6wMI_wIAAJQF6wMiDRIAALgEACA9AACWBQAgPgAAlgUAID8AAJYFACBAAACWBQAg-AIIAAAAAfkCCAAAAAX6AggAAAAF-wIIAAAAAfwCCAAAAAH9AggAAAAB_gIIAAAAAf8CCACVBQAhCPgCCAAAAAH5AggAAAAF-gIIAAAABfsCCAAAAAH8AggAAAAB_QIIAAAAAf4CCAAAAAH_AggAlgUAIQ4BAACZBQAg4wIAAJcFADDkAgAAbgAQ5QIAAJcFADDmAgEA0wQAIfYCQADWBAAhgwMBAIAFACHYAwEA0wQAIdkDAQDTBAAh2gMBAIAFACHbAwAAmAUAINwDAACYBQAg3QMBAIAFACHeAwEAgAUAIQz4AoAAAAAB-wKAAAAAAfwCgAAAAAH9AoAAAAAB_gKAAAAAAf8CgAAAAAHfAwEAAAAB4AMBAAAAAeEDAQAAAAHiA4AAAAAB4wOAAAAAAeQDgAAAAAEhBQAAoQUAIBEAAKIFACATAADYBAAgGQAA3AQAICIAAJ8FACAjAACgBQAgJAAAowUAICUAANoEACAmAADbBAAgJwAApAUAICgAAN0EACApAADZBAAgKgAApQUAIOMCAACaBQAw5AIAAFkAEOUCAACaBQAw5gIBANMEACHnAgEA0wQAIegCAQDTBAAh6QIBAIAFACHqAiAA1wQAIewCAACbBewCIu4CAACcBe4CIvACAACdBfACIvECAQDTBAAh8gIBANMEACHzAgEAgAUAIfQCAQCABQAh9QIgAJ4FACH2AkAA1gQAIfcCQADWBAAh9gMAAFkAIPcDAABZACAfBQAAoQUAIBEAAKIFACATAADYBAAgGQAA3AQAICIAAJ8FACAjAACgBQAgJAAAowUAICUAANoEACAmAADbBAAgJwAApAUAICgAAN0EACApAADZBAAgKgAApQUAIOMCAACaBQAw5AIAAFkAEOUCAACaBQAw5gIBANMEACHnAgEA0wQAIegCAQDTBAAh6QIBAIAFACHqAiAA1wQAIewCAACbBewCIu4CAACcBe4CIvACAACdBfACIvECAQDTBAAh8gIBANMEACHzAgEAgAUAIfQCAQCABQAh9QIgAJ4FACH2AkAA1gQAIfcCQADWBAAhBPgCAAAA7AIC-QIAAADsAgj6AgAAAOwCCP8CAAC_BOwCIgT4AgAAAO4CAvkCAAAA7gII-gIAAADuAgj_AgAAvQTuAiIE-AIAAADwAgL5AgAAAPACCPoCAAAA8AII_wIAALsE8AIiAvgCIAAAAAH_AiAAuQQAIREBAACpBQAgBQAAzgUAIOMCAADVBQAw5AIAAAMAEOUCAADVBQAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGFAwEA0wQAIYYDAQDTBAAhhwMBANMEACGIAwEA0wQAIY4DAQCABQAhjwMBANMEACH2AwAAAwAg9wMAAAMAIBcBAACpBQAgBQAAzgUAIOMCAADUBQAw5AIAAAgAEOUCAADUBQAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGDAwEA0wQAIYQDAQDTBAAhhQMBAIAFACGGAwEAgAUAIYcDQAC9BQAhiAMBAIAFACGJAwEAgAUAIYoDAQCABQAhiwMBAIAFACGMAwEAgAUAIY0DAQCABQAhjgMBAIAFACH2AwAACAAg9wMAAAgAIBABAACFBQAgBAAAgQUAIAYAAIIFACAHAACDBQAgCAAAhAUAIOMCAAD_BAAw5AIAAGMAEOUCAAD_BAAw5gIBANMEACHnAgEA0wQAIfYCQADWBAAh9wJAANYEACGjAwEAgAUAIcwDAQDTBAAh9gMAAGMAIPcDAABjACADlQMAACEAIJYDAAAhACCXAwAAIQAgFwEAAKkFACAHAAC-BQAgEQAAvwUAIOMCAAC6BQAw5AIAACYAEOUCAAC6BQAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhgwMBANMEACHVAwEA0wQAIdcDAAC8BesDIuUDAQCABQAh5gMBAIAFACHnAwgAuwUAIegDCAC7BQAh6QMIALsFACHrA0AA1gQAIewDQAC9BQAh7QMBAIAFACHuAwEAgAUAIfYDAAAmACD3AwAAJgAgA5UDAAA1ACCWAwAANQAglwMAADUAIAOVAwAAbgAglgMAAG4AIJcDAABuACADjwMBAAAAAakDAQAAAAG2AwEAAAABEAgAAKoFACAMAACpBQAgDQAAqwUAIOMCAACnBQAw5AIAAD4AEOUCAACnBQAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhjwMBANMEACGpAwEA0wQAIbYDAQDTBAAhzQMIAKgFACHOAwgAqAUAIc8DCACoBQAh0AMIAKgFACEI-AIIAAAAAfkCCAAAAAT6AggAAAAE-wIIAAAAAfwCCAAAAAH9AggAAAAB_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-QIIAAAABfoCCAAAAAX7AggAAAAB_AIIAAAAAf0CCAAAAAH-AggAAAAB_wIIAJYFACEE-AIAAADrAwL5AgAAAOsDCPoCAAAA6wMI_wIAAJQF6wMiCPgCQAAAAAH5AkAAAAAF-gJAAAAABfsCQAAAAAH8AkAAAAAB_QJAAAAAAf4CQAAAAAH_AkAAyQQAIRgFAADOBQAgDQIA1QQAISAAAIQFACAhAADTBQAg4wIAANAFADDkAgAADAAQ5QIAANAFADDmAgEA0wQAIecCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhngMAANEFngMinwMCANUEACGgAwgAqAUAIaIDAADSBaIDIqMDAQDTBAAhpAMIAKgFACGlAwgAqAUAIaYDIADXBAAhpwMIAKgFACGoAwgAqAUAIfYDAAAMACD3AwAADAAgFAEAAKkFACAPAAC5BQAgEAAAowUAIOMCAADABQAw5AIAACEAEOUCAADABQAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhgwMBANMEACGrAwEAgAUAIawDCACoBQAhrgMAAMEFrgMisAMAAMIFsAMisgMAAMMFsgMiswMBAIAFACG0AwEAgAUAIbUDQAC9BQAh9gMAACEAIPcDAAAhACASAQAAqQUAIA8AALkFACAQAACjBQAg4wIAAMAFADDkAgAAIQAQ5QIAAMAFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGDAwEA0wQAIasDAQCABQAhrAMIAKgFACGuAwAAwQWuAyKwAwAAwgWwAyKyAwAAwwWyAyKzAwEAgAUAIbQDAQCABQAhtQNAAL0FACEE-AIAAACuAwL5AgAAAK4DCPoCAAAArgMI_wIAAPMErgMiBPgCAAAAsAMC-QIAAACwAwj6AgAAALADCP8CAADxBLADIgT4AgAAALIDAvkCAAAAsgMI-gIAAACyAwj_AgAA7wSyAyICjwMBAAAAAbYDAQAAAAEbDAAAqQUAIA0AAKsFACAOAADHBQAgEQAAogUAIOMCAADFBQAw5AIAAB0AEOUCAADFBQAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhjwMBANMEACG2AwEA0wQAIbkDAQDTBAAhugMAAMEFrgMiuwMQAMYFACG8AxAAxgUAIb0DEADGBQAhvgMQAMYFACG_AxAAxgUAIcADEADGBQAhwQMAAMMFsgMiwgMQAMYFACHDAxAAxgUAIcQDAADDBbIDIsUDEADGBQAhxgMQAMYFACHHAwAAwwWyAyII-AIQAAAAAfkCEAAAAAT6AhAAAAAE-wIQAAAAAfwCEAAAAAH9AhAAAAAB_gIQAAAAAf8CEAD4BAAhDgwAAKkFACANAACrBQAgEwAAuQUAIBsAALgFACDjAgAAtwUAMOQCAAApABDlAgAAtwUAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhtgMBANMEACH2AwAAKQAg9wMAACkAIAKpAwEAAAAB0QMBAAAAAQgIAACqBQAgHAAAxwUAIOMCAADJBQAw5AIAABkAEOUCAADJBQAw5gIBANMEACGpAwEA0wQAIdEDAQDTBAAhAqkDAQAAAAGqAwEAAAABCggAAKoFACAJAACqBQAg4wIAAMsFADDkAgAAFAAQ5QIAAMsFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGpAwEA0wQAIaoDAQDTBAAhFgUAAM4FACAHAAC-BQAgCgAAzwUAIAsAAM8FACAXAADbBAAgHQAAuAUAIB4AANoEACAfAADdBAAg4wIAAMwFADDkAgAAEAAQ5QIAAMwFADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIaMDAQDTBAAhzAMBANMEACHSAwEA0wQAIdMDCACoBQAh1AMCANUEACHVAwEA0wQAIdcDAADNBdcDIgT4AgAAANcDAvkCAAAA1wMI-gIAAADXAwj_AgAAjAXXAyIQAQAAhQUAIAQAAIEFACAGAACCBQAgBwAAgwUAIAgAAIQFACDjAgAA_wQAMOQCAABjABDlAgAA_wQAMOYCAQDTBAAh5wIBANMEACH2AkAA1gQAIfcCQADWBAAhowMBAIAFACHMAwEA0wQAIfYDAABjACD3AwAAYwAgA5UDAAAUACCWAwAAFAAglwMAABQAIBYFAADOBQAgDQIA1QQAISAAAIQFACAhAADTBQAg4wIAANAFADDkAgAADAAQ5QIAANAFADDmAgEA0wQAIecCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhngMAANEFngMinwMCANUEACGgAwgAqAUAIaIDAADSBaIDIqMDAQDTBAAhpAMIAKgFACGlAwgAqAUAIaYDIADXBAAhpwMIAKgFACGoAwgAqAUAIQT4AgAAAJ4DAvkCAAAAngMI-gIAAACeAwj_AgAA6ASeAyIE-AIAAACiAwL5AgAAAKIDCPoCAAAAogMI_wIAAOYEogMiA5UDAAAmACCWAwAAJgAglwMAACYAIBUBAACpBQAgBQAAzgUAIOMCAADUBQAw5AIAAAgAEOUCAADUBQAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGDAwEA0wQAIYQDAQDTBAAhhQMBAIAFACGGAwEAgAUAIYcDQAC9BQAhiAMBAIAFACGJAwEAgAUAIYoDAQCABQAhiwMBAIAFACGMAwEAgAUAIY0DAQCABQAhjgMBAIAFACEPAQAAqQUAIAUAAM4FACDjAgAA1QUAMOQCAAADABDlAgAA1QUAMOYCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhhQMBANMEACGGAwEA0wQAIYcDAQDTBAAhiAMBANMEACGOAwEAgAUAIY8DAQDTBAAhAAAAAAH7AwEAAAABAfsDAQAAAAEB-wMgAAAAAQH7AwAAAOwCAgH7AwAAAO4CAgH7AwAAAPACAgH7AyAAAAABAfsDQAAAAAEHNwAAxgcAIDgAAMkHACD4AwAAxwcAIPkDAADIBwAg_AMAAAMAIP0DAAADACD-AwAABgAgBzcAAL8HACA4AADCBwAg-AMAAMAHACD5AwAAwQcAIPwDAAAIACD9AwAACAAg_gMAAAoAIAc3AACoCwAgOAAAmwwAIPgDAACpCwAg-QMAAJoMACD8AwAAYwAg_QMAAGMAIP4DAACCAgAgCzcAALYHADA4AAC6BwAw-AMAALcHADD5AwAAuAcAMPoDAAC5BwAg-wMAAJgGADD8AwAAmAYAMP0DAACYBgAw_gMAAJgGADD_AwAAuwcAMIAEAACbBgAwBzcAAKQHACA4AACnBwAg-AMAAKUHACD5AwAApgcAIPwDAAAmACD9AwAAJgAg_gMAAAEAIAs3AACUBwAwOAAAmQcAMPgDAACVBwAw-QMAAJYHADD6AwAAlwcAIPsDAACYBwAw_AMAAJgHADD9AwAAmAcAMP4DAACYBwAw_wMAAJoHADCABAAAmwcAMAs3AACGBwAwOAAAiwcAMPgDAACHBwAw-QMAAIgHADD6AwAAiQcAIPsDAACKBwAw_AMAAIoHADD9AwAAigcAMP4DAACKBwAw_wMAAIwHADCABAAAjQcAMAs3AADoBgAwOAAA7QYAMPgDAADpBgAw-QMAAOoGADD6AwAA6wYAIPsDAADsBgAw_AMAAOwGADD9AwAA7AYAMP4DAADsBgAw_wMAAO4GADCABAAA7wYAMAs3AADaBgAwOAAA3wYAMPgDAADbBgAw-QMAANwGADD6AwAA3QYAIPsDAADeBgAw_AMAAN4GADD9AwAA3gYAMP4DAADeBgAw_wMAAOAGADCABAAA4QYAMAs3AADMBgAwOAAA0QYAMPgDAADNBgAw-QMAAM4GADD6AwAAzwYAIPsDAADQBgAw_AMAANAGADD9AwAA0AYAMP4DAADQBgAw_wMAANIGADCABAAA0wYAMAs3AAC8BgAwOAAAwQYAMPgDAAC9BgAw-QMAAL4GADD6AwAAvwYAIPsDAADABgAw_AMAAMAGADD9AwAAwAYAMP4DAADABgAw_wMAAMIGADCABAAAwwYAMAs3AAD7BQAwOAAAgAYAMPgDAAD8BQAw-QMAAP0FADD6AwAA_gUAIPsDAAD_BQAw_AMAAP8FADD9AwAA_wUAMP4DAAD_BQAw_wMAAIEGADCABAAAggYAMAs3AADvBQAwOAAA9AUAMPgDAADwBQAw-QMAAPEFADD6AwAA8gUAIPsDAADzBQAw_AMAAPMFADD9AwAA8wUAMP4DAADzBQAw_wMAAPUFADCABAAA9gUAMAnmAgEAAAAB9gJAAAAAAdgDAQAAAAHZAwEAAAAB2gMBAAAAAdsDgAAAAAHcA4AAAAAB3QMBAAAAAd4DAQAAAAECAAAAcAAgNwAA-gUAIAMAAABwACA3AAD6BQAgOAAA-QUAIAEwAACZDAAwDgEAAJkFACDjAgAAlwUAMOQCAABuABDlAgAAlwUAMOYCAQAAAAH2AkAA1gQAIYMDAQCABQAh2AMBANMEACHZAwEA0wQAIdoDAQCABQAh2wMAAJgFACDcAwAAmAUAIN0DAQCABQAh3gMBAIAFACECAAAAcAAgMAAA-QUAIAIAAAD3BQAgMAAA-AUAIA3jAgAA9gUAMOQCAAD3BQAQ5QIAAPYFADDmAgEA0wQAIfYCQADWBAAhgwMBAIAFACHYAwEA0wQAIdkDAQDTBAAh2gMBAIAFACHbAwAAmAUAINwDAACYBQAg3QMBAIAFACHeAwEAgAUAIQ3jAgAA9gUAMOQCAAD3BQAQ5QIAAPYFADDmAgEA0wQAIfYCQADWBAAhgwMBAIAFACHYAwEA0wQAIdkDAQDTBAAh2gMBAIAFACHbAwAAmAUAINwDAACYBQAg3QMBAIAFACHeAwEAgAUAIQnmAgEA2gUAIfYCQADhBQAh2AMBANoFACHZAwEA2gUAIdoDAQDbBQAh2wOAAAAAAdwDgAAAAAHdAwEA2wUAId4DAQDbBQAhCeYCAQDaBQAh9gJAAOEFACHYAwEA2gUAIdkDAQDaBQAh2gMBANsFACHbA4AAAAAB3AOAAAAAAd0DAQDbBQAh3gMBANsFACEJ5gIBAAAAAfYCQAAAAAHYAwEAAAAB2QMBAAAAAdoDAQAAAAHbA4AAAAAB3AOAAAAAAd0DAQAAAAHeAwEAAAABBw0AALkGACATAAC7BgAgGwAAugYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAbYDAQAAAAECAAAAKwAgNwAAuAYAIAMAAAArACA3AAC4BgAgOAAAhQYAIAEwAACYDAAwDQwAAKkFACANAACrBQAgEwAAuQUAIBsAALgFACDjAgAAtwUAMOQCAAApABDlAgAAtwUAMOYCAQAAAAH2AkAA1gQAIfcCQADWBAAhjwMBANMEACG2AwEA0wQAIfADAAC2BQAgAgAAACsAIDAAAIUGACACAAAAgwYAIDAAAIQGACAI4wIAAIIGADDkAgAAgwYAEOUCAACCBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhjwMBANMEACG2AwEA0wQAIQjjAgAAggYAMOQCAACDBgAQ5QIAAIIGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGPAwEA0wQAIbYDAQDTBAAhBOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIbYDAQDaBQAhBw0AAIYGACATAACIBgAgGwAAhwYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIbYDAQDaBQAhBTcAAPgLACA4AACWDAAg-AMAAPkLACD5AwAAlQwAIP4DAADOAwAgCzcAAKoGADA4AACvBgAw-AMAAKsGADD5AwAArAYAMPoDAACtBgAg-wMAAK4GADD8AwAArgYAMP0DAACuBgAw_gMAAK4GADD_AwAAsAYAMIAEAACxBgAwBzcAAIkGACA4AACMBgAg-AMAAIoGACD5AwAAiwYAIPwDAAAdACD9AwAAHQAg_gMAAB8AIBYMAACnBgAgDQAAqAYAIBEAAKkGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABtgMBAAAAAboDAAAArgMCuwMQAAAAAbwDEAAAAAG9AxAAAAABvgMQAAAAAb8DEAAAAAHAAxAAAAABwQMAAACyAwLCAxAAAAABwwMQAAAAAcQDAAAAsgMCxQMQAAAAAcYDEAAAAAHHAwAAALIDAgIAAAAfACA3AACJBgAgAwAAAB0AIDcAAIkGACA4AACNBgAgGAAAAB0AIAwAAJEGACANAACSBgAgEQAAkwYAIDAAAI0GACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIbYDAQDaBQAhugMAAI4GrgMiuwMQAI8GACG8AxAAjwYAIb0DEACPBgAhvgMQAI8GACG_AxAAjwYAIcADEACPBgAhwQMAAJAGsgMiwgMQAI8GACHDAxAAjwYAIcQDAACQBrIDIsUDEACPBgAhxgMQAI8GACHHAwAAkAayAyIWDAAAkQYAIA0AAJIGACARAACTBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACG2AwEA2gUAIboDAACOBq4DIrsDEACPBgAhvAMQAI8GACG9AxAAjwYAIb4DEACPBgAhvwMQAI8GACHAAxAAjwYAIcEDAACQBrIDIsIDEACPBgAhwwMQAI8GACHEAwAAkAayAyLFAxAAjwYAIcYDEACPBgAhxwMAAJAGsgMiAfsDAAAArgMCBfsDEAAAAAGBBBAAAAABggQQAAAAAYMEEAAAAAGEBBAAAAABAfsDAAAAsgMCBTcAAIIMACA4AACTDAAg-AMAAIMMACD5AwAAkgwAIP4DAABbACAFNwAAgAwAIDgAAJAMACD4AwAAgQwAIPkDAACPDAAg_gMAAM4DACALNwAAlAYAMDgAAJkGADD4AwAAlQYAMPkDAACWBgAw-gMAAJcGACD7AwAAmAYAMPwDAACYBgAw_QMAAJgGADD-AwAAmAYAMP8DAACaBgAwgAQAAJsGADANAQAApQYAIBAAAKYGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGDAwEAAAABrAMIAAAAAa4DAAAArgMCsAMAAACwAwKyAwAAALIDArMDAQAAAAG0AwEAAAABtQNAAAAAAQIAAAAjACA3AACkBgAgAwAAACMAIDcAAKQGACA4AAChBgAgATAAAI4MADASAQAAqQUAIA8AALkFACAQAACjBQAg4wIAAMAFADDkAgAAIQAQ5QIAAMAFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIYMDAQDTBAAhqwMBAIAFACGsAwgAqAUAIa4DAADBBa4DIrADAADCBbADIrIDAADDBbIDIrMDAQAAAAG0AwEAAAABtQNAAL0FACECAAAAIwAgMAAAoQYAIAIAAACcBgAgMAAAnQYAIA_jAgAAmwYAMOQCAACcBgAQ5QIAAJsGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGDAwEA0wQAIasDAQCABQAhrAMIAKgFACGuAwAAwQWuAyKwAwAAwgWwAyKyAwAAwwWyAyKzAwEAgAUAIbQDAQCABQAhtQNAAL0FACEP4wIAAJsGADDkAgAAnAYAEOUCAACbBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhgwMBANMEACGrAwEAgAUAIawDCACoBQAhrgMAAMEFrgMisAMAAMIFsAMisgMAAMMFsgMiswMBAIAFACG0AwEAgAUAIbUDQAC9BQAhC-YCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYMDAQDaBQAhrAMIAJ4GACGuAwAAjgauAyKwAwAAnwawAyKyAwAAkAayAyKzAwEA2wUAIbQDAQDbBQAhtQNAAKAGACEF-wMIAAAAAYEECAAAAAGCBAgAAAABgwQIAAAAAYQECAAAAAEB-wMAAACwAwIB-wNAAAAAAQ0BAACiBgAgEAAAowYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYMDAQDaBQAhrAMIAJ4GACGuAwAAjgauAyKwAwAAnwawAyKyAwAAkAayAyKzAwEA2wUAIbQDAQDbBQAhtQNAAKAGACEFNwAAhgwAIDgAAIwMACD4AwAAhwwAIPkDAACLDAAg_gMAAFsAIAc3AACEDAAgOAAAiQwAIPgDAACFDAAg-QMAAIgMACD8AwAAJgAg_QMAACYAIP4DAAABACANAQAApQYAIBAAAKYGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGDAwEAAAABrAMIAAAAAa4DAAAArgMCsAMAAACwAwKyAwAAALIDArMDAQAAAAG0AwEAAAABtQNAAAAAAQM3AACGDAAg-AMAAIcMACD-AwAAWwAgAzcAAIQMACD4AwAAhQwAIP4DAAABACADNwAAggwAIPgDAACDDAAg_gMAAFsAIAM3AACADAAg-AMAAIEMACD-AwAAzgMAIAQ3AACUBgAw-AMAAJUGADD6AwAAlwYAIP4DAACYBgAwAwgAALcGACDmAgEAAAABqQMBAAAAAQIAAAAbACA3AAC2BgAgAwAAABsAIDcAALYGACA4AAC0BgAgATAAAP8LADAJCAAAqgUAIBwAAMcFACDjAgAAyQUAMOQCAAAZABDlAgAAyQUAMOYCAQAAAAGpAwEA0wQAIdEDAQDTBAAh9AMAAMgFACACAAAAGwAgMAAAtAYAIAIAAACyBgAgMAAAswYAIAbjAgAAsQYAMOQCAACyBgAQ5QIAALEGADDmAgEA0wQAIakDAQDTBAAh0QMBANMEACEG4wIAALEGADDkAgAAsgYAEOUCAACxBgAw5gIBANMEACGpAwEA0wQAIdEDAQDTBAAhAuYCAQDaBQAhqQMBANoFACEDCAAAtQYAIOYCAQDaBQAhqQMBANoFACEFNwAA-gsAIDgAAP0LACD4AwAA-wsAIPkDAAD8CwAg_gMAABIAIAMIAAC3BgAg5gIBAAAAAakDAQAAAAEDNwAA-gsAIPgDAAD7CwAg_gMAABIAIAcNAAC5BgAgEwAAuwYAIBsAALoGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAG2AwEAAAABAzcAAPgLACD4AwAA-QsAIP4DAADOAwAgBDcAAKoGADD4AwAAqwYAMPoDAACtBgAg_gMAAK4GADADNwAAiQYAIPgDAACKBgAg_gMAAB8AIAsIAADKBgAgDQAAywYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAG2AwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQIAAABAACA3AADJBgAgAwAAAEAAIDcAAMkGACA4AADGBgAgATAAAPcLADARCAAAqgUAIAwAAKkFACANAACrBQAg4wIAAKcFADDkAgAAPgAQ5QIAAKcFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhqQMBANMEACG2AwEA0wQAIc0DCACoBQAhzgMIAKgFACHPAwgAqAUAIdADCACoBQAh7wMAAKYFACACAAAAQAAgMAAAxgYAIAIAAADEBgAgMAAAxQYAIA3jAgAAwwYAMOQCAADEBgAQ5QIAAMMGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGPAwEA0wQAIakDAQDTBAAhtgMBANMEACHNAwgAqAUAIc4DCACoBQAhzwMIAKgFACHQAwgAqAUAIQ3jAgAAwwYAMOQCAADEBgAQ5QIAAMMGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGPAwEA0wQAIakDAQDTBAAhtgMBANMEACHNAwgAqAUAIc4DCACoBQAhzwMIAKgFACHQAwgAqAUAIQnmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGpAwEA2gUAIbYDAQDaBQAhzQMIAJ4GACHOAwgAngYAIc8DCACeBgAh0AMIAJ4GACELCAAAxwYAIA0AAMgGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGpAwEA2gUAIbYDAQDaBQAhzQMIAJ4GACHOAwgAngYAIc8DCACeBgAh0AMIAJ4GACEFNwAA7wsAIDgAAPULACD4AwAA8AsAIPkDAAD0CwAg_gMAABIAIAU3AADtCwAgOAAA8gsAIPgDAADuCwAg-QMAAPELACD-AwAAzgMAIAsIAADKBgAgDQAAywYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAG2AwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQM3AADvCwAg-AMAAPALACD-AwAAEgAgAzcAAO0LACD4AwAA7gsAIP4DAADOAwAgCA0AANkGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGgAwgAAAABtgMBAAAAAbcDCAAAAAG4AwgAAAABAgAAADwAIDcAANgGACADAAAAPAAgNwAA2AYAIDgAANYGACABMAAA7AsAMA4MAACpBQAgDQAAqwUAIOMCAACtBQAw5AIAADoAEOUCAACtBQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGPAwEA0wQAIaADCACoBQAhtgMBANMEACG3AwgAqAUAIbgDCACoBQAh8AMAAKwFACACAAAAPAAgMAAA1gYAIAIAAADUBgAgMAAA1QYAIAvjAgAA0wYAMOQCAADUBgAQ5QIAANMGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGPAwEA0wQAIaADCACoBQAhtgMBANMEACG3AwgAqAUAIbgDCACoBQAhC-MCAADTBgAw5AIAANQGABDlAgAA0wYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhoAMIAKgFACG2AwEA0wQAIbcDCACoBQAhuAMIAKgFACEH5gIBANoFACH2AkAA4QUAIfcCQADhBQAhoAMIAJ4GACG2AwEA2gUAIbcDCACeBgAhuAMIAJ4GACEIDQAA1wYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIaADCACeBgAhtgMBANoFACG3AwgAngYAIbgDCACeBgAhBTcAAOcLACA4AADqCwAg-AMAAOgLACD5AwAA6QsAIP4DAADOAwAgCA0AANkGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGgAwgAAAABtgMBAAAAAbcDCAAAAAG4AwgAAAABAzcAAOcLACD4AwAA6AsAIP4DAADOAwAgCBcAAOcGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGZAwEAAAABmgMIAAAAAZsDAQAAAAGcAwgAAAABAgAAADcAIDcAAOYGACADAAAANwAgNwAA5gYAIDgAAOQGACABMAAA5gsAMA4MAACpBQAgFwAAsAUAIOMCAACvBQAw5AIAADUAEOUCAACvBQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGPAwEA0wQAIZkDAQDTBAAhmgMIAKgFACGbAwEA0wQAIZwDCACoBQAh8QMAAK4FACACAAAANwAgMAAA5AYAIAIAAADiBgAgMAAA4wYAIAvjAgAA4QYAMOQCAADiBgAQ5QIAAOEGADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGPAwEA0wQAIZkDAQDTBAAhmgMIAKgFACGbAwEA0wQAIZwDCACoBQAhC-MCAADhBgAw5AIAAOIGABDlAgAA4QYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhmQMBANMEACGaAwgAqAUAIZsDAQDTBAAhnAMIAKgFACEH5gIBANoFACH2AkAA4QUAIfcCQADhBQAhmQMBANoFACGaAwgAngYAIZsDAQDaBQAhnAMIAJ4GACEIFwAA5QYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZkDAQDaBQAhmgMIAJ4GACGbAwEA2gUAIZwDCACeBgAhBTcAAOELACA4AADkCwAg-AMAAOILACD5AwAA4wsAIP4DAAAzACAIFwAA5wYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZkDAQAAAAGaAwgAAAABmwMBAAAAAZwDCAAAAAEDNwAA4QsAIPgDAADiCwAg_gMAADMAIAsIAACDBwAgDQAAhAcAIBgAAIUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGaAwgAAAABqQMBAAAAAbYDAQAAAAHKAwAAAMoDAssDQAAAAAECAAAAMwAgNwAAggcAIAMAAAAzACA3AACCBwAgOAAA8wYAIAEwAADgCwAwEQgAAKoFACANAACrBQAgFQAAqQUAIBgAAKQFACDjAgAAsgUAMOQCAAAxABDlAgAAsgUAMOYCAQAAAAH2AkAA1gQAIfcCQADWBAAhmgMIAKgFACGpAwEA0wQAIbYDAQDTBAAhyAMBANMEACHKAwAAswXKAyLLA0AA1gQAIfIDAACxBQAgAgAAADMAIDAAAPMGACACAAAA8AYAIDAAAPEGACAM4wIAAO8GADDkAgAA8AYAEOUCAADvBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhmgMIAKgFACGpAwEA0wQAIbYDAQDTBAAhyAMBANMEACHKAwAAswXKAyLLA0AA1gQAIQzjAgAA7wYAMOQCAADwBgAQ5QIAAO8GADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGaAwgAqAUAIakDAQDTBAAhtgMBANMEACHIAwEA0wQAIcoDAACzBcoDIssDQADWBAAhCOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZoDCACeBgAhqQMBANoFACG2AwEA2gUAIcoDAADyBsoDIssDQADhBQAhAfsDAAAAygMCCwgAAPQGACANAAD1BgAgGAAA9gYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZoDCACeBgAhqQMBANoFACG2AwEA2gUAIcoDAADyBsoDIssDQADhBQAhBTcAANILACA4AADeCwAg-AMAANMLACD5AwAA3QsAIP4DAAASACAFNwAA0AsAIDgAANsLACD4AwAA0QsAIPkDAADaCwAg_gMAAM4DACALNwAA9wYAMDgAAPsGADD4AwAA-AYAMPkDAAD5BgAw-gMAAPoGACD7AwAA3gYAMPwDAADeBgAw_QMAAN4GADD-AwAA3gYAMP8DAAD8BgAwgAQAAOEGADAIDAAAgQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGaAwgAAAABmwMBAAAAAZwDCAAAAAECAAAANwAgNwAAgAcAIAMAAAA3ACA3AACABwAgOAAA_gYAIAEwAADZCwAwAgAAADcAIDAAAP4GACACAAAA4gYAIDAAAP0GACAH5gIBANoFACH2AkAA4QUAIfcCQADhBQAhjwMBANoFACGaAwgAngYAIZsDAQDaBQAhnAMIAJ4GACEIDAAA_wYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhmgMIAJ4GACGbAwEA2gUAIZwDCACeBgAhBTcAANQLACA4AADXCwAg-AMAANULACD5AwAA1gsAIP4DAABbACAIDAAAgQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGaAwgAAAABmwMBAAAAAZwDCAAAAAEDNwAA1AsAIPgDAADVCwAg_gMAAFsAIAsIAACDBwAgDQAAhAcAIBgAAIUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGaAwgAAAABqQMBAAAAAbYDAQAAAAHKAwAAAMoDAssDQAAAAAEDNwAA0gsAIPgDAADTCwAg_gMAABIAIAM3AADQCwAg-AMAANELACD-AwAAzgMAIAQ3AAD3BgAw-AMAAPgGADD6AwAA-gYAIP4DAADeBgAwFg0AAKgGACAOAACTBwAgEQAAqQYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAbYDAQAAAAG5AwEAAAABugMAAACuAwK7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAwAAALIDAsIDEAAAAAHDAxAAAAABxAMAAACyAwLFAxAAAAABxgMQAAAAAccDAAAAsgMCAgAAAB8AIDcAAJIHACADAAAAHwAgNwAAkgcAIDgAAJAHACABMAAAzwsAMBwMAACpBQAgDQAAqwUAIA4AAMcFACARAACiBQAg4wIAAMUFADDkAgAAHQAQ5QIAAMUFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhtgMBANMEACG5AwEAAAABugMAAMEFrgMiuwMQAMYFACG8AxAAxgUAIb0DEADGBQAhvgMQAMYFACG_AxAAxgUAIcADEADGBQAhwQMAAMMFsgMiwgMQAMYFACHDAxAAxgUAIcQDAADDBbIDIsUDEADGBQAhxgMQAMYFACHHAwAAwwWyAyLwAwAAxAUAIAIAAAAfACAwAACQBwAgAgAAAI4HACAwAACPBwAgF-MCAACNBwAw5AIAAI4HABDlAgAAjQcAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhtgMBANMEACG5AwEA0wQAIboDAADBBa4DIrsDEADGBQAhvAMQAMYFACG9AxAAxgUAIb4DEADGBQAhvwMQAMYFACHAAxAAxgUAIcEDAADDBbIDIsIDEADGBQAhwwMQAMYFACHEAwAAwwWyAyLFAxAAxgUAIcYDEADGBQAhxwMAAMMFsgMiF-MCAACNBwAw5AIAAI4HABDlAgAAjQcAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIY8DAQDTBAAhtgMBANMEACG5AwEA0wQAIboDAADBBa4DIrsDEADGBQAhvAMQAMYFACG9AxAAxgUAIb4DEADGBQAhvwMQAMYFACHAAxAAxgUAIcEDAADDBbIDIsIDEADGBQAhwwMQAMYFACHEAwAAwwWyAyLFAxAAxgUAIcYDEADGBQAhxwMAAMMFsgMiE-YCAQDaBQAh9gJAAOEFACH3AkAA4QUAIbYDAQDaBQAhuQMBANoFACG6AwAAjgauAyK7AxAAjwYAIbwDEACPBgAhvQMQAI8GACG-AxAAjwYAIb8DEACPBgAhwAMQAI8GACHBAwAAkAayAyLCAxAAjwYAIcMDEACPBgAhxAMAAJAGsgMixQMQAI8GACHGAxAAjwYAIccDAACQBrIDIhYNAACSBgAgDgAAkQcAIBEAAJMGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACG2AwEA2gUAIbkDAQDaBQAhugMAAI4GrgMiuwMQAI8GACG8AxAAjwYAIb0DEACPBgAhvgMQAI8GACG_AxAAjwYAIcADEACPBgAhwQMAAJAGsgMiwgMQAI8GACHDAxAAjwYAIcQDAACQBrIDIsUDEACPBgAhxgMQAI8GACHHAwAAkAayAyIFNwAAygsAIDgAAM0LACD4AwAAywsAIPkDAADMCwAg_gMAACsAIBYNAACoBgAgDgAAkwcAIBEAAKkGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAG2AwEAAAABuQMBAAAAAboDAAAArgMCuwMQAAAAAbwDEAAAAAG9AxAAAAABvgMQAAAAAb8DEAAAAAHAAxAAAAABwQMAAACyAwLCAxAAAAABwwMQAAAAAcQDAAAAsgMCxQMQAAAAAcYDEAAAAAHHAwAAALIDAgM3AADKCwAg-AMAAMsLACD-AwAAKwAgBwgAAKIHACANAACjBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqQMBAAAAAbYDAQAAAAECAAAALwAgNwAAoQcAIAMAAAAvACA3AAChBwAgOAAAngcAIAEwAADJCwAwDQgAAKoFACANAACrBQAgFQAAqQUAIOMCAAC1BQAw5AIAAC0AEOUCAAC1BQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGpAwEA0wQAIbYDAQDTBAAhyAMBANMEACHzAwAAtAUAIAIAAAAvACAwAACeBwAgAgAAAJwHACAwAACdBwAgCeMCAACbBwAw5AIAAJwHABDlAgAAmwcAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIakDAQDTBAAhtgMBANMEACHIAwEA0wQAIQnjAgAAmwcAMOQCAACcBwAQ5QIAAJsHADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGpAwEA0wQAIbYDAQDTBAAhyAMBANMEACEF5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqQMBANoFACG2AwEA2gUAIQcIAACfBwAgDQAAoAcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIakDAQDaBQAhtgMBANoFACEFNwAAwQsAIDgAAMcLACD4AwAAwgsAIPkDAADGCwAg_gMAABIAIAU3AAC_CwAgOAAAxAsAIPgDAADACwAg-QMAAMMLACD-AwAAzgMAIAcIAACiBwAgDQAAowcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAG2AwEAAAABAzcAAMELACD4AwAAwgsAIP4DAAASACADNwAAvwsAIPgDAADACwAg_gMAAM4DACAQBwAAtAcAIBEAALUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAHVAwEAAAAB1wMAAADrAwLlAwEAAAAB5gMBAAAAAecDCAAAAAHoAwgAAAAB6QMIAAAAAesDQAAAAAHsA0AAAAAB7QMBAAAAAe4DAQAAAAECAAAAAQAgNwAApAcAIAMAAAAmACA3AACkBwAgOAAAqAcAIBIAAAAmACAHAACrBwAgEQAArAcAIDAAAKgHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACHVAwEA2gUAIdcDAACqB-sDIuUDAQDbBQAh5gMBANsFACHnAwgAqQcAIegDCACpBwAh6QMIAKkHACHrA0AA4QUAIewDQACgBgAh7QMBANsFACHuAwEA2wUAIRAHAACrBwAgEQAArAcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIdUDAQDaBQAh1wMAAKoH6wMi5QMBANsFACHmAwEA2wUAIecDCACpBwAh6AMIAKkHACHpAwgAqQcAIesDQADhBQAh7ANAAKAGACHtAwEA2wUAIe4DAQDbBQAhBfsDCAAAAAGBBAgAAAABggQIAAAAAYMECAAAAAGEBAgAAAABAfsDAAAA6wMCBTcAALULACA4AAC9CwAg-AMAALYLACD5AwAAvAsAIP4DAAAOACAHNwAArQcAIDgAALAHACD4AwAArgcAIPkDAACvBwAg_AMAACEAIP0DAAAhACD-AwAAIwAgDQEAAKUGACAPAACzBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABgwMBAAAAAasDAQAAAAGsAwgAAAABrgMAAACuAwKwAwAAALADArIDAAAAsgMCswMBAAAAAbUDQAAAAAECAAAAIwAgNwAArQcAIAMAAAAhACA3AACtBwAgOAAAsQcAIA8AAAAhACABAACiBgAgDwAAsgcAIDAAALEHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGDAwEA2gUAIasDAQDbBQAhrAMIAJ4GACGuAwAAjgauAyKwAwAAnwawAyKyAwAAkAayAyKzAwEA2wUAIbUDQACgBgAhDQEAAKIGACAPAACyBwAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhgwMBANoFACGrAwEA2wUAIawDCACeBgAhrgMAAI4GrgMisAMAAJ8GsAMisgMAAJAGsgMiswMBANsFACG1A0AAoAYAIQc3AAC3CwAgOAAAugsAIPgDAAC4CwAg-QMAALkLACD8AwAAHQAg_QMAAB0AIP4DAAAfACADNwAAtwsAIPgDAAC4CwAg_gMAAB8AIAM3AAC1CwAg-AMAALYLACD-AwAADgAgAzcAAK0HACD4AwAArgcAIP4DAAAjACANDwAAswcAIBAAAKYGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGrAwEAAAABrAMIAAAAAa4DAAAArgMCsAMAAACwAwKyAwAAALIDArMDAQAAAAG0AwEAAAABtQNAAAAAAQIAAAAjACA3AAC-BwAgAwAAACMAIDcAAL4HACA4AAC9BwAgATAAALQLADACAAAAIwAgMAAAvQcAIAIAAACcBgAgMAAAvAcAIAvmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGrAwEA2wUAIawDCACeBgAhrgMAAI4GrgMisAMAAJ8GsAMisgMAAJAGsgMiswMBANsFACG0AwEA2wUAIbUDQACgBgAhDQ8AALIHACAQAACjBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqwMBANsFACGsAwgAngYAIa4DAACOBq4DIrADAACfBrADIrIDAACQBrIDIrMDAQDbBQAhtAMBANsFACG1A0AAoAYAIQ0PAACzBwAgEAAApgYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAasDAQAAAAGsAwgAAAABrgMAAACuAwKwAwAAALADArIDAAAAsgMCswMBAAAAAbQDAQAAAAG1A0AAAAABEAUAAMUHACDmAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABhAMBAAAAAYUDAQAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY4DAQAAAAECAAAACgAgNwAAvwcAIAMAAAAIACA3AAC_BwAgOAAAwwcAIBIAAAAIACAFAADEBwAgMAAAwwcAIOYCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhhAMBANoFACGFAwEA2wUAIYYDAQDbBQAhhwNAAKAGACGIAwEA2wUAIYkDAQDbBQAhigMBANsFACGLAwEA2wUAIYwDAQDbBQAhjQMBANsFACGOAwEA2wUAIRAFAADEBwAg5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGEAwEA2gUAIYUDAQDbBQAhhgMBANsFACGHA0AAoAYAIYgDAQDbBQAhiQMBANsFACGKAwEA2wUAIYsDAQDbBQAhjAMBANsFACGNAwEA2wUAIY4DAQDbBQAhBTcAAK8LACA4AACyCwAg-AMAALALACD5AwAAsQsAIP4DAACCAgAgAzcAAK8LACD4AwAAsAsAIP4DAACCAgAgCgUAAMwHACDmAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAY4DAQAAAAECAAAABgAgNwAAxgcAIAMAAAADACA3AADGBwAgOAAAygcAIAwAAAADACAFAADLBwAgMAAAygcAIOYCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhhQMBANoFACGGAwEA2gUAIYcDAQDaBQAhiAMBANoFACGOAwEA2wUAIQoFAADLBwAg5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIYYDAQDaBQAhhwMBANoFACGIAwEA2gUAIY4DAQDbBQAhBTcAAKoLACA4AACtCwAg-AMAAKsLACD5AwAArAsAIP4DAACCAgAgAzcAAKoLACD4AwAAqwsAIP4DAACCAgAgAzcAAMYHACD4AwAAxwcAIP4DAAAGACADNwAAvwcAIPgDAADABwAg_gMAAAoAIAM3AACoCwAg-AMAAKkLACD-AwAAggIAIAQ3AAC2BwAw-AMAALcHADD6AwAAuQcAIP4DAACYBgAwAzcAAKQHACD4AwAApQcAIP4DAAABACAENwAAlAcAMPgDAACVBwAw-gMAAJcHACD-AwAAmAcAMAQ3AACGBwAw-AMAAIcHADD6AwAAiQcAIP4DAACKBwAwBDcAAOgGADD4AwAA6QYAMPoDAADrBgAg_gMAAOwGADAENwAA2gYAMPgDAADbBgAw-gMAAN0GACD-AwAA3gYAMAQ3AADMBgAw-AMAAM0GADD6AwAAzwYAIP4DAADQBgAwBDcAALwGADD4AwAAvQYAMPoDAAC_BgAg_gMAAMAGADAENwAA-wUAMPgDAAD8BQAw-gMAAP4FACD-AwAA_wUAMAQ3AADvBQAw-AMAAPAFADD6AwAA8gUAIP4DAADzBQAwAAAABTcAAKMLACA4AACmCwAg-AMAAKQLACD5AwAApQsAIP4DAABbACADNwAAowsAIPgDAACkCwAg_gMAAFsAIAAAAAU3AACeCwAgOAAAoQsAIPgDAACfCwAg-QMAAKALACD-AwAAWwAgAzcAAJ4LACD4AwAAnwsAIP4DAABbACAAAAAAAAH7AwAAAJEDAgX7AwIAAAABgQQCAAAAAYIEAgAAAAGDBAIAAAABhAQCAAAAAQs3AACoCAAwOAAArAgAMPgDAACpCAAw-QMAAKoIADD6AwAAqwgAIPsDAACKBwAw_AMAAIoHADD9AwAAigcAMP4DAACKBwAw_wMAAK0IADCABAAAjQcAMAs3AACdCAAwOAAAoQgAMPgDAACeCAAw-QMAAJ8IADD6AwAAoAgAIPsDAAD_BQAw_AMAAP8FADD9AwAA_wUAMP4DAAD_BQAw_wMAAKIIADCABAAAggYAMAs3AACSCAAwOAAAlggAMPgDAACTCAAw-QMAAJQIADD6AwAAlQgAIPsDAACYBwAw_AMAAJgHADD9AwAAmAcAMP4DAACYBwAw_wMAAJcIADCABAAAmwcAMAs3AACHCAAwOAAAiwgAMPgDAACICAAw-QMAAIkIADD6AwAAiggAIPsDAADsBgAw_AMAAOwGADD9AwAA7AYAMP4DAADsBgAw_wMAAIwIADCABAAA7wYAMAs3AAD8BwAwOAAAgAgAMPgDAAD9BwAw-QMAAP4HADD6AwAA_wcAIPsDAADQBgAw_AMAANAGADD9AwAA0AYAMP4DAADQBgAw_wMAAIEIADCABAAA0wYAMAs3AADxBwAwOAAA9QcAMPgDAADyBwAw-QMAAPMHADD6AwAA9AcAIPsDAADABgAw_AMAAMAGADD9AwAAwAYAMP4DAADABgAw_wMAAPYHADCABAAAwwYAMAsIAADKBgAgDAAA-wcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGpAwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQIAAABAACA3AAD6BwAgAwAAAEAAIDcAAPoHACA4AAD4BwAgATAAAJ0LADACAAAAQAAgMAAA-AcAIAIAAADEBgAgMAAA9wcAIAnmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIakDAQDaBQAhzQMIAJ4GACHOAwgAngYAIc8DCACeBgAh0AMIAJ4GACELCAAAxwYAIAwAAPkHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIakDAQDaBQAhzQMIAJ4GACHOAwgAngYAIc8DCACeBgAh0AMIAJ4GACEFNwAAmAsAIDgAAJsLACD4AwAAmQsAIPkDAACaCwAg_gMAAFsAIAsIAADKBgAgDAAA-wcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAGpAwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQM3AACYCwAg-AMAAJkLACD-AwAAWwAgCAwAAIYIACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABoAMIAAAAAbcDCAAAAAG4AwgAAAABAgAAADwAIDcAAIUIACADAAAAPAAgNwAAhQgAIDgAAIMIACABMAAAlwsAMAIAAAA8ACAwAACDCAAgAgAAANQGACAwAACCCAAgB-YCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhoAMIAJ4GACG3AwgAngYAIbgDCACeBgAhCAwAAIQIACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIaADCACeBgAhtwMIAJ4GACG4AwgAngYAIQU3AACSCwAgOAAAlQsAIPgDAACTCwAg-QMAAJQLACD-AwAAWwAgCAwAAIYIACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABoAMIAAAAAbcDCAAAAAG4AwgAAAABAzcAAJILACD4AwAAkwsAIP4DAABbACALCAAAgwcAIBUAAJEIACAYAACFBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABmgMIAAAAAakDAQAAAAHIAwEAAAABygMAAADKAwLLA0AAAAABAgAAADMAIDcAAJAIACADAAAAMwAgNwAAkAgAIDgAAI4IACABMAAAkQsAMAIAAAAzACAwAACOCAAgAgAAAPAGACAwAACNCAAgCOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZoDCACeBgAhqQMBANoFACHIAwEA2gUAIcoDAADyBsoDIssDQADhBQAhCwgAAPQGACAVAACPCAAgGAAA9gYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZoDCACeBgAhqQMBANoFACHIAwEA2gUAIcoDAADyBsoDIssDQADhBQAhBTcAAIwLACA4AACPCwAg-AMAAI0LACD5AwAAjgsAIP4DAABbACALCAAAgwcAIBUAAJEIACAYAACFBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABmgMIAAAAAakDAQAAAAHIAwEAAAABygMAAADKAwLLA0AAAAABAzcAAIwLACD4AwAAjQsAIP4DAABbACAHCAAAogcAIBUAAJwIACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGpAwEAAAAByAMBAAAAAQIAAAAvACA3AACbCAAgAwAAAC8AIDcAAJsIACA4AACZCAAgATAAAIsLADACAAAALwAgMAAAmQgAIAIAAACcBwAgMAAAmAgAIAXmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGpAwEA2gUAIcgDAQDaBQAhBwgAAJ8HACAVAACaCAAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqQMBANoFACHIAwEA2gUAIQU3AACGCwAgOAAAiQsAIPgDAACHCwAg-QMAAIgLACD-AwAAWwAgBwgAAKIHACAVAACcCAAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqQMBAAAAAcgDAQAAAAEDNwAAhgsAIPgDAACHCwAg_gMAAFsAIAcMAACnCAAgEwAAuwYAIBsAALoGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGPAwEAAAABAgAAACsAIDcAAKYIACADAAAAKwAgNwAApggAIDgAAKQIACABMAAAhQsAMAIAAAArACAwAACkCAAgAgAAAIMGACAwAACjCAAgBOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhBwwAAKUIACATAACIBgAgGwAAhwYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhBTcAAIALACA4AACDCwAg-AMAAIELACD5AwAAggsAIP4DAABbACAHDAAApwgAIBMAALsGACAbAAC6BgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAQM3AACACwAg-AMAAIELACD-AwAAWwAgFgwAAKcGACAOAACTBwAgEQAAqQYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAG5AwEAAAABugMAAACuAwK7AxAAAAABvAMQAAAAAb0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAwAAALIDAsIDEAAAAAHDAxAAAAABxAMAAACyAwLFAxAAAAABxgMQAAAAAccDAAAAsgMCAgAAAB8AIDcAALAIACADAAAAHwAgNwAAsAgAIDgAAK8IACABMAAA_woAMAIAAAAfACAwAACvCAAgAgAAAI4HACAwAACuCAAgE-YCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhuQMBANoFACG6AwAAjgauAyK7AxAAjwYAIbwDEACPBgAhvQMQAI8GACG-AxAAjwYAIb8DEACPBgAhwAMQAI8GACHBAwAAkAayAyLCAxAAjwYAIcMDEACPBgAhxAMAAJAGsgMixQMQAI8GACHGAxAAjwYAIccDAACQBrIDIhYMAACRBgAgDgAAkQcAIBEAAJMGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGPAwEA2gUAIbkDAQDaBQAhugMAAI4GrgMiuwMQAI8GACG8AxAAjwYAIb0DEACPBgAhvgMQAI8GACG_AxAAjwYAIcADEACPBgAhwQMAAJAGsgMiwgMQAI8GACHDAxAAjwYAIcQDAACQBrIDIsUDEACPBgAhxgMQAI8GACHHAwAAkAayAyIWDAAApwYAIA4AAJMHACARAACpBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAbkDAQAAAAG6AwAAAK4DArsDEAAAAAG8AxAAAAABvQMQAAAAAb4DEAAAAAG_AxAAAAABwAMQAAAAAcEDAAAAsgMCwgMQAAAAAcMDEAAAAAHEAwAAALIDAsUDEAAAAAHGAxAAAAABxwMAAACyAwIENwAAqAgAMPgDAACpCAAw-gMAAKsIACD-AwAAigcAMAQ3AACdCAAw-AMAAJ4IADD6AwAAoAgAIP4DAAD_BQAwBDcAAJIIADD4AwAAkwgAMPoDAACVCAAg_gMAAJgHADAENwAAhwgAMPgDAACICAAw-gMAAIoIACD-AwAA7AYAMAQ3AAD8BwAw-AMAAP0HADD6AwAA_wcAIP4DAADQBgAwBDcAAPEHADD4AwAA8gcAMPoDAAD0BwAg_gMAAMAGADAAAAAAAAAAAAAAAAAAAAAAAfsDAAAAngMCAfsDAAAAogMCBTcAANkKACA4AAD9CgAg-AMAANoKACD5AwAA_AoAIP4DAACCAgAgCzcAANoIADA4AADfCAAw-AMAANsIADD5AwAA3AgAMPoDAADdCAAg-wMAAN4IADD8AwAA3ggAMP0DAADeCAAw_gMAAN4IADD_AwAA4AgAMIAEAADhCAAwCzcAAMwIADA4AADRCAAw-AMAAM0IADD5AwAAzggAMPoDAADPCAAg-wMAANAIADD8AwAA0AgAMP0DAADQCAAw_gMAANAIADD_AwAA0ggAMIAEAADTCAAwEAEAANkIACARAAC1BwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABgwMBAAAAAdcDAAAA6wMC5QMBAAAAAeYDAQAAAAHnAwgAAAAB6AMIAAAAAekDCAAAAAHrA0AAAAAB7ANAAAAAAe0DAQAAAAHuAwEAAAABAgAAAAEAIDcAANgIACADAAAAAQAgNwAA2AgAIDgAANYIACABMAAA-woAMBUBAACpBQAgBwAAvgUAIBEAAL8FACDjAgAAugUAMOQCAAAmABDlAgAAugUAMOYCAQAAAAH2AkAA1gQAIfcCQADWBAAhgwMBAAAAAdUDAQDTBAAh1wMAALwF6wMi5QMBAIAFACHmAwEAgAUAIecDCAC7BQAh6AMIALsFACHpAwgAuwUAIesDQADWBAAh7ANAAL0FACHtAwEAgAUAIe4DAQCABQAhAgAAAAEAIDAAANYIACACAAAA1AgAIDAAANUIACAS4wIAANMIADDkAgAA1AgAEOUCAADTCAAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhgwMBANMEACHVAwEA0wQAIdcDAAC8BesDIuUDAQCABQAh5gMBAIAFACHnAwgAuwUAIegDCAC7BQAh6QMIALsFACHrA0AA1gQAIewDQAC9BQAh7QMBAIAFACHuAwEAgAUAIRLjAgAA0wgAMOQCAADUCAAQ5QIAANMIADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGDAwEA0wQAIdUDAQDTBAAh1wMAALwF6wMi5QMBAIAFACHmAwEAgAUAIecDCAC7BQAh6AMIALsFACHpAwgAuwUAIesDQADWBAAh7ANAAL0FACHtAwEAgAUAIe4DAQCABQAhDuYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYMDAQDaBQAh1wMAAKoH6wMi5QMBANsFACHmAwEA2wUAIecDCACpBwAh6AMIAKkHACHpAwgAqQcAIesDQADhBQAh7ANAAKAGACHtAwEA2wUAIe4DAQDbBQAhEAEAANcIACARAACsBwAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhgwMBANoFACHXAwAAqgfrAyLlAwEA2wUAIeYDAQDbBQAh5wMIAKkHACHoAwgAqQcAIekDCACpBwAh6wNAAOEFACHsA0AAoAYAIe0DAQDbBQAh7gMBANsFACEFNwAA9goAIDgAAPkKACD4AwAA9woAIPkDAAD4CgAg_gMAAFsAIBABAADZCAAgEQAAtQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAYMDAQAAAAHXAwAAAOsDAuUDAQAAAAHmAwEAAAAB5wMIAAAAAegDCAAAAAHpAwgAAAAB6wNAAAAAAewDQAAAAAHtAwEAAAAB7gMBAAAAAQM3AAD2CgAg-AMAAPcKACD-AwAAWwAgEQUAAK0JACAKAACuCQAgCwAArwkAIBcAALIJACAdAACwCQAgHgAAsQkAIB8AALMJACDmAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABowMBAAAAAcwDAQAAAAHSAwEAAAAB0wMIAAAAAdQDAgAAAAHXAwAAANcDAgIAAAASACA3AACsCQAgAwAAABIAIDcAAKwJACA4AADlCAAgATAAAPUKADAWBQAAzgUAIAcAAL4FACAKAADPBQAgCwAAzwUAIBcAANsEACAdAAC4BQAgHgAA2gQAIB8AAN0EACDjAgAAzAUAMOQCAAAQABDlAgAAzAUAMOYCAQAAAAH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGjAwEA0wQAIcwDAQAAAAHSAwEA0wQAIdMDCACoBQAh1AMCANUEACHVAwEA0wQAIdcDAADNBdcDIgIAAAASACAwAADlCAAgAgAAAOIIACAwAADjCAAgDuMCAADhCAAw5AIAAOIIABDlAgAA4QgAMOYCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhowMBANMEACHMAwEA0wQAIdIDAQDTBAAh0wMIAKgFACHUAwIA1QQAIdUDAQDTBAAh1wMAAM0F1wMiDuMCAADhCAAw5AIAAOIIABDlAgAA4QgAMOYCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhowMBANMEACHMAwEA0wQAIdIDAQDTBAAh0wMIAKgFACHUAwIA1QQAIdUDAQDTBAAh1wMAAM0F1wMiCuYCAQDaBQAh9AIBANoFACH2AkAA4QUAIfcCQADhBQAhowMBANoFACHMAwEA2gUAIdIDAQDaBQAh0wMIAJ4GACHUAwIA6gcAIdcDAADkCNcDIgH7AwAAANcDAhEFAADmCAAgCgAA5wgAIAsAAOgIACAXAADrCAAgHQAA6QgAIB4AAOoIACAfAADsCAAg5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGjAwEA2gUAIcwDAQDaBQAh0gMBANoFACHTAwgAngYAIdQDAgDqBwAh1wMAAOQI1wMiBTcAANsKACA4AADzCgAg-AMAANwKACD5AwAA8goAIP4DAACCAgAgCzcAAKEJADA4AAClCQAw-AMAAKIJADD5AwAAowkAMPoDAACkCQAg-wMAAJcJADD8AwAAlwkAMP0DAACXCQAw_gMAAJcJADD_AwAApgkAMIAEAACaCQAwCzcAAJMJADA4AACYCQAw-AMAAJQJADD5AwAAlQkAMPoDAACWCQAg-wMAAJcJADD8AwAAlwkAMP0DAACXCQAw_gMAAJcJADD_AwAAmQkAMIAEAACaCQAwCzcAAIgJADA4AACMCQAw-AMAAIkJADD5AwAAigkAMPoDAACLCQAg-wMAAK4GADD8AwAArgYAMP0DAACuBgAw_gMAAK4GADD_AwAAjQkAMIAEAACxBgAwCzcAAP8IADA4AACDCQAw-AMAAIAJADD5AwAAgQkAMPoDAACCCQAg-wMAAJgHADD8AwAAmAcAMP0DAACYBwAw_gMAAJgHADD_AwAAhAkAMIAEAACbBwAwCzcAAPYIADA4AAD6CAAw-AMAAPcIADD5AwAA-AgAMPoDAAD5CAAg-wMAAOwGADD8AwAA7AYAMP0DAADsBgAw_gMAAOwGADD_AwAA-wgAMIAEAADvBgAwCzcAAO0IADA4AADxCAAw-AMAAO4IADD5AwAA7wgAMPoDAADwCAAg-wMAAMAGADD8AwAAwAYAMP0DAADABgAw_gMAAMAGADD_AwAA8ggAMIAEAADDBgAwCwwAAPsHACANAADLBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABjwMBAAAAAbYDAQAAAAHNAwgAAAABzgMIAAAAAc8DCAAAAAHQAwgAAAABAgAAAEAAIDcAAPUIACADAAAAQAAgNwAA9QgAIDgAAPQIACABMAAA8QoAMAIAAABAACAwAAD0CAAgAgAAAMQGACAwAADzCAAgCeYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhtgMBANoFACHNAwgAngYAIc4DCACeBgAhzwMIAJ4GACHQAwgAngYAIQsMAAD5BwAgDQAAyAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIY8DAQDaBQAhtgMBANoFACHNAwgAngYAIc4DCACeBgAhzwMIAJ4GACHQAwgAngYAIQsMAAD7BwAgDQAAywYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAY8DAQAAAAG2AwEAAAABzQMIAAAAAc4DCAAAAAHPAwgAAAAB0AMIAAAAAQsNAACEBwAgFQAAkQgAIBgAAIUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGaAwgAAAABtgMBAAAAAcgDAQAAAAHKAwAAAMoDAssDQAAAAAECAAAAMwAgNwAA_ggAIAMAAAAzACA3AAD-CAAgOAAA_QgAIAEwAADwCgAwAgAAADMAIDAAAP0IACACAAAA8AYAIDAAAPwIACAI5gIBANoFACH2AkAA4QUAIfcCQADhBQAhmgMIAJ4GACG2AwEA2gUAIcgDAQDaBQAhygMAAPIGygMiywNAAOEFACELDQAA9QYAIBUAAI8IACAYAAD2BgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhmgMIAJ4GACG2AwEA2gUAIcgDAQDaBQAhygMAAPIGygMiywNAAOEFACELDQAAhAcAIBUAAJEIACAYAACFBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABmgMIAAAAAbYDAQAAAAHIAwEAAAABygMAAADKAwLLA0AAAAABBw0AAKMHACAVAACcCAAg5gIBAAAAAfYCQAAAAAH3AkAAAAABtgMBAAAAAcgDAQAAAAECAAAALwAgNwAAhwkAIAMAAAAvACA3AACHCQAgOAAAhgkAIAEwAADvCgAwAgAAAC8AIDAAAIYJACACAAAAnAcAIDAAAIUJACAF5gIBANoFACH2AkAA4QUAIfcCQADhBQAhtgMBANoFACHIAwEA2gUAIQcNAACgBwAgFQAAmggAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIbYDAQDaBQAhyAMBANoFACEHDQAAowcAIBUAAJwIACDmAgEAAAAB9gJAAAAAAfcCQAAAAAG2AwEAAAAByAMBAAAAAQMcAACSCQAg5gIBAAAAAdEDAQAAAAECAAAAGwAgNwAAkQkAIAMAAAAbACA3AACRCQAgOAAAjwkAIAEwAADuCgAwAgAAABsAIDAAAI8JACACAAAAsgYAIDAAAI4JACAC5gIBANoFACHRAwEA2gUAIQMcAACQCQAg5gIBANoFACHRAwEA2gUAIQU3AADpCgAgOAAA7AoAIPgDAADqCgAg-QMAAOsKACD-AwAAKwAgAxwAAJIJACDmAgEAAAAB0QMBAAAAAQM3AADpCgAg-AMAAOoKACD-AwAAKwAgBQgAAKAJACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGpAwEAAAABAgAAABYAIDcAAJ8JACADAAAAFgAgNwAAnwkAIDgAAJ0JACABMAAA6AoAMAsIAACqBQAgCQAAqgUAIOMCAADLBQAw5AIAABQAEOUCAADLBQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGpAwEA0wQAIaoDAQDTBAAh9QMAAMoFACACAAAAFgAgMAAAnQkAIAIAAACbCQAgMAAAnAkAIAjjAgAAmgkAMOQCAACbCQAQ5QIAAJoJADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGpAwEA0wQAIaoDAQDTBAAhCOMCAACaCQAw5AIAAJsJABDlAgAAmgkAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIakDAQDTBAAhqgMBANMEACEE5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqQMBANoFACEFCAAAngkAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIakDAQDaBQAhBTcAAOMKACA4AADmCgAg-AMAAOQKACD5AwAA5QoAIP4DAAASACAFCAAAoAkAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAakDAQAAAAEDNwAA4woAIPgDAADkCgAg_gMAABIAIAUJAACrCQAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqgMBAAAAAQIAAAAWACA3AACqCQAgAwAAABYAIDcAAKoJACA4AACoCQAgATAAAOIKADACAAAAFgAgMAAAqAkAIAIAAACbCQAgMAAApwkAIATmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGqAwEA2gUAIQUJAACpCQAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqgMBANoFACEFNwAA3QoAIDgAAOAKACD4AwAA3goAIPkDAADfCgAg_gMAABIAIAUJAACrCQAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqgMBAAAAAQM3AADdCgAg-AMAAN4KACD-AwAAEgAgEQUAAK0JACAKAACuCQAgCwAArwkAIBcAALIJACAdAACwCQAgHgAAsQkAIB8AALMJACDmAgEAAAAB9AIBAAAAAfYCQAAAAAH3AkAAAAABowMBAAAAAcwDAQAAAAHSAwEAAAAB0wMIAAAAAdQDAgAAAAHXAwAAANcDAgM3AADbCgAg-AMAANwKACD-AwAAggIAIAQ3AAChCQAw-AMAAKIJADD6AwAApAkAIP4DAACXCQAwBDcAAJMJADD4AwAAlAkAMPoDAACWCQAg_gMAAJcJADAENwAAiAkAMPgDAACJCQAw-gMAAIsJACD-AwAArgYAMAQ3AAD_CAAw-AMAAIAJADD6AwAAggkAIP4DAACYBwAwBDcAAPYIADD4AwAA9wgAMPoDAAD5CAAg_gMAAOwGADAENwAA7QgAMPgDAADuCAAw-gMAAPAIACD-AwAAwAYAMAM3AADZCgAg-AMAANoKACD-AwAAggIAIAQ3AADaCAAw-AMAANsIADD6AwAA3QgAIP4DAADeCAAwBDcAAMwIADD4AwAAzQgAMPoDAADPCAAg_gMAANAIADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs3AACICgAwOAAAjQoAMPgDAACJCgAw-QMAAIoKADD6AwAAiwoAIPsDAACMCgAw_AMAAIwKADD9AwAAjAoAMP4DAACMCgAw_wMAAI4KADCABAAAjwoAMAs3AAD8CQAwOAAAgQoAMPgDAAD9CQAw-QMAAP4JADD6AwAA_wkAIPsDAACACgAw_AMAAIAKADD9AwAAgAoAMP4DAACACgAw_wMAAIIKADCABAAAgwoAMAs3AADwCQAwOAAA9QkAMPgDAADxCQAw-QMAAPIJADD6AwAA8wkAIPsDAAD0CQAw_AMAAPQJADD9AwAA9AkAMP4DAAD0CQAw_wMAAPYJADCABAAA9wkAMAs3AADlCQAwOAAA6QkAMPgDAADmCQAw-QMAAOcJADD6AwAA6AkAIPsDAADeCAAw_AMAAN4IADD9AwAA3ggAMP4DAADeCAAw_wMAAOoJADCABAAA4QgAMAs3AADZCQAwOAAA3gkAMPgDAADaCQAw-QMAANsJADD6AwAA3AkAIPsDAADdCQAw_AMAAN0JADD9AwAA3QkAMP4DAADdCQAw_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-QMAANQKACD-AwAADgAgEQcAAO8JACAKAACuCQAgCwAArwkAIBcAALIJACAdAACwCQAgHgAAsQkAIB8AALMJACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGjAwEAAAABzAMBAAAAAdIDAQAAAAHTAwgAAAAB1AMCAAAAAdUDAQAAAAHXAwAAANcDAgM3AADSCgAg-AMAANMKACD-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_QkAMPoDAAD_CQAg_gMAAIAKADAENwAA8AkAMPgDAADxCQAw-gMAAPMJACD-AwAA9AkAMAQ3AADlCQAw-AMAAOYJADD6AwAA6AkAIP4DAADeCAAwBDcAANkJADD4AwAA2gkAMPoDAADcCQAg_gMAAN0JADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHNwAAygoAIDgAAM0KACD4AwAAywoAIPkDAADMCgAg_AMAAFkAIP0DAABZACD-AwAAWwAgAzcAAMoKACD4AwAAywoAIP4DAABbACAAAAAAABEFAAC7CgAgEQAAvAoAIBMAALcIACAZAAC7CAAgIgAAuQoAICMAALoKACAkAAC9CgAgJQAAuQgAICYAALoIACAnAAC-CgAgKAAAvAgAICkAALgIACAqAAC_CgAg6QIAANYFACDzAgAA1gUAIPQCAADWBQAg9QIAANYFACADAQAAuAoAIAUAALsKACCOAwAA1gUAIAwBAAC4CgAgBQAAuwoAIIUDAADWBQAghgMAANYFACCHAwAA1gUAIIgDAADWBQAgiQMAANYFACCKAwAA1gUAIIsDAADWBQAgjAMAANYFACCNAwAA1gUAII4DAADWBQAgBgEAAJ0KACAEAACZCgAgBgAAmgoAIAcAAJsKACAIAACcCgAgowMAANYFACAACwEAALgKACAHAADACgAgEQAAwQoAIOUDAADWBQAg5gMAANYFACDnAwAA1gUAIOgDAADWBQAg6QMAANYFACDsAwAA1gUAIO0DAADWBQAg7gMAANYFACAAAAMFAAC7CgAgIAAAnAoAICEAAMkKACAHAQAAuAoAIA8AAMYKACAQAAC9CgAgqwMAANYFACCzAwAA1gUAILQDAADWBQAgtQMAANYFACAIBQAAuwoAIAcAAMAKACAKAADICgAgCwAAyAoAIBcAALoIACAdAADFCgAgHgAAuQgAIB8AALwIACAGEwAAtwgAIBQAALgIACAWAAC5CAAgFwAAuggAIBkAALsIACAaAAC8CAAgBAgAAMIKACANAADDCgAgFQAAuAoAIBgAAL4KACAABAwAALgKACANAADDCgAgDgAAxwoAIBEAALwKACAEDAAAuAoAIA0AAMMKACATAADGCgAgGwAAxQoAIAAAGwUAAM8HACARAADQBwAgEwAA0wcAIBkAANYHACAiAADNBwAgIwAAzgcAICQAANEHACAlAADSBwAgJgAA1AcAICcAANUHACAoAADXBwAgKQAA2AcAIOYCAQAAAAHnAgEAAAAB6AIBAAAAAekCAQAAAAHqAiAAAAAB7AIAAADsAgLuAgAAAO4CAvACAAAA8AIC8QIBAAAAAfICAQAAAAHzAgEAAAAB9AIBAAAAAfUCIAAAAAH2AkAAAAAB9wJAAAAAAQIAAABbACA3AADKCgAgAwAAAFkAIDcAAMoKACA4AADOCgAgHQAAAFkAIAUAAOQFACARAADlBQAgEwAA6AUAIBkAAOsFACAiAADiBQAgIwAA4wUAICQAAOYFACAlAADnBQAgJgAA6QUAICcAAOoFACAoAADsBQAgKQAA7QUAIDAAAM4KACDmAgEA2gUAIecCAQDaBQAh6AIBANoFACHpAgEA2wUAIeoCIADcBQAh7AIAAN0F7AIi7gIAAN4F7gIi8AIAAN8F8AIi8QIBANoFACHyAgEA2gUAIfMCAQDbBQAh9AIBANsFACH1AiAA4AUAIfYCQADhBQAh9wJAAOEFACEbBQAA5AUAIBEAAOUFACATAADoBQAgGQAA6wUAICIAAOIFACAjAADjBQAgJAAA5gUAICUAAOcFACAmAADpBQAgJwAA6gUAICgAAOwFACApAADtBQAg5gIBANoFACHnAgEA2gUAIegCAQDaBQAh6QIBANsFACHqAiAA3AUAIewCAADdBewCIu4CAADeBe4CIvACAADfBfACIvECAQDaBQAh8gIBANoFACHzAgEA2wUAIfQCAQDbBQAh9QIgAOAFACH2AkAA4QUAIfcCQADhBQAhCeYCAQAAAAH2AkAAAAAB9wJAAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGOAwEAAAABjwMBAAAAAQ_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_goAIAwAAABjACABAADYCQAgBAAA1AkAIAYAANUJACAIAADXCQAgMAAA_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-ACI_ACNAACQAAAAAAAUSACA9ACE-ACI_ACNAACQBAZwBAgEBogECAxIAKT8AKkAAKwAAAAMSACk_ACpAACsCBQAEBwAGAgUABAcABgUSADA9ADE-ADI_ADNAADQAAAAAAAUSADA9ADE-ADI_ADNAADQDCAAHDQALFQACAwgABw0ACxUAAgMSADk_ADpAADsAAAADEgA5PwA6QAA7AggABxwACgIIAAccAAoDEgBAPwBBQABCAAAAAxIAQD8AQUAAQgMIAAcMAAINAAsDCAAHDAACDQALBRIARz0ASD4AST8ASkAASwAAAAAABRIARz0ASD4AST8ASkAASwAAAxIAUD8AUUAAUgAAAAMSAFA_AFFAAFICDAACDQALAgwAAg0ACwMSAFc_AFhAAFkAAAADEgBXPwBYQABZAwgABw0ACxUAAgMIAAcNAAsVAAIFEgBePQBfPgBgPwBhQABiAAAAAAAFEgBePQBfPgBgPwBhQABiAwwAAg0ACw4ACgMMAAINAAsOAAoFEgBnPQBoPgBpPwBqQABrAAAAAAAFEgBnPQBoPgBpPwBqQABrAgwAAg0ACwIMAAINAAsFEgBwPQBxPgByPwBzQAB0AAAAAAAFEgBwPQBxPgByPwBzQAB0AwEAAg_8AgwQ_QIBAwEAAg-DAwwQhAMBBRIAeT0Aej4Aez8AfEAAfQAAAAAABRIAeT0Aej4Aez8AfEAAfQIIAAcJAAcCCAAHCQAHAxIAggE_AIMBQACEAQAAAAMSAIIBPwCDAUAAhAEBBQAEAQUABAUSAIkBPQCKAT4AiwE_AIwBQACNAQAAAAAABRIAiQE9AIoBPgCLAT8AjAFAAI0BAgwAAhcAEAIMAAIXABAFEgCSAT0AkwE-AJQBPwCVAUAAlgEAAAAAAAUSAJIBPQCTAT4AlAE_AJUBQACWAQAABRIAmwE9AJwBPgCdAT8AngFAAJ8BAAAAAAAFEgCbAT0AnAE-AJ0BPwCeAUAAnwECAQACBQAEAgEAAgUABAMSAKQBPwClAUAApgEAAAADEgCkAT8ApQFAAKYBAgEAAgUABAIBAAIFAAQDEgCrAT8ArAFAAK0BAAAAAxIAqwE_AKwBQACtAQEFnQQEAQWjBAQDEgCyAT8AswFAALQBAAAAAxIAsgE_ALMBQAC0ASsCASx9AS1-AS5_AS-AAQExggEBMoQBHDOFAR00hwEBNYkBHDaKAR45iwEBOowBATuNARxBkAEfQpEBJUOSARpEkwEaRZQBGkaVARpHlgEaSJgBGkmaARxKmwEmS54BGkygARxNoQEnTqMBGk-kARpQpQEcUagBKFKpASxTqgEHVKsBB1WsAQdWrQEHV64BB1iwAQdZsgEcWrMBLVu1AQdctwEcXbgBLl65AQdfugEHYLsBHGG-AS9ivwE1Y8ABD2TBAQ9lwgEPZsMBD2fEAQ9oxgEPacgBHGrJATZrywEPbM0BHG3OATduzwEPb9ABD3DRARxx1AE4ctUBPHPWAQl01wEJddgBCXbZAQl32gEJeNwBCXneARx63wE9e-EBCXzjARx95AE-fuUBCX_mAQmAAecBHIEB6gE_ggHrAUODAewBFIQB7QEUhQHuARSGAe8BFIcB8AEUiAHyARSJAfQBHIoB9QFEiwH3ARSMAfkBHI0B-gFFjgH7ARSPAfwBFJAB_QEckQGAAkaSAYECTJMBgwIElAGEAgSVAYYCBJYBhwIElwGIAgSYAYoCBJkBjAIcmgGNAk2bAY8CBJwBkQIcnQGSAk6eAZMCBJ8BlAIEoAGVAhyhAZgCT6IBmQJTowGaAgqkAZsCCqUBnAIKpgGdAgqnAZ4CCqgBoAIKqQGiAhyqAaMCVKsBpQIKrAGnAhytAagCVa4BqQIKrwGqAgqwAasCHLEBrgJWsgGvAlqzAbACELQBsQIQtQGyAhC2AbMCELcBtAIQuAG2AhC5AbgCHLoBuQJbuwG7AhC8Ab0CHL0BvgJcvgG_AhC_AcACEMABwQIcwQHEAl3CAcUCY8MBxgIMxAHHAgzFAcgCDMYByQIMxwHKAgzIAcwCDMkBzgIcygHPAmTLAdECDMwB0wIczQHUAmXOAdUCDM8B1gIM0AHXAhzRAdoCZtIB2wJs0wHcAhPUAd0CE9UB3gIT1gHfAhPXAeACE9gB4gIT2QHkAhzaAeUCbdsB5wIT3AHpAhzdAeoCbt4B6wIT3wHsAhPgAe0CHOEB8AJv4gHxAnXjAfICDeQB8wIN5QH0Ag3mAfUCDecB9gIN6AH4Ag3pAfoCHOoB-wJ26wH_Ag3sAYEDHO0BggN37gGFAw3vAYYDDfABhwMc8QGKA3jyAYsDfvMBjAMI9AGNAwj1AY4DCPYBjwMI9wGQAwj4AZIDCPkBlAMc-gGVA3_7AZcDCPwBmQMc_QGaA4AB_gGbAwj_AZwDCIACnQMcgQKgA4EBggKhA4UBgwKiAwaEAqMDBoUCpAMGhgKlAwaHAqYDBogCqAMGiQKqAxyKAqsDhgGLAq0DBowCrwMcjQKwA4cBjgKxAwaPArIDBpACswMckQK2A4gBkgK3A44BkwK4AxGUArkDEZUCugMRlgK7AxGXArwDEZgCvgMRmQLAAxyaAsEDjwGbAsMDEZwCxQMcnQLGA5ABngLHAxGfAsgDEaACyQMcoQLMA5EBogLNA5cBowLPAwukAtADC6UC0wMLpgLUAwunAtUDC6gC1wMLqQLZAxyqAtoDmAGrAtwDC6wC3gMcrQLfA5kBrgLgAwuvAuEDC7AC4gMcsQLlA5oBsgLmA6ABswLnAwO0AugDA7UC6QMDtgLqAwO3AusDA7gC7QMDuQLvAxy6AvADoQG7AvIDA7wC9AMcvQL1A6IBvgL2AwO_AvcDA8AC-AMcwQL7A6MBwgL8A6cBwwL9AwXEAv4DBcUC_wMFxgKABAXHAoEEBcgCgwQFyQKFBBzKAoYEqAHLAogEBcwCigQczQKLBKkBzgKMBAXPAo0EBdACjgQc0QKRBKoB0gKSBK4B0wKTBALUApQEAtUClQQC1gKWBALXApcEAtgCmQQC2QKbBBzaApwErwHbAp8EAtwCoQQc3QKiBLAB3gKkBALfAqUEAuACpgQc4QKpBLEB4gKqBLUB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AdmissionApplicationScalarFieldEnum: () => AdmissionApplicationScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  CourseAssigntScalarFieldEnum: () => CourseAssigntScalarFieldEnum,
  CourseEnrollmentScalarFieldEnum: () => CourseEnrollmentScalarFieldEnum,
  CourseMarksScalarFieldEnum: () => CourseMarksScalarFieldEnum,
  CourseScalarFieldEnum: () => CourseScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DepartmentScalarFieldEnum: () => DepartmentScalarFieldEnum,
  EnrollmentScalarFieldEnum: () => EnrollmentScalarFieldEnum,
  ExamScalarFieldEnum: () => ExamScalarFieldEnum,
  FeeScalarFieldEnum: () => FeeScalarFieldEnum,
  GPAResultScalarFieldEnum: () => GPAResultScalarFieldEnum,
  InstructorProfileScalarFieldEnum: () => InstructorProfileScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrerequisiteCourseScalarFieldEnum: () => PrerequisiteCourseScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProgramScalarFieldEnum: () => ProgramScalarFieldEnum,
  QueryMode: () => QueryMode,
  ResultScalarFieldEnum: () => ResultScalarFieldEnum,
  SemesterScalarFieldEnum: () => SemesterScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentProfileScalarFieldEnum: () => StudentProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UsersScalarFieldEnum: () => UsersScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  AdmissionApplication: "AdmissionApplication",
  AuditLog: "AuditLog",
  Course: "Course",
  CourseAssignt: "CourseAssignt",
  CourseEnrollment: "CourseEnrollment",
  CourseMarks: "CourseMarks",
  Department: "Department",
  Enrollment: "Enrollment",
  Exam: "Exam",
  Fee: "Fee",
  GPAResult: "GPAResult",
  Payment: "Payment",
  PrerequisiteCourse: "PrerequisiteCourse",
  Program: "Program",
  Result: "Result",
  Semester: "Semester",
  StudentProfile: "StudentProfile",
  InstructorProfile: "InstructorProfile",
  Users: "Users"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdmissionApplicationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  programId: "programId",
  previousInstitution: "previousInstitution",
  previousDegree: "previousDegree",
  sscResult: "sscResult",
  hscResult: "hscResult",
  diplomaResult: "diplomaResult",
  status: "status",
  submittedAt: "submittedAt",
  reviewedAt: "reviewedAt",
  reviewedBy: "reviewedBy",
  rejectionReason: "rejectionReason",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AuditLogScalarFieldEnum = {
  id: "id",
  userId: "userId",
  action: "action",
  resource: "resource",
  resourceId: "resourceId",
  oldData: "oldData",
  newData: "newData",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt"
};
var CourseScalarFieldEnum = {
  id: "id",
  title: "title",
  code: "code",
  description: "description",
  credit: "credit",
  semesterNumber: "semesterNumber",
  departmentId: "departmentId",
  programId: "programId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  status: "status"
};
var CourseAssigntScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  instructorId: "instructorId",
  semesterId: "semesterId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourseEnrollmentScalarFieldEnum = {
  id: "id",
  enrollmentId: "enrollmentId",
  courseId: "courseId"
};
var CourseMarksScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  courseId: "courseId",
  semesterId: "semesterId",
  attendanceMarks: "attendanceMarks",
  assignmentMarks: "assignmentMarks",
  midMarks: "midMarks",
  finalExamMarks: "finalExamMarks",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var DepartmentScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EnrollmentScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  semesterId: "semesterId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ExamScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  semesterId: "semesterId",
  instructorId: "instructorId",
  examType: "examType",
  examDate: "examDate",
  totalMarks: "totalMarks",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var FeeScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  semesterId: "semesterId",
  enroleMentId: "enroleMentId",
  feeType: "feeType",
  totalCredit: "totalCredit",
  perCreditRate: "perCreditRate",
  totalAmount: "totalAmount",
  remainingAmount: "remainingAmount",
  firstInstallmentAmount: "firstInstallmentAmount",
  firstInstallmentRemainingAmount: "firstInstallmentRemainingAmount",
  firstInstallmentStatus: "firstInstallmentStatus",
  secondInstallmentAmount: "secondInstallmentAmount",
  secondInstallmentRemainingAmount: "secondInstallmentRemainingAmount",
  secondInstallmentStatus: "secondInstallmentStatus",
  thirdInstallmentAmount: "thirdInstallmentAmount",
  thirdInstallmentRemainingAmount: "thirdInstallmentRemainingAmount",
  thirdInstallmentStatus: "thirdInstallmentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var GPAResultScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  semesterId: "semesterId",
  totalCredits: "totalCredits",
  totalPoints: "totalPoints",
  gpa: "gpa",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  feeId: "feeId",
  amount: "amount",
  paymentType: "paymentType",
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
  transactionId: "transactionId",
  admissionId: "admissionId",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PrerequisiteCourseScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  prerequisiteCourseId: "prerequisiteCourseId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProgramScalarFieldEnum = {
  id: "id",
  departmentId: "departmentId",
  name: "name",
  degreeType: "degreeType",
  duration: "duration",
  totalCredits: "totalCredits",
  semester: "semester",
  semesterType: "semesterType",
  description: "description",
  admissionFee: "admissionFee",
  tuitionFee: "tuitionFee",
  isActive: "isActive",
  perCreditFee: "perCreditFee",
  totalFee: "totalFee",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ResultScalarFieldEnum = {
  id: "id",
  examId: "examId",
  studentId: "studentId",
  totalMarks: "totalMarks",
  grade: "grade",
  gradePoint: "gradePoint",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SemesterScalarFieldEnum = {
  id: "id",
  name: "name",
  year: "year",
  startDate: "startDate",
  endDate: "endDate",
  registrationOpen: "registrationOpen",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentProfileScalarFieldEnum = {
  id: "id",
  phone: "phone",
  dateOfBirth: "dateOfBirth",
  gender: "gender",
  address: "address",
  profilePhoto: "profilePhoto",
  studentId: "studentId",
  departmentId: "departmentId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InstructorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  teacherCode: "teacherCode",
  departmentId: "departmentId",
  phone: "phone",
  gender: "gender",
  dateOfBirth: "dateOfBirth",
  address: "address",
  designation: "designation",
  bio: "bio",
  specialization: "specialization",
  qualification: "qualification",
  experience: "experience",
  profilePhoto: "profilePhoto",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UsersScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  emailVerified: "emailVerified",
  role: "role",
  userStatus: "userStatus",
  authProvider: "authProvider",
  imageUrl: "imageUrl",
  imagePublicId: "imagePublicId",
  googleId: "googleId",
  departmentId: "departmentId",
  isEnrolled: "isEnrolled",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  GRADUATED: "GRADUATED",
  SUSPENDED: "SUSPENDED",
  DROPPED: "DROPPED"
};
var AdmissionStatus = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  PAID: "PAID"
};
var SemesterCode = {
  SPRING: "SPRING",
  SUMMER: "SUMMER",
  FALL: "FALL"
};
var PaymentType = {
  ADMISSION_FEE: "ADMISSION_FEE",
  SEMESTER_FEE: "SEMESTER_FEE"
};
var PaymentMethod = {
  STRIPE: "STRIPE"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};
var ExamType = {
  MIDTERM: "MIDTERM",
  FINAL: "FINAL"
};
var CourseAssignmentStatus = {
  ASSIGNED: "ASSIGNED",
  UNASSIGNED: "UNASSIGNED"
};
var AuthProvider = {
  CREDENTIAL: "CREDENTIAL",
  GOOGLE: "GOOGLE"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/pirsma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/module/auth/auth.service.ts
import ejs from "ejs";
import path3 from "path";

// src/lib/nodemiler.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smt_user,
    pass: config_default.smt_password
  }
});

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, options) => {
  try {
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    console.log(error);
  }
};
var verifyToken = (token, secret) => {
  try {
    const verifedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifedToken
    };
  } catch (error) {
    console.log("Token verifed falied", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/module/auth/auth.service.ts
var AuthService = class {
  async createDB(payload) {
    console.log("paylaod", payload);
    const userExits = await prisma.users.findUnique({
      where: { email: payload.email }
    });
    if (userExits) {
      throw new Error("This Email Already Created");
    }
    if (payload.role === Role.INSTRUCTOR) {
      throw new Error("This instuctor not create normal users");
    }
    const otpkey = `otpkey:${payload.email}`;
    const userKey = `studentKey:${payload.email}`;
    const expirtionSeconds = 60 * 5;
    console.log(userKey, "userkey");
    const passwordhash = await bcrypt.hash(
      payload.password,
      Number(config_default.bycriptHashRound)
    );
    payload.password = passwordhash;
    const otp = randomInt(1e5, 1e6);
    await redisClient.set(otpkey, otp.toString(), {
      EX: expirtionSeconds
    });
    await redisClient.set(userKey, JSON.stringify(payload), {
      EX: expirtionSeconds
    });
    const templatesPath = path3.join(
      process.cwd(),
      `/src/templates/registration-user-otp.ejs`
    );
    const templatesData = {
      name: payload.name,
      email: payload.email,
      otp,
      expirtionSeconds: expirtionSeconds / 60
    };
    const html = await ejs.renderFile(templatesPath, templatesData);
    console.log("html", templatesData);
    await transporter.sendMail({
      from: config_default.smt_user,
      to: payload.email,
      subject: "Email Verification",
      html
    });
    return;
  }
  async verifayAccountDB(paylaod) {
    const { email, otp } = paylaod;
    const userExits = await prisma.users.findUnique({ where: { email } });
    const otpkey = `otpkey:${email.trim()}`;
    const userKey = `studentKey:${email.trim()}`;
    const redisOtp = await redisClient.get(otpkey);
    if (!otp) {
      throw new Error("Invalid Otp");
    }
    if (redisOtp !== otp.toString()) {
      throw new Error("OTP Value Not Match!Pleace Valid OTP");
    }
    if (userExits?.emailVerified) {
      throw new Error("User Already Verified");
    }
    const RedisUserPayload = await redisClient.get(userKey);
    if (typeof RedisUserPayload !== "string") {
      throw new Error("User registration data not found or expired");
    }
    const userPayload = JSON.parse(RedisUserPayload);
    const result = await prisma.users.create({
      data: {
        name: userPayload.name,
        email: userPayload.email,
        password: userPayload.password,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        isEnrolled: false
      }
    });
    await redisClient.del(otpkey);
    await redisClient.del(userKey);
    const templatesPath = path3.join(
      process.cwd(),
      `/src/templates/wecome-message.ejs`
    );
    const html = await ejs.renderFile(templatesPath, { name: result.name });
    await transporter.sendMail({
      from: config_default.smt_user,
      to: result.email.trim(),
      subject: "Welcome to UniSphere",
      html
    });
    return result;
  }
  async loginDB(paylaod) {
    const { password, email } = paylaod;
    const userExits = await prisma.users.findUnique({
      where: {
        email
      }
    });
    if (!userExits) {
      throw new Error("User not Found Pleace try Again");
    }
    if (!userExits.password) {
      throw new Error("User password is not set");
    }
    const passwordMatch = await bcrypt.compare(password, userExits.password);
    if (!passwordMatch) {
      throw new Error("Password Dosenot Match!Pleacce try again");
    }
    const jwtpayload = {
      id: userExits.id,
      name: userExits.name,
      email: userExits.email,
      role: userExits.role,
      departmentId: userExits.departmentId
    };
    const accessToken = jwtUtils.createToken(jwtpayload, config_default.accessSecret, {
      expiresIn: config_default.jwt_access_Expires
    });
    const refreshToken = jwtUtils.createToken(
      jwtpayload,
      config_default.refreshSecret,
      { expiresIn: config_default.jwt_refresh_Expires }
    );
    console.log("accessToken", accessToken, "refreshToken", refreshToken);
    return { accessToken, refreshToken };
  }
  async googleLoginDB(payload) {
    console.log("paylaod", payload);
    const { idToken, role } = payload;
    if (!idToken) {
      throw new Error("Token is required");
    }
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config_default.google_client_id
    });
    const googleUser = ticket.getPayload();
    if (!googleUser || !googleUser.email) {
      throw new Error("Invalid Google Token");
    }
    let user = await prisma.users.findUnique({
      where: {
        email: googleUser.email
      }
    });
    if (!user) {
      throw new Error("user not found Pleace Register");
    }
    if (user.role === Role.INSTRUCTOR) {
      throw new Error("Instructor  not google login and register");
    }
    if (user.authProvider !== AuthProvider.GOOGLE) {
      user = await prisma.users.update({
        where: { email: googleUser.email },
        data: {
          authProvider: AuthProvider.GOOGLE,
          googleId: googleUser.sub
        }
      });
    }
    const jwtPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.departmentId
    };
    const accessToken = jwtUtils.createToken(jwtPayload, config_default.accessSecret, {
      expiresIn: config_default.jwt_access_Expires
    });
    const refreshToken = jwtUtils.createToken(
      jwtPayload,
      config_default.refreshSecret,
      { expiresIn: config_default.jwt_refresh_Expires }
    );
    return { accessToken, refreshToken };
  }
};
var auth_service_default = new AuthService();

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.status).json({
    success: data.success,
    status: data.status,
    message: data.message,
    data: data.data
  });
};

// src/module/auth/auth.controller.ts
import statusCode from "http-status-codes";
var AuthController = class extends BaseController {
  createStudent = this.handle(async (req, res) => {
    const payload = req.body;
    console.log("paylaod", payload);
    await auth_service_default.createDB(payload);
    sendResponse(res, {
      message: "Verifay OTP Send Pleace Check your Email",
      status: statusCode.OK,
      success: true
    });
  });
  verifayAccount = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await auth_service_default.verifayAccountDB(paylaod);
    sendResponse(res, {
      message: "User Register is successFully",
      status: statusCode.OK,
      success: true,
      data: result
    });
  });
  login = this.handle(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_default.loginDB(payload);
    if (!result) {
      throw new Error("User creation failed");
    }
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user login  successfully",
      status: statusCode.CREATED,
      data: { accessToken, refreshToken }
    });
  });
  me = this.handle(async (req, res) => {
  });
  googleLogin = this.handle(async (req, res) => {
    console.log("googleLogin", req.body);
    const result = await auth_service_default.googleLoginDB(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none"
    });
    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none"
    });
    sendResponse(res, {
      success: true,
      message: "Google login successful!",
      status: statusCode.OK,
      data: { accessToken, refreshToken }
    });
  });
};
var auth_controller_default = new AuthController();

// src/midileware/validationReq.ts
var ValidationReq = class extends BaseController {
  validate(schema) {
    return this.handle((req, _res, next) => {
      const payload = {
        body: req.body ?? {}
      };
      const result = schema.safeParse(payload);
      if (!result.success) {
        throw result.error;
      }
      req.body = result.data.body;
      next();
    });
  }
};
var validationReq = new ValidationReq();

// src/module/auth/auth.validation.ts
import { z } from "zod";
var userRegisterValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    email: z.string().trim().min(1, "Email is required").refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      {
        message: "Email is not valid"
      }
    ),
    role: z.enum(["STUDENT"], {
      message: "Role must be STUDENT"
    }),
    password: z.string().trim().superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: "custom",
          message: "Password is required"
        });
        return;
      }
      if (value.length < 6) {
        ctx.addIssue({
          code: "custom",
          message: "Password must be at least 6 characters"
        });
      }
    }),
    departmentId: z.string().trim().uuid("Please select a valid department")
  })
});
var authValidation = {
  userRegisterValidationSchema
};

// src/module/auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  validationReq.validate(authValidation.userRegisterValidationSchema),
  auth_controller_default.createStudent
);
router.post("/verified-email", auth_controller_default.verifayAccount);
router.post("/login", auth_controller_default.login);
router.post("/google-login", auth_controller_default.googleLogin);
var authRouter = router;

// src/module/students/students.routes.ts
import { Router as Router2 } from "express";

// src/module/students/student.controller.ts
import statusCode2 from "http-status-codes";

// src/module/students/student.service.ts
var StudentService = class {
  async updateProfileDB(payload) {
    const { phone, gender, dateOfBirth, address, studentId, departmentId } = payload;
    const result = await prisma.studentProfile.upsert({
      where: {
        studentId
      },
      create: {
        phone,
        gender,
        dateOfBirth,
        address,
        studentId,
        departmentId
      },
      update: {
        phone,
        gender,
        dateOfBirth,
        address
      }
    });
    return result;
  }
  async getStudentProfile(id) {
    const result = await prisma.users.findUnique({
      where: { id },
      include: {
        studentProfile: true
      },
      omit: {
        password: true
      }
    });
    return result;
  }
  async admissionApplicationDB(payload) {
    const {
      userId,
      programId,
      previousDegree,
      previousInstitution,
      sscResult,
      hscResult,
      diplomaResult
    } = payload;
    const applicationExists = await prisma.admissionApplication.findUnique({
      where: { id: userId }
    });
    if (applicationExists) {
      throw new Error("This user has already submitted an application");
    }
    const result = await prisma.admissionApplication.create({
      data: {
        userId,
        programId,
        previousDegree,
        previousInstitution,
        status: AdmissionStatus.PENDING,
        sscResult,
        hscResult,
        diplomaResult
      }
    });
    return result;
  }
  async getAllProgram(query) {
    const { search, department, degreeType, page } = query;
    const whereProgramCondition = {};
    const searchNormalization = search?.trim() ?? null;
    const departmentNormalization = department?.trim() ?? null;
    const degreeTypeNormalization = degreeType?.trim() ?? null;
    if (searchNormalization) {
      whereProgramCondition.OR = [
        {
          name: {
            contains: searchNormalization,
            mode: "insensitive"
          }
        },
        {
          department: {
            name: {
              contains: searchNormalization,
              mode: "insensitive"
            }
          }
        }
      ];
    }
    if (departmentNormalization && departmentNormalization !== "All") {
      whereProgramCondition.department = {
        code: departmentNormalization
      };
    }
    if (degreeTypeNormalization && degreeTypeNormalization !== "All") {
      whereProgramCondition.degreeType = degreeTypeNormalization.toUpperCase();
    }
    const limit = 6;
    const currentPage = Number(page) || 1;
    const skip = limit * (currentPage - 1);
    const [total, programs] = await Promise.all([
      prisma.program.count({
        where: whereProgramCondition
      }),
      prisma.program.findMany({
        where: whereProgramCondition,
        skip,
        take: limit,
        include: {
          department: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      totalPages,
      currentPage,
      programs
    };
  }
  async myApplication(id) {
    const result = await prisma.admissionApplication.findMany({
      where: { userId: id }
    });
    return result;
  }
  async stuedentEnrolement(payload) {
    const { semesterId, studentId, Enrolementcourses } = payload;
    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_semesterId: {
            studentId,
            semesterId
          }
        },
        include: {
          Enrolementcourses: {
            select: {
              courseId: true
            }
          }
        }
      });
      if (existingEnrollment) {
        const alreadyEnrolledCourseIds = existingEnrollment.Enrolementcourses.map((course) => course.courseId);
        const duplicateCourses = Enrolementcourses.filter(
          (course) => alreadyEnrolledCourseIds.includes(course.courseId)
        );
        if (duplicateCourses.length > 0) {
          throw new Error(`One or more selected courses are already enrolled`);
        }
        throw new Error("Student is already enrolled in this semester");
      }
      const semester = await tx.semester.findUnique({
        where: {
          id: semesterId
        },
        select: {
          id: true,
          semesterNumber: true
        }
      });
      if (!semester) {
        throw new Error("Semester not found");
      }
      const courseIds = Enrolementcourses.map((course) => course.courseId);
      if (semester.semesterNumber !== 1) {
        const prerequisites = await tx.prerequisiteCourse.findMany({
          where: {
            courseId: {
              in: courseIds
            }
          },
          select: {
            courseId: true,
            prerequisiteCourseId: true,
            prerequisiteCourse: {
              select: {
                code: true,
                title: true
              }
            }
          }
        });
        for (const prerequisite of prerequisites) {
          const prerequisiteResult = await tx.result.findFirst({
            where: {
              studentId,
              exam: {
                courseId: prerequisite.prerequisiteCourseId
              }
            },
            select: {
              grade: true,
              gradePoint: true
            }
          });
          if (!prerequisiteResult) {
            throw new Error(
              `You must complete prerequisite course ${prerequisite.prerequisiteCourse.code} before enrolling`
            );
          }
          if (prerequisiteResult.grade === "F") {
            throw new Error(
              `You failed prerequisite course ${prerequisite.prerequisiteCourse.code}. You cannot enroll in this course`
            );
          }
        }
      }
      const enrollment = await tx.enrollment.create({
        data: {
          semesterId,
          studentId,
          Enrolementcourses: {
            createMany: {
              data: Enrolementcourses
            }
          }
        },
        include: {
          Enrolementcourses: {
            include: {
              course: {
                select: {
                  program: {
                    select: {
                      perCreditFee: true
                    }
                  },
                  credit: true
                }
              }
            }
          }
        }
      });
      const courses = enrollment.Enrolementcourses.map((item) => item.course);
      const totalCredit = courses.reduce(
        (sum, course) => sum + Number(course.credit),
        0
      );
      const perCreditFee = Number(courses[0]?.program?.perCreditFee ?? 0);
      const totalAmount = totalCredit * perCreditFee;
      const perInstallmentAmount = totalAmount / 3;
      const fee = await tx.fee.create({
        data: {
          studentId,
          semesterId,
          enroleMentId: enrollment.id,
          feeType: PaymentType.SEMESTER_FEE,
          totalCredit,
          totalAmount,
          perCreditRate: perCreditFee,
          firstInstallmentAmount: perInstallmentAmount,
          secondInstallmentAmount: perInstallmentAmount,
          thirdInstallmentAmount: perInstallmentAmount,
          remainingAmount: totalAmount,
          firstInstallmentRemainingAmount: perInstallmentAmount,
          secondInstallmentRemainingAmount: perInstallmentAmount,
          thirdInstallmentRemainingAmount: perInstallmentAmount
        }
      });
      return {
        enrollment,
        fee
      };
    });
    return result;
  }
  async GetfeeInstalmentDB(userId, semesterId) {
    const whereConditon = {};
    whereConditon.studentId = userId;
    if (semesterId) {
      whereConditon.semesterId = semesterId.trim();
    }
    const result = await prisma.fee.findMany({ where: whereConditon });
    return result;
  }
  async myEnrolementDB(id) {
    const result = await prisma.enrollment.findMany({
      where: { studentId: id },
      include: {
        Enrolementcourses: {
          include: {
            course: {
              select: {
                title: true
              }
            }
          }
        }
      }
    });
    return result;
  }
  async myCgpaDB(payload) {
    const { studentId, semesterId } = payload;
    const results = await prisma.result.findMany({
      where: {
        studentId,
        exam: {
          semesterId
        }
      },
      select: {
        gradePoint: true,
        exam: {
          select: {
            course: {
              select: {
                credit: true
              }
            }
          }
        }
      }
    });
    const totalCredits = results.reduce(
      (sum, result) => sum + Number(result.exam.course.credit),
      0
    );
    const totalPoints = results.reduce(
      (sum, result) => sum + Number(result.gradePoint) * Number(result.exam.course.credit),
      0
    );
    const gpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
    const semesterResult = await prisma.gPAResult.upsert({
      where: {
        studentId_semesterId: { studentId, semesterId }
      },
      update: {
        totalPoints,
        totalCredits,
        gpa
      },
      create: {
        semesterId,
        totalPoints,
        totalCredits,
        gpa,
        studentId
      }
    });
    return semesterResult;
  }
  async getAllCourseDB(query) {
    const {
      search,
      semesterNumber,
      page = "1",
      limit = "6",
      departmentId
    } = query;
    const currentPage = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * pageLimit;
    const andConditions = [];
    if (departmentId) {
      andConditions.push({
        departmentId
      });
    }
    if (search) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            code: {
              contains: search,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (semesterNumber) {
      andConditions.push({
        semesterNumber: Number(semesterNumber)
      });
    }
    const whereCondition = {
      AND: andConditions
    };
    const [courses, total] = await prisma.$transaction([
      prisma.course.findMany({
        where: whereCondition,
        skip,
        take: pageLimit,
        include: {
          department: {
            select: {
              id: true,
              name: true
            }
          },
          program: {
            select: {
              name: true
            }
          },
          courseAssign: {
            include: {
              instructor: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              semester: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.course.count({
        where: whereCondition
      })
    ]);
    const totalPage = Math.ceil(total / pageLimit);
    return {
      meta: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPage
      },
      data: courses
    };
  }
};
var student_service_default = new StudentService();

// src/module/students/student.controller.ts
var StudentController = class extends BaseController {
  updateme = this.handle(async (req, res) => {
    const body = req.body;
    const id = req.user?.id;
    const paylaod = { ...body, studentId: id };
    const studentProfile = await student_service_default.updateProfileDB(paylaod);
    sendResponse(res, {
      message: "profie updated successfully",
      status: statusCode2.OK,
      success: true,
      data: studentProfile
    });
  });
  getStudentProfile = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await student_service_default.getStudentProfile(id);
    sendResponse(res, {
      message: "profile found",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  admissionApplication = this.handle(async (req, res) => {
    const body = req.body;
    const userId = req.user?.id;
    const paylaod = { ...body, userId };
    const result = await student_service_default.admissionApplicationDB(paylaod);
    sendResponse(res, {
      message: "profile found",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  getAllProgramg = this.handle(async (req, res) => {
    const queray = req.query;
    const result = await student_service_default.getAllProgram(queray);
    sendResponse(res, {
      message: "program found",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  myApplication = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await student_service_default.myApplication(id);
    sendResponse(res, {
      message: "program found",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  studentEnrolement = this.handle(async (req, res) => {
    const body = req.body;
    const studentId = req.params?.id;
    const paylaod = { ...body, studentId };
    const result = await student_service_default.stuedentEnrolement(paylaod);
    sendResponse(res, {
      message: "Stuent Enrolement successFully",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  getFeeInstalment = this.handle(async (req, res) => {
    const userId = req.user?.id;
    const semesterId = req.query.semesterId;
    const result = await student_service_default.GetfeeInstalmentDB(userId, semesterId);
    sendResponse(res, {
      message: "get all fee",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  myEnrolement = this.handle(async (req, res) => {
    const userId = req.user?.id;
    const result = await student_service_default.myEnrolementDB(userId);
    sendResponse(res, {
      message: "get all enrolement",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  mygpa = this.handle(async (req, res) => {
    const userId = req.user?.id;
    const body = req.body;
    const paylaod = {
      ...body,
      studentId: userId
    };
    const result = await student_service_default.myCgpaDB(paylaod);
    sendResponse(res, {
      message: "get all enrolement",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
  getAllcourses = this.handle(async (req, res) => {
    const departmentId = req.user?.departmentId;
    const query = req.query;
    const paylaod = {
      ...query,
      departmentId
    };
    console.log("deparment", departmentId);
    const result = await student_service_default.getAllCourseDB(paylaod);
    sendResponse(res, {
      message: "get all  courses found",
      status: statusCode2.OK,
      success: true,
      data: result
    });
  });
};
var student_controller_default = new StudentController();

// src/midileware/auth.ts
import status from "http-status-codes";
var auth = (...requriedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new Error(
          "You are not logged in. Please log in to access this resource."
        );
      }
      const verifedToken = jwtUtils.verifyToken(token, config_default.accessSecret);
      if (!verifedToken.success) {
        throw new Error(verifedToken.error);
      }
      const { id, name, email, role, departmentId } = verifedToken.data;
      if (requriedRoles.length && !requriedRoles.includes(role)) {
        throw new Error(
          "Forbidden. You don't have permission to access this resource."
        );
      }
      console.log("verayfat tijeb", verifedToken);
      const user = await prisma.users.findUnique({
        where: {
          id,
          name,
          email,
          role,
          departmentId
        }
      });
      if (!user) {
        throw new Error("User not found. Please log in again.");
      }
      req.user = {
        email,
        name,
        id,
        role,
        departmentId
      };
      next();
    } catch (error) {
      console.log("Auth Error:", error);
      sendResponse(res, {
        success: false,
        status: status.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : "Authentication failed"
      });
    }
  };
};

// src/module/students/stuent.validation.ts
import { z as z2 } from "zod";
var studentProfileValidationSchema = z2.object({
  body: z2.object({
    phone: z2.string().trim().min(11, "Phone number is required"),
    gender: z2.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Invalid gender"
    }),
    dateOfBirth: z2.string({
      message: "Valid date of birth is required"
    }),
    address: z2.string().trim().min(1, "Address is required")
  })
});
var admissionBodySchema = z2.object({
  body: z2.object({
    programId: z2.string().uuid("Program ID is required"),
    previousDegree: z2.string().trim().min(1, "Previous degree is required"),
    previousInstitution: z2.string().trim().min(1, "Previous institution is required"),
    sscResult: z2.number().min(0).max(5),
    hscResult: z2.number().min(0).max(5).optional(),
    diplomaResult: z2.number().min(0).max(4).optional()
  }).refine(
    (data) => data.hscResult !== void 0 || data.diplomaResult !== void 0,
    {
      message: "Either HSC result or Diploma result is required"
    }
  )
});
var studentEnrollmentValidationSchema = z2.object({
  body: z2.object({
    semesterId: z2.string().trim().min(1, "Semester ID is required"),
    studentId: z2.string().trim().min(1, "Student ID is required"),
    Enrolementcourses: z2.array(
      z2.object({
        courseId: z2.string().trim().min(1, "Course ID is required")
      })
    ).min(1, "At least one course is required").superRefine((courses, ctx) => {
      const courseIds = courses.map((course) => course.courseId);
      const duplicateIds = courseIds.filter(
        (id, index) => courseIds.indexOf(id) !== index
      );
      if (duplicateIds.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Duplicate course is not allowed",
          path: [courseIds.indexOf(duplicateIds[0]), "courseId"]
        });
      }
    })
  })
});
var studentValidation = {
  admissionBodySchema,
  studentProfileValidationSchema,
  studentEnrollmentValidationSchema
};

// src/module/students/students.routes.ts
var router2 = Router2();
router2.patch(
  "/me",
  auth("STUDENT"),
  validationReq.validate(studentValidation.studentProfileValidationSchema),
  student_controller_default.updateme
);
router2.get("/me", auth("STUDENT"), student_controller_default.getStudentProfile);
router2.post(
  "/application-admission",
  auth("STUDENT"),
  validationReq.validate(studentValidation.admissionBodySchema),
  student_controller_default.admissionApplication
);
router2.get("/all-Program", student_controller_default.getAllProgramg);
router2.get("/my-application", auth("STUDENT"), student_controller_default.myApplication);
router2.post(
  "/student-enrolement",
  auth("STUDENT"),
  validationReq.validate(studentValidation.studentEnrollmentValidationSchema),
  student_controller_default.studentEnrolement
);
router2.get("/all-courses", auth("STUDENT"), student_controller_default.getAllcourses);
router2.get(
  "/myInstalmentFee",
  auth("STUDENT"),
  student_controller_default.getFeeInstalment
);
router2.get("/my-enrolement", auth("STUDENT"), student_controller_default.myEnrolement);
router2.post("/my-gpa", auth("STUDENT"), student_controller_default.mygpa);
var studentRouter = router2;

// src/module/admin/admin.routes.ts
import { Router as Router3 } from "express";

// src/module/admin/admin.service.ts
import crypto from "crypto";
var AdminService = class {
  async createDepartmentDB(payload) {
    const { name, code, description } = payload;
    const departmentExits = await prisma.department.findUnique({
      where: { code }
    });
    if (departmentExits) {
      throw new Error("Already this department created");
    }
    const result = await prisma.department.create({
      data: {
        name,
        code,
        description
      }
    });
    return result;
  }
  async getALLDepartmentDB() {
    const result = await prisma.department.findMany();
    return result;
  }
  async getAllUserDB(query) {
    const { role, status: status2, department } = query;
    const whereQuery = {};
    const departmentNormalization = department?.trim() ?? null;
    if (role) {
      whereQuery.role = role.toLocaleUpperCase();
    }
    if (status2) {
      whereQuery.userStatus = status2.toLocaleUpperCase();
    }
    if (departmentNormalization) {
      whereQuery.department = {
        code: departmentNormalization.toLocaleUpperCase()
      };
    }
    console.log("WHERE:", JSON.stringify(whereQuery, null, 2));
    const result = await prisma.users.findMany({
      where: whereQuery,
      include: {
        instructorProfile: true
      }
    });
    console.log("result", result);
    return result;
  }
  async teachersCreateDB(payload) {
    const { name, email, departmentId, gender } = payload;
    console.log("paylaod", payload);
    const result = await prisma.users.create({
      data: {
        name,
        email,
        role: Role.INSTRUCTOR,
        departmentId,
        instructorProfile: {
          create: {
            teacherCode: `Tch-${crypto.randomUUID()}`,
            departmentId,
            gender
          }
        }
      },
      include: {
        instructorProfile: true
      }
    });
    if (!result) {
      throw new Error("Teacher Not Created");
    }
    console.log("result", result);
    const token = crypto.randomBytes(32).toString("hex");
    const readisTokenKey = `teacher:${token}`;
    await redisClient.set(
      readisTokenKey,
      JSON.stringify({ email: result.email, token }),
      {
        EX: 60 * 60 * 24
      }
    );
    return {
      tokenId: token
    };
  }
  async createProgramDB(payload) {
    const {
      semester,
      semesterType,
      duration,
      departmentId,
      degreeType,
      description,
      totalCredits,
      tuitionFee,
      name,
      code,
      admissionFee,
      isActive,
      perCreditFee,
      totalFee
    } = payload;
    const result = await prisma.program.create({
      data: {
        semester,
        semesterType,
        duration,
        departmentId,
        degreeType,
        description,
        totalCredits,
        tuitionFee,
        name,
        code,
        admissionFee,
        isActive,
        perCreditFee,
        totalFee
      }
    });
    return result;
  }
  async updateStatusApplicationDB(id, status2) {
    const result = await prisma.admissionApplication.update({
      where: { id },
      data: { status: status2 }
    });
    return result;
  }
  async updateStatusUserDB(id, status2, adminId) {
    if (!status2) {
      throw new Error("Status is required");
    }
    const oldUser = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        userStatus: true
      }
    });
    if (!oldUser) {
      throw new Error("User not found");
    }
    if (oldUser.role === Role.INSTRUCTOR && (status2 === UserStatus.GRADUATED || status2 === UserStatus.DROPPED)) {
      throw new Error("Instructor status cannot be changed to this status");
    }
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.users.update({
        where: { id },
        data: {
          status: status2
        }
      });
      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: "STATUS_CHANGE",
          resource: "USER",
          resourceId: id,
          oldData: {
            status: oldUser.userStatus
          },
          newData: {
            status: updatedUser.userStatus
          }
        }
      });
      return updatedUser;
    });
    return result;
  }
  async createCourseDB(payload) {
    const {
      code,
      departmentId,
      description,
      title,
      programId,
      credit,
      semesterNumber
    } = payload;
    const departmentExits = await prisma.department.findUnique({
      where: { id: departmentId }
    });
    if (!departmentExits) {
      throw new Error("This Department Doesnot exits");
    }
    const exitCourse = await prisma.course.findUnique({ where: { code } });
    if (exitCourse) {
      throw new Error("This course is already add");
    }
    const result = await prisma.course.create({
      data: {
        departmentId,
        code,
        description,
        title,
        programId,
        credit,
        semesterNumber
      }
    });
    return result;
  }
  async createPrerequisiteDB(paylaod) {
    const { courseId, prerequisiteCourseId } = paylaod;
    const result = await prisma.prerequisiteCourse.create({
      data: {
        courseId,
        prerequisiteCourseId
      }
    });
    return result;
  }
  async createSemesterDB(paylaod) {
    const { name, year, startDate, endDate } = paylaod;
    const exitsSemester = await prisma.semester.findUnique({
      where: { name_year: { name, year } }
    });
    if (exitsSemester) {
      throw new Error("This Semester is Already cretate");
    }
    const result = await prisma.semester.create({
      data: {
        name,
        year,
        startDate,
        endDate
      }
    });
    return result;
  }
  async updateSemesterDB(paylaod, id) {
    const { startDate, endDate, registrationOpen } = paylaod;
    const whereSemesterUpdte = {};
    if (startDate) {
      whereSemesterUpdte.startDate = startDate;
    }
    if (endDate) {
      whereSemesterUpdte.endDate = endDate;
    }
    if (registrationOpen) {
      whereSemesterUpdte.registrationOpen = registrationOpen;
    }
    const result = await prisma.semester.update({
      where: { id },
      data: whereSemesterUpdte
    });
    return result;
  }
  async getllStudentApplicationDB() {
    const result = await prisma.admissionApplication.findMany();
    return result;
  }
  async courseTeacherAssign(payload, adminId) {
    const { semesterId, courseId, instructorId } = payload;
    const existingAssignment = await prisma.courseAssignt.findUnique({
      where: {
        courseId_semesterId: {
          courseId,
          semesterId
        }
      }
    });
    if (existingAssignment) {
      throw new Error(
        "This course is already assigned to an instructor for this semester"
      );
    }
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.courseAssignt.create({
        data: {
          semesterId,
          courseId,
          instructorId
        }
      });
      const course = await tx.course.update({
        where: {
          id: courseId
        },
        data: {
          status: CourseAssignmentStatus.ASSIGNED
        }
      });
      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: "ASSIGN",
          resource: "COURSE",
          resourceId: courseId,
          oldData: {
            assignment: null,
            courseStatus: CourseAssignmentStatus.UNASSIGNED
          },
          newData: {
            semesterId,
            instructorId,
            courseStatus: course.status
          }
        }
      });
      return assignment;
    });
    return result;
  }
  async getAllCourse(payload) {
    const { department, search } = payload;
    const departmentNor = department?.trim() || null;
    const searchNor = search?.trim() || null;
    const whereCondition = {};
    if (departmentNor) {
      whereCondition.department = {
        code: departmentNor.toUpperCase()
      };
    }
    if (searchNor) {
      whereCondition.OR = [
        {
          title: {
            contains: searchNor,
            mode: "insensitive"
          }
        },
        {
          code: {
            contains: searchNor,
            mode: "insensitive"
          }
        }
      ];
    }
    const result = await prisma.course.findMany({
      where: whereCondition,
      include: {
        department: true
      }
    });
    return result;
  }
  async getALLSemester() {
    const result = await prisma.semester.findMany();
    return result;
  }
  async dashboardStatsDB() {
    const [userCount, studentCoutn, instructorCount, TotalMoney] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { role: Role.STUDENT } }),
      prisma.users.count({ where: { role: Role.INSTRUCTOR } }),
      prisma.payment.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: {
          amount: true
        }
      })
    ]);
    return { userCount, studentCoutn, instructorCount, TotalMoney };
  }
  async updateUserAdminRole(id, role, adminId) {
    const oldUser = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        role: true
      }
    });
    if (!oldUser) {
      throw new Error("User not found");
    }
    const result = await prisma.$transaction(async (tx) => {
      const result2 = await tx.users.update({
        where: { id },
        data: {
          role
        }
      });
      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: "ROLE_CHANGE",
          resource: "USER",
          resourceId: id,
          oldData: {
            role: oldUser.role
          },
          newData: {
            role: result2.role
          }
        }
      });
    });
    return result;
  }
  async auditLogDB() {
    const result = await prisma.auditLog.findMany();
    return result;
  }
};
var admin_service_default = new AdminService();

// src/module/admin/admin.controller.ts
import statusCode3 from "http-status-codes";
var Admin = class extends BaseController {
  CreateDepartment = this.handle(async (req, res) => {
    const payload = req.body;
    const result = await admin_service_default.createDepartmentDB(payload);
    sendResponse(res, {
      message: "Department Created SuccessFully",
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  getAllDepartment = this.handle(async (req, res) => {
    const result = await admin_service_default.getALLDepartmentDB();
    sendResponse(res, {
      message: "Department",
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  teacherCreate = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await admin_service_default.teachersCreateDB(paylaod);
    sendResponse(res, {
      message: "Teacher is Created SuccessFully",
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  createProgram = this.handle(async (req, res) => {
    const payload = req.body;
    const result = await admin_service_default.createProgramDB(payload);
    sendResponse(res, {
      message: "Program is Created SuccessFully",
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  updateApplicationStatus = this.handle(async (req, res) => {
    const status2 = req.body?.status;
    const id = req.params?.id;
    const result = await admin_service_default.updateStatusApplicationDB(id, status2);
    sendResponse(res, {
      message: `Application ${status2} is  SuccessFully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  getAllUser = this.handle(async (req, res) => {
    const query = req.query;
    console.log("queray", query);
    const result = await admin_service_default.getAllUserDB(query);
    sendResponse(res, {
      message: "user Found",
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  updateStatus = this.handle(async (req, res) => {
    const id = req.params?.id;
    const status2 = req.body?.status;
    const adminId = req.user?.id;
    const result = await admin_service_default.updateStatusUserDB(id, status2, adminId);
    sendResponse(res, {
      message: `user ${status2} is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  createCourse = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await admin_service_default.createCourseDB(paylaod);
    sendResponse(res, {
      message: `create Course is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  createPrerequisite = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await admin_service_default.createPrerequisiteDB(paylaod);
    sendResponse(res, {
      message: ` Course  create is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  createSemester = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await admin_service_default.createSemesterDB(paylaod);
    sendResponse(res, {
      message: `Semester create is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  updateSemester = this.handle(async (req, res) => {
    const paylaod = req.body;
    const id = req.params?.id;
    const result = await admin_service_default.updateSemesterDB(paylaod, id);
    sendResponse(res, {
      message: `Update create is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  getAllStudenApplication = this.handle(async (req, res) => {
    const result = await admin_service_default.getllStudentApplicationDB();
    sendResponse(res, {
      message: `Update create is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  courseTeacherAssign = this.handle(async (req, res) => {
    const body = req.body;
    const id = req.params?.id;
    const adminId = req.user?.id;
    const paylaod = {
      ...body,
      courseId: id
    };
    const result = await admin_service_default.courseTeacherAssign(paylaod, adminId);
    sendResponse(res, {
      message: `Course Assign teacher is successfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  getALLcourse = this.handle(async (req, res) => {
    const queray = req.query;
    const result = await admin_service_default.getAllCourse(queray);
    sendResponse(res, {
      message: `all corse found`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  getALLSemester = this.handle(async (req, res) => {
    const result = await admin_service_default.getALLSemester();
    sendResponse(res, {
      message: `all semester found`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  dashboardStats = this.handle(async (req, res) => {
    const result = await admin_service_default.dashboardStatsDB();
    sendResponse(res, {
      message: `dashbaord states found`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  userUpdateRole = this.handle(async (req, res) => {
    const id = req.params.id;
    const role = req.body.role;
    const adminid = req.user?.id;
    const result = await admin_service_default.updateUserAdminRole(id, role, adminid);
    sendResponse(res, {
      message: `User updte ${role} succesfully`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
  auditlog = this.handle(async (req, res) => {
    const result = await admin_service_default.auditLogDB();
    sendResponse(res, {
      message: `get auditlog`,
      status: statusCode3.OK,
      success: true,
      data: result
    });
  });
};
var admin_controller_default = new Admin();

// src/module/admin/admin.validation.ts
import { z as z3 } from "zod";
var createDepartmentValidationSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, "Department name is required"),
    code: z3.string().trim().min(1, "Department code is required").max(20, "Department code is too long"),
    description: z3.string().trim().min(1, "Description is required")
  })
});
var createProgramValidationSchema = z3.object({
  body: z3.object({
    semester: z3.number().int().positive(),
    semesterType: z3.string().min(1, "Semester type is required"),
    duration: z3.number().positive(),
    departmentId: z3.string().uuid("Invalid department ID"),
    degreeType: z3.string().min(1, "Degree type is required"),
    description: z3.string().trim().min(1, "Description is required"),
    totalCredits: z3.number().positive(),
    tuitionFee: z3.number().nonnegative(),
    name: z3.string().trim().min(1, "Program name is required"),
    code: z3.string().trim().min(1, "Program code is required"),
    admissionFee: z3.number().nonnegative(),
    isActive: z3.boolean(),
    perCreditFee: z3.number().nonnegative(),
    totalFee: z3.number().nonnegative()
  })
});
var updateApplicationStatusValidationSchema = z3.object({
  body: z3.object({
    status: z3.enum(["PENDING", "APPROVED", "REJECTED", "PAID"])
  }),
  params: z3.object({
    id: z3.string().uuid("Invalid application ID")
  })
});
var updateUserStatusValidationSchema = z3.object({
  body: z3.object({
    status: z3.enum([
      "PENDING",
      "ACTIVE",
      "INACTIVE",
      "GRADUATED",
      "SUSPENDED",
      "DROPPED"
    ])
  }),
  params: z3.object({
    id: z3.string().uuid("Invalid user ID")
  })
});
var createCourseValidationSchema = z3.object({
  body: z3.object({
    code: z3.string().trim().min(1, "Course code is required"),
    departmentId: z3.string().uuid("Invalid department ID"),
    description: z3.string().trim().min(1, "Description is required"),
    title: z3.string().trim().min(1, "Course title is required"),
    programId: z3.string().uuid("Invalid program ID"),
    credit: z3.number().positive("Credit must be greater than 0"),
    semesterNumber: z3.number().int().positive()
  })
});
var createPrerequisiteValidationSchema = z3.object({
  body: z3.object({
    courseId: z3.string().uuid("Invalid course ID"),
    prerequisiteCourseId: z3.string().uuid("Invalid prerequisite course ID")
  })
});
var createSemesterValidationSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, "Semester name is required"),
    year: z3.number().int().min(2e3),
    startDate: z3.coerce.date({
      message: "Invalid start date"
    }),
    endDate: z3.coerce.date({
      message: "Invalid end date"
    })
  })
});
var courseTeacherAssignValidationSchema = z3.object({
  body: z3.object({
    semesterId: z3.string().uuid("Invalid semester ID"),
    instructorId: z3.string().uuid("Invalid instructor ID")
  }),
  params: z3.object({
    id: z3.string().uuid("Invalid course ID")
  })
});
var adminValidation = {
  createDepartmentValidationSchema,
  createProgramValidationSchema,
  updateApplicationStatusValidationSchema,
  updateUserStatusValidationSchema,
  createCourseValidationSchema,
  createPrerequisiteValidationSchema,
  createSemesterValidationSchema,
  courseTeacherAssignValidationSchema
};

// src/module/admin/admin.routes.ts
var router3 = Router3();
router3.post(
  "/department",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createDepartmentValidationSchema),
  admin_controller_default.CreateDepartment
);
router3.post(
  "/create-teacher",
  auth("ADMIN"),
  validationReq.validate(adminValidation.courseTeacherAssignValidationSchema),
  admin_controller_default.teacherCreate
);
router3.post(
  "/create-program",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createProgramValidationSchema),
  admin_controller_default.createProgram
);
router3.patch(
  "/admissions/:id/status",
  auth("ADMIN"),
  validationReq.validate(
    adminValidation.updateApplicationStatusValidationSchema
  ),
  admin_controller_default.updateApplicationStatus
);
router3.get("/department", admin_controller_default.getAllDepartment);
router3.get("/users", admin_controller_default.getAllUser);
router3.patch(
  "/users/:id/status",
  auth("ADMIN"),
  validationReq.validate(adminValidation.updateUserStatusValidationSchema),
  admin_controller_default.updateStatus
);
router3.post(
  "/create-course",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createCourseValidationSchema),
  admin_controller_default.createCourse
);
router3.post(
  "/create-prerequisite",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createPrerequisiteValidationSchema),
  admin_controller_default.createPrerequisite
);
router3.post(
  "/create-semester",
  auth("ADMIN"),
  validationReq.validate(adminValidation.createSemesterValidationSchema),
  admin_controller_default.createSemester
);
router3.patch(
  "/update-semester/:id",
  auth("ADMIN"),
  admin_controller_default.updateSemester
);
router3.get(
  "/studentadmissionsApplication",
  auth("STUDENT"),
  admin_controller_default.getAllStudenApplication
);
router3.post("/course/:id/assign", admin_controller_default.courseTeacherAssign);
router3.get("/all-course", auth("ADMIN"), admin_controller_default.getALLcourse);
router3.get("/all-semester", admin_controller_default.getALLSemester);
router3.get("/dashboard-stats", auth("ADMIN"), admin_controller_default.dashboardStats);
router3.patch("/users/:id/role", auth("ADMIN"), admin_controller_default.userUpdateRole);
router3.get("/audit-logs", auth("ADMIN"), admin_controller_default.auditlog);
var adminRouter = router3;

// src/module/teacher/teacher.route.ts
import { Router as Router4 } from "express";

// src/module/teacher/teachers.service.ts
import bcrypt2 from "bcrypt";
var Teachers = class {
  async setPasswordDB(paylaod) {
    const { password, confirmPassword, tokenId } = paylaod;
    if (!tokenId) {
      throw new Error("token is emapty pleace token");
    }
    const readisTokenKey = `teacher:${tokenId}`;
    const redisToken = await redisClient.get(readisTokenKey);
    if (password !== confirmPassword) {
      throw new Error("confirm password doesnot match");
    }
    if (typeof redisToken !== "string") {
      throw new Error("Token is invalid or expired");
    }
    const tokenPaylod = JSON.parse(redisToken);
    const { token, email } = tokenPaylod;
    if (tokenId !== token) {
      throw new Error("unathorizeacces your token");
    }
    const passwordHash = await bcrypt2.hash(
      password,
      Number(config_default.bycriptHashRound)
    );
    const result = await prisma.users.update({
      where: {
        email
      },
      data: {
        password: passwordHash,
        emailVerified: true,
        status: UserStatus.ACTIVE
      }
    });
    await redisClient.del(readisTokenKey);
    return result;
  }
  async updateTeacherProfile(paylaod, userId) {
    const {
      phone,
      address,
      experience,
      bio,
      gender,
      dateOfBirth,
      designation,
      specialization,
      qualification
    } = paylaod;
    const result = await prisma.instructorProfile.update({
      where: { userId },
      data: {
        experience,
        phone,
        gender,
        dateOfBirth,
        designation,
        specialization,
        qualification,
        address,
        bio
      }
    });
    return result;
  }
  async myExamCouresesCreatedDB(paylaod) {
    const {
      courseId,
      semesterId,
      instructorId,
      examType,
      examDate,
      totalMarks
    } = paylaod;
    const result = await prisma.exam.create({
      data: {
        courseId,
        semesterId,
        examDate,
        examType,
        totalMarks,
        instructorId
      }
    });
    return result;
  }
  async myCoursesAssignDB(id) {
    const result = await prisma.courseAssignt.findMany({
      where: { instructorId: id },
      include: {
        course: {
          select: {
            title: true,
            code: true,
            courseEnrollment: {
              select: {
                enrollment: {
                  select: {
                    student: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        status: true,
                        departmentId: true,
                        isEnrolled: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return result;
  }
  async courseMarks(payload) {
    const {
      studentId,
      courseId,
      semesterId,
      attendanceMarks,
      assignmentMarks,
      midMarks,
      finalExamMarks
    } = payload;
    const attendance = Number(attendanceMarks);
    const assignment = Number(assignmentMarks);
    const mid = Number(midMarks);
    const finalExam = Number(finalExamMarks);
    const existsMarksStudent = await prisma.courseMarks.findUnique({
      where: {
        studentId_courseId_semesterId: {
          studentId,
          courseId,
          semesterId
        }
      }
    });
    if (existsMarksStudent) {
      throw new Error(
        "This student already has marks for this course and semester"
      );
    }
    const exitExamMidMarks = await prisma.exam.findUnique({
      where: {
        courseId_semesterId_examType: {
          courseId,
          semesterId,
          examType: ExamType.MIDTERM
        }
      }
    });
    if (!exitExamMidMarks) {
      throw new Error("Midterm exam not found for this course and semester");
    }
    if (mid > exitExamMidMarks.totalMarks) {
      throw new Error(
        `Midterm marks cannot exceed ${exitExamMidMarks.totalMarks}`
      );
    }
    const exitExamFinalMarks = await prisma.exam.findUnique({
      where: {
        courseId_semesterId_examType: {
          courseId,
          semesterId,
          examType: ExamType.FINAL
        }
      }
    });
    if (!exitExamFinalMarks) {
      throw new Error("Final exam not found for this course and semester");
    }
    if (finalExam > exitExamFinalMarks.totalMarks) {
      throw new Error(
        `Final exam marks cannot exceed ${exitExamFinalMarks.totalMarks}`
      );
    }
    const totalMarks = attendance + assignment + mid + finalExam;
    let grade;
    let gradePoint;
    if (totalMarks >= 80) {
      grade = "A+";
      gradePoint = 4;
    } else if (totalMarks >= 75) {
      grade = "A";
      gradePoint = 3.75;
    } else if (totalMarks >= 70) {
      grade = "A-";
      gradePoint = 3.5;
    } else if (totalMarks >= 65) {
      grade = "B+";
      gradePoint = 3.25;
    } else if (totalMarks >= 60) {
      grade = "B";
      gradePoint = 3;
    } else if (totalMarks >= 55) {
      grade = "B-";
      gradePoint = 2.75;
    } else if (totalMarks >= 50) {
      grade = "C+";
      gradePoint = 2.5;
    } else if (totalMarks >= 45) {
      grade = "C";
      gradePoint = 2.25;
    } else if (totalMarks >= 40) {
      grade = "D";
      gradePoint = 2;
    } else {
      grade = "F";
      gradePoint = 0;
    }
    const result = await prisma.$transaction(async (tx) => {
      const courseMarks = await tx.courseMarks.create({
        data: {
          studentId,
          courseId,
          semesterId,
          attendanceMarks: attendance,
          assignmentMarks: assignment,
          midMarks: mid,
          finalExamMarks: finalExam
        }
      });
      const finalResult = await tx.result.create({
        data: {
          studentId,
          totalMarks,
          grade,
          gradePoint,
          examId: exitExamFinalMarks.id
        }
      });
      return {
        courseMarks,
        result: finalResult
      };
    });
    return result;
  }
};
var teachers_service_default = new Teachers();

// src/module/teacher/teachers.controller.ts
import statusCode4 from "http-status-codes";
var Teachers2 = class extends BaseController {
  setPassoword = this.handle(async (req, res) => {
    const paylaod = req.body;
    const result = await teachers_service_default.setPasswordDB(paylaod);
    sendResponse(res, {
      message: "Password change  is  SuccessFully",
      status: statusCode4.OK,
      success: true,
      data: result
    });
  });
  updateTeacherProfile = this.handle(async (req, res) => {
    const paylaod = req.body;
    const userId = req.user?.id;
    const result = await teachers_service_default.updateTeacherProfile(paylaod, userId);
    sendResponse(res, {
      message: "profie update  is  SuccessFully",
      status: statusCode4.OK,
      success: true,
      data: result
    });
  });
  myCoursesExamCreated = this.handle(async (req, res) => {
    const courseId = req.params?.id;
    const instructorId = req.user?.id;
    const body = req.body;
    const paylaod = {
      ...body,
      courseId,
      instructorId
    };
    const result = await teachers_service_default.myExamCouresesCreatedDB(paylaod);
    sendResponse(res, {
      message: "Exam created  is  SuccessFully",
      status: statusCode4.OK,
      success: true,
      data: result
    });
  });
  myCouresAssign = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await teachers_service_default.myCoursesAssignDB(id);
    sendResponse(res, {
      message: "my corses found",
      status: statusCode4.OK,
      success: true,
      data: result
    });
  });
  courseMarks = this.handle(async (req, res) => {
    const courseId = req.params?.id;
    const body = req.body;
    const paylaod = {
      ...body,
      courseId
    };
    const result = await teachers_service_default.courseMarks(paylaod);
    sendResponse(res, {
      message: "Exam Created Succesfully",
      status: statusCode4.OK,
      success: true,
      data: result
    });
  });
};
var teachers_controller_default = new Teachers2();

// src/module/teacher/teacherrs.validation.ts
import { z as z4 } from "zod";
var setPasswordValidationSchema = z4.object({
  body: z4.object({
    password: z4.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z4.string().min(6, "Confirm password is required"),
    tokenId: z4.string().trim().min(1, "Token ID is required")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"]
  })
});
var updateTeacherProfileValidationSchema = z4.object({
  body: z4.object({
    phone: z4.string().trim().min(11, "Phone number must be at least 11 characters").optional(),
    address: z4.string().trim().min(1, "Address cannot be empty").optional(),
    experience: z4.coerce.number().min(0, "Experience cannot be negative").optional(),
    bio: z4.string().trim().max(500, "Bio cannot exceed 500 characters").optional(),
    gender: z4.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dateOfBirth: z4.coerce.date().optional(),
    designation: z4.string().trim().min(1, "Designation is required").optional(),
    specialization: z4.string().trim().min(1, "Specialization is required").optional(),
    qualification: z4.string().trim().min(1, "Qualification is required").optional()
  })
});
var createExamValidationSchema = z4.object({
  body: z4.object({
    courseId: z4.string().trim().min(1, "Course ID is required"),
    semesterId: z4.string().trim().min(1, "Semester ID is required"),
    instructorId: z4.string().trim().min(1, "Instructor ID is required"),
    examType: z4.enum(["MIDTERM", "FINAL"]),
    examDate: z4.coerce.date({
      message: "Valid exam date is required"
    }),
    totalMarks: z4.coerce.number().positive("Total marks must be greater than 0")
  })
});
var courseMarksValidationSchema = z4.object({
  body: z4.object({
    studentId: z4.string().trim().min(1, "Student ID is required"),
    courseId: z4.string().trim().min(1, "Course ID is required"),
    semesterId: z4.string().trim().min(1, "Semester ID is required"),
    attendanceMarks: z4.coerce.number().min(0, "Attendance marks cannot be negative"),
    assignmentMarks: z4.coerce.number().min(0, "Assignment marks cannot be negative"),
    midMarks: z4.coerce.number().min(0, "Midterm marks cannot be negative"),
    finalExamMarks: z4.coerce.number().min(0, "Final exam marks cannot be negative")
  })
});
var teacherValidation = {
  setPasswordValidationSchema,
  updateTeacherProfileValidationSchema,
  createExamValidationSchema,
  courseMarksValidationSchema
};

// src/module/teacher/teacher.route.ts
var router4 = Router4();
router4.patch(
  "/set-password",
  validationReq.validate(teacherValidation.setPasswordValidationSchema),
  teachers_controller_default.setPassoword
);
router4.patch(
  "/update-teacher-profile",
  auth("INSTRUCTOR"),
  validationReq.validate(
    teacherValidation.updateTeacherProfileValidationSchema
  ),
  teachers_controller_default.updateTeacherProfile
);
router4.post(
  "/mycourse/:id/exam",
  auth("INSTRUCTOR"),
  validationReq.validate(teacherValidation.createExamValidationSchema),
  teachers_controller_default.myCoursesExamCreated
);
router4.get(
  "/course/my-assigned",
  auth("INSTRUCTOR"),
  teachers_controller_default.myCouresAssign
);
router4.post(
  "/corse-marks/:id",
  auth("INSTRUCTOR"),
  validationReq.validate(teacherValidation.courseMarksValidationSchema),
  teachers_controller_default.courseMarks
);
var teacherRouter = router4;

// src/module/payment/payment.routes.ts
import { Router as Router5 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_Key);

// src/module/payment/payment.service.ts
var PaymentService = class {
  async createPaymentsDB(payload, userId) {
    const { applicationsId, feeId, semesterFees } = payload;
    if (applicationsId) {
      return await prisma.$transaction(async (tx) => {
        const application = await tx.admissionApplication.findUnique({
          where: {
            id: applicationsId
          },
          include: {
            program: true,
            user: true
          }
        });
        if (!application) {
          throw new Error("This Admission does not exist");
        }
        if (application.status === AdmissionStatus.PAID) {
          throw new Error("This Student Already pay");
        }
        if (application.userId !== userId) {
          throw new Error("You are not allowed to pay for this admission");
        }
        const amount = application.program.admissionFee;
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: application.user.email,
          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: `Admission Fee - ${application.program.name}`
                },
                unit_amount: Math.round(amount * 100)
              },
              quantity: 1
            }
          ],
          metadata: {
            paymentType: PaymentType.ADMISSION_FEE,
            admissionId: application.id,
            userId
          },
          success_url: `${config_default.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
          cancel_url: `${config_default.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`
        });
        await tx.payment.upsert({
          where: {
            admissionId: applicationsId
          },
          update: {
            transactionId: session.id,
            paymentStatus: PaymentStatus.PENDING
          },
          create: {
            admissionId: applicationsId,
            userId,
            amount,
            paymentType: PaymentType.ADMISSION_FEE,
            paymentMethod: PaymentMethod.STRIPE,
            paymentStatus: PaymentStatus.PENDING,
            transactionId: session.id
          }
        });
        return {
          sessionId: session.id,
          paymentUrl: session.url
        };
      });
    }
    if (feeId) {
      if (semesterFees === void 0 || semesterFees === null) {
        throw new Error("Semester fees amount is required");
      }
      return await prisma.$transaction(async (tx) => {
        const fees = await tx.fee.findUnique({
          where: {
            id: feeId
          },
          include: {
            student: true
          }
        });
        if (!fees) {
          throw new Error("This fees does not exist");
        }
        if (fees?.studentId !== userId) {
          throw new Error("You are not allowed to pay for this semesterFees");
        }
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              price_data: {
                currency: "bdt",
                product_data: {
                  name: "Semester Fees"
                },
                unit_amount: Math.round(Number(semesterFees) * 100)
              },
              quantity: 1
            }
          ],
          customer_email: fees.student?.email,
          metadata: {
            enrolementId: fees.enroleMentId,
            userId: fees.studentId
          },
          success_url: `${config_default.appurl}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
          cancel_url: `${config_default.appurl}/payment/cancel?sessionId={CHECKOUT_SESSION_ID}`
        });
        const existingPayment = await tx.payment.findFirst({
          where: {
            feeId: fees.id
          }
        });
        if (existingPayment) {
          await tx.payment.update({
            where: {
              id: existingPayment.id
            },
            data: {
              transactionId: session.id,
              paymentStatus: PaymentStatus.PENDING
            }
          });
        } else {
          await tx.payment.create({
            data: {
              feeId: fees.id,
              userId,
              amount: semesterFees,
              paymentType: PaymentType.SEMESTER_FEE,
              paymentMethod: PaymentMethod.STRIPE,
              paymentStatus: PaymentStatus.PENDING,
              transactionId: session.id
            }
          });
        }
        return {
          sessionId: session.id,
          paymentUrl: session.url
        };
      });
    }
    throw new Error("Admission and semesterEnrollment id not provided");
  }
  async confirmPaymentDB(event) {
    const session = event.data.object;
    const paymentExists = await prisma.payment.findUnique({
      where: {
        transactionId: session.id
      }
    });
    if (!paymentExists) {
      throw new Error("This Pyment not found");
    }
    if (event.type === "checkout.session.completed") {
      if (paymentExists?.paymentStatus !== PaymentStatus.PAID && paymentExists.paymentType == PaymentType.ADMISSION_FEE) {
        await this.confirmAdmissionPayment(
          session,
          paymentExists.userId,
          paymentExists.id
        );
      }
      if (paymentExists.paymentType === PaymentType.SEMESTER_FEE && paymentExists.feeId) {
        await this.confirmSemesterPayment(
          paymentExists.feeId,
          session,
          paymentExists.id
        );
      }
    }
    if (event.type === "checkout.session.expired" && paymentExists.paymentStatus === PaymentStatus.PENDING) {
      await prisma.payment.update({
        where: {
          transactionId: session.id
        },
        data: {
          paymentStatus: PaymentStatus.CANCELLED
        }
      });
    }
  }
  async confirmAdmissionPayment(session, userId, paymentId) {
    const paymentExists = await prisma.payment.findUnique({
      where: {
        id: paymentId
      }
    });
    if (!paymentExists) {
      throw new Error("this payment not found");
    }
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          transactionId: session.id
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      const admission = await tx.admissionApplication.update({
        where: {
          userId
        },
        data: {
          status: AdmissionStatus.PAID
        },
        include: {
          program: {
            select: {
              perCreditFee: true
            }
          }
        }
      });
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      let name;
      if (month >= 1 && month <= 4) {
        name = SemesterCode.SPRING;
      } else if (month >= 5 && month <= 8) {
        name = SemesterCode.SUMMER;
      } else {
        name = SemesterCode.FALL;
      }
      const semester = await tx.semester.findUnique({
        where: {
          name_year: {
            name,
            year
          }
        }
      });
      if (!semester) {
        throw new Error("Current academic semester not found");
      }
      const semesterNumber = 1;
      const courses = await tx.course.findMany({
        where: {
          programId: admission.programId,
          semesterNumber
        },
        select: {
          id: true,
          credit: true
        }
      });
      if (!courses) {
        throw new Error("now corses for semester");
      }
      console.log("corses", courses);
      const enrollment = await tx.enrollment.create({
        data: {
          semesterId: semester.id,
          studentId: userId,
          Enrolementcourses: {
            createMany: {
              data: courses.map((course) => ({
                courseId: course.id
              }))
            }
          }
        }
      });
      await tx.users.update({
        where: {
          id: userId
        },
        data: {
          isEnrolled: true,
          status: UserStatus.ACTIVE
        }
      });
      console.log("enrolement", enrollment);
      const totalCredit = courses.reduce(
        (sum, course) => sum + course.credit,
        0
      );
      const perCreditFee = Number(admission.program.perCreditFee);
      const totalAmount = totalCredit * perCreditFee;
      const perInstallmentAmount = totalAmount / 3;
      const fee = await tx.fee.create({
        data: {
          studentId: paymentExists.userId,
          semesterId: enrollment.semesterId,
          enroleMentId: enrollment.id,
          feeType: PaymentType.SEMESTER_FEE,
          totalCredit,
          totalAmount,
          perCreditRate: perCreditFee,
          firstInstallmentAmount: perInstallmentAmount,
          secondInstallmentAmount: perInstallmentAmount,
          thirdInstallmentAmount: perInstallmentAmount,
          remainingAmount: totalAmount,
          firstInstallmentRemainingAmount: perInstallmentAmount,
          secondInstallmentRemainingAmount: perInstallmentAmount,
          thirdInstallmentRemainingAmount: perInstallmentAmount
        }
      });
      return {
        payment: paymentExists,
        admission,
        semester,
        enrollment,
        fee
      };
    });
  }
  async confirmSemesterPayment(feeId, session, paymentId) {
    const paymentExists = await prisma.payment.findUnique({
      where: { id: paymentId }
    });
    if (!paymentExists) {
      throw new Error("This payment not found");
    }
    const fees = await prisma.fee.findUnique({
      where: { id: feeId }
    });
    if (!fees) {
      throw new Error("This Fees not found");
    }
    return await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          transactionId: session.id
        },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAt: /* @__PURE__ */ new Date()
        }
      });
      const feesId = fees.id;
      const paidAggregrate = await tx.payment.aggregate({
        where: {
          feeId: feesId,
          paymentStatus: PaymentStatus.PAID
        },
        _sum: {
          amount: true
        }
      });
      const totalPaid = paidAggregrate._sum.amount ?? 0;
      const totalAmount = Number(fees.totalAmount);
      const remainingAmount = Math.max(totalAmount - totalPaid, 0);
      const firstAmout = Number(fees.firstInstallmentAmount);
      const firstRemaing = Math.max(firstAmout - totalPaid, 0);
      const secandAmount = Number(fees.secondInstallmentAmount);
      const secandPaid = Math.max(totalPaid - firstAmout, 0);
      const secandRemaing = Math.max(secandAmount - secandPaid, 0);
      const thirdAmount = Number(fees.thirdInstallmentAmount);
      const thirdPaid = Math.max(totalPaid - (firstAmout + secandPaid), 0);
      const thirdRemaing = Math.max(thirdAmount - thirdPaid, 0);
      const firstStatus = totalPaid >= firstAmout ? PaymentStatus.PAID : PaymentStatus.PENDING;
      const secandStatus = secandPaid >= secandAmount ? PaymentStatus.PAID : PaymentStatus.PENDING;
      const thirdStatus = thirdPaid >= thirdAmount ? PaymentStatus.PAID : PaymentStatus.PENDING;
      await tx.fee.update({
        where: { id: feesId },
        data: {
          firstInstallmentStatus: firstStatus,
          firstInstallmentRemainingAmount: firstRemaing,
          secondInstallmentStatus: secandStatus,
          secondInstallmentRemainingAmount: secandRemaing,
          thirdInstallmentStatus: thirdStatus,
          thirdInstallmentRemainingAmount: thirdRemaing,
          remainingAmount
        }
      });
    });
  }
  async getALLPaymentStudent(id) {
    const result = await prisma.payment.findMany({ where: { id } });
    result;
  }
  async getSinglePaymentStudent(id) {
    const result = await prisma.payment.findUnique({ where: { id } });
    return result;
  }
};
var payment_service_default = new PaymentService();

// src/module/payment/Payment.controller.ts
import statusCode5 from "http-status-codes";
import Stripe2 from "stripe";
var PaymentController = class extends BaseController {
  createPayment = this.handle(async (req, res) => {
    const payload = req.body;
    const userId = req.user?.id;
    console.log("payload", payload);
    const result = await payment_service_default.createPaymentsDB(payload, userId);
    sendResponse(res, {
      message: "program found",
      status: statusCode5.OK,
      success: true,
      data: result
    });
  });
  confrimPayment = this.handle(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      throw new Error("Stripe signature is missing");
    }
    const event = Stripe2.webhooks.constructEvent(
      req.body,
      signature,
      config_default.stripeWebhookSecret
    );
    const result = await payment_service_default.confirmPaymentDB(event);
    sendResponse(res, {
      message: "payment success fully",
      status: statusCode5.OK,
      success: true,
      data: result
    });
  });
  getAllPaymetnUser = this.handle(async (req, res) => {
    const id = req.user?.id;
    const result = await payment_service_default.getALLPaymentStudent(id);
    sendResponse(res, {
      message: "payment found",
      status: statusCode5.OK,
      success: true,
      data: result
    });
  });
  getsinglePaymetnUser = this.handle(async (req, res) => {
    const id = req.params.id;
    const result = await payment_service_default.getSinglePaymentStudent(id);
    sendResponse(res, {
      message: "payment sigle found",
      status: statusCode5.OK,
      success: true,
      data: result
    });
  });
};
var Payment_controller_default = new PaymentController();

// src/module/payment/payment.routes.ts
var router5 = Router5();
router5.post("/initiate", auth("STUDENT"), Payment_controller_default.createPayment);
router5.get("/", auth("STUDENT"), Payment_controller_default.getAllPaymetnUser);
router5.get("/:id", auth("STUDENT"), Payment_controller_default.getsinglePaymetnUser);
var paymentRouter = router5;

// src/module/user/user.routes.ts
import { Router as Router6 } from "express";

// src/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloudinary_api_secret: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary_default = cloudinary;

// src/module/user/user.service.ts
var UserService = class {
  async uploadeProfieImageDB(buffer, userId) {
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        imageUrl: true,
        imagePublicId: true
      }
    });
    const cloudinaryResult = await new Promise(
      (resolve, reject) => {
        cloudinary_default.uploader.upload_stream(
          {
            resource_type: "auto"
          },
          async (error, result) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(new Error("No result returned from Cloudinary"));
            }
            resolve(result);
          }
        ).end(buffer);
      }
    );
    const updateUser = await prisma.users.update({
      where: { id: userId },
      data: {
        imageUrl: cloudinaryResult.secure_url,
        imagePublicId: cloudinaryResult.public_id
      },
      omit: {
        password: true
      }
    });
    if (currentUser?.imageUrl && currentUser.imagePublicId) {
      await cloudinary_default.uploader.destroy(currentUser.imagePublicId);
    }
    return updateUser;
  }
};
var user_service_default = new UserService();

// src/module/user/user.controller.ts
import { StatusCodes } from "http-status-codes";
var UserController = class extends BaseController {
  uploadeProfileImage = this.handle(async (req, res) => {
    if (!req.file) {
      throw new Error("No File Provided.");
    }
    const id = req.user?.id;
    const result = await user_service_default.uploadeProfieImageDB(req.file?.buffer, id);
    sendResponse(res, {
      message: "Profiel Imges uploade successfully",
      status: StatusCodes.OK,
      success: true,
      data: result
    });
  });
};
var user_controller_default = new UserController();

// src/module/user/user.routes.ts
var router6 = Router6();
router6.patch(
  "/profile-image",
  auth("ADMIN", "INSTRUCTOR", "STUDENT"),
  upload.single("profileImage"),
  user_controller_default.uploadeProfileImage
);
var UserRoutes = router6;

// src/midileware/golobalError.ts
import { ZodError } from "zod";
var globalErrorHandler = (err, _req, res, _next) => {
  if (config_default.node_env === "development") {
    console.log("Error from Global Error Handler:", err);
  }
  let statusCode6 = 500;
  let errorMessage = "Something went wrong";
  const errors = [];
  if (err instanceof ZodError) {
    statusCode6 = 400;
    errorMessage = "Validation Error";
    errors.push(
      ...err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    );
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode6 = 400;
    errorMessage = "Invalid data provided";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode6 = 409;
      errorMessage = "User already exists";
    } else if (err.code === "P2003") {
      statusCode6 = 400;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode6 = 404;
      errorMessage = "Requested record was not found";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode6 = 500;
    errorMessage = "Database connection failed";
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode6 = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof Error) {
    statusCode6 = 400;
    errorMessage = err.message;
  }
  res.status(statusCode6).json({
    success: false,
    message: errorMessage,
    errors
  });
};

// src/app.ts
import path4 from "path";
var app = express();
app.use(cookie());
app.use(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  Payment_controller_default.confrimPayment
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", async (req, res) => {
  res.send("University managementsystem");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/payments/", paymentRouter);
app.use("/api/v1/user/", UserRoutes);
app.set("view engine", "ejs");
app.set("views", path4.join(process.cwd(), "src/templates"));
app.get("/google-login", (req, res) => {
  res.render("googlelogin");
});
app.use(globalErrorHandler);
var app_default = app;

// src/utils/seed.ts
import bcrypt3 from "bcrypt";
var adminSeed = async () => {
  try {
    const adminExits = await prisma.users.findFirst({
      where: {
        role: Role.ADMIN
      }
    });
    if (adminExits) {
      console.log("Super Admin Already Exists!");
      return;
    }
    const name = config_default.admin_name;
    const email = config_default.admin_email;
    const password = config_default.admin_password;
    if (!name || !email || !password) {
      throw new Error(
        "Super Admin Name , Email, Password Missing In Env File!!!"
      );
    }
    const passwordHash = await bcrypt3.hash(
      password,
      Number(config_default.bycriptHashRound)
    );
    const admin = await prisma.users.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true
      }
    });
    console.log("Super Admin Created : ", admin);
  } catch (error) {
    console.log("Error Seeding Super Admin : ", error);
  }
};

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("database is connect postgress");
    adminSeed();
    await redisClient.connect();
    console.log("redis is connected successfully");
    await transporter.verify();
    console.log("nodemiller is connected successfully");
    app_default.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.mjs.map