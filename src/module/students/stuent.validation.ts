import { z } from "zod";

export const studentProfileValidationSchema = z.object({
  body: z.object({
    phone: z.string().trim().min(11, "Phone number is required"),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Invalid gender",
    }),

    dateOfBirth: z.string({
      message: "Valid date of birth is required",
    }),

    address: z.string().trim().min(1, "Address is required"),
    departmentId: z.string().trim().min(5, "departmentId is Reqauired"),
  }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "application/pdf",
];

const fileSchema = z
  .custom<File>((val) => val instanceof File, {
    message: "Valid file is required",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Invalid file type. Only SVG, PNG, JPG, or PDF are allowed.",
  });

export const admissionBodySchema = z.object({
  body: z
    .object({
      programId: z.string().uuid("Program ID is required"),
      educationType: z.enum(["HSC", "DIPLOMA"]),

      // File fields
      sscResult: fileSchema, 
      hscResult: fileSchema.optional(),
      diplomaResult: fileSchema.optional(),
    })
    .refine(
      (data) => {
        if (data.educationType === "HSC") {
          return data.hscResult !== undefined;
        }
        if (data.educationType === "DIPLOMA") {
          return data.diplomaResult !== undefined;
        }
        return false;
      },
      {
        message:
          "HSC result file or Diploma result file is required based on education type",
        path: ["educationType"],
      },
    ),
});

export type AdmissionBodyInput = z.infer<typeof admissionBodySchema>;

const studentEnrollmentValidationSchema = z.object({
  body: z.object({
    semesterId: z.string().trim().min(1, "Semester ID is required"),

    studentId: z.string().trim().min(1, "Student ID is required"),

    Enrolementcourses: z
      .array(
        z.object({
          courseId: z.string().trim().min(1, "Course ID is required"),
        }),
      )
      .min(1, "At least one course is required")
      .superRefine((courses, ctx) => {
        const courseIds = courses.map((course) => course.courseId);

        const duplicateIds = courseIds.filter(
          (id, index) => courseIds.indexOf(id) !== index,
        );

        if (duplicateIds.length > 0) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate course is not allowed",
            path: [courseIds.indexOf(duplicateIds[0]!), "courseId"],
          });
        }
      }),
  }),
});

export const studentValidation = {
  admissionBodySchema,
  studentProfileValidationSchema,
  studentEnrollmentValidationSchema,
};
