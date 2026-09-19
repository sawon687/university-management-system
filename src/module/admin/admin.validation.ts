import { z } from "zod";
const createDepartmentValidationSchema = z.object({
	body: z.object({
		name: z.string().trim().min(1, "Department name is required"),

		code: z
			.string()
			.trim()
			.min(1, "Department code is required")
			.max(20, "Department code is too long"),

		description: z.string().trim().min(1, "Description is required"),
	}),
});

const createProgramValidationSchema = z.object({
	body: z.object({
		semester: z.number().int().positive(),

		semesterType: z.string().min(1, "Semester type is required"),

		duration: z.number().positive(),

		departmentId: z.string().uuid("Invalid department ID"),

		degreeType: z.string().min(1, "Degree type is required"),

		description: z.string().trim().min(1, "Description is required"),

		totalCredits: z.number().positive(),

		tuitionFee: z.number().nonnegative(),

		name: z.string().trim().min(1, "Program name is required"),

		code: z.string().trim().min(1, "Program code is required"),

		admissionFee: z.number().nonnegative(),

		isActive: z.boolean(),

		perCreditFee: z.number().nonnegative(),

		totalFee: z.number().nonnegative(),
	}),
});

const updateApplicationStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "PAID"]),
  }),

  
});
const updateUserStatusValidationSchema = z.object({
	body: z.object({
		status: z.enum([
			"PENDING",
			"ACTIVE",
			"INACTIVE",
			"GRADUATED",
			"SUSPENDED",
			"DROPPED",
		]),
	}),


	
});
const createCourseValidationSchema = z.object({
	body: z.object({
		code: z.string().trim().min(1, "Course code is required"),

		departmentId: z.string().uuid("Invalid department ID"),

		description: z.string().trim().min(1, "Description is required"),

		title: z.string().trim().min(1, "Course title is required"),

		programId: z.string().uuid("Invalid program ID"),

		credit: z.number().positive("Credit must be greater than 0"),

		semesterNumber: z.number().int().positive(),
	}),
});

const createPrerequisiteValidationSchema = z.object({
	body: z.object({
		courseId: z.string().uuid("Invalid course ID"),

		prerequisiteCourseId: z.string().uuid("Invalid prerequisite course ID"),
	}),
});

const createSemesterValidationSchema = z.object({
	body: z.object({
		name: z.string().trim().min(1, "Semester name is required"),

		year: z.number().int().min(2000),

		startDate: z.coerce.date({
			message: "Invalid start date",
		}),

		endDate: z.coerce.date({
			message: "Invalid end date",
		}),
	}),
});

const courseTeacherAssignValidationSchema = z.object({
	body: z.object({
		semesterId: z.string().uuid("Invalid semester ID"),

		instructorId: z.string().uuid("Invalid instructor ID"),
	}),


		
	
});
export const adminValidation = {
	createDepartmentValidationSchema,
	createProgramValidationSchema,
	updateApplicationStatusValidationSchema,
	updateUserStatusValidationSchema,
	createCourseValidationSchema,
	createPrerequisiteValidationSchema,
	createSemesterValidationSchema,
	courseTeacherAssignValidationSchema,
};
