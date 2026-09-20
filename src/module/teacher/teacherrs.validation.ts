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
			.min(11, "Phone number must be at least 11 characters")
			.optional(),

		address: z.string().trim().min(1, "Address cannot be empty").optional(),

		experience: z.coerce
			.string()
			.min(0, "Experience cannot be negative")
			.optional(),

		bio: z
			.string()
			.trim()
			.max(500, "Bio cannot exceed 500 characters")
			.optional(),

		gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

		dateOfBirth: z.coerce.date().optional(),

		designation: z.string().trim().min(1, "Designation is required").optional(),

		specialization: z
			.string()
			.trim()
			.min(1, "Specialization is required")
			.optional(),

		qualification: z
			.string()
			.trim()
			.min(1, "Qualification is required")
			.optional(),
	}),
});

export const createExamValidationSchema = z.object({
	body: z.object({
		courseId: z.string().trim().min(1, "Course ID is required"),

		semesterId: z.string().trim().min(1, "Semester ID is required"),

		instructorId: z.string().trim().min(1, "Instructor ID is required"),

		examType: z.enum(["MIDTERM", "FINAL"]),

		examDate: z.coerce.date({
			message: "Valid exam date is required",
		}),

		totalMarks: z.coerce
			.number()
			.positive("Total marks must be greater than 0"),
	}),
});

export const courseMarksValidationSchema = z.object({
	body: z.object({
		studentId: z.string().trim().min(1, "Student ID is required"),

		courseId: z.string().trim().min(1, "Course ID is required"),

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
