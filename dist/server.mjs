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
  "inlineSchema": 'model AdmissionApplication {\n  id        String @id @default(uuid())\n  userId    String @unique\n  programId String\n\n  previousInstitution String?\n  previousDegree      String?\n  sscResult           Float?\n  hscResult           Float?\n  diplomaResult       Float?\n\n  status AdmissionStatus @default(PENDING)\n\n  submittedAt     DateTime  @default(now())\n  reviewedAt      DateTime?\n  reviewedBy      String?\n  rejectionReason String?\n\n  user    Users   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  program Program @relation(fields: [programId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  payments  Payment?\n\n  @@index([userId])\n  @@index([programId])\n  @@index([status])\n}\n\nmodel AuditLog {\n  id String @id @default(uuid())\n\n  userId     String?\n  action     String\n  resource   String\n  resourceId String?\n\n  oldData Json?\n  newData Json?\n\n  ipAddress String?\n  userAgent String?\n\n  createdAt DateTime @default(now())\n\n  user Users? @relation(fields: [userId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([resource])\n  @@index([action])\n  @@index([createdAt])\n}\n\nmodel Course {\n  id          String @id @default(uuid())\n  title       String\n  code        String @unique\n  description String\n  credit      Float\n\n  semesterNumber Int // 1 = First, 2 = Second, 3 = Third\n\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)\n\n  programId String\n  program   Program @relation(fields: [programId], references: [id], onDelete: Cascade)\n\n  createdAt        DateTime               @default(now())\n  updatedAt        DateTime               @updatedAt\n  status           CourseAssignmentStatus @default(UNASSIGNED)\n  prerequisites    PrerequisiteCourse[]   @relation("CoursePrerequisites")\n  prerequisiteFor  PrerequisiteCourse[]   @relation("PrerequisiteForCourses")\n  courseEnrollment CourseEnrollment[]\n  courseAssign     CourseAssignt[]\n  exam             Exam[]\n  coursReuslt      CourseMarks[]\n\n  @@index([programId])\n  @@index([departmentId])\n  @@index([semesterNumber])\n  @@index([programId, semesterNumber])\n}\n\nmodel CourseAssignt {\n  id String @id @default(uuid())\n\n  courseId     String\n  instructorId String\n  semesterId   String\n\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  instructor Users @relation(fields: [instructorId], references: [id], onDelete: Cascade)\n\n  semester Semester @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseId, semesterId])\n  @@index([courseId])\n  @@index([instructorId])\n  @@index([semesterId])\n}\n\nmodel CourseEnrollment {\n  id           String @id @default(uuid())\n  enrollmentId String\n  courseId     String\n\n  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)\n\n  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)\n\n  @@unique([enrollmentId, courseId])\n  @@index([courseId])\n}\n\nmodel CourseMarks {\n  id String @id @default(uuid())\n\n  studentId  String\n  courseId   String\n  semesterId String\n\n  attendanceMarks Float @default(0)\n  assignmentMarks Float @default(0)\n  midMarks        Float @default(0)\n  finalExamMarks  Float @default(0)\n\n  student  Users    @relation("studentCourseResult", fields: [studentId], references: [id])\n  course   Course   @relation(fields: [courseId], references: [id])\n  semester Semester @relation(fields: [semesterId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, courseId, semesterId])\n  @@index([studentId])\n  @@index([courseId])\n  @@index([semesterId])\n}\n\nmodel Department {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  code        String  @unique\n  description String?\n\n  students  StudentProfile[]\n  teachers  InstructorProfile[]\n  program   Program[]\n  course    Course[]\n  user      Users[]\n  createdAt DateTime            @default(now())\n  updatedAt DateTime            @updatedAt\n}\n\nmodel Enrollment {\n  id         String @id @default(uuid())\n  studentId  String\n  semesterId String\n\n  semester          Semester           @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n  student           Users              @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  Enrolementcourses CourseEnrollment[]\n  fees              Fee?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n}\n\nenum Role {\n  STUDENT\n  INSTRUCTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  PENDING\n  GRADUATED\n  SUSPENDED\n  DROPPED\n}\n\nenum Gender {\n  MALE\n  FEMALE\n}\n\nenum AdmissionStatus {\n  PENDING\n  UNDER_REVIEW\n  ACCEPTED\n  REJECTED\n  PAID\n}\n\nenum SemesterType {\n  TRI_SEMESTER\n  BI_SEMESTER\n}\n\nenum DegreeType {\n  BSC\n  MSC\n  BBA\n  MBA\n  BA\n}\n\nenum SemesterCode {\n  SPRING\n  SUMMER\n  FALL\n}\n\nenum PaymentType {\n  ADMISSION_FEE\n  SEMESTER_FEE\n}\n\nenum PaymentMethod {\n  STRIPE\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n}\n\nenum ExamType {\n  MIDTERM\n  FINAL\n}\n\nenum CourseAssignmentStatus {\n  ASSIGNED\n  UNASSIGNED\n}\n\nenum AuthProvider {\n  CREDENTIAL\n  GOOGLE\n}\n\nmodel Exam {\n  id           String @id @default(uuid())\n  courseId     String\n  semesterId   String\n  instructorId String\n\n  examType   ExamType\n  examDate   DateTime\n  totalMarks Float\n\n  course     Course   @relation(fields: [courseId], references: [id])\n  semester   Semester @relation(fields: [semesterId], references: [id])\n  instructor Users    @relation("InstructorExams", fields: [instructorId], references: [id])\n\n  results Result[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([courseId, semesterId, examType])\n  @@index([courseId])\n  @@index([semesterId])\n  @@index([instructorId])\n}\n\nmodel Fee {\n  id String @id @default(uuid())\n\n  studentId    String\n  semesterId   String\n  enroleMentId String @unique\n\n  feeType PaymentType\n\n  totalCredit   Decimal\n  perCreditRate Decimal\n\n  // Original/full fee amount\n  totalAmount Decimal\n\n  // Total unpaid amount\n  remainingAmount Decimal\n\n  // 1st installment\n  firstInstallmentAmount          Decimal\n  firstInstallmentRemainingAmount Decimal\n  firstInstallmentStatus          PaymentStatus @default(PENDING)\n\n  // 2nd installment\n  secondInstallmentAmount          Decimal\n  secondInstallmentRemainingAmount Decimal\n  secondInstallmentStatus          PaymentStatus @default(PENDING)\n\n  // 3rd installment\n  thirdInstallmentAmount          Decimal\n  thirdInstallmentRemainingAmount Decimal\n  thirdInstallmentStatus          PaymentStatus @default(PENDING)\n\n  student Users @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  semester Semester @relation(fields: [semesterId], references: [id], onDelete: Cascade)\n\n  enroleMent Enrollment @relation(fields: [enroleMentId], references: [id], onDelete: Cascade)\n\n  payments Payment[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n}\n\nmodel GPAResult {\n  id         String @id @default(uuid())\n  studentId  String\n  semesterId String\n\n  totalCredits Float\n  totalPoints  Float\n  gpa          Float\n\n  student  Users    @relation(fields: [studentId], references: [id])\n  semester Semester @relation(fields: [semesterId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([studentId, semesterId])\n  @@index([studentId])\n  @@index([semesterId])\n  @@map("gpaResult")\n}\n\nmodel Payment {\n  id     String  @id @default(uuid())\n  userId String\n  feeId  String?\n\n  amount        Float\n  paymentType   PaymentType\n  paymentMethod PaymentMethod\n  paymentStatus PaymentStatus @default(PENDING)\n\n  transactionId String?   @unique\n  admissionId   String?   @unique\n  paidAt        DateTime?\n\n  user      Users                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  fee       Fee?                  @relation(fields: [feeId], references: [id])\n  admission AdmissionApplication? @relation(fields: [admissionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([feeId])\n  @@index([paymentType])\n  @@index([paymentStatus])\n}\n\nmodel PrerequisiteCourse {\n  id                   String @id @default(uuid())\n  courseId             String\n  prerequisiteCourseId String\n\n  course Course @relation("CoursePrerequisites", fields: [courseId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  prerequisiteCourse Course   @relation("PrerequisiteForCourses", fields: [prerequisiteCourseId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  createdAt          DateTime @default(now())\n  updatedAt          DateTime @updatedAt\n\n  @@unique([courseId, prerequisiteCourseId])\n  @@index([courseId])\n  @@index([prerequisiteCourseId])\n}\n\nmodel Program {\n  id           String                 @id @default(uuid())\n  departmentId String\n  name         String\n  degreeType   DegreeType\n  duration     Int\n  totalCredits Float\n  semester     Int\n  semesterType SemesterType\n  description  String\n  admissionFee Float\n  tuitionFee   Float\n  isActive     Boolean                @default(true)\n  perCreditFee Float\n  totalFee     Float\n  department   Department             @relation(fields: [departmentId], references: [id])\n  courses      Course[]\n  applications AdmissionApplication[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([departmentId])\n  @@index([degreeType])\n  @@index([name])\n}\n\nmodel Result {\n  id         String @id @default(uuid())\n  examId     String\n  studentId  String\n  totalMarks Float\n  grade      String\n  gradePoint Float\n\n  exam    Exam  @relation(fields: [examId], references: [id])\n  student Users @relation("StudentResults", fields: [studentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([examId, studentId])\n  @@index([examId])\n  @@index([studentId])\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Semester {\n  id               String       @id @default(uuid())\n  name             SemesterCode\n  year             Int // 2026\n  startDate        DateTime\n  endDate          DateTime\n  registrationOpen Boolean      @default(false)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  fees         Fee[]\n  enrollments  Enrollment[]\n  CourseAssign CourseAssignt[]\n  exam         Exam[]\n  gpaResult    GPAResult[]\n  courseResult CourseMarks[]\n\n  @@unique([name, year])\n}\n\nmodel StudentProfile {\n  id           String     @id @default(uuid())\n  phone        String\n  dateOfBirth  String\n  gender       String\n  address      String\n  profilePhoto String?\n  studentId    String     @unique\n  user         Users      @relation("studentProfile", fields: [studentId], references: [id], onDelete: Cascade)\n  departmentId String\n  department   Department @relation(fields: [departmentId], references: [id])\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n\n  @@map("studentProfile")\n}\n\nmodel InstructorProfile {\n  id           String @id @default(uuid())\n  userId       String @unique\n  teacherCode  String @unique\n  departmentId String @unique\n\n  phone          String?\n  gender         String?\n  dateOfBirth    DateTime?\n  address        String?\n  designation    String?\n  bio            String?\n  specialization String?\n  qualification  String?\n  experience     String?\n  profilePhoto   String?\n\n  user       Users      @relation("instructorProfile", fields: [userId], references: [id], onDelete: Cascade)\n  department Department @relation(fields: [departmentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Users {\n  id String @id @default(uuid())\n\n  name              String\n  email             String                @unique\n  password          String?\n  emailVerified     Boolean               @default(false)\n  role              Role                  @default(STUDENT)\n  userStatus        UserStatus            @default(PENDING)\n  authProvider      AuthProvider          @default(CREDENTIAL)\n  imageUrl          String                @default("")\n  imagePublicId     String                @default("")\n  studentProfile    StudentProfile?       @relation("studentProfile")\n  instructorProfile InstructorProfile?    @relation("instructorProfile")\n  googleId          String?\n  departmentId      String?\n  isEnrolled        Boolean?\n  department        Department?           @relation(fields: [departmentId], references: [id])\n  createdAt         DateTime              @default(now())\n  updatedAt         DateTime              @updatedAt\n  payments          Payment[]\n  application       AdmissionApplication?\n  courseAssignments CourseAssignt[]\n  fees              Fee[]\n  instructorExams   Exam[]                @relation("InstructorExams")\n  studentResults    Result[]              @relation("StudentResults")\n  gpaResult         GPAResult[]\n  corseResult       CourseMarks[]         @relation("studentCourseResult")\n  enrolledment      Enrollment[]\n  auditLog          AuditLog[]\n  deletedAt         DateTime?\n  isDeleted         Boolean               @default(false)\n}\n',
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
config2.runtimeDataModel = JSON.parse('{"models":{"AdmissionApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"programId","kind":"scalar","type":"String"},{"name":"previousInstitution","kind":"scalar","type":"String"},{"name":"previousDegree","kind":"scalar","type":"String"},{"name":"sscResult","kind":"scalar","type":"Float"},{"name":"hscResult","kind":"scalar","type":"Float"},{"name":"diplomaResult","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"AdmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedBy","kind":"scalar","type":"String"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"AdmissionApplicationToUsers"},{"name":"program","kind":"object","type":"Program","relationName":"AdmissionApplicationToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"AdmissionApplicationToPayment"}],"dbName":null,"schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"oldData","kind":"scalar","type":"Json"},{"name":"newData","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"Users","relationName":"AuditLogToUsers"}],"dbName":null,"schema":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"credit","kind":"scalar","type":"Float"},{"name":"semesterNumber","kind":"scalar","type":"Int"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"CourseToDepartment"},{"name":"programId","kind":"scalar","type":"String"},{"name":"program","kind":"object","type":"Program","relationName":"CourseToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"CourseAssignmentStatus"},{"name":"prerequisites","kind":"object","type":"PrerequisiteCourse","relationName":"CoursePrerequisites"},{"name":"prerequisiteFor","kind":"object","type":"PrerequisiteCourse","relationName":"PrerequisiteForCourses"},{"name":"courseEnrollment","kind":"object","type":"CourseEnrollment","relationName":"CourseToCourseEnrollment"},{"name":"courseAssign","kind":"object","type":"CourseAssignt","relationName":"CourseToCourseAssignt"},{"name":"exam","kind":"object","type":"Exam","relationName":"CourseToExam"},{"name":"coursReuslt","kind":"object","type":"CourseMarks","relationName":"CourseToCourseMarks"}],"dbName":null,"schema":null},"CourseAssignt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"instructorId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseAssignt"},{"name":"instructor","kind":"object","type":"Users","relationName":"CourseAssigntToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseAssigntToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"CourseEnrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"enrollment","kind":"object","type":"Enrollment","relationName":"CourseEnrollmentToEnrollment"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseEnrollment"}],"dbName":null,"schema":null},"CourseMarks":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"attendanceMarks","kind":"scalar","type":"Float"},{"name":"assignmentMarks","kind":"scalar","type":"Float"},{"name":"midMarks","kind":"scalar","type":"Float"},{"name":"finalExamMarks","kind":"scalar","type":"Float"},{"name":"student","kind":"object","type":"Users","relationName":"studentCourseResult"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToCourseMarks"},{"name":"semester","kind":"object","type":"Semester","relationName":"CourseMarksToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Department":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"students","kind":"object","type":"StudentProfile","relationName":"DepartmentToStudentProfile"},{"name":"teachers","kind":"object","type":"InstructorProfile","relationName":"DepartmentToInstructorProfile"},{"name":"program","kind":"object","type":"Program","relationName":"DepartmentToProgram"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToDepartment"},{"name":"user","kind":"object","type":"Users","relationName":"DepartmentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Enrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"semester","kind":"object","type":"Semester","relationName":"EnrollmentToSemester"},{"name":"student","kind":"object","type":"Users","relationName":"EnrollmentToUsers"},{"name":"Enrolementcourses","kind":"object","type":"CourseEnrollment","relationName":"CourseEnrollmentToEnrollment"},{"name":"fees","kind":"object","type":"Fee","relationName":"EnrollmentToFee"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Exam":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"instructorId","kind":"scalar","type":"String"},{"name":"examType","kind":"enum","type":"ExamType"},{"name":"examDate","kind":"scalar","type":"DateTime"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"course","kind":"object","type":"Course","relationName":"CourseToExam"},{"name":"semester","kind":"object","type":"Semester","relationName":"ExamToSemester"},{"name":"instructor","kind":"object","type":"Users","relationName":"InstructorExams"},{"name":"results","kind":"object","type":"Result","relationName":"ExamToResult"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Fee":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"enroleMentId","kind":"scalar","type":"String"},{"name":"feeType","kind":"enum","type":"PaymentType"},{"name":"totalCredit","kind":"scalar","type":"Decimal"},{"name":"perCreditRate","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"remainingAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"firstInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"secondInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"secondInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"secondInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"thirdInstallmentAmount","kind":"scalar","type":"Decimal"},{"name":"thirdInstallmentRemainingAmount","kind":"scalar","type":"Decimal"},{"name":"thirdInstallmentStatus","kind":"enum","type":"PaymentStatus"},{"name":"student","kind":"object","type":"Users","relationName":"FeeToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"FeeToSemester"},{"name":"enroleMent","kind":"object","type":"Enrollment","relationName":"EnrollmentToFee"},{"name":"payments","kind":"object","type":"Payment","relationName":"FeeToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"GPAResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"semesterId","kind":"scalar","type":"String"},{"name":"totalCredits","kind":"scalar","type":"Float"},{"name":"totalPoints","kind":"scalar","type":"Float"},{"name":"gpa","kind":"scalar","type":"Float"},{"name":"student","kind":"object","type":"Users","relationName":"GPAResultToUsers"},{"name":"semester","kind":"object","type":"Semester","relationName":"GPAResultToSemester"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"gpaResult","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"feeId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"paymentType","kind":"enum","type":"PaymentType"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"admissionId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"Users","relationName":"PaymentToUsers"},{"name":"fee","kind":"object","type":"Fee","relationName":"FeeToPayment"},{"name":"admission","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"PrerequisiteCourse":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"prerequisiteCourseId","kind":"scalar","type":"String"},{"name":"course","kind":"object","type":"Course","relationName":"CoursePrerequisites"},{"name":"prerequisiteCourse","kind":"object","type":"Course","relationName":"PrerequisiteForCourses"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Program":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"degreeType","kind":"enum","type":"DegreeType"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalCredits","kind":"scalar","type":"Float"},{"name":"semester","kind":"scalar","type":"Int"},{"name":"semesterType","kind":"enum","type":"SemesterType"},{"name":"description","kind":"scalar","type":"String"},{"name":"admissionFee","kind":"scalar","type":"Float"},{"name":"tuitionFee","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"perCreditFee","kind":"scalar","type":"Float"},{"name":"totalFee","kind":"scalar","type":"Float"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToProgram"},{"name":"courses","kind":"object","type":"Course","relationName":"CourseToProgram"},{"name":"applications","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToProgram"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Result":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"examId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"totalMarks","kind":"scalar","type":"Float"},{"name":"grade","kind":"scalar","type":"String"},{"name":"gradePoint","kind":"scalar","type":"Float"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToResult"},{"name":"student","kind":"object","type":"Users","relationName":"StudentResults"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Semester":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"enum","type":"SemesterCode"},{"name":"year","kind":"scalar","type":"Int"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"registrationOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"fees","kind":"object","type":"Fee","relationName":"FeeToSemester"},{"name":"enrollments","kind":"object","type":"Enrollment","relationName":"EnrollmentToSemester"},{"name":"CourseAssign","kind":"object","type":"CourseAssignt","relationName":"CourseAssigntToSemester"},{"name":"exam","kind":"object","type":"Exam","relationName":"ExamToSemester"},{"name":"gpaResult","kind":"object","type":"GPAResult","relationName":"GPAResultToSemester"},{"name":"courseResult","kind":"object","type":"CourseMarks","relationName":"CourseMarksToSemester"}],"dbName":null,"schema":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"studentProfile"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToStudentProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"studentProfile","schema":null},"InstructorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"teacherCode","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"gender","kind":"scalar","type":"String"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"designation","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"Users","relationName":"instructorProfile"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToInstructorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null,"schema":null},"Users":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"userStatus","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"studentProfile"},{"name":"instructorProfile","kind":"object","type":"InstructorProfile","relationName":"instructorProfile"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"departmentId","kind":"scalar","type":"String"},{"name":"isEnrolled","kind":"scalar","type":"Boolean"},{"name":"department","kind":"object","type":"Department","relationName":"DepartmentToUsers"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUsers"},{"name":"application","kind":"object","type":"AdmissionApplication","relationName":"AdmissionApplicationToUsers"},{"name":"courseAssignments","kind":"object","type":"CourseAssignt","relationName":"CourseAssigntToUsers"},{"name":"fees","kind":"object","type":"Fee","relationName":"FeeToUsers"},{"name":"instructorExams","kind":"object","type":"Exam","relationName":"InstructorExams"},{"name":"studentResults","kind":"object","type":"Result","relationName":"StudentResults"},{"name":"gpaResult","kind":"object","type":"GPAResult","relationName":"GPAResultToUsers"},{"name":"corseResult","kind":"object","type":"CourseMarks","relationName":"studentCourseResult"},{"name":"enrolledment","kind":"object","type":"Enrollment","relationName":"EnrollmentToUsers"},{"name":"auditLog","kind":"object","type":"AuditLog","relationName":"AuditLogToUsers"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","students","department","teachers","program","course","prerequisiteCourse","prerequisites","prerequisiteFor","student","semester","enroleMent","fee","admission","payments","_count","fees","enrollments","instructor","CourseAssign","exam","results","gpaResult","courseResult","Enrolementcourses","enrollment","courseEnrollment","courseAssign","coursReuslt","courses","applications","studentProfile","instructorProfile","application","courseAssignments","instructorExams","studentResults","corseResult","enrolledment","auditLog","AdmissionApplication.findUnique","AdmissionApplication.findUniqueOrThrow","AdmissionApplication.findFirst","AdmissionApplication.findFirstOrThrow","AdmissionApplication.findMany","data","AdmissionApplication.createOne","AdmissionApplication.createMany","AdmissionApplication.createManyAndReturn","AdmissionApplication.updateOne","AdmissionApplication.updateMany","AdmissionApplication.updateManyAndReturn","create","update","AdmissionApplication.upsertOne","AdmissionApplication.deleteOne","AdmissionApplication.deleteMany","having","_avg","_sum","_min","_max","AdmissionApplication.groupBy","AdmissionApplication.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","CourseAssignt.findUnique","CourseAssignt.findUniqueOrThrow","CourseAssignt.findFirst","CourseAssignt.findFirstOrThrow","CourseAssignt.findMany","CourseAssignt.createOne","CourseAssignt.createMany","CourseAssignt.createManyAndReturn","CourseAssignt.updateOne","CourseAssignt.updateMany","CourseAssignt.updateManyAndReturn","CourseAssignt.upsertOne","CourseAssignt.deleteOne","CourseAssignt.deleteMany","CourseAssignt.groupBy","CourseAssignt.aggregate","CourseEnrollment.findUnique","CourseEnrollment.findUniqueOrThrow","CourseEnrollment.findFirst","CourseEnrollment.findFirstOrThrow","CourseEnrollment.findMany","CourseEnrollment.createOne","CourseEnrollment.createMany","CourseEnrollment.createManyAndReturn","CourseEnrollment.updateOne","CourseEnrollment.updateMany","CourseEnrollment.updateManyAndReturn","CourseEnrollment.upsertOne","CourseEnrollment.deleteOne","CourseEnrollment.deleteMany","CourseEnrollment.groupBy","CourseEnrollment.aggregate","CourseMarks.findUnique","CourseMarks.findUniqueOrThrow","CourseMarks.findFirst","CourseMarks.findFirstOrThrow","CourseMarks.findMany","CourseMarks.createOne","CourseMarks.createMany","CourseMarks.createManyAndReturn","CourseMarks.updateOne","CourseMarks.updateMany","CourseMarks.updateManyAndReturn","CourseMarks.upsertOne","CourseMarks.deleteOne","CourseMarks.deleteMany","CourseMarks.groupBy","CourseMarks.aggregate","Department.findUnique","Department.findUniqueOrThrow","Department.findFirst","Department.findFirstOrThrow","Department.findMany","Department.createOne","Department.createMany","Department.createManyAndReturn","Department.updateOne","Department.updateMany","Department.updateManyAndReturn","Department.upsertOne","Department.deleteOne","Department.deleteMany","Department.groupBy","Department.aggregate","Enrollment.findUnique","Enrollment.findUniqueOrThrow","Enrollment.findFirst","Enrollment.findFirstOrThrow","Enrollment.findMany","Enrollment.createOne","Enrollment.createMany","Enrollment.createManyAndReturn","Enrollment.updateOne","Enrollment.updateMany","Enrollment.updateManyAndReturn","Enrollment.upsertOne","Enrollment.deleteOne","Enrollment.deleteMany","Enrollment.groupBy","Enrollment.aggregate","Exam.findUnique","Exam.findUniqueOrThrow","Exam.findFirst","Exam.findFirstOrThrow","Exam.findMany","Exam.createOne","Exam.createMany","Exam.createManyAndReturn","Exam.updateOne","Exam.updateMany","Exam.updateManyAndReturn","Exam.upsertOne","Exam.deleteOne","Exam.deleteMany","Exam.groupBy","Exam.aggregate","Fee.findUnique","Fee.findUniqueOrThrow","Fee.findFirst","Fee.findFirstOrThrow","Fee.findMany","Fee.createOne","Fee.createMany","Fee.createManyAndReturn","Fee.updateOne","Fee.updateMany","Fee.updateManyAndReturn","Fee.upsertOne","Fee.deleteOne","Fee.deleteMany","Fee.groupBy","Fee.aggregate","GPAResult.findUnique","GPAResult.findUniqueOrThrow","GPAResult.findFirst","GPAResult.findFirstOrThrow","GPAResult.findMany","GPAResult.createOne","GPAResult.createMany","GPAResult.createManyAndReturn","GPAResult.updateOne","GPAResult.updateMany","GPAResult.updateManyAndReturn","GPAResult.upsertOne","GPAResult.deleteOne","GPAResult.deleteMany","GPAResult.groupBy","GPAResult.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PrerequisiteCourse.findUnique","PrerequisiteCourse.findUniqueOrThrow","PrerequisiteCourse.findFirst","PrerequisiteCourse.findFirstOrThrow","PrerequisiteCourse.findMany","PrerequisiteCourse.createOne","PrerequisiteCourse.createMany","PrerequisiteCourse.createManyAndReturn","PrerequisiteCourse.updateOne","PrerequisiteCourse.updateMany","PrerequisiteCourse.updateManyAndReturn","PrerequisiteCourse.upsertOne","PrerequisiteCourse.deleteOne","PrerequisiteCourse.deleteMany","PrerequisiteCourse.groupBy","PrerequisiteCourse.aggregate","Program.findUnique","Program.findUniqueOrThrow","Program.findFirst","Program.findFirstOrThrow","Program.findMany","Program.createOne","Program.createMany","Program.createManyAndReturn","Program.updateOne","Program.updateMany","Program.updateManyAndReturn","Program.upsertOne","Program.deleteOne","Program.deleteMany","Program.groupBy","Program.aggregate","Result.findUnique","Result.findUniqueOrThrow","Result.findFirst","Result.findFirstOrThrow","Result.findMany","Result.createOne","Result.createMany","Result.createManyAndReturn","Result.updateOne","Result.updateMany","Result.updateManyAndReturn","Result.upsertOne","Result.deleteOne","Result.deleteMany","Result.groupBy","Result.aggregate","Semester.findUnique","Semester.findUniqueOrThrow","Semester.findFirst","Semester.findFirstOrThrow","Semester.findMany","Semester.createOne","Semester.createMany","Semester.createManyAndReturn","Semester.updateOne","Semester.updateMany","Semester.updateManyAndReturn","Semester.upsertOne","Semester.deleteOne","Semester.deleteMany","Semester.groupBy","Semester.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","InstructorProfile.findUnique","InstructorProfile.findUniqueOrThrow","InstructorProfile.findFirst","InstructorProfile.findFirstOrThrow","InstructorProfile.findMany","InstructorProfile.createOne","InstructorProfile.createMany","InstructorProfile.createManyAndReturn","InstructorProfile.updateOne","InstructorProfile.updateMany","InstructorProfile.updateManyAndReturn","InstructorProfile.upsertOne","InstructorProfile.deleteOne","InstructorProfile.deleteMany","InstructorProfile.groupBy","InstructorProfile.aggregate","Users.findUnique","Users.findUniqueOrThrow","Users.findFirst","Users.findFirstOrThrow","Users.findMany","Users.createOne","Users.createMany","Users.createManyAndReturn","Users.updateOne","Users.updateMany","Users.updateManyAndReturn","Users.upsertOne","Users.deleteOne","Users.deleteMany","Users.groupBy","Users.aggregate","AND","OR","NOT","id","name","email","password","emailVerified","Role","role","UserStatus","userStatus","AuthProvider","authProvider","imageUrl","imagePublicId","googleId","departmentId","isEnrolled","createdAt","updatedAt","deletedAt","isDeleted","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","teacherCode","phone","gender","dateOfBirth","address","designation","bio","specialization","qualification","experience","profilePhoto","studentId","SemesterCode","year","startDate","endDate","registrationOpen","every","some","none","name_year","examId","totalMarks","grade","gradePoint","DegreeType","degreeType","duration","totalCredits","SemesterType","semesterType","description","admissionFee","tuitionFee","isActive","perCreditFee","totalFee","courseId","prerequisiteCourseId","feeId","amount","PaymentType","paymentType","PaymentMethod","paymentMethod","PaymentStatus","paymentStatus","transactionId","admissionId","paidAt","semesterId","totalPoints","gpa","enroleMentId","feeType","totalCredit","perCreditRate","totalAmount","remainingAmount","firstInstallmentAmount","firstInstallmentRemainingAmount","firstInstallmentStatus","secondInstallmentAmount","secondInstallmentRemainingAmount","secondInstallmentStatus","thirdInstallmentAmount","thirdInstallmentRemainingAmount","thirdInstallmentStatus","instructorId","ExamType","examType","examDate","code","attendanceMarks","assignmentMarks","midMarks","finalExamMarks","enrollmentId","title","credit","semesterNumber","programId","CourseAssignmentStatus","status","action","resource","resourceId","oldData","newData","ipAddress","userAgent","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","previousInstitution","previousDegree","sscResult","hscResult","diplomaResult","AdmissionStatus","submittedAt","reviewedAt","reviewedBy","rejectionReason","studentId_courseId_semesterId","studentId_semesterId","examId_studentId","courseId_semesterId_examType","courseId_semesterId","enrollmentId_courseId","courseId_prerequisiteCourseId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "nAy1AbACFQEAAKoFACAHAAC-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_BAAw5AIAAGMAEOUCAAD_BAAw5gIBANMEACHnAgEA0wQAIfYCQADWBAAh9wJAANYEACGlAwEAgAUAIc4DAQDTBAAhAQAAAGMAIAMAAAAhACACAAAiADADAAAjACABAAAAJgAgAwAAAC0AIAIAAC4AMAMAAC8AIAMAAAAdACACAAAeADADAAAfACADAAAAMQAgAgAAMgAwAwAAMwAgAwAAADUAIAIAADYAMAMAADcAIAMAAAA6ACACAAA7ADADAAA8ACADAAAAPgAgAgAAPwAwAwAAQAAgAwAAACkAIAIAACoAMAMAACsAIA4BAACZBQAg4wIAAJcFADDkAgAAbgAQ5QIAAJcFADDmAgEA0wQAIfYCQADWBAAhhQMBAIAFACHaAwEA0wQAIdsDAQDTBAAh3AMBAIAFACHdAwAAmAUAIN4DAACYBQAg3wMBAIAFACHgAwEAgAUAIQcBAAC4CgAghQMAANYFACDcAwAA1gUAIN0DAADWBQAg3gMAANYFACDfAwAA1gUAIOADAADWBQAgDgEAAJkFACDjAgAAlwUAMOQCAABuABDlAgAAlwUAMOYCAQAAAAH2AkAA1gQAIYUDAQCABQAh2gMBANMEACHbAwEA0wQAIdwDAQCABQAh3QMAAJgFACDeAwAAmAUAIN8DAQCABQAh4AMBAIAFACEDAAAAbgAgAgAAbwAwAwAAcAAgAQAAAFkAIAEAAAAhACABAAAALQAgAQAAAB0AIAEAAAAxACABAAAANQAgAQAAADoAIAEAAAA-ACABAAAAKQAgAQAAAG4AIAEAAAAhACABAAAAAQAgAwAAACYAIAIAAFQAMAMAAAEAIAMAAAAmACACAABUADADAAABACADAAAAJgAgAgAAVAAwAwAAAQAgEgEAANkIACAHAAC0BwAgEQAAtQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAYUDAQAAAAHXAwEAAAAB2QMAAADtAwLnAwEAAAAB6AMBAAAAAekDCAAAAAHqAwgAAAAB6wMIAAAAAe0DQAAAAAHuA0AAAAAB7wMBAAAAAfADAQAAAAEBMAAAgQEAIA_mAgEAAAAB9gJAAAAAAfcCQAAAAAGFAwEAAAAB1wMBAAAAAdkDAAAA7QMC5wMBAAAAAegDAQAAAAHpAwgAAAAB6gMIAAAAAesDCAAAAAHtA0AAAAAB7gNAAAAAAe8DAQAAAAHwAwEAAAABATAAAIMBADABMAAAgwEAMBIBAADXCAAgBwAAqwcAIBEAAKwHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIdcDAQDaBQAh2QMAAKoH7QMi5wMBANsFACHoAwEA2wUAIekDCACpBwAh6gMIAKkHACHrAwgAqQcAIe0DQADhBQAh7gNAAOIFACHvAwEA2wUAIfADAQDbBQAhAgAAAAEAIDAAAIYBACAP5gIBANoFACH2AkAA4QUAIfcCQADhBQAhhQMBANoFACHXAwEA2gUAIdkDAACqB-0DIucDAQDbBQAh6AMBANsFACHpAwgAqQcAIeoDCACpBwAh6wMIAKkHACHtA0AA4QUAIe4DQADiBQAh7wMBANsFACHwAwEA2wUAIQIAAAAmACAwAACIAQAgAgAAACYAIDAAAIgBACADAAAAAQAgNwAAgQEAIDgAAIYBACABAAAAAQAgAQAAACYAIA0SAACzCgAgPQAAtAoAID4AALcKACA_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_AACsCgAgQAAAqwoAIA7jAgAAiQUAMOQCAAC9AQAQ5QIAAIkFADDmAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIaUDAQCsBAAhzgMBAKwEACHUAwEArAQAIdUDCADgBAAh1gMCAM0EACHXAwEArAQAIdkDAACKBdkDIgMAAAAQACACAAC8AQAwPAAAvQEAIAMAAAAQACACAAARADADAAASACABAAAALwAgAQAAAC8AIAMAAAAtACACAAAuADADAAAvACADAAAALQAgAgAALgAwAwAALwAgAwAAAC0AIAIAAC4AMAMAAC8AIAkIAACiBwAgDQAAowcAIBUAAJwIACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGrAwEAAAABuAMBAAAAAcoDAQAAAAEBMAAAxQEAIAbmAgEAAAAB9gJAAAAAAfcCQAAAAAGrAwEAAAABuAMBAAAAAcoDAQAAAAEBMAAAxwEAMAEwAADHAQAwCQgAAJ8HACANAACgBwAgFQAAmggAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIasDAQDaBQAhuAMBANoFACHKAwEA2gUAIQIAAAAvACAwAADKAQAgBuYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIasDAQDaBQAhuAMBANoFACHKAwEA2gUAIQIAAAAtACAwAADMAQAgAgAAAC0AIDAAAMwBACADAAAALwAgNwAAxQEAIDgAAMoBACABAAAALwAgAQAAAC0AIAMSAACmCgAgPwAAqAoAIEAAAKcKACAJ4wIAAIgFADDkAgAA0wEAEOUCAACIBQAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhqwMBAKwEACG4AwEArAQAIcoDAQCsBAAhAwAAAC0AIAIAANIBADA8AADTAQAgAwAAAC0AIAIAAC4AMAMAAC8AIAEAAAAbACABAAAAGwAgAwAAABkAIAIAABoAMAMAABsAIAMAAAAZACACAAAaADADAAAbACADAAAAGQAgAgAAGgAwAwAAGwAgBQgAALcGACAcAACSCQAg5gIBAAAAAasDAQAAAAHTAwEAAAABATAAANsBACAD5gIBAAAAAasDAQAAAAHTAwEAAAABATAAAN0BADABMAAA3QEAMAUIAAC1BgAgHAAAkAkAIOYCAQDaBQAhqwMBANoFACHTAwEA2gUAIQIAAAAbACAwAADgAQAgA-YCAQDaBQAhqwMBANoFACHTAwEA2gUAIQIAAAAZACAwAADiAQAgAgAAABkAIDAAAOIBACADAAAAGwAgNwAA2wEAIDgAAOABACABAAAAGwAgAQAAABkAIAMSAACjCgAgPwAApQoAIEAAAKQKACAG4wIAAIcFADDkAgAA6QEAEOUCAACHBQAw5gIBAKwEACGrAwEArAQAIdMDAQCsBAAhAwAAABkAIAIAAOgBADA8AADpAQAgAwAAABkAIAIAABoAMAMAABsAIAEAAABAACABAAAAQAAgAwAAAD4AIAIAAD8AMAMAAEAAIAMAAAA-ACACAAA_ADADAABAACADAAAAPgAgAgAAPwAwAwAAQAAgDQgAAMoGACAMAAD7BwAgDQAAywYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZEDAQAAAAGrAwEAAAABuAMBAAAAAc8DCAAAAAHQAwgAAAAB0QMIAAAAAdIDCAAAAAEBMAAA8QEAIArmAgEAAAAB9gJAAAAAAfcCQAAAAAGRAwEAAAABqwMBAAAAAbgDAQAAAAHPAwgAAAAB0AMIAAAAAdEDCAAAAAHSAwgAAAABATAAAPMBADABMAAA8wEAMA0IAADHBgAgDAAA-QcAIA0AAMgGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGRAwEA2gUAIasDAQDaBQAhuAMBANoFACHPAwgAnwYAIdADCACfBgAh0QMIAJ8GACHSAwgAnwYAIQIAAABAACAwAAD2AQAgCuYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhqwMBANoFACG4AwEA2gUAIc8DCACfBgAh0AMIAJ8GACHRAwgAnwYAIdIDCACfBgAhAgAAAD4AIDAAAPgBACACAAAAPgAgMAAA-AEAIAMAAABAACA3AADxAQAgOAAA9gEAIAEAAABAACABAAAAPgAgBRIAAJ4KACA9AACfCgAgPgAAogoAID8AAKEKACBAAACgCgAgDeMCAACGBQAw5AIAAP8BABDlAgAAhgUAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIZEDAQCsBAAhqwMBAKwEACG4AwEArAQAIc8DCADgBAAh0AMIAOAEACHRAwgA4AQAIdIDCADgBAAhAwAAAD4AIAIAAP4BADA8AAD_AQAgAwAAAD4AIAIAAD8AMAMAAEAAIA4BAACFBQAgBAAAgQUAIAYAAIIFACAHAACDBQAgCAAAhAUAIOMCAAD_BAAw5AIAAGMAEOUCAAD_BAAw5gIBAAAAAecCAQAAAAH2AkAA1gQAIfcCQADWBAAhpQMBAIAFACHOAwEAAAABAQAAAIICACABAAAAggIAIAYBAACdCgAgBAAAmQoAIAYAAJoKACAHAACbCgAgCAAAnAoAIKUDAADWBQAgAwAAAGMAIAIAAIUCADADAACCAgAgAwAAAGMAIAIAAIUCADADAACCAgAgAwAAAGMAIAIAAIUCADADAACCAgAgCwEAAJgKACAEAACUCgAgBgAAlQoAIAcAAJYKACAIAACXCgAg5gIBAAAAAecCAQAAAAH2AkAAAAAB9wJAAAAAAaUDAQAAAAHOAwEAAAABATAAAIkCACAG5gIBAAAAAecCAQAAAAH2AkAAAAAB9wJAAAAAAaUDAQAAAAHOAwEAAAABATAAAIsCADABMAAAiwIAMAsBAADYCQAgBAAA1AkAIAYAANUJACAHAADWCQAgCAAA1wkAIOYCAQDaBQAh5wIBANoFACH2AkAA4QUAIfcCQADhBQAhpQMBANsFACHOAwEA2gUAIQIAAACCAgAgMAAAjgIAIAbmAgEA2gUAIecCAQDaBQAh9gJAAOEFACH3AkAA4QUAIaUDAQDbBQAhzgMBANoFACECAAAAYwAgMAAAkAIAIAIAAABjACAwAACQAgAgAwAAAIICACA3AACJAgAgOAAAjgIAIAEAAACCAgAgAQAAAGMAIAQSAADRCQAgPwAA0wkAIEAAANIJACClAwAA1gUAIAnjAgAA_gQAMOQCAACXAgAQ5QIAAP4EADDmAgEArAQAIecCAQCsBAAh9gJAALMEACH3AkAAswQAIaUDAQCtBAAhzgMBAKwEACEDAAAAYwAgAgAAlgIAMDwAAJcCACADAAAAYwAgAgAAhQIAMAMAAIICACABAAAAKwAgAQAAACsAIAMAAAApACACAAAqADADAAArACADAAAAKQAgAgAAKgAwAwAAKwAgAwAAACkAIAIAACoAMAMAACsAIAkMAACnCAAgDQAAuQYAIBMAALsGACAbAAC6BgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABkQMBAAAAAbgDAQAAAAEBMAAAnwIAIAXmAgEAAAAB9gJAAAAAAfcCQAAAAAGRAwEAAAABuAMBAAAAAQEwAAChAgAwATAAAKECADAJDAAApQgAIA0AAIcGACATAACJBgAgGwAAiAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhuAMBANoFACECAAAAKwAgMAAApAIAIAXmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGRAwEA2gUAIbgDAQDaBQAhAgAAACkAIDAAAKYCACACAAAAKQAgMAAApgIAIAMAAAArACA3AACfAgAgOAAApAIAIAEAAAArACABAAAAKQAgAxIAAM4JACA_AADQCQAgQAAAzwkAIAjjAgAA_QQAMOQCAACtAgAQ5QIAAP0EADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGRAwEArAQAIbgDAQCsBAAhAwAAACkAIAIAAKwCADA8AACtAgAgAwAAACkAIAIAACoAMAMAACsAIAEAAAAzACABAAAAMwAgAwAAADEAIAIAADIAMAMAADMAIAMAAAAxACACAAAyADADAAAzACADAAAAMQAgAgAAMgAwAwAAMwAgDQgAAIMHACANAACEBwAgFQAAkQgAIBgAAIUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGcAwgAAAABqwMBAAAAAbgDAQAAAAHKAwEAAAABzAMAAADMAwLNA0AAAAABATAAALUCACAJ5gIBAAAAAfYCQAAAAAH3AkAAAAABnAMIAAAAAasDAQAAAAG4AwEAAAABygMBAAAAAcwDAAAAzAMCzQNAAAAAAQEwAAC3AgAwATAAALcCADANCAAA9AYAIA0AAPUGACAVAACPCAAgGAAA9gYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZwDCACfBgAhqwMBANoFACG4AwEA2gUAIcoDAQDaBQAhzAMAAPIGzAMizQNAAOEFACECAAAAMwAgMAAAugIAIAnmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGcAwgAnwYAIasDAQDaBQAhuAMBANoFACHKAwEA2gUAIcwDAADyBswDIs0DQADhBQAhAgAAADEAIDAAALwCACACAAAAMQAgMAAAvAIAIAMAAAAzACA3AAC1AgAgOAAAugIAIAEAAAAzACABAAAAMQAgBRIAAMkJACA9AADKCQAgPgAAzQkAID8AAMwJACBAAADLCQAgDOMCAAD5BAAw5AIAAMMCABDlAgAA-QQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIZwDCADgBAAhqwMBAKwEACG4AwEArAQAIcoDAQCsBAAhzAMAAPoEzAMizQNAALMEACEDAAAAMQAgAgAAwgIAMDwAAMMCACADAAAAMQAgAgAAMgAwAwAAMwAgAQAAAB8AIAEAAAAfACADAAAAHQAgAgAAHgAwAwAAHwAgAwAAAB0AIAIAAB4AMAMAAB8AIAMAAAAdACACAAAeADADAAAfACAYDAAApwYAIA0AAKgGACAOAACTBwAgEQAAqQYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZEDAQAAAAG4AwEAAAABuwMBAAAAAbwDAAAAsAMCvQMQAAAAAb4DEAAAAAG_AxAAAAABwAMQAAAAAcEDEAAAAAHCAxAAAAABwwMAAAC0AwLEAxAAAAABxQMQAAAAAcYDAAAAtAMCxwMQAAAAAcgDEAAAAAHJAwAAALQDAgEwAADLAgAgFOYCAQAAAAH2AkAAAAAB9wJAAAAAAZEDAQAAAAG4AwEAAAABuwMBAAAAAbwDAAAAsAMCvQMQAAAAAb4DEAAAAAG_AxAAAAABwAMQAAAAAcEDEAAAAAHCAxAAAAABwwMAAAC0AwLEAxAAAAABxQMQAAAAAcYDAAAAtAMCxwMQAAAAAcgDEAAAAAHJAwAAALQDAgEwAADNAgAwATAAAM0CADAYDAAAkgYAIA0AAJMGACAOAACRBwAgEQAAlAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhuAMBANoFACG7AwEA2gUAIbwDAACPBrADIr0DEACQBgAhvgMQAJAGACG_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_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_AwAwATAAAL8DADAKDAAA_wYAIBcAAOUGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGRAwEA2gUAIZsDAQDaBQAhnAMIAJ8GACGdAwEA2gUAIZ4DCACfBgAhAgAAADcAIDAAAMIDACAI5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACGbAwEA2gUAIZwDCACfBgAhnQMBANoFACGeAwgAnwYAIQIAAAA1ACAwAADEAwAgAgAAADUAIDAAAMQDACADAAAANwAgNwAAvQMAIDgAAMIDACABAAAANwAgAQAAADUAIAUSAAC9CAAgPQAAvggAID4AAMEIACA_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_AADZBQAgQAAA2AUAIOkCAADWBQAg8wIAANYFACD0AgAA1gUAIPUCAADWBQAg-AIAANYFACAU4wIAAKsEADDkAgAAqAQAEOUCAACrBAAw5gIBAKwEACHnAgEArAQAIegCAQCsBAAh6QIBAK0EACHqAiAArgQAIewCAACvBOwCIu4CAACwBO4CIvACAACxBPACIvECAQCsBAAh8gIBAKwEACHzAgEArQQAIfQCAQCtBAAh9QIgALIEACH2AkAAswQAIfcCQACzBAAh-AJAALQEACH5AiAArgQAIQMAAABZACACAACnBAAwPAAAqAQAIAMAAABZACACAABaADADAABbACAU4wIAAKsEADDkAgAAqAQAEOUCAACrBAAw5gIBAKwEACHnAgEArAQAIegCAQCsBAAh6QIBAK0EACHqAiAArgQAIewCAACvBOwCIu4CAACwBO4CIvACAACxBPACIvECAQCsBAAh8gIBAKwEACHzAgEArQQAIfQCAQCtBAAh9QIgALIEACH2AkAAswQAIfcCQACzBAAh-AJAALQEACH5AiAArgQAIQ4SAAC5BAAgPwAAyAQAIEAAAMgEACD6AgEAAAAB-wIBAAAABPwCAQAAAAT9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEAAAABgQMBAMcEACGCAwEAAAABgwMBAAAAAYQDAQAAAAEOEgAAtgQAID8AAMYEACBAAADGBAAg-gIBAAAAAfsCAQAAAAX8AgEAAAAF_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAYEDAQDFBAAhggMBAAAAAYMDAQAAAAGEAwEAAAABBRIAALkEACA_AADEBAAgQAAAxAQAIPoCIAAAAAGBAyAAwwQAIQcSAAC5BAAgPwAAwgQAIEAAAMIEACD6AgAAAOwCAvsCAAAA7AII_AIAAADsAgiBAwAAwQTsAiIHEgAAuQQAID8AAMAEACBAAADABAAg-gIAAADuAgL7AgAAAO4CCPwCAAAA7gIIgQMAAL8E7gIiBxIAALkEACA_AAC-BAAgQAAAvgQAIPoCAAAA8AIC-wIAAADwAgj8AgAAAPACCIEDAAC9BPACIgUSAAC2BAAgPwAAvAQAIEAAALwEACD6AiAAAAABgQMgALsEACELEgAAuQQAID8AALoEACBAAAC6BAAg-gJAAAAAAfsCQAAAAAT8AkAAAAAE_QJAAAAAAf4CQAAAAAH_AkAAAAABgANAAAAAAYEDQAC4BAAhCxIAALYEACA_AAC3BAAgQAAAtwQAIPoCQAAAAAH7AkAAAAAF_AJAAAAABf0CQAAAAAH-AkAAAAAB_wJAAAAAAYADQAAAAAGBA0AAtQQAIQsSAAC2BAAgPwAAtwQAIEAAALcEACD6AkAAAAAB-wJAAAAABfwCQAAAAAX9AkAAAAAB_gJAAAAAAf8CQAAAAAGAA0AAAAABgQNAALUEACEI-gICAAAAAfsCAgAAAAX8AgIAAAAF_QICAAAAAf4CAgAAAAH_AgIAAAABgAMCAAAAAYEDAgC2BAAhCPoCQAAAAAH7AkAAAAAF_AJAAAAABf0CQAAAAAH-AkAAAAAB_wJAAAAAAYADQAAAAAGBA0AAtwQAIQsSAAC5BAAgPwAAugQAIEAAALoEACD6AkAAAAAB-wJAAAAABPwCQAAAAAT9AkAAAAAB_gJAAAAAAf8CQAAAAAGAA0AAAAABgQNAALgEACEI-gICAAAAAfsCAgAAAAT8AgIAAAAE_QICAAAAAf4CAgAAAAH_AgIAAAABgAMCAAAAAYEDAgC5BAAhCPoCQAAAAAH7AkAAAAAE_AJAAAAABP0CQAAAAAH-AkAAAAAB_wJAAAAAAYADQAAAAAGBA0AAugQAIQUSAAC2BAAgPwAAvAQAIEAAALwEACD6AiAAAAABgQMgALsEACEC-gIgAAAAAYEDIAC8BAAhBxIAALkEACA_AAC-BAAgQAAAvgQAIPoCAAAA8AIC-wIAAADwAgj8AgAAAPACCIEDAAC9BPACIgT6AgAAAPACAvsCAAAA8AII_AIAAADwAgiBAwAAvgTwAiIHEgAAuQQAID8AAMAEACBAAADABAAg-gIAAADuAgL7AgAAAO4CCPwCAAAA7gIIgQMAAL8E7gIiBPoCAAAA7gIC-wIAAADuAgj8AgAAAO4CCIEDAADABO4CIgcSAAC5BAAgPwAAwgQAIEAAAMIEACD6AgAAAOwCAvsCAAAA7AII_AIAAADsAgiBAwAAwQTsAiIE-gIAAADsAgL7AgAAAOwCCPwCAAAA7AIIgQMAAMIE7AIiBRIAALkEACA_AADEBAAgQAAAxAQAIPoCIAAAAAGBAyAAwwQAIQL6AiAAAAABgQMgAMQEACEOEgAAtgQAID8AAMYEACBAAADGBAAg-gIBAAAAAfsCAQAAAAX8AgEAAAAF_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAYEDAQDFBAAhggMBAAAAAYMDAQAAAAGEAwEAAAABC_oCAQAAAAH7AgEAAAAF_AIBAAAABf0CAQAAAAH-AgEAAAAB_wIBAAAAAYADAQAAAAGBAwEAxgQAIYIDAQAAAAGDAwEAAAABhAMBAAAAAQ4SAAC5BAAgPwAAyAQAIEAAAMgEACD6AgEAAAAB-wIBAAAABPwCAQAAAAT9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEAAAABgQMBAMcEACGCAwEAAAABgwMBAAAAAYQDAQAAAAEL-gIBAAAAAfsCAQAAAAT8AgEAAAAE_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAYEDAQDIBAAhggMBAAAAAYMDAQAAAAGEAwEAAAABE-MCAADJBAAw5AIAAJAEABDlAgAAyQQAMOYCAQCsBAAh9AIBAKwEACH2AkAAswQAIfcCQACzBAAhhQMBAKwEACGGAwEArAQAIYcDAQCtBAAhiAMBAK0EACGJA0AAtAQAIYoDAQCtBAAhiwMBAK0EACGMAwEArQQAIY0DAQCtBAAhjgMBAK0EACGPAwEArQQAIZADAQCtBAAhDeMCAADKBAAw5AIAAPoDABDlAgAAygQAMOYCAQCsBAAh9AIBAKwEACH2AkAAswQAIfcCQACzBAAhhwMBAKwEACGIAwEArAQAIYkDAQCsBAAhigMBAKwEACGQAwEArQQAIZEDAQCsBAAhC-MCAADLBAAw5AIAAOQDABDlAgAAywQAMOYCAQCsBAAh5wIAAMwEkwMi9gJAALMEACH3AkAAswQAIZMDAgDNBAAhlANAALMEACGVA0AAswQAIZYDIACuBAAhBxIAALkEACA_AADRBAAgQAAA0QQAIPoCAAAAkwMC-wIAAACTAwj8AgAAAJMDCIEDAADQBJMDIg0SAAC5BAAgPQAAzwQAID4AALkEACA_AAC5BAAgQAAAuQQAIPoCAgAAAAH7AgIAAAAE_AICAAAABP0CAgAAAAH-AgIAAAAB_wICAAAAAYADAgAAAAGBAwIAzgQAIQ0SAAC5BAAgPQAAzwQAID4AALkEACA_AAC5BAAgQAAAuQQAIPoCAgAAAAH7AgIAAAAE_AICAAAABP0CAgAAAAH-AgIAAAAB_wICAAAAAYADAgAAAAGBAwIAzgQAIQj6AggAAAAB-wIIAAAABPwCCAAAAAT9AggAAAAB_gIIAAAAAf8CCAAAAAGAAwgAAAABgQMIAM8EACEHEgAAuQQAID8AANEEACBAAADRBAAg-gIAAACTAwL7AgAAAJMDCPwCAAAAkwMIgQMAANAEkwMiBPoCAAAAkwMC-wIAAACTAwj8AgAAAJMDCIEDAADRBJMDIhETAADYBAAgFAAA2QQAIBYAANoEACAXAADbBAAgGQAA3AQAIBoAAN0EACDjAgAA0gQAMOQCAADRAwAQ5QIAANIEADDmAgEA0wQAIecCAADUBJMDIvYCQADWBAAh9wJAANYEACGTAwIA1QQAIZQDQADWBAAhlQNAANYEACGWAyAA1wQAIQv6AgEAAAAB-wIBAAAABPwCAQAAAAT9AgEAAAAB_gIBAAAAAf8CAQAAAAGAAwEAAAABgQMBAMgEACGCAwEAAAABgwMBAAAAAYQDAQAAAAEE-gIAAACTAwL7AgAAAJMDCPwCAAAAkwMIgQMAANEEkwMiCPoCAgAAAAH7AgIAAAAE_AICAAAABP0CAgAAAAH-AgIAAAAB_wICAAAAAYADAgAAAAGBAwIAuQQAIQj6AkAAAAAB-wJAAAAABPwCQAAAAAT9AkAAAAAB_gJAAAAAAf8CQAAAAAGAA0AAAAABgQNAALoEACEC-gIgAAAAAYEDIADEBAAhA5cDAAAdACCYAwAAHQAgmQMAAB0AIAOXAwAAKQAgmAMAACkAIJkDAAApACADlwMAAC0AIJgDAAAtACCZAwAALQAgA5cDAAAxACCYAwAAMQAgmQMAADEAIAOXAwAAOgAgmAMAADoAIJkDAAA6ACADlwMAAD4AIJgDAAA-ACCZAwAAPgAgAucCAAAAkwMCkwMCAAAAAQvjAgAA3wQAMOQCAADLAwAQ5QIAAN8EADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGRAwEArAQAIZsDAQCsBAAhnAMIAOAEACGdAwEArAQAIZ4DCADgBAAhDRIAALkEACA9AADPBAAgPgAAzwQAID8AAM8EACBAAADPBAAg-gIIAAAAAfsCCAAAAAT8AggAAAAE_QIIAAAAAf4CCAAAAAH_AggAAAABgAMIAAAAAYEDCADhBAAhDRIAALkEACA9AADPBAAgPgAAzwQAID8AAM8EACBAAADPBAAg-gIIAAAAAfsCCAAAAAT8AggAAAAE_QIIAAAAAf4CCAAAAAH_AggAAAABgAMIAAAAAYEDCADhBAAhEw0CAM0EACHjAgAA4gQAMOQCAAC1AwAQ5QIAAOIEADDmAgEArAQAIecCAQCsBAAh9AIBAKwEACH2AkAAswQAIfcCQACzBAAhoAMAAOMEoAMioQMCAM0EACGiAwgA4AQAIaQDAADkBKQDIqUDAQCsBAAhpgMIAOAEACGnAwgA4AQAIagDIACuBAAhqQMIAOAEACGqAwgA4AQAIQcSAAC5BAAgPwAA6AQAIEAAAOgEACD6AgAAAKADAvsCAAAAoAMI_AIAAACgAwiBAwAA5wSgAyIHEgAAuQQAID8AAOYEACBAAADmBAAg-gIAAACkAwL7AgAAAKQDCPwCAAAApAMIgQMAAOUEpAMiBxIAALkEACA_AADmBAAgQAAA5gQAIPoCAAAApAMC-wIAAACkAwj8AgAAAKQDCIEDAADlBKQDIgT6AgAAAKQDAvsCAAAApAMI_AIAAACkAwiBAwAA5gSkAyIHEgAAuQQAID8AAOgEACBAAADoBAAg-gIAAACgAwL7AgAAAKADCPwCAAAAoAMIgQMAAOcEoAMiBPoCAAAAoAMC-wIAAACgAwj8AgAAAKADCIEDAADoBKADIgjjAgAA6QQAMOQCAACfAwAQ5QIAAOkEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGrAwEArAQAIawDAQCsBAAhD-MCAADqBAAw5AIAAIkDABDlAgAA6gQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIYUDAQCsBAAhrQMBAK0EACGuAwgA4AQAIbADAADrBLADIrIDAADsBLIDIrQDAADtBLQDIrUDAQCtBAAhtgMBAK0EACG3A0AAtAQAIQcSAAC5BAAgPwAA8wQAIEAAAPMEACD6AgAAALADAvsCAAAAsAMI_AIAAACwAwiBAwAA8gSwAyIHEgAAuQQAID8AAPEEACBAAADxBAAg-gIAAACyAwL7AgAAALIDCPwCAAAAsgMIgQMAAPAEsgMiBxIAALkEACA_AADvBAAgQAAA7wQAIPoCAAAAtAMC-wIAAAC0Awj8AgAAALQDCIEDAADuBLQDIgcSAAC5BAAgPwAA7wQAIEAAAO8EACD6AgAAALQDAvsCAAAAtAMI_AIAAAC0AwiBAwAA7gS0AyIE-gIAAAC0AwL7AgAAALQDCPwCAAAAtAMIgQMAAO8EtAMiBxIAALkEACA_AADxBAAgQAAA8QQAIPoCAAAAsgMC-wIAAACyAwj8AgAAALIDCIEDAADwBLIDIgT6AgAAALIDAvsCAAAAsgMI_AIAAACyAwiBAwAA8QSyAyIHEgAAuQQAID8AAPMEACBAAADzBAAg-gIAAACwAwL7AgAAALADCPwCAAAAsAMIgQMAAPIEsAMiBPoCAAAAsAMC-wIAAACwAwj8AgAAALADCIEDAADzBLADIgvjAgAA9AQAMOQCAADvAgAQ5QIAAPQEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGRAwEArAQAIaIDCADgBAAhuAMBAKwEACG5AwgA4AQAIboDCADgBAAhF-MCAAD1BAAw5AIAANkCABDlAgAA9QQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIZEDAQCsBAAhuAMBAKwEACG7AwEArAQAIbwDAADrBLADIr0DEAD2BAAhvgMQAPYEACG_AxAA9gQAIcADEAD2BAAhwQMQAPYEACHCAxAA9gQAIcMDAADtBLQDIsQDEAD2BAAhxQMQAPYEACHGAwAA7QS0AyLHAxAA9gQAIcgDEAD2BAAhyQMAAO0EtAMiDRIAALkEACA9AAD4BAAgPgAA-AQAID8AAPgEACBAAAD4BAAg-gIQAAAAAfsCEAAAAAT8AhAAAAAE_QIQAAAAAf4CEAAAAAH_AhAAAAABgAMQAAAAAYEDEAD3BAAhDRIAALkEACA9AAD4BAAgPgAA-AQAID8AAPgEACBAAAD4BAAg-gIQAAAAAfsCEAAAAAT8AhAAAAAE_QIQAAAAAf4CEAAAAAH_AhAAAAABgAMQAAAAAYEDEAD3BAAhCPoCEAAAAAH7AhAAAAAE_AIQAAAABP0CEAAAAAH-AhAAAAAB_wIQAAAAAYADEAAAAAGBAxAA-AQAIQzjAgAA-QQAMOQCAADDAgAQ5QIAAPkEADDmAgEArAQAIfYCQACzBAAh9wJAALMEACGcAwgA4AQAIasDAQCsBAAhuAMBAKwEACHKAwEArAQAIcwDAAD6BMwDIs0DQACzBAAhBxIAALkEACA_AAD8BAAgQAAA_AQAIPoCAAAAzAMC-wIAAADMAwj8AgAAAMwDCIEDAAD7BMwDIgcSAAC5BAAgPwAA_AQAIEAAAPwEACD6AgAAAMwDAvsCAAAAzAMI_AIAAADMAwiBAwAA-wTMAyIE-gIAAADMAwL7AgAAAMwDCPwCAAAAzAMIgQMAAPwEzAMiCOMCAAD9BAAw5AIAAK0CABDlAgAA_QQAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIZEDAQCsBAAhuAMBAKwEACEJ4wIAAP4EADDkAgAAlwIAEOUCAAD-BAAw5gIBAKwEACHnAgEArAQAIfYCQACzBAAh9wJAALMEACGlAwEArQQAIc4DAQCsBAAhDgEAAIUFACAEAACBBQAgBgAAggUAIAcAAIMFACAIAACEBQAg4wIAAP8EADDkAgAAYwAQ5QIAAP8EADDmAgEA0wQAIecCAQDTBAAh9gJAANYEACH3AkAA1gQAIaUDAQCABQAhzgMBANMEACEL-gIBAAAAAfsCAQAAAAX8AgEAAAAF_QIBAAAAAf4CAQAAAAH_AgEAAAABgAMBAAAAAYEDAQDGBAAhggMBAAAAAYMDAQAAAAGEAwEAAAABA5cDAAADACCYAwAAAwAgmQMAAAMAIAOXAwAACAAgmAMAAAgAIJkDAAAIACADlwMAAAwAIJgDAAAMACCZAwAADAAgA5cDAAAQACCYAwAAEAAgmQMAABAAIAOXAwAAWQAgmAMAAFkAIJkDAABZACAN4wIAAIYFADDkAgAA_wEAEOUCAACGBQAw5gIBAKwEACH2AkAAswQAIfcCQACzBAAhkQMBAKwEACGrAwEArAQAIbgDAQCsBAAhzwMIAOAEACHQAwgA4AQAIdEDCADgBAAh0gMIAOAEACEG4wIAAIcFADDkAgAA6QEAEOUCAACHBQAw5gIBAKwEACGrAwEArAQAIdMDAQCsBAAhCeMCAACIBQAw5AIAANMBABDlAgAAiAUAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIasDAQCsBAAhuAMBAKwEACHKAwEArAQAIQ7jAgAAiQUAMOQCAAC9AQAQ5QIAAIkFADDmAgEArAQAIfQCAQCsBAAh9gJAALMEACH3AkAAswQAIaUDAQCsBAAhzgMBAKwEACHUAwEArAQAIdUDCADgBAAh1gMCAM0EACHXAwEArAQAIdkDAACKBdkDIgcSAAC5BAAgPwAAjAUAIEAAAIwFACD6AgAAANkDAvsCAAAA2QMI_AIAAADZAwiBAwAAiwXZAyIHEgAAuQQAID8AAIwFACBAAACMBQAg-gIAAADZAwL7AgAAANkDCPwCAAAA2QMIgQMAAIsF2QMiBPoCAAAA2QMC-wIAAADZAwj8AgAAANkDCIEDAACMBdkDIg3jAgAAjQUAMOQCAACnAQAQ5QIAAI0FADDmAgEArAQAIfYCQACzBAAhhQMBAK0EACHaAwEArAQAIdsDAQCsBAAh3AMBAK0EACHdAwAAjgUAIN4DAACOBQAg3wMBAK0EACHgAwEArQQAIQ8SAAC2BAAgPwAAjwUAIEAAAI8FACD6AoAAAAAB_QKAAAAAAf4CgAAAAAH_AoAAAAABgAOAAAAAAYEDgAAAAAHhAwEAAAAB4gMBAAAAAeMDAQAAAAHkA4AAAAAB5QOAAAAAAeYDgAAAAAEM-gKAAAAAAf0CgAAAAAH-AoAAAAAB_wKAAAAAAYADgAAAAAGBA4AAAAAB4QMBAAAAAeIDAQAAAAHjAwEAAAAB5AOAAAAAAeUDgAAAAAHmA4AAAAABEuMCAACQBQAw5AIAAI8BABDlAgAAkAUAMOYCAQCsBAAh9gJAALMEACH3AkAAswQAIYUDAQCsBAAh1wMBAKwEACHZAwAAkgXtAyLnAwEArQQAIegDAQCtBAAh6QMIAJEFACHqAwgAkQUAIesDCACRBQAh7QNAALMEACHuA0AAtAQAIe8DAQCtBAAh8AMBAK0EACENEgAAtgQAID0AAJYFACA-AACWBQAgPwAAlgUAIEAAAJYFACD6AggAAAAB-wIIAAAABfwCCAAAAAX9AggAAAAB_gIIAAAAAf8CCAAAAAGAAwgAAAABgQMIAJUFACEHEgAAuQQAID8AAJQFACBAAACUBQAg-gIAAADtAwL7AgAAAO0DCPwCAAAA7QMIgQMAAJMF7QMiBxIAALkEACA_AACUBQAgQAAAlAUAIPoCAAAA7QMC-wIAAADtAwj8AgAAAO0DCIEDAACTBe0DIgT6AgAAAO0DAvsCAAAA7QMI_AIAAADtAwiBAwAAlAXtAyINEgAAtgQAID0AAJYFACA-AACWBQAgPwAAlgUAIEAAAJYFACD6AggAAAAB-wIIAAAABfwCCAAAAAX9AggAAAAB_gIIAAAAAf8CCAAAAAGAAwgAAAABgQMIAJUFACEI-gIIAAAAAfsCCAAAAAX8AggAAAAF_QIIAAAAAf4CCAAAAAH_AggAAAABgAMIAAAAAYEDCACWBQAhDgEAAJkFACDjAgAAlwUAMOQCAABuABDlAgAAlwUAMOYCAQDTBAAh9gJAANYEACGFAwEAgAUAIdoDAQDTBAAh2wMBANMEACHcAwEAgAUAId0DAACYBQAg3gMAAJgFACDfAwEAgAUAIeADAQCABQAhDPoCgAAAAAH9AoAAAAAB_gKAAAAAAf8CgAAAAAGAA4AAAAABgQOAAAAAAeEDAQAAAAHiAwEAAAAB4wMBAAAAAeQDgAAAAAHlA4AAAAAB5gOAAAAAASMFAACiBQAgEQAAowUAIBMAANgEACAZAADcBAAgIgAAoAUAICMAAKEFACAkAACkBQAgJQAA2gQAICYAANsEACAnAAClBQAgKAAA3QQAICkAANkEACAqAACmBQAg4wIAAJoFADDkAgAAWQAQ5QIAAJoFADDmAgEA0wQAIecCAQDTBAAh6AIBANMEACHpAgEAgAUAIeoCIADXBAAh7AIAAJsF7AIi7gIAAJwF7gIi8AIAAJ0F8AIi8QIBANMEACHyAgEA0wQAIfMCAQCABQAh9AIBAIAFACH1AiAAngUAIfYCQADWBAAh9wJAANYEACH4AkAAnwUAIfkCIADXBAAh-AMAAFkAIPkDAABZACAhBQAAogUAIBEAAKMFACATAADYBAAgGQAA3AQAICIAAKAFACAjAAChBQAgJAAApAUAICUAANoEACAmAADbBAAgJwAApQUAICgAAN0EACApAADZBAAgKgAApgUAIOMCAACaBQAw5AIAAFkAEOUCAACaBQAw5gIBANMEACHnAgEA0wQAIegCAQDTBAAh6QIBAIAFACHqAiAA1wQAIewCAACbBewCIu4CAACcBe4CIvACAACdBfACIvECAQDTBAAh8gIBANMEACHzAgEAgAUAIfQCAQCABQAh9QIgAJ4FACH2AkAA1gQAIfcCQADWBAAh-AJAAJ8FACH5AiAA1wQAIQT6AgAAAOwCAvsCAAAA7AII_AIAAADsAgiBAwAAwgTsAiIE-gIAAADuAgL7AgAAAO4CCPwCAAAA7gIIgQMAAMAE7gIiBPoCAAAA8AIC-wIAAADwAgj8AgAAAPACCIEDAAC-BPACIgL6AiAAAAABgQMgALwEACEI-gJAAAAAAfsCQAAAAAX8AkAAAAAF_QJAAAAAAf4CQAAAAAH_AkAAAAABgANAAAAAAYEDQAC3BAAhEQEAAKoFACAFAADOBQAg4wIAANUFADDkAgAAAwAQ5QIAANUFADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYcDAQDTBAAhiAMBANMEACGJAwEA0wQAIYoDAQDTBAAhkAMBAIAFACGRAwEA0wQAIfgDAAADACD5AwAAAwAgFwEAAKoFACAFAADOBQAg4wIAANQFADDkAgAACAAQ5QIAANQFADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhhgMBANMEACGHAwEAgAUAIYgDAQCABQAhiQNAAJ8FACGKAwEAgAUAIYsDAQCABQAhjAMBAIAFACGNAwEAgAUAIY4DAQCABQAhjwMBAIAFACGQAwEAgAUAIfgDAAAIACD5AwAACAAgEAEAAIUFACAEAACBBQAgBgAAggUAIAcAAIMFACAIAACEBQAg4wIAAP8EADDkAgAAYwAQ5QIAAP8EADDmAgEA0wQAIecCAQDTBAAh9gJAANYEACH3AkAA1gQAIaUDAQCABQAhzgMBANMEACH4AwAAYwAg-QMAAGMAIAOXAwAAIQAgmAMAACEAIJkDAAAhACAXAQAAqgUAIAcAAL4FACARAAC_BQAg4wIAALsFADDkAgAAJgAQ5QIAALsFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGFAwEA0wQAIdcDAQDTBAAh2QMAAL0F7QMi5wMBAIAFACHoAwEAgAUAIekDCAC8BQAh6gMIALwFACHrAwgAvAUAIe0DQADWBAAh7gNAAJ8FACHvAwEAgAUAIfADAQCABQAh-AMAACYAIPkDAAAmACADlwMAADUAIJgDAAA1ACCZAwAANQAgA5cDAABuACCYAwAAbgAgmQMAAG4AIAORAwEAAAABqwMBAAAAAbgDAQAAAAEQCAAAqwUAIAwAAKoFACANAACsBQAg4wIAAKgFADDkAgAAPgAQ5QIAAKgFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGRAwEA0wQAIasDAQDTBAAhuAMBANMEACHPAwgAqQUAIdADCACpBQAh0QMIAKkFACHSAwgAqQUAIQj6AggAAAAB-wIIAAAABPwCCAAAAAT9AggAAAAB_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-wIIAAAABfwCCAAAAAX9AggAAAAB_gIIAAAAAf8CCAAAAAGAAwgAAAABgQMIAJYFACEE-gIAAADtAwL7AgAAAO0DCPwCAAAA7QMIgQMAAJQF7QMiGAUAAM4FACANAgDVBAAhIAAAhAUAICEAANMFACDjAgAA0AUAMOQCAAAMABDlAgAA0AUAMOYCAQDTBAAh5wIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGgAwAA0QWgAyKhAwIA1QQAIaIDCACpBQAhpAMAANIFpAMipQMBANMEACGmAwgAqQUAIacDCACpBQAhqAMgANcEACGpAwgAqQUAIaoDCACpBQAh-AMAAAwAIPkDAAAMACAUAQAAqgUAIA8AALoFACAQAACkBQAg4wIAAMAFADDkAgAAIQAQ5QIAAMAFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGFAwEA0wQAIa0DAQCABQAhrgMIAKkFACGwAwAAwQWwAyKyAwAAwgWyAyK0AwAAwwW0AyK1AwEAgAUAIbYDAQCABQAhtwNAAJ8FACH4AwAAIQAg-QMAACEAIBIBAACqBQAgDwAAugUAIBAAAKQFACDjAgAAwAUAMOQCAAAhABDlAgAAwAUAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhrQMBAIAFACGuAwgAqQUAIbADAADBBbADIrIDAADCBbIDIrQDAADDBbQDIrUDAQCABQAhtgMBAIAFACG3A0AAnwUAIQT6AgAAALADAvsCAAAAsAMI_AIAAACwAwiBAwAA8wSwAyIE-gIAAACyAwL7AgAAALIDCPwCAAAAsgMIgQMAAPEEsgMiBPoCAAAAtAMC-wIAAAC0Awj8AgAAALQDCIEDAADvBLQDIgKRAwEAAAABuAMBAAAAARsMAACqBQAgDQAArAUAIA4AAMcFACARAACjBQAg4wIAAMUFADDkAgAAHQAQ5QIAAMUFADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGRAwEA0wQAIbgDAQDTBAAhuwMBANMEACG8AwAAwQWwAyK9AxAAxgUAIb4DEADGBQAhvwMQAMYFACHAAxAAxgUAIcEDEADGBQAhwgMQAMYFACHDAwAAwwW0AyLEAxAAxgUAIcUDEADGBQAhxgMAAMMFtAMixwMQAMYFACHIAxAAxgUAIckDAADDBbQDIgj6AhAAAAAB-wIQAAAABPwCEAAAAAT9AhAAAAAB_gIQAAAAAf8CEAAAAAGAAxAAAAABgQMQAPgEACEODAAAqgUAIA0AAKwFACATAAC6BQAgGwAAuQUAIOMCAAC4BQAw5AIAACkAEOUCAAC4BQAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACG4AwEA0wQAIfgDAAApACD5AwAAKQAgAqsDAQAAAAHTAwEAAAABCAgAAKsFACAcAADHBQAg4wIAAMkFADDkAgAAGQAQ5QIAAMkFADDmAgEA0wQAIasDAQDTBAAh0wMBANMEACECqwMBAAAAAawDAQAAAAEKCAAAqwUAIAkAAKsFACDjAgAAywUAMOQCAAAUABDlAgAAywUAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIasDAQDTBAAhrAMBANMEACEWBQAAzgUAIAcAAL4FACAKAADPBQAgCwAAzwUAIBcAANsEACAdAAC5BQAgHgAA2gQAIB8AAN0EACDjAgAAzAUAMOQCAAAQABDlAgAAzAUAMOYCAQDTBAAh9AIBANMEACH2AkAA1gQAIfcCQADWBAAhpQMBANMEACHOAwEA0wQAIdQDAQDTBAAh1QMIAKkFACHWAwIA1QQAIdcDAQDTBAAh2QMAAM0F2QMiBPoCAAAA2QMC-wIAAADZAwj8AgAAANkDCIEDAACMBdkDIhABAACFBQAgBAAAgQUAIAYAAIIFACAHAACDBQAgCAAAhAUAIOMCAAD_BAAw5AIAAGMAEOUCAAD_BAAw5gIBANMEACHnAgEA0wQAIfYCQADWBAAh9wJAANYEACGlAwEAgAUAIc4DAQDTBAAh-AMAAGMAIPkDAABjACADlwMAABQAIJgDAAAUACCZAwAAFAAgFgUAAM4FACANAgDVBAAhIAAAhAUAICEAANMFACDjAgAA0AUAMOQCAAAMABDlAgAA0AUAMOYCAQDTBAAh5wIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGgAwAA0QWgAyKhAwIA1QQAIaIDCACpBQAhpAMAANIFpAMipQMBANMEACGmAwgAqQUAIacDCACpBQAhqAMgANcEACGpAwgAqQUAIaoDCACpBQAhBPoCAAAAoAMC-wIAAACgAwj8AgAAAKADCIEDAADoBKADIgT6AgAAAKQDAvsCAAAApAMI_AIAAACkAwiBAwAA5gSkAyIDlwMAACYAIJgDAAAmACCZAwAAJgAgFQEAAKoFACAFAADOBQAg4wIAANQFADDkAgAACAAQ5QIAANQFADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhhgMBANMEACGHAwEAgAUAIYgDAQCABQAhiQNAAJ8FACGKAwEAgAUAIYsDAQCABQAhjAMBAIAFACGNAwEAgAUAIY4DAQCABQAhjwMBAIAFACGQAwEAgAUAIQ8BAACqBQAgBQAAzgUAIOMCAADVBQAw5AIAAAMAEOUCAADVBQAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGHAwEA0wQAIYgDAQDTBAAhiQMBANMEACGKAwEA0wQAIZADAQCABQAhkQMBANMEACEAAAAAAf0DAQAAAAEB_QMBAAAAAQH9AyAAAAABAf0DAAAA7AICAf0DAAAA7gICAf0DAAAA8AICAf0DIAAAAAEB_QNAAAAAAQH9A0AAAAABBzcAAMYHACA4AADJBwAg-gMAAMcHACD7AwAAyAcAIP4DAAADACD_AwAAAwAggAQAAAYAIAc3AAC_BwAgOAAAwgcAIPoDAADABwAg-wMAAMEHACD-AwAACAAg_wMAAAgAIIAEAAAKACAHNwAAqAsAIDgAAJsMACD6AwAAqQsAIPsDAACaDAAg_gMAAGMAIP8DAABjACCABAAAggIAIAs3AAC2BwAwOAAAugcAMPoDAAC3BwAw-wMAALgHADD8AwAAuQcAIP0DAACZBgAw_gMAAJkGADD_AwAAmQYAMIAEAACZBgAwgQQAALsHADCCBAAAnAYAMAc3AACkBwAgOAAApwcAIPoDAAClBwAg-wMAAKYHACD-AwAAJgAg_wMAACYAIIAEAAABACALNwAAlAcAMDgAAJkHADD6AwAAlQcAMPsDAACWBwAw_AMAAJcHACD9AwAAmAcAMP4DAACYBwAw_wMAAJgHADCABAAAmAcAMIEEAACaBwAwggQAAJsHADALNwAAhgcAMDgAAIsHADD6AwAAhwcAMPsDAACIBwAw_AMAAIkHACD9AwAAigcAMP4DAACKBwAw_wMAAIoHADCABAAAigcAMIEEAACMBwAwggQAAI0HADALNwAA6AYAMDgAAO0GADD6AwAA6QYAMPsDAADqBgAw_AMAAOsGACD9AwAA7AYAMP4DAADsBgAw_wMAAOwGADCABAAA7AYAMIEEAADuBgAwggQAAO8GADALNwAA2gYAMDgAAN8GADD6AwAA2wYAMPsDAADcBgAw_AMAAN0GACD9AwAA3gYAMP4DAADeBgAw_wMAAN4GADCABAAA3gYAMIEEAADgBgAwggQAAOEGADALNwAAzAYAMDgAANEGADD6AwAAzQYAMPsDAADOBgAw_AMAAM8GACD9AwAA0AYAMP4DAADQBgAw_wMAANAGADCABAAA0AYAMIEEAADSBgAwggQAANMGADALNwAAvAYAMDgAAMEGADD6AwAAvQYAMPsDAAC-BgAw_AMAAL8GACD9AwAAwAYAMP4DAADABgAw_wMAAMAGADCABAAAwAYAMIEEAADCBgAwggQAAMMGADALNwAA_AUAMDgAAIEGADD6AwAA_QUAMPsDAAD-BQAw_AMAAP8FACD9AwAAgAYAMP4DAACABgAw_wMAAIAGADCABAAAgAYAMIEEAACCBgAwggQAAIMGADALNwAA8AUAMDgAAPUFADD6AwAA8QUAMPsDAADyBQAw_AMAAPMFACD9AwAA9AUAMP4DAAD0BQAw_wMAAPQFADCABAAA9AUAMIEEAAD2BQAwggQAAPcFADAJ5gIBAAAAAfYCQAAAAAHaAwEAAAAB2wMBAAAAAdwDAQAAAAHdA4AAAAAB3gOAAAAAAd8DAQAAAAHgAwEAAAABAgAAAHAAIDcAAPsFACADAAAAcAAgNwAA-wUAIDgAAPoFACABMAAAmQwAMA4BAACZBQAg4wIAAJcFADDkAgAAbgAQ5QIAAJcFADDmAgEAAAAB9gJAANYEACGFAwEAgAUAIdoDAQDTBAAh2wMBANMEACHcAwEAgAUAId0DAACYBQAg3gMAAJgFACDfAwEAgAUAIeADAQCABQAhAgAAAHAAIDAAAPoFACACAAAA-AUAIDAAAPkFACAN4wIAAPcFADDkAgAA-AUAEOUCAAD3BQAw5gIBANMEACH2AkAA1gQAIYUDAQCABQAh2gMBANMEACHbAwEA0wQAIdwDAQCABQAh3QMAAJgFACDeAwAAmAUAIN8DAQCABQAh4AMBAIAFACEN4wIAAPcFADDkAgAA-AUAEOUCAAD3BQAw5gIBANMEACH2AkAA1gQAIYUDAQCABQAh2gMBANMEACHbAwEA0wQAIdwDAQCABQAh3QMAAJgFACDeAwAAmAUAIN8DAQCABQAh4AMBAIAFACEJ5gIBANoFACH2AkAA4QUAIdoDAQDaBQAh2wMBANoFACHcAwEA2wUAId0DgAAAAAHeA4AAAAAB3wMBANsFACHgAwEA2wUAIQnmAgEA2gUAIfYCQADhBQAh2gMBANoFACHbAwEA2gUAIdwDAQDbBQAh3QOAAAAAAd4DgAAAAAHfAwEA2wUAIeADAQDbBQAhCeYCAQAAAAH2AkAAAAAB2gMBAAAAAdsDAQAAAAHcAwEAAAAB3QOAAAAAAd4DgAAAAAHfAwEAAAAB4AMBAAAAAQcNAAC5BgAgEwAAuwYAIBsAALoGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAG4AwEAAAABAgAAACsAIDcAALgGACADAAAAKwAgNwAAuAYAIDgAAIYGACABMAAAmAwAMA0MAACqBQAgDQAArAUAIBMAALoFACAbAAC5BQAg4wIAALgFADDkAgAAKQAQ5QIAALgFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhuAMBANMEACHyAwAAtwUAIAIAAAArACAwAACGBgAgAgAAAIQGACAwAACFBgAgCOMCAACDBgAw5AIAAIQGABDlAgAAgwYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhuAMBANMEACEI4wIAAIMGADDkAgAAhAYAEOUCAACDBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACG4AwEA0wQAIQTmAgEA2gUAIfYCQADhBQAh9wJAAOEFACG4AwEA2gUAIQcNAACHBgAgEwAAiQYAIBsAAIgGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACG4AwEA2gUAIQU3AAD4CwAgOAAAlgwAIPoDAAD5CwAg-wMAAJUMACCABAAAzgMAIAs3AACqBgAwOAAArwYAMPoDAACrBgAw-wMAAKwGADD8AwAArQYAIP0DAACuBgAw_gMAAK4GADD_AwAArgYAMIAEAACuBgAwgQQAALAGADCCBAAAsQYAMAc3AACKBgAgOAAAjQYAIPoDAACLBgAg-wMAAIwGACD-AwAAHQAg_wMAAB0AIIAEAAAfACAWDAAApwYAIA0AAKgGACARAACpBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABkQMBAAAAAbgDAQAAAAG8AwAAALADAr0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAxAAAAABwgMQAAAAAcMDAAAAtAMCxAMQAAAAAcUDEAAAAAHGAwAAALQDAscDEAAAAAHIAxAAAAAByQMAAAC0AwICAAAAHwAgNwAAigYAIAMAAAAdACA3AACKBgAgOAAAjgYAIBgAAAAdACAMAACSBgAgDQAAkwYAIBEAAJQGACAwAACOBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACG4AwEA2gUAIbwDAACPBrADIr0DEACQBgAhvgMQAJAGACG_AxAAkAYAIcADEACQBgAhwQMQAJAGACHCAxAAkAYAIcMDAACRBrQDIsQDEACQBgAhxQMQAJAGACHGAwAAkQa0AyLHAxAAkAYAIcgDEACQBgAhyQMAAJEGtAMiFgwAAJIGACANAACTBgAgEQAAlAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhuAMBANoFACG8AwAAjwawAyK9AxAAkAYAIb4DEACQBgAhvwMQAJAGACHAAxAAkAYAIcEDEACQBgAhwgMQAJAGACHDAwAAkQa0AyLEAxAAkAYAIcUDEACQBgAhxgMAAJEGtAMixwMQAJAGACHIAxAAkAYAIckDAACRBrQDIgH9AwAAALADAgX9AxAAAAABgwQQAAAAAYQEEAAAAAGFBBAAAAABhgQQAAAAAQH9AwAAALQDAgU3AACCDAAgOAAAkwwAIPoDAACDDAAg-wMAAJIMACCABAAAWwAgBTcAAIAMACA4AACQDAAg-gMAAIEMACD7AwAAjwwAIIAEAADOAwAgCzcAAJUGADA4AACaBgAw-gMAAJYGADD7AwAAlwYAMPwDAACYBgAg_QMAAJkGADD-AwAAmQYAMP8DAACZBgAwgAQAAJkGADCBBAAAmwYAMIIEAACcBgAwDQEAAKUGACAQAACmBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABhQMBAAAAAa4DCAAAAAGwAwAAALADArIDAAAAsgMCtAMAAAC0AwK1AwEAAAABtgMBAAAAAbcDQAAAAAECAAAAIwAgNwAApAYAIAMAAAAjACA3AACkBgAgOAAAoQYAIAEwAACODAAwEgEAAKoFACAPAAC6BQAgEAAApAUAIOMCAADABQAw5AIAACEAEOUCAADABQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGFAwEA0wQAIa0DAQCABQAhrgMIAKkFACGwAwAAwQWwAyKyAwAAwgWyAyK0AwAAwwW0AyK1AwEAAAABtgMBAAAAAbcDQACfBQAhAgAAACMAIDAAAKEGACACAAAAnQYAIDAAAJ4GACAP4wIAAJwGADDkAgAAnQYAEOUCAACcBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhhQMBANMEACGtAwEAgAUAIa4DCACpBQAhsAMAAMEFsAMisgMAAMIFsgMitAMAAMMFtAMitQMBAIAFACG2AwEAgAUAIbcDQACfBQAhD-MCAACcBgAw5AIAAJ0GABDlAgAAnAYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhrQMBAIAFACGuAwgAqQUAIbADAADBBbADIrIDAADCBbIDIrQDAADDBbQDIrUDAQCABQAhtgMBAIAFACG3A0AAnwUAIQvmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIa4DCACfBgAhsAMAAI8GsAMisgMAAKAGsgMitAMAAJEGtAMitQMBANsFACG2AwEA2wUAIbcDQADiBQAhBf0DCAAAAAGDBAgAAAABhAQIAAAAAYUECAAAAAGGBAgAAAABAf0DAAAAsgMCDQEAAKIGACAQAACjBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhhQMBANoFACGuAwgAnwYAIbADAACPBrADIrIDAACgBrIDIrQDAACRBrQDIrUDAQDbBQAhtgMBANsFACG3A0AA4gUAIQU3AACGDAAgOAAAjAwAIPoDAACHDAAg-wMAAIsMACCABAAAWwAgBzcAAIQMACA4AACJDAAg-gMAAIUMACD7AwAAiAwAIP4DAAAmACD_AwAAJgAggAQAAAEAIA0BAAClBgAgEAAApgYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAYUDAQAAAAGuAwgAAAABsAMAAACwAwKyAwAAALIDArQDAAAAtAMCtQMBAAAAAbYDAQAAAAG3A0AAAAABAzcAAIYMACD6AwAAhwwAIIAEAABbACADNwAAhAwAIPoDAACFDAAggAQAAAEAIAM3AACCDAAg-gMAAIMMACCABAAAWwAgAzcAAIAMACD6AwAAgQwAIIAEAADOAwAgBDcAAJUGADD6AwAAlgYAMPwDAACYBgAggAQAAJkGADADCAAAtwYAIOYCAQAAAAGrAwEAAAABAgAAABsAIDcAALYGACADAAAAGwAgNwAAtgYAIDgAALQGACABMAAA_wsAMAkIAACrBQAgHAAAxwUAIOMCAADJBQAw5AIAABkAEOUCAADJBQAw5gIBAAAAAasDAQDTBAAh0wMBANMEACH2AwAAyAUAIAIAAAAbACAwAAC0BgAgAgAAALIGACAwAACzBgAgBuMCAACxBgAw5AIAALIGABDlAgAAsQYAMOYCAQDTBAAhqwMBANMEACHTAwEA0wQAIQbjAgAAsQYAMOQCAACyBgAQ5QIAALEGADDmAgEA0wQAIasDAQDTBAAh0wMBANMEACEC5gIBANoFACGrAwEA2gUAIQMIAAC1BgAg5gIBANoFACGrAwEA2gUAIQU3AAD6CwAgOAAA_QsAIPoDAAD7CwAg-wMAAPwLACCABAAAEgAgAwgAALcGACDmAgEAAAABqwMBAAAAAQM3AAD6CwAg-gMAAPsLACCABAAAEgAgBw0AALkGACATAAC7BgAgGwAAugYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAbgDAQAAAAEDNwAA-AsAIPoDAAD5CwAggAQAAM4DACAENwAAqgYAMPoDAACrBgAw_AMAAK0GACCABAAArgYAMAM3AACKBgAg-gMAAIsGACCABAAAHwAgCwgAAMoGACANAADLBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqwMBAAAAAbgDAQAAAAHPAwgAAAAB0AMIAAAAAdEDCAAAAAHSAwgAAAABAgAAAEAAIDcAAMkGACADAAAAQAAgNwAAyQYAIDgAAMYGACABMAAA9wsAMBEIAACrBQAgDAAAqgUAIA0AAKwFACDjAgAAqAUAMOQCAAA-ABDlAgAAqAUAMOYCAQAAAAH2AkAA1gQAIfcCQADWBAAhkQMBANMEACGrAwEA0wQAIbgDAQDTBAAhzwMIAKkFACHQAwgAqQUAIdEDCACpBQAh0gMIAKkFACHxAwAApwUAIAIAAABAACAwAADGBgAgAgAAAMQGACAwAADFBgAgDeMCAADDBgAw5AIAAMQGABDlAgAAwwYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhqwMBANMEACG4AwEA0wQAIc8DCACpBQAh0AMIAKkFACHRAwgAqQUAIdIDCACpBQAhDeMCAADDBgAw5AIAAMQGABDlAgAAwwYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhqwMBANMEACG4AwEA0wQAIc8DCACpBQAh0AMIAKkFACHRAwgAqQUAIdIDCACpBQAhCeYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIasDAQDaBQAhuAMBANoFACHPAwgAnwYAIdADCACfBgAh0QMIAJ8GACHSAwgAnwYAIQsIAADHBgAgDQAAyAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIasDAQDaBQAhuAMBANoFACHPAwgAnwYAIdADCACfBgAh0QMIAJ8GACHSAwgAnwYAIQU3AADvCwAgOAAA9QsAIPoDAADwCwAg-wMAAPQLACCABAAAEgAgBTcAAO0LACA4AADyCwAg-gMAAO4LACD7AwAA8QsAIIAEAADOAwAgCwgAAMoGACANAADLBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqwMBAAAAAbgDAQAAAAHPAwgAAAAB0AMIAAAAAdEDCAAAAAHSAwgAAAABAzcAAO8LACD6AwAA8AsAIIAEAAASACADNwAA7QsAIPoDAADuCwAggAQAAM4DACAIDQAA2QYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAaIDCAAAAAG4AwEAAAABuQMIAAAAAboDCAAAAAECAAAAPAAgNwAA2AYAIAMAAAA8ACA3AADYBgAgOAAA1gYAIAEwAADsCwAwDgwAAKoFACANAACsBQAg4wIAAK4FADDkAgAAOgAQ5QIAAK4FADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhogMIAKkFACG4AwEA0wQAIbkDCACpBQAhugMIAKkFACHyAwAArQUAIAIAAAA8ACAwAADWBgAgAgAAANQGACAwAADVBgAgC-MCAADTBgAw5AIAANQGABDlAgAA0wYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhogMIAKkFACG4AwEA0wQAIbkDCACpBQAhugMIAKkFACEL4wIAANMGADDkAgAA1AYAEOUCAADTBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACGiAwgAqQUAIbgDAQDTBAAhuQMIAKkFACG6AwgAqQUAIQfmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGiAwgAnwYAIbgDAQDaBQAhuQMIAJ8GACG6AwgAnwYAIQgNAADXBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhogMIAJ8GACG4AwEA2gUAIbkDCACfBgAhugMIAJ8GACEFNwAA5wsAIDgAAOoLACD6AwAA6AsAIPsDAADpCwAggAQAAM4DACAIDQAA2QYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAaIDCAAAAAG4AwEAAAABuQMIAAAAAboDCAAAAAEDNwAA5wsAIPoDAADoCwAggAQAAM4DACAIFwAA5wYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZsDAQAAAAGcAwgAAAABnQMBAAAAAZ4DCAAAAAECAAAANwAgNwAA5gYAIAMAAAA3ACA3AADmBgAgOAAA5AYAIAEwAADmCwAwDgwAAKoFACAXAACxBQAg4wIAALAFADDkAgAANQAQ5QIAALAFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhmwMBANMEACGcAwgAqQUAIZ0DAQDTBAAhngMIAKkFACHzAwAArwUAIAIAAAA3ACAwAADkBgAgAgAAAOIGACAwAADjBgAgC-MCAADhBgAw5AIAAOIGABDlAgAA4QYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZEDAQDTBAAhmwMBANMEACGcAwgAqQUAIZ0DAQDTBAAhngMIAKkFACEL4wIAAOEGADDkAgAA4gYAEOUCAADhBgAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACGbAwEA0wQAIZwDCACpBQAhnQMBANMEACGeAwgAqQUAIQfmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGbAwEA2gUAIZwDCACfBgAhnQMBANoFACGeAwgAnwYAIQgXAADlBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhmwMBANoFACGcAwgAnwYAIZ0DAQDaBQAhngMIAJ8GACEFNwAA4QsAIDgAAOQLACD6AwAA4gsAIPsDAADjCwAggAQAADMAIAgXAADnBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABmwMBAAAAAZwDCAAAAAGdAwEAAAABngMIAAAAAQM3AADhCwAg-gMAAOILACCABAAAMwAgCwgAAIMHACANAACEBwAgGAAAhQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZwDCAAAAAGrAwEAAAABuAMBAAAAAcwDAAAAzAMCzQNAAAAAAQIAAAAzACA3AACCBwAgAwAAADMAIDcAAIIHACA4AADzBgAgATAAAOALADARCAAAqwUAIA0AAKwFACAVAACqBQAgGAAApQUAIOMCAACzBQAw5AIAADEAEOUCAACzBQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGcAwgAqQUAIasDAQDTBAAhuAMBANMEACHKAwEA0wQAIcwDAAC0BcwDIs0DQADWBAAh9AMAALIFACACAAAAMwAgMAAA8wYAIAIAAADwBgAgMAAA8QYAIAzjAgAA7wYAMOQCAADwBgAQ5QIAAO8GADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGcAwgAqQUAIasDAQDTBAAhuAMBANMEACHKAwEA0wQAIcwDAAC0BcwDIs0DQADWBAAhDOMCAADvBgAw5AIAAPAGABDlAgAA7wYAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIZwDCACpBQAhqwMBANMEACG4AwEA0wQAIcoDAQDTBAAhzAMAALQFzAMizQNAANYEACEI5gIBANoFACH2AkAA4QUAIfcCQADhBQAhnAMIAJ8GACGrAwEA2gUAIbgDAQDaBQAhzAMAAPIGzAMizQNAAOEFACEB_QMAAADMAwILCAAA9AYAIA0AAPUGACAYAAD2BgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhnAMIAJ8GACGrAwEA2gUAIbgDAQDaBQAhzAMAAPIGzAMizQNAAOEFACEFNwAA0gsAIDgAAN4LACD6AwAA0wsAIPsDAADdCwAggAQAABIAIAU3AADQCwAgOAAA2wsAIPoDAADRCwAg-wMAANoLACCABAAAzgMAIAs3AAD3BgAwOAAA-wYAMPoDAAD4BgAw-wMAAPkGADD8AwAA-gYAIP0DAADeBgAw_gMAAN4GADD_AwAA3gYAMIAEAADeBgAwgQQAAPwGADCCBAAA4QYAMAgMAACBBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABkQMBAAAAAZwDCAAAAAGdAwEAAAABngMIAAAAAQIAAAA3ACA3AACABwAgAwAAADcAIDcAAIAHACA4AAD-BgAgATAAANkLADACAAAANwAgMAAA_gYAIAIAAADiBgAgMAAA_QYAIAfmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGRAwEA2gUAIZwDCACfBgAhnQMBANoFACGeAwgAnwYAIQgMAAD_BgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACGcAwgAnwYAIZ0DAQDaBQAhngMIAJ8GACEFNwAA1AsAIDgAANcLACD6AwAA1QsAIPsDAADWCwAggAQAAFsAIAgMAACBBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABkQMBAAAAAZwDCAAAAAGdAwEAAAABngMIAAAAAQM3AADUCwAg-gMAANULACCABAAAWwAgCwgAAIMHACANAACEBwAgGAAAhQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZwDCAAAAAGrAwEAAAABuAMBAAAAAcwDAAAAzAMCzQNAAAAAAQM3AADSCwAg-gMAANMLACCABAAAEgAgAzcAANALACD6AwAA0QsAIIAEAADOAwAgBDcAAPcGADD6AwAA-AYAMPwDAAD6BgAggAQAAN4GADAWDQAAqAYAIA4AAJMHACARAACpBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABuAMBAAAAAbsDAQAAAAG8AwAAALADAr0DEAAAAAG-AxAAAAABvwMQAAAAAcADEAAAAAHBAxAAAAABwgMQAAAAAcMDAAAAtAMCxAMQAAAAAcUDEAAAAAHGAwAAALQDAscDEAAAAAHIAxAAAAAByQMAAAC0AwICAAAAHwAgNwAAkgcAIAMAAAAfACA3AACSBwAgOAAAkAcAIAEwAADPCwAwHAwAAKoFACANAACsBQAgDgAAxwUAIBEAAKMFACDjAgAAxQUAMOQCAAAdABDlAgAAxQUAMOYCAQAAAAH2AkAA1gQAIfcCQADWBAAhkQMBANMEACG4AwEA0wQAIbsDAQAAAAG8AwAAwQWwAyK9AxAAxgUAIb4DEADGBQAhvwMQAMYFACHAAxAAxgUAIcEDEADGBQAhwgMQAMYFACHDAwAAwwW0AyLEAxAAxgUAIcUDEADGBQAhxgMAAMMFtAMixwMQAMYFACHIAxAAxgUAIckDAADDBbQDIvIDAADEBQAgAgAAAB8AIDAAAJAHACACAAAAjgcAIDAAAI8HACAX4wIAAI0HADDkAgAAjgcAEOUCAACNBwAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACG4AwEA0wQAIbsDAQDTBAAhvAMAAMEFsAMivQMQAMYFACG-AxAAxgUAIb8DEADGBQAhwAMQAMYFACHBAxAAxgUAIcIDEADGBQAhwwMAAMMFtAMixAMQAMYFACHFAxAAxgUAIcYDAADDBbQDIscDEADGBQAhyAMQAMYFACHJAwAAwwW0AyIX4wIAAI0HADDkAgAAjgcAEOUCAACNBwAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhkQMBANMEACG4AwEA0wQAIbsDAQDTBAAhvAMAAMEFsAMivQMQAMYFACG-AxAAxgUAIb8DEADGBQAhwAMQAMYFACHBAxAAxgUAIcIDEADGBQAhwwMAAMMFtAMixAMQAMYFACHFAxAAxgUAIcYDAADDBbQDIscDEADGBQAhyAMQAMYFACHJAwAAwwW0AyIT5gIBANoFACH2AkAA4QUAIfcCQADhBQAhuAMBANoFACG7AwEA2gUAIbwDAACPBrADIr0DEACQBgAhvgMQAJAGACG_AxAAkAYAIcADEACQBgAhwQMQAJAGACHCAxAAkAYAIcMDAACRBrQDIsQDEACQBgAhxQMQAJAGACHGAwAAkQa0AyLHAxAAkAYAIcgDEACQBgAhyQMAAJEGtAMiFg0AAJMGACAOAACRBwAgEQAAlAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIbgDAQDaBQAhuwMBANoFACG8AwAAjwawAyK9AxAAkAYAIb4DEACQBgAhvwMQAJAGACHAAxAAkAYAIcEDEACQBgAhwgMQAJAGACHDAwAAkQa0AyLEAxAAkAYAIcUDEACQBgAhxgMAAJEGtAMixwMQAJAGACHIAxAAkAYAIckDAACRBrQDIgU3AADKCwAgOAAAzQsAIPoDAADLCwAg-wMAAMwLACCABAAAKwAgFg0AAKgGACAOAACTBwAgEQAAqQYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAbgDAQAAAAG7AwEAAAABvAMAAACwAwK9AxAAAAABvgMQAAAAAb8DEAAAAAHAAxAAAAABwQMQAAAAAcIDEAAAAAHDAwAAALQDAsQDEAAAAAHFAxAAAAABxgMAAAC0AwLHAxAAAAAByAMQAAAAAckDAAAAtAMCAzcAAMoLACD6AwAAywsAIIAEAAArACAHCAAAogcAIA0AAKMHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGrAwEAAAABuAMBAAAAAQIAAAAvACA3AAChBwAgAwAAAC8AIDcAAKEHACA4AACeBwAgATAAAMkLADANCAAAqwUAIA0AAKwFACAVAACqBQAg4wIAALYFADDkAgAALQAQ5QIAALYFADDmAgEAAAAB9gJAANYEACH3AkAA1gQAIasDAQDTBAAhuAMBANMEACHKAwEA0wQAIfUDAAC1BQAgAgAAAC8AIDAAAJ4HACACAAAAnAcAIDAAAJ0HACAJ4wIAAJsHADDkAgAAnAcAEOUCAACbBwAw5gIBANMEACH2AkAA1gQAIfcCQADWBAAhqwMBANMEACG4AwEA0wQAIcoDAQDTBAAhCeMCAACbBwAw5AIAAJwHABDlAgAAmwcAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIasDAQDTBAAhuAMBANMEACHKAwEA0wQAIQXmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGrAwEA2gUAIbgDAQDaBQAhBwgAAJ8HACANAACgBwAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhqwMBANoFACG4AwEA2gUAIQU3AADBCwAgOAAAxwsAIPoDAADCCwAg-wMAAMYLACCABAAAEgAgBTcAAL8LACA4AADECwAg-gMAAMALACD7AwAAwwsAIIAEAADOAwAgBwgAAKIHACANAACjBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABqwMBAAAAAbgDAQAAAAEDNwAAwQsAIPoDAADCCwAggAQAABIAIAM3AAC_CwAg-gMAAMALACCABAAAzgMAIBAHAAC0BwAgEQAAtQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAdcDAQAAAAHZAwAAAO0DAucDAQAAAAHoAwEAAAAB6QMIAAAAAeoDCAAAAAHrAwgAAAAB7QNAAAAAAe4DQAAAAAHvAwEAAAAB8AMBAAAAAQIAAAABACA3AACkBwAgAwAAACYAIDcAAKQHACA4AACoBwAgEgAAACYAIAcAAKsHACARAACsBwAgMAAAqAcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIdcDAQDaBQAh2QMAAKoH7QMi5wMBANsFACHoAwEA2wUAIekDCACpBwAh6gMIAKkHACHrAwgAqQcAIe0DQADhBQAh7gNAAOIFACHvAwEA2wUAIfADAQDbBQAhEAcAAKsHACARAACsBwAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAh1wMBANoFACHZAwAAqgftAyLnAwEA2wUAIegDAQDbBQAh6QMIAKkHACHqAwgAqQcAIesDCACpBwAh7QNAAOEFACHuA0AA4gUAIe8DAQDbBQAh8AMBANsFACEF_QMIAAAAAYMECAAAAAGEBAgAAAABhQQIAAAAAYYECAAAAAEB_QMAAADtAwIFNwAAtQsAIDgAAL0LACD6AwAAtgsAIPsDAAC8CwAggAQAAA4AIAc3AACtBwAgOAAAsAcAIPoDAACuBwAg-wMAAK8HACD-AwAAIQAg_wMAACEAIIAEAAAjACANAQAApQYAIA8AALMHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGFAwEAAAABrQMBAAAAAa4DCAAAAAGwAwAAALADArIDAAAAsgMCtAMAAAC0AwK1AwEAAAABtwNAAAAAAQIAAAAjACA3AACtBwAgAwAAACEAIDcAAK0HACA4AACxBwAgDwAAACEAIAEAAKIGACAPAACyBwAgMAAAsQcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYUDAQDaBQAhrQMBANsFACGuAwgAnwYAIbADAACPBrADIrIDAACgBrIDIrQDAACRBrQDIrUDAQDbBQAhtwNAAOIFACENAQAAogYAIA8AALIHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIa0DAQDbBQAhrgMIAJ8GACGwAwAAjwawAyKyAwAAoAayAyK0AwAAkQa0AyK1AwEA2wUAIbcDQADiBQAhBzcAALcLACA4AAC6CwAg-gMAALgLACD7AwAAuQsAIP4DAAAdACD_AwAAHQAggAQAAB8AIAM3AAC3CwAg-gMAALgLACCABAAAHwAgAzcAALULACD6AwAAtgsAIIAEAAAOACADNwAArQcAIPoDAACuBwAggAQAACMAIA0PAACzBwAgEAAApgYAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAa0DAQAAAAGuAwgAAAABsAMAAACwAwKyAwAAALIDArQDAAAAtAMCtQMBAAAAAbYDAQAAAAG3A0AAAAABAgAAACMAIDcAAL4HACADAAAAIwAgNwAAvgcAIDgAAL0HACABMAAAtAsAMAIAAAAjACAwAAC9BwAgAgAAAJ0GACAwAAC8BwAgC-YCAQDaBQAh9gJAAOEFACH3AkAA4QUAIa0DAQDbBQAhrgMIAJ8GACGwAwAAjwawAyKyAwAAoAayAyK0AwAAkQa0AyK1AwEA2wUAIbYDAQDbBQAhtwNAAOIFACENDwAAsgcAIBAAAKMGACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGtAwEA2wUAIa4DCACfBgAhsAMAAI8GsAMisgMAAKAGsgMitAMAAJEGtAMitQMBANsFACG2AwEA2wUAIbcDQADiBQAhDQ8AALMHACAQAACmBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABrQMBAAAAAa4DCAAAAAGwAwAAALADArIDAAAAsgMCtAMAAAC0AwK1AwEAAAABtgMBAAAAAbcDQAAAAAEQBQAAxQcAIOYCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGGAwEAAAABhwMBAAAAAYgDAQAAAAGJA0AAAAABigMBAAAAAYsDAQAAAAGMAwEAAAABjQMBAAAAAY4DAQAAAAGPAwEAAAABkAMBAAAAAQIAAAAKACA3AAC_BwAgAwAAAAgAIDcAAL8HACA4AADDBwAgEgAAAAgAIAUAAMQHACAwAADDBwAg5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGGAwEA2gUAIYcDAQDbBQAhiAMBANsFACGJA0AA4gUAIYoDAQDbBQAhiwMBANsFACGMAwEA2wUAIY0DAQDbBQAhjgMBANsFACGPAwEA2wUAIZADAQDbBQAhEAUAAMQHACDmAgEA2gUAIfQCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYYDAQDaBQAhhwMBANsFACGIAwEA2wUAIYkDQADiBQAhigMBANsFACGLAwEA2wUAIYwDAQDbBQAhjQMBANsFACGOAwEA2wUAIY8DAQDbBQAhkAMBANsFACEFNwAArwsAIDgAALILACD6AwAAsAsAIPsDAACxCwAggAQAAIICACADNwAArwsAIPoDAACwCwAggAQAAIICACAKBQAAzAcAIOYCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABkAMBAAAAAQIAAAAGACA3AADGBwAgAwAAAAMAIDcAAMYHACA4AADKBwAgDAAAAAMAIAUAAMsHACAwAADKBwAg5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGHAwEA2gUAIYgDAQDaBQAhiQMBANoFACGKAwEA2gUAIZADAQDbBQAhCgUAAMsHACDmAgEA2gUAIfQCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYcDAQDaBQAhiAMBANoFACGJAwEA2gUAIYoDAQDaBQAhkAMBANsFACEFNwAAqgsAIDgAAK0LACD6AwAAqwsAIPsDAACsCwAggAQAAIICACADNwAAqgsAIPoDAACrCwAggAQAAIICACADNwAAxgcAIPoDAADHBwAggAQAAAYAIAM3AAC_BwAg-gMAAMAHACCABAAACgAgAzcAAKgLACD6AwAAqQsAIIAEAACCAgAgBDcAALYHADD6AwAAtwcAMPwDAAC5BwAggAQAAJkGADADNwAApAcAIPoDAAClBwAggAQAAAEAIAQ3AACUBwAw-gMAAJUHADD8AwAAlwcAIIAEAACYBwAwBDcAAIYHADD6AwAAhwcAMPwDAACJBwAggAQAAIoHADAENwAA6AYAMPoDAADpBgAw_AMAAOsGACCABAAA7AYAMAQ3AADaBgAw-gMAANsGADD8AwAA3QYAIIAEAADeBgAwBDcAAMwGADD6AwAAzQYAMPwDAADPBgAggAQAANAGADAENwAAvAYAMPoDAAC9BgAw_AMAAL8GACCABAAAwAYAMAQ3AAD8BQAw-gMAAP0FADD8AwAA_wUAIIAEAACABgAwBDcAAPAFADD6AwAA8QUAMPwDAADzBQAggAQAAPQFADAAAAAFNwAAowsAIDgAAKYLACD6AwAApAsAIPsDAAClCwAggAQAAFsAIAM3AACjCwAg-gMAAKQLACCABAAAWwAgAAAABTcAAJ4LACA4AAChCwAg-gMAAJ8LACD7AwAAoAsAIIAEAABbACADNwAAngsAIPoDAACfCwAggAQAAFsAIAAAAAAAAf0DAAAAkwMCBf0DAgAAAAGDBAIAAAABhAQCAAAAAYUEAgAAAAGGBAIAAAABCzcAAKgIADA4AACsCAAw-gMAAKkIADD7AwAAqggAMPwDAACrCAAg_QMAAIoHADD-AwAAigcAMP8DAACKBwAwgAQAAIoHADCBBAAArQgAMIIEAACNBwAwCzcAAJ0IADA4AAChCAAw-gMAAJ4IADD7AwAAnwgAMPwDAACgCAAg_QMAAIAGADD-AwAAgAYAMP8DAACABgAwgAQAAIAGADCBBAAAoggAMIIEAACDBgAwCzcAAJIIADA4AACWCAAw-gMAAJMIADD7AwAAlAgAMPwDAACVCAAg_QMAAJgHADD-AwAAmAcAMP8DAACYBwAwgAQAAJgHADCBBAAAlwgAMIIEAACbBwAwCzcAAIcIADA4AACLCAAw-gMAAIgIADD7AwAAiQgAMPwDAACKCAAg_QMAAOwGADD-AwAA7AYAMP8DAADsBgAwgAQAAOwGADCBBAAAjAgAMIIEAADvBgAwCzcAAPwHADA4AACACAAw-gMAAP0HADD7AwAA_gcAMPwDAAD_BwAg_QMAANAGADD-AwAA0AYAMP8DAADQBgAwgAQAANAGADCBBAAAgQgAMIIEAADTBgAwCzcAAPEHADA4AAD1BwAw-gMAAPIHADD7AwAA8wcAMPwDAAD0BwAg_QMAAMAGADD-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_CgAwAgAAAB8AIDAAAK8IACACAAAAjgcAIDAAAK4IACAT5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACG7AwEA2gUAIbwDAACPBrADIr0DEACQBgAhvgMQAJAGACG_AxAAkAYAIcADEACQBgAhwQMQAJAGACHCAxAAkAYAIcMDAACRBrQDIsQDEACQBgAhxQMQAJAGACHGAwAAkQa0AyLHAxAAkAYAIcgDEACQBgAhyQMAAJEGtAMiFgwAAJIGACAOAACRBwAgEQAAlAYAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhuwMBANoFACG8AwAAjwawAyK9AxAAkAYAIb4DEACQBgAhvwMQAJAGACHAAxAAkAYAIcEDEACQBgAhwgMQAJAGACHDAwAAkQa0AyLEAxAAkAYAIcUDEACQBgAhxgMAAJEGtAMixwMQAJAGACHIAxAAkAYAIckDAACRBrQDIhYMAACnBgAgDgAAkwcAIBEAAKkGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGRAwEAAAABuwMBAAAAAbwDAAAAsAMCvQMQAAAAAb4DEAAAAAG_AxAAAAABwAMQAAAAAcEDEAAAAAHCAxAAAAABwwMAAAC0AwLEAxAAAAABxQMQAAAAAcYDAAAAtAMCxwMQAAAAAcgDEAAAAAHJAwAAALQDAgQ3AACoCAAw-gMAAKkIADD8AwAAqwgAIIAEAACKBwAwBDcAAJ0IADD6AwAAnggAMPwDAACgCAAggAQAAIAGADAENwAAkggAMPoDAACTCAAw_AMAAJUIACCABAAAmAcAMAQ3AACHCAAw-gMAAIgIADD8AwAAiggAIIAEAADsBgAwBDcAAPwHADD6AwAA_QcAMPwDAAD_BwAggAQAANAGADAENwAA8QcAMPoDAADyBwAw_AMAAPQHACCABAAAwAYAMAAAAAAAAAAAAAAAAAAAAAAB_QMAAACgAwIB_QMAAACkAwIFNwAA2QoAIDgAAP0KACD6AwAA2goAIPsDAAD8CgAggAQAAIICACALNwAA2ggAMDgAAN8IADD6AwAA2wgAMPsDAADcCAAw_AMAAN0IACD9AwAA3ggAMP4DAADeCAAw_wMAAN4IADCABAAA3ggAMIEEAADgCAAwggQAAOEIADALNwAAzAgAMDgAANEIADD6AwAAzQgAMPsDAADOCAAw_AMAAM8IACD9AwAA0AgAMP4DAADQCAAw_wMAANAIADCABAAA0AgAMIEEAADSCAAwggQAANMIADAQAQAA2QgAIBEAALUHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGFAwEAAAAB2QMAAADtAwLnAwEAAAAB6AMBAAAAAekDCAAAAAHqAwgAAAAB6wMIAAAAAe0DQAAAAAHuA0AAAAAB7wMBAAAAAfADAQAAAAECAAAAAQAgNwAA2AgAIAMAAAABACA3AADYCAAgOAAA1ggAIAEwAAD7CgAwFQEAAKoFACAHAAC-BQAgEQAAvwUAIOMCAAC7BQAw5AIAACYAEOUCAAC7BQAw5gIBAAAAAfYCQADWBAAh9wJAANYEACGFAwEAAAAB1wMBANMEACHZAwAAvQXtAyLnAwEAgAUAIegDAQCABQAh6QMIALwFACHqAwgAvAUAIesDCAC8BQAh7QNAANYEACHuA0AAnwUAIe8DAQCABQAh8AMBAIAFACECAAAAAQAgMAAA1ggAIAIAAADUCAAgMAAA1QgAIBLjAgAA0wgAMOQCAADUCAAQ5QIAANMIADDmAgEA0wQAIfYCQADWBAAh9wJAANYEACGFAwEA0wQAIdcDAQDTBAAh2QMAAL0F7QMi5wMBAIAFACHoAwEAgAUAIekDCAC8BQAh6gMIALwFACHrAwgAvAUAIe0DQADWBAAh7gNAAJ8FACHvAwEAgAUAIfADAQCABQAhEuMCAADTCAAw5AIAANQIABDlAgAA0wgAMOYCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAh1wMBANMEACHZAwAAvQXtAyLnAwEAgAUAIegDAQCABQAh6QMIALwFACHqAwgAvAUAIesDCAC8BQAh7QNAANYEACHuA0AAnwUAIe8DAQCABQAh8AMBAIAFACEO5gIBANoFACH2AkAA4QUAIfcCQADhBQAhhQMBANoFACHZAwAAqgftAyLnAwEA2wUAIegDAQDbBQAh6QMIAKkHACHqAwgAqQcAIesDCACpBwAh7QNAAOEFACHuA0AA4gUAIe8DAQDbBQAh8AMBANsFACEQAQAA1wgAIBEAAKwHACDmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIdkDAACqB-0DIucDAQDbBQAh6AMBANsFACHpAwgAqQcAIeoDCACpBwAh6wMIAKkHACHtA0AA4QUAIe4DQADiBQAh7wMBANsFACHwAwEA2wUAIQU3AAD2CgAgOAAA-QoAIPoDAAD3CgAg-wMAAPgKACCABAAAWwAgEAEAANkIACARAAC1BwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABhQMBAAAAAdkDAAAA7QMC5wMBAAAAAegDAQAAAAHpAwgAAAAB6gMIAAAAAesDCAAAAAHtA0AAAAAB7gNAAAAAAe8DAQAAAAHwAwEAAAABAzcAAPYKACD6AwAA9woAIIAEAABbACARBQAArQkAIAoAAK4JACALAACvCQAgFwAAsgkAIB0AALAJACAeAACxCQAgHwAAswkAIOYCAQAAAAH0AgEAAAAB9gJAAAAAAfcCQAAAAAGlAwEAAAABzgMBAAAAAdQDAQAAAAHVAwgAAAAB1gMCAAAAAdkDAAAA2QMCAgAAABIAIDcAAKwJACADAAAAEgAgNwAArAkAIDgAAOUIACABMAAA9QoAMBYFAADOBQAgBwAAvgUAIAoAAM8FACALAADPBQAgFwAA2wQAIB0AALkFACAeAADaBAAgHwAA3QQAIOMCAADMBQAw5AIAABAAEOUCAADMBQAw5gIBAAAAAfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIaUDAQDTBAAhzgMBAAAAAdQDAQDTBAAh1QMIAKkFACHWAwIA1QQAIdcDAQDTBAAh2QMAAM0F2QMiAgAAABIAIDAAAOUIACACAAAA4ggAIDAAAOMIACAO4wIAAOEIADDkAgAA4ggAEOUCAADhCAAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGlAwEA0wQAIc4DAQDTBAAh1AMBANMEACHVAwgAqQUAIdYDAgDVBAAh1wMBANMEACHZAwAAzQXZAyIO4wIAAOEIADDkAgAA4ggAEOUCAADhCAAw5gIBANMEACH0AgEA0wQAIfYCQADWBAAh9wJAANYEACGlAwEA0wQAIc4DAQDTBAAh1AMBANMEACHVAwgAqQUAIdYDAgDVBAAh1wMBANMEACHZAwAAzQXZAyIK5gIBANoFACH0AgEA2gUAIfYCQADhBQAh9wJAAOEFACGlAwEA2gUAIc4DAQDaBQAh1AMBANoFACHVAwgAnwYAIdYDAgDqBwAh2QMAAOQI2QMiAf0DAAAA2QMCEQUAAOYIACAKAADnCAAgCwAA6AgAIBcAAOsIACAdAADpCAAgHgAA6ggAIB8AAOwIACDmAgEA2gUAIfQCAQDaBQAh9gJAAOEFACH3AkAA4QUAIaUDAQDaBQAhzgMBANoFACHUAwEA2gUAIdUDCACfBgAh1gMCAOoHACHZAwAA5AjZAyIFNwAA2woAIDgAAPMKACD6AwAA3AoAIPsDAADyCgAggAQAAIICACALNwAAoQkAMDgAAKUJADD6AwAAogkAMPsDAACjCQAw_AMAAKQJACD9AwAAlwkAMP4DAACXCQAw_wMAAJcJADCABAAAlwkAMIEEAACmCQAwggQAAJoJADALNwAAkwkAMDgAAJgJADD6AwAAlAkAMPsDAACVCQAw_AMAAJYJACD9AwAAlwkAMP4DAACXCQAw_wMAAJcJADCABAAAlwkAMIEEAACZCQAwggQAAJoJADALNwAAiAkAMDgAAIwJADD6AwAAiQkAMPsDAACKCQAw_AMAAIsJACD9AwAArgYAMP4DAACuBgAw_wMAAK4GADCABAAArgYAMIEEAACNCQAwggQAALEGADALNwAA_wgAMDgAAIMJADD6AwAAgAkAMPsDAACBCQAw_AMAAIIJACD9AwAAmAcAMP4DAACYBwAw_wMAAJgHADCABAAAmAcAMIEEAACECQAwggQAAJsHADALNwAA9ggAMDgAAPoIADD6AwAA9wgAMPsDAAD4CAAw_AMAAPkIACD9AwAA7AYAMP4DAADsBgAw_wMAAOwGADCABAAA7AYAMIEEAAD7CAAwggQAAO8GADALNwAA7QgAMDgAAPEIADD6AwAA7ggAMPsDAADvCAAw_AMAAPAIACD9AwAAwAYAMP4DAADABgAw_wMAAMAGADCABAAAwAYAMIEEAADyCAAwggQAAMMGADALDAAA-wcAIA0AAMsGACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGRAwEAAAABuAMBAAAAAc8DCAAAAAHQAwgAAAAB0QMIAAAAAdIDCAAAAAECAAAAQAAgNwAA9QgAIAMAAABAACA3AAD1CAAgOAAA9AgAIAEwAADxCgAwAgAAAEAAIDAAAPQIACACAAAAxAYAIDAAAPMIACAJ5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACG4AwEA2gUAIc8DCACfBgAh0AMIAJ8GACHRAwgAnwYAIdIDCACfBgAhCwwAAPkHACANAADIBgAg5gIBANoFACH2AkAA4QUAIfcCQADhBQAhkQMBANoFACG4AwEA2gUAIc8DCACfBgAh0AMIAJ8GACHRAwgAnwYAIdIDCACfBgAhCwwAAPsHACANAADLBgAg5gIBAAAAAfYCQAAAAAH3AkAAAAABkQMBAAAAAbgDAQAAAAHPAwgAAAAB0AMIAAAAAdEDCAAAAAHSAwgAAAABCw0AAIQHACAVAACRCAAgGAAAhQcAIOYCAQAAAAH2AkAAAAAB9wJAAAAAAZwDCAAAAAG4AwEAAAABygMBAAAAAcwDAAAAzAMCzQNAAAAAAQIAAAAzACA3AAD-CAAgAwAAADMAIDcAAP4IACA4AAD9CAAgATAAAPAKADACAAAAMwAgMAAA_QgAIAIAAADwBgAgMAAA_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_AMAAJYJACCABAAAlwkAMAQ3AACICQAw-gMAAIkJADD8AwAAiwkAIIAEAACuBgAwBDcAAP8IADD6AwAAgAkAMPwDAACCCQAggAQAAJgHADAENwAA9ggAMPoDAAD3CAAw_AMAAPkIACCABAAA7AYAMAQ3AADtCAAw-gMAAO4IADD8AwAA8AgAIIAEAADABgAwAzcAANkKACD6AwAA2goAIIAEAACCAgAgBDcAANoIADD6AwAA2wgAMPwDAADdCAAggAQAAN4IADAENwAAzAgAMPoDAADNCAAw_AMAAM8IACCABAAA0AgAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACzcAAIgKADA4AACNCgAw-gMAAIkKADD7AwAAigoAMPwDAACLCgAg_QMAAIwKADD-AwAAjAoAMP8DAACMCgAwgAQAAIwKADCBBAAAjgoAMIIEAACPCgAwCzcAAPwJADA4AACBCgAw-gMAAP0JADD7AwAA_gkAMPwDAAD_CQAg_QMAAIAKADD-AwAAgAoAMP8DAACACgAwgAQAAIAKADCBBAAAggoAMIIEAACDCgAwCzcAAPAJADA4AAD1CQAw-gMAAPEJADD7AwAA8gkAMPwDAADzCQAg_QMAAPQJADD-AwAA9AkAMP8DAAD0CQAwgAQAAPQJADCBBAAA9gkAMIIEAAD3CQAwCzcAAOUJADA4AADpCQAw-gMAAOYJADD7AwAA5wkAMPwDAADoCQAg_QMAAN4IADD-AwAA3ggAMP8DAADeCAAwgAQAAN4IADCBBAAA6gkAMIIEAADhCAAwCzcAANkJADA4AADeCQAw-gMAANoJADD7AwAA2wkAMPwDAADcCQAg_QMAAN0JADD-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gEAAAAB9gJAANYEACH3AkAA1gQAIYUDAQAAAAGGAwEAAAABhwMBAIAFACGIAwEAgAUAIYkDQACfBQAhigMBAIAFACGLAwEAgAUAIYwDAQCABQAhjQMBAIAFACGOAwEAgAUAIY8DAQCABQAhkAMBAIAFACECAAAACgAgMAAAhgoAIAIAAACECgAgMAAAhQoAIBPjAgAAgwoAMOQCAACECgAQ5QIAAIMKADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhhgMBANMEACGHAwEAgAUAIYgDAQCABQAhiQNAAJ8FACGKAwEAgAUAIYsDAQCABQAhjAMBAIAFACGNAwEAgAUAIY4DAQCABQAhjwMBAIAFACGQAwEAgAUAIRPjAgAAgwoAMOQCAACECgAQ5QIAAIMKADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYUDAQDTBAAhhgMBANMEACGHAwEAgAUAIYgDAQCABQAhiQNAAJ8FACGKAwEAgAUAIYsDAQCABQAhjAMBAIAFACGNAwEAgAUAIY4DAQCABQAhjwMBAIAFACGQAwEAgAUAIQ_mAgEA2gUAIfYCQADhBQAh9wJAAOEFACGFAwEA2gUAIYYDAQDaBQAhhwMBANsFACGIAwEA2wUAIYkDQADiBQAhigMBANsFACGLAwEA2wUAIYwDAQDbBQAhjQMBANsFACGOAwEA2wUAIY8DAQDbBQAhkAMBANsFACEQAQAA3QcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYUDAQDaBQAhhgMBANoFACGHAwEA2wUAIYgDAQDbBQAhiQNAAOIFACGKAwEA2wUAIYsDAQDbBQAhjAMBANsFACGNAwEA2wUAIY4DAQDbBQAhjwMBANsFACGQAwEA2wUAIRABAADeBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABiAMBAAAAAYkDQAAAAAGKAwEAAAABiwMBAAAAAYwDAQAAAAGNAwEAAAABjgMBAAAAAY8DAQAAAAGQAwEAAAABCgEAAOMHACDmAgEAAAAB9gJAAAAAAfcCQAAAAAGHAwEAAAABiAMBAAAAAYkDAQAAAAGKAwEAAAABkAMBAAAAAZEDAQAAAAECAAAABgAgNwAAkwoAIAMAAAAGACA3AACTCgAgOAAAkgoAIAEwAADPCgAwDwEAAKoFACAFAADOBQAg4wIAANUFADDkAgAAAwAQ5QIAANUFADDmAgEAAAAB9AIBANMEACH2AkAA1gQAIfcCQADWBAAhhwMBANMEACGIAwEA0wQAIYkDAQDTBAAhigMBANMEACGQAwEAgAUAIZEDAQAAAAECAAAABgAgMAAAkgoAIAIAAACQCgAgMAAAkQoAIA3jAgAAjwoAMOQCAACQCgAQ5QIAAI8KADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYcDAQDTBAAhiAMBANMEACGJAwEA0wQAIYoDAQDTBAAhkAMBAIAFACGRAwEA0wQAIQ3jAgAAjwoAMOQCAACQCgAQ5QIAAI8KADDmAgEA0wQAIfQCAQDTBAAh9gJAANYEACH3AkAA1gQAIYcDAQDTBAAhiAMBANMEACGJAwEA0wQAIYoDAQDTBAAhkAMBAIAFACGRAwEA0wQAIQnmAgEA2gUAIfYCQADhBQAh9wJAAOEFACGHAwEA2gUAIYgDAQDaBQAhiQMBANoFACGKAwEA2gUAIZADAQDbBQAhkQMBANoFACEKAQAA4gcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIYcDAQDaBQAhiAMBANoFACGJAwEA2gUAIYoDAQDaBQAhkAMBANsFACGRAwEA2gUAIQoBAADjBwAg5gIBAAAAAfYCQAAAAAH3AkAAAAABhwMBAAAAAYgDAQAAAAGJAwEAAAABigMBAAAAAZADAQAAAAGRAwEAAAABBDcAAIgKADD6AwAAiQoAMPwDAACLCgAggAQAAIwKADAENwAA_AkAMPoDAAD9CQAw_AMAAP8JACCABAAAgAoAMAQ3AADwCQAw-gMAAPEJADD8AwAA8wkAIIAEAAD0CQAwBDcAAOUJADD6AwAA5gkAMPwDAADoCQAggAQAAN4IADAENwAA2QkAMPoDAADaCQAw_AMAANwJACCABAAA3QkAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc3AADKCgAgOAAAzQoAIPoDAADLCgAg-wMAAMwKACD-AwAAWQAg_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_AxAAkAYAIcADEACQBgAhwQMQAJAGACHCAxAAkAYAIcMDAACRBrQDIsQDEACQBgAhxQMQAJAGACHGAwAAkQa0AyLHAxAAkAYAIcgDEACQBgAhyQMAAJEGtAMiFwwAAJIGACANAACTBgAgDgAAkQcAIOYCAQDaBQAh9gJAAOEFACH3AkAA4QUAIZEDAQDaBQAhuAMBANoFACG7AwEA2gUAIbwDAACPBrADIr0DEACQBgAhvgMQAJAGACG_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_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-gsAIAMAAAAQACA3AAD6CwAgOAAA_gsAIBQAAAAQACAFAADmCAAgBwAA7QkAIAoAAOcIACALAADoCAAgFwAA6wgAIB4AAOoIACAfAADsCAAgMAAA_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-AJAAOIFACH5AiAA3AUAIQMAAADRAwAgNwAA-AsAIDgAAJcMACAPAAAA0QMAIBMAAOsHACAWAADtBwAgFwAA7gcAIBkAAO8HACAaAADwBwAgMAAAlwwAIOYCAQDaBQAh5wIAAOkHkwMi9gJAAOEFACH3AkAA4QUAIZMDAgDqBwAhlANAAOEFACGVA0AA4QUAIZYDIADcBQAhDRMAAOsHACAWAADtBwAgFwAA7gcAIBkAAO8HACAaAADwBwAg5gIBANoFACHnAgAA6QeTAyL2AkAA4QUAIfcCQADhBQAhkwMCAOoHACGUA0AA4QUAIZUDQADhBQAhlgMgANwFACEE5gIBAAAAAfYCQAAAAAH3AkAAAAABuAMBAAAAAQnmAgEAAAAB9gJAAAAAAdoDAQAAAAHbAwEAAAAB3AMBAAAAAd0DgAAAAAHeA4AAAAAB3wMBAAAAAeADAQAAAAEDAAAAYwAgNwAAqAsAIDgAAJwMACAMAAAAYwAgBAAA1AkAIAYAANUJACAHAADWCQAgCAAA1wkAIDAAAJwMACDmAgEA2gUAIecCAQDaBQAh9gJAAOEFACH3AkAA4QUAIaUDAQDbBQAhzgMBANoFACEKBAAA1AkAIAYAANUJACAHAADWCQAgCAAA1wkAIOYCAQDaBQAh5wIBANoFACH2AkAA4QUAIfcCQADhBQAhpQMBANsFACHOAwEA2gUAIQMBAAIHAAYRfA0OBWQEEWUNEgAbE2gMGWsTIgQDI2IFJGYBJWcPJmkQJ2oRKGwUKW0KKnEaAgEAAgUABAYBXAIEBwMGCwUHDwYIWAcSABkCAQACBQAEBAUABBIAGCATByFVAQkFAAQHAAYKFwgLGAgSABcXTBAdHAkeSw8fTRQCCAAHCQAHAggABxwACgUMAAINAAsSABYTSQwbSAkHEgAVEyAMFCwKFjAPFzQQGT0TGkEUBQwAAg0ACw4AChEkDRIADgMBAAIPJQwQJwEBESgAAwgABw0ACxUAAgUIAAcNAAsSABIVAAIYOBECDAACFwAQARg5AAIMAAINAAsDCAAHDAACDQALBhNCABRDABZEABdFABlGABpHAAEbSgAGCk4AC08AF1IAHVAAHlEAH1MAAiBWACFXAAUBYQAEXQAGXgAHXwAIYAABAXICCRFzABN1ABl4ACV0ACZ2ACd3ACh5ACl6ACp7AAACAQACBwAGAgEAAgcABgUSACA9ACE-ACI_ACNAACQAAAAAAAUSACA9ACE-ACI_ACNAACQBAZwBAgEBogECAxIAKT8AKkAAKwAAAAMSACk_ACpAACsCBQAEBwAGAgUABAcABgUSADA9ADE-ADI_ADNAADQAAAAAAAUSADA9ADE-ADI_ADNAADQDCAAHDQALFQACAwgABw0ACxUAAgMSADk_ADpAADsAAAADEgA5PwA6QAA7AggABxwACgIIAAccAAoDEgBAPwBBQABCAAAAAxIAQD8AQUAAQgMIAAcMAAINAAsDCAAHDAACDQALBRIARz0ASD4AST8ASkAASwAAAAAABRIARz0ASD4AST8ASkAASwAAAxIAUD8AUUAAUgAAAAMSAFA_AFFAAFICDAACDQALAgwAAg0ACwMSAFc_AFhAAFkAAAADEgBXPwBYQABZAwgABw0ACxUAAgMIAAcNAAsVAAIFEgBePQBfPgBgPwBhQABiAAAAAAAFEgBePQBfPgBgPwBhQABiAwwAAg0ACw4ACgMMAAINAAsOAAoFEgBnPQBoPgBpPwBqQABrAAAAAAAFEgBnPQBoPgBpPwBqQABrAgwAAg0ACwIMAAINAAsFEgBwPQBxPgByPwBzQAB0AAAAAAAFEgBwPQBxPgByPwBzQAB0AwEAAg_8AgwQ_QIBAwEAAg-DAwwQhAMBBRIAeT0Aej4Aez8AfEAAfQAAAAAABRIAeT0Aej4Aez8AfEAAfQIIAAcJAAcCCAAHCQAHAxIAggE_AIMBQACEAQAAAAMSAIIBPwCDAUAAhAEBBQAEAQUABAUSAIkBPQCKAT4AiwE_AIwBQACNAQAAAAAABRIAiQE9AIoBPgCLAT8AjAFAAI0BAgwAAhcAEAIMAAIXABAFEgCSAT0AkwE-AJQBPwCVAUAAlgEAAAAAAAUSAJIBPQCTAT4AlAE_AJUBQACWAQAABRIAmwE9AJwBPgCdAT8AngFAAJ8BAAAAAAAFEgCbAT0AnAE-AJ0BPwCeAUAAnwECAQACBQAEAgEAAgUABAMSAKQBPwClAUAApgEAAAADEgCkAT8ApQFAAKYBAgEAAgUABAIBAAIFAAQDEgCrAT8ArAFAAK0BAAAAAxIAqwE_AKwBQACtAQEFnQQEAQWjBAQDEgCyAT8AswFAALQBAAAAAxIAsgE_ALMBQAC0ASsCASx9AS1-AS5_AS-AAQExggEBMoQBHDOFAR00hwEBNYkBHDaKAR45iwEBOowBATuNARxBkAEfQpEBJUOSARpEkwEaRZQBGkaVARpHlgEaSJgBGkmaARxKmwEmS54BGkygARxNoQEnTqMBGk-kARpQpQEcUagBKFKpASxTqgEHVKsBB1WsAQdWrQEHV64BB1iwAQdZsgEcWrMBLVu1AQdctwEcXbgBLl65AQdfugEHYLsBHGG-AS9ivwE1Y8ABD2TBAQ9lwgEPZsMBD2fEAQ9oxgEPacgBHGrJATZrywEPbM0BHG3OATduzwEPb9ABD3DRARxx1AE4ctUBPHPWAQl01wEJddgBCXbZAQl32gEJeNwBCXneARx63wE9e-EBCXzjARx95AE-fuUBCX_mAQmAAecBHIEB6gE_ggHrAUODAewBFIQB7QEUhQHuARSGAe8BFIcB8AEUiAHyARSJAfQBHIoB9QFEiwH3ARSMAfkBHI0B-gFFjgH7ARSPAfwBFJAB_QEckQGAAkaSAYECTJMBgwIElAGEAgSVAYYCBJYBhwIElwGIAgSYAYoCBJkBjAIcmgGNAk2bAY8CBJwBkQIcnQGSAk6eAZMCBJ8BlAIEoAGVAhyhAZgCT6IBmQJTowGaAgqkAZsCCqUBnAIKpgGdAgqnAZ4CCqgBoAIKqQGiAhyqAaMCVKsBpQIKrAGnAhytAagCVa4BqQIKrwGqAgqwAasCHLEBrgJWsgGvAlqzAbACELQBsQIQtQGyAhC2AbMCELcBtAIQuAG2AhC5AbgCHLoBuQJbuwG7AhC8Ab0CHL0BvgJcvgG_AhC_AcACEMABwQIcwQHEAl3CAcUCY8MBxgIMxAHHAgzFAcgCDMYByQIMxwHKAgzIAcwCDMkBzgIcygHPAmTLAdECDMwB0wIczQHUAmXOAdUCDM8B1gIM0AHXAhzRAdoCZtIB2wJs0wHcAhPUAd0CE9UB3gIT1gHfAhPXAeACE9gB4gIT2QHkAhzaAeUCbdsB5wIT3AHpAhzdAeoCbt4B6wIT3wHsAhPgAe0CHOEB8AJv4gHxAnXjAfICDeQB8wIN5QH0Ag3mAfUCDecB9gIN6AH4Ag3pAfoCHOoB-wJ26wH_Ag3sAYEDHO0BggN37gGFAw3vAYYDDfABhwMc8QGKA3jyAYsDfvMBjAMI9AGNAwj1AY4DCPYBjwMI9wGQAwj4AZIDCPkBlAMc-gGVA3_7AZcDCPwBmQMc_QGaA4AB_gGbAwj_AZwDCIACnQMcgQKgA4EBggKhA4UBgwKiAwaEAqMDBoUCpAMGhgKlAwaHAqYDBogCqAMGiQKqAxyKAqsDhgGLAq0DBowCrwMcjQKwA4cBjgKxAwaPArIDBpACswMckQK2A4gBkgK3A44BkwK4AxGUArkDEZUCugMRlgK7AxGXArwDEZgCvgMRmQLAAxyaAsEDjwGbAsMDEZwCxQMcnQLGA5ABngLHAxGfAsgDEaACyQMcoQLMA5EBogLNA5cBowLPAwukAtADC6UC0wMLpgLUAwunAtUDC6gC1wMLqQLZAxyqAtoDmAGrAtwDC6wC3gMcrQLfA5kBrgLgAwuvAuEDC7AC4gMcsQLlA5oBsgLmA6ABswLnAwO0AugDA7UC6QMDtgLqAwO3AusDA7gC7QMDuQLvAxy6AvADoQG7AvIDA7wC9AMcvQL1A6IBvgL2AwO_AvcDA8AC-AMcwQL7A6MBwgL8A6cBwwL9AwXEAv4DBcUC_wMFxgKABAXHAoEEBcgCgwQFyQKFBBzKAoYEqAHLAogEBcwCigQczQKLBKkBzgKMBAXPAo0EBdACjgQc0QKRBKoB0gKSBK4B0wKTBALUApQEAtUClQQC1gKWBALXApcEAtgCmQQC2QKbBBzaApwErwHbAp8EAtwCoQQc3QKiBLAB3gKkBALfAqUEAuACpgQc4QKpBLEB4gKqBLUB"
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
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
  isDeleted: "isDeleted"
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
        departmentId: userPayload.departmentId,
        role: Role.STUDENT,
        userStatus: UserStatus.ACTIVE,
        emailVerified: true,
        isEnrolled: false
      },
      omit: {
        password: true
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
    const accessToken = jwtUtils.createToken(
      jwtpayload,
      config_default.accessSecret,
      {
        expiresIn: config_default.jwt_access_Expires
      }
    );
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
    if (!user || user.isDeleted) {
      throw new Error("User not found. Please register.");
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
  async refreshToken(token) {
    const verifiedRefreshToken = jwtUtils.verifyToken(
      token,
      config_default.refreshSecret
    );
    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
      throw new Error(
        config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
      );
    }
    const data = verifiedRefreshToken.data;
    const user = await prisma.users.findUnique({
      where: { id: data.userId }
    });
    if (!user || user.isDeleted || user.userStatus !== UserStatus.ACTIVE) {
      throw new Error("User is inactive or not found");
    }
    const jwtPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    const accessToken = jwtUtils.createToken(
      jwtPayload,
      config_default.accessSecret,
      config_default.jwt_access_Expires
    );
    const refreshToken = jwtUtils.createToken(
      jwtPayload,
      config_default.refreshSecret,
      config_default.jwt_refresh_Expires
    );
    return {
      accessToken,
      refreshToken
    };
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
  refreshToken = this.handle(async (req, res) => {
    if (!req.cookies.refreshToken) {
      throw new Error("Refresh token is missing");
    }
    const result = await auth_service_default.refreshToken(req.cookies.refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config_default.node_env === "development" ? false : true,
      sameSite: config_default.node_env === "development" ? "lax" : "none",
      maxAge: 1e3 * 60 * 60 * 24
      // 24 hour or 1 day
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config_default.node_env === "development" ? false : true,
      sameSite: config_default.node_env === "development" ? "lax" : "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 days
    });
    sendResponse(res, {
      status: statusCode.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
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

// src/lib/express-authLimite.ts
import rateLimit from "express-rate-limit";
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  limit: 20,
  // 20 requests
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: []
  }
});

// src/module/auth/auth.routes.ts
var router = Router();
router.post(
  "/register",
  validationReq.validate(authValidation.userRegisterValidationSchema),
  auth_controller_default.createStudent
);
router.post("/verified-email", authLimiter, auth_controller_default.verifayAccount);
router.post("/login", authLimiter, auth_controller_default.login);
router.post("/google-login", auth_controller_default.googleLogin);
router.post("/refresh-token", auth_controller_default.refreshToken);
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
        description: description ?? null
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
  async userDeletedDB(id, adminId) {
    if (id) {
      throw new Error("user id is Emptay");
    }
    const oldUser = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        isDeleted: true
      }
    });
    if (!oldUser) {
      throw new Error("User not found");
    }
    if (oldUser.isDeleted) {
      throw new Error("User is already deleted");
    }
    const result = await prisma.$transaction(async (tx) => {
      const result2 = await tx.users.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: "User Deleted",
          resource: "USER",
          resourceId: id,
          oldData: {
            isDeleted: false
          },
          newData: {
            isDeleted: result2.isDeleted
          }
        }
      });
      return result2;
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
  userDelete = this.handle(async (req, res) => {
    const id = req.params.id;
    const adminId = req.user?.role;
    const result = await admin_service_default.userDeletedDB(id, adminId);
    sendResponse(res, {
      message: `user deleted successfully`,
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
router3.delete("/users/:id", auth("ADMIN"), admin_controller_default.userDelete);
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
import helmet from "helmet";
import cors from "cors";
var app = express();
app.use(
  cors({
    origin: config_default.appurl,
    credentials: true
  })
);
app.use(helmet());
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