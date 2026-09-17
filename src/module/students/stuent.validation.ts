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
	}),
});

const admissionBodySchema = z.object({
	body: z
		.object({
			programId: z.string().uuid("Program ID is required"),

			previousDegree: z.string().trim().min(1, "Previous degree is required"),

			previousInstitution: z
				.string()
				.trim()
				.min(1, "Previous institution is required"),

			sscResult: z.number().min(0).max(5),

			hscResult: z.number().min(0).max(5).optional(),

			diplomaResult: z.number().min(0).max(4).optional(),
		})
		.refine(
			(data) =>
				data.hscResult !== undefined || data.diplomaResult !== undefined,
			{
				message: "Either HSC result or Diploma result is required",
			},
		),
});

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
						path: [courseIds.indexOf(duplicateIds[0]), "courseId"],
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
