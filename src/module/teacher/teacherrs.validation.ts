import { z } from "zod";

export const setPasswordValidationSchema = z.object({
  body: z
    .object({
      password: z.string().min(6, "Password must be at least 6 characters"),

      confirmPassword: z.string().min(6, "Confirm password is required"),

      tokenId: z.string().trim().min(1, "Token ID is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Confirm password does not match",
      path: ["confirmPassword"],
    }),
});

export const updateTeacherProfileValidationSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .pipe(
        z
          .string()
          .regex(
            /^01[3-9]\d{8}$/,
            "Please provide a valid Bangladeshi phone number",
          )
          .optional(),
      )
      .optional(),

    address: z
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .pipe(z.string().min(1, "Address cannot be empty").optional())
      .optional(),

    experience: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.string().min(0, "Experience cannot be negative").optional(),
    ),

    bio: z.string().trim().optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    departmentId: z
      .string()
      .trim()
      .uuid("Please provide a valid department ID"),

    dateOfBirth: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce
        .date()
        .refine((date) => date <= new Date(), {
          message: "Date of birth cannot be in the future",
        })
        .optional(),
    ),

    designation: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().trim().min(1, "Designation cannot be empty").optional(),
    ),

    specialization: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().trim().min(1, "Specialization cannot be empty").optional(),
    ),

    qualification: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.string().trim().min(1, "Qualification cannot be empty").optional(),
    ),
  }),
});

export const createExamValidationSchema = z.object({
  body: z.object({
    examType: z.enum(["MIDTERM", "FINAL", "QUIZ"], {
      message: "Please select an exam type",
    }),
    examDate: z.string().min(1, "Please select exam date and time"),
    totalMarks: z
      .string()
      .min(1, "Total marks is required")
      .refine(
        (value) => Number.isFinite(Number(value)) && Number(value) > 0,
        "Total marks must be greater than zero",
      ),
  }),
});

export const courseMarksValidationSchema = z.object({
  body: z.object({
    studentId: z.string().trim().min(1, "Student ID is required"),

    semesterId: z.string().trim().min(1, "Semester ID is required"),

    attendanceMarks: z.coerce
      .number()
      .min(0, "Attendance marks cannot be negative"),

    assignmentMarks: z.coerce
      .number()
      .min(0, "Assignment marks cannot be negative"),

    midMarks: z.coerce.number().min(0, "Midterm marks cannot be negative"),

    finalExamMarks: z.coerce
      .number()
      .min(0, "Final exam marks cannot be negative"),
  }),
});

export const teacherValidation = {
  setPasswordValidationSchema,
  updateTeacherProfileValidationSchema,
  createExamValidationSchema,
  courseMarksValidationSchema,
};
