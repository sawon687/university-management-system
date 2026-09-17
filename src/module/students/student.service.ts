import { create } from "node:domain";
import {
	AdmissionStatus,
	type DegreeType,
	PaymentType,
	type Prisma,
} from "../../../generated/prisma/client";
import type {
	CourseWhereInput,
	FeeWhereInput,
	ProgramWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import type {
	IAdmissionApplication,
	ICourseQuery,
	IqueryProgram,
	IStudentEnrolement,
	IStudentProfile,
} from "./students.interface";

class StudentService {
	async updateProfileDB(payload: IStudentProfile) {
		const { phone, gender, dateOfBirth, address, studentId, departmentId } =
			payload;

		const result = await prisma.studentProfile.upsert({
			where: {
				studentId,
			},
			create: {
				phone,
				gender,
				dateOfBirth,
				address,
				studentId,
				departmentId,
			},
			update: {
				phone,
				gender,
				dateOfBirth,
				address,
			},
		});

		return result;
	}

	async getStudentProfile(id: string) {
		const result = await prisma.users.findUnique({
			where: { id },
			include: {
				studentProfile: true,
			},
			omit: {
				password: true,
			},
		});
		return result;
	}

	async admissionApplicationDB(payload: IAdmissionApplication) {
		const {
			userId,
			programId,
			previousDegree,
			previousInstitution,
			sscResult,
			hscResult,
			diplomaResult,
		} = payload;

		const applicationExists = await prisma.admissionApplication.findUnique({
			where: { id: userId },
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
				diplomaResult,
			},
		});

		return result;
	}

	async getAllProgram(query: IqueryProgram) {
		const { search, department, degreeType, page } = query;

		const whereProgramCondition: ProgramWhereInput = {};

		const searchNormalization = search?.trim() ?? null;
		const departmentNormalization = department?.trim() ?? null;
		const degreeTypeNormalization = degreeType?.trim() ?? null;

		// Search: Program name + Department name
		if (searchNormalization) {
			whereProgramCondition.OR = [
				{
					name: {
						contains: searchNormalization,
						mode: "insensitive",
					},
				},
				{
					department: {
						name: {
							contains: searchNormalization,
							mode: "insensitive",
						},
					},
				},
			];
		}

		// Department filter
		if (departmentNormalization && departmentNormalization !== "All") {
			whereProgramCondition.department = {
				code: departmentNormalization,
			};
		}

		// Degree type filter
		if (degreeTypeNormalization && degreeTypeNormalization !== "All") {
			whereProgramCondition.degreeType =
				degreeTypeNormalization.toUpperCase() as DegreeType;
		}

		// Pagination
		const limit = 6;
		const currentPage = Number(page) || 1;
		const skip = limit * (currentPage - 1);

		const [total, programs] = await Promise.all([
			prisma.program.count({
				where: whereProgramCondition,
			}),

			prisma.program.findMany({
				where: whereProgramCondition,
				skip,
				take: limit,
				include: {
					department: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			}),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			total,
			totalPages,
			currentPage,
			programs,
		};
	}

	async myApplication(id: string) {
		const result = await prisma.admissionApplication.findMany({
			where: { userId: id },
		});
		return result;
	}

	async stuedentEnrolement(payload: IStudentEnrolement) {
		const { semesterId, studentId, Enrolementcourses } = payload;

		const result = await prisma.$transaction(async (tx) => {
			// 1. Check already enrolled in this semester
			const existingEnrollment = await tx.enrollment.findUnique({
				where: {
					studentId_semesterId: {
						studentId,
						semesterId,
					},
				},
				include: {
					Enrolementcourses: {
						select: {
							courseId: true,
						},
					},
				},
			});

			if (existingEnrollment) {
				const alreadyEnrolledCourseIds =
					existingEnrollment.Enrolementcourses.map((course) => course.courseId);

				const duplicateCourses = Enrolementcourses.filter((course) =>
					alreadyEnrolledCourseIds.includes(course.courseId),
				);

				if (duplicateCourses.length > 0) {
					throw new Error(`One or more selected courses are already enrolled`);
				}

				throw new Error("Student is already enrolled in this semester");
			}

			//  Get semester information
			const semester = await tx.semester.findUnique({
				where: {
					id: semesterId,
				},
				select: {
					id: true,
					semesterNumber: true,
				},
			});

			if (!semester) {
				throw new Error("Semester not found");
			}

			const courseIds = Enrolementcourses.map((course) => course.courseId);

			//  First semester হলে prerequisite check লাগবে না
			if (semester.semesterNumber !== 1) {
				const prerequisites = await tx.prerequisiteCourse.findMany({
					where: {
						courseId: {
							in: courseIds,
						},
					},
					select: {
						courseId: true,
						prerequisiteCourseId: true,
						prerequisiteCourse: {
							select: {
								code: true,
								title: true,
							},
						},
					},
				});

				//  Check every prerequisite
				for (const prerequisite of prerequisites) {
					const prerequisiteResult = await tx.result.findFirst({
						where: {
							studentId,
							exam: {
								courseId: prerequisite.prerequisiteCourseId,
							},
						},
						select: {
							grade: true,
							gradePoint: true,
						},
					});

					if (!prerequisiteResult) {
						throw new Error(
							`You must complete prerequisite course ${prerequisite.prerequisiteCourse.code} before enrolling`,
						);
					}

					if (prerequisiteResult.grade === "F") {
						throw new Error(
							`You failed prerequisite course ${prerequisite.prerequisiteCourse.code}. You cannot enroll in this course`,
						);
					}
				}
			}

			//  Create enrollment
			const enrollment = await tx.enrollment.create({
				data: {
					semesterId,
					studentId,

					Enrolementcourses: {
						createMany: {
							data: Enrolementcourses,
						},
					},
				},

				include: {
					Enrolementcourses: {
						include: {
							course: {
								select: {
									program: {
										select: {
											perCreditFee: true,
										},
									},
									credit: true,
								},
							},
						},
					},
				},
			});

			// Calculate fee
			const courses = enrollment.Enrolementcourses.map((item) => item.course);

			const totalCredit = courses.reduce(
				(sum, course) => sum + Number(course.credit),
				0,
			);

			const perCreditFee = Number(courses[0]?.program?.perCreditFee ?? 0);

			const totalAmount = totalCredit * perCreditFee;

			const perInstallmentAmount = totalAmount / 3;

			// Create fee
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
					thirdInstallmentRemainingAmount: perInstallmentAmount,
				},
			});

			return {
				enrollment,
				fee,
			};
		});

		return result;
	}
	async GetfeeInstalmentDB(userId: string, semesterId: string) {
		const whereConditon: FeeWhereInput = {};

		whereConditon.studentId = userId;
		if (semesterId) {
			whereConditon.semesterId = semesterId.trim();
		}

		const result = await prisma.fee.findMany({ where: whereConditon });

		return result;
	}

	async myEnrolementDB(id: string) {
		const result = await prisma.enrollment.findMany({
			where: { studentId: id },
			include: {
				Enrolementcourses: {
					include: {
						course: {
							select: {
								title: true,
							},
						},
					},
				},
			},
		});

		return result;
	}

	async myCgpaDB(payload: Omit<IStudentEnrolement, "Enrolementcourses">) {
		const { studentId, semesterId } = payload;

		const results = await prisma.result.findMany({
			where: {
				studentId,
				exam: {
					semesterId,
				},
			},
			select: {
				gradePoint: true,
				exam: {
					select: {
						course: {
							select: {
								credit: true,
							},
						},
					},
				},
			},
		});

		const totalCredits = results.reduce(
			(sum, result) => sum + Number(result.exam.course.credit),
			0,
		);

		const totalPoints = results.reduce(
			(sum, result) =>
				sum + Number(result.gradePoint) * Number(result.exam.course.credit),
			0,
		);

		const gpa =
			totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

		const semesterResult = await prisma.gPAResult.upsert({
			where: {
				studentId_semesterId: { studentId, semesterId },
			},
			update: {
				totalPoints,
				totalCredits,
				gpa,
			},
			create: {
				semesterId,
				totalPoints,
				totalCredits,
				gpa,
				studentId,
			},
		});
		return semesterResult;
	}
	async getAllCourseDB(query: ICourseQuery) {
		const {
			search,
			semesterNumber,
			page = "1",
			limit = "6",
			departmentId,
		} = query;

		const currentPage = Math.max(Number(page), 1);
		const pageLimit = Math.max(Number(limit), 1);
		const skip = (currentPage - 1) * pageLimit;

		const andConditions: CourseWhereInput[] = [];

		// Department fixed from logged-in user
		if (departmentId) {
			andConditions.push({
				departmentId: departmentId,
			});
		}

		if (search) {
			andConditions.push({
				OR: [
					{
						title: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						code: {
							contains: search,
							mode: "insensitive",
						},
					},
				],
			});
		}

		if (semesterNumber) {
			andConditions.push({
				semesterNumber: Number(semesterNumber),
			});
		}

		const whereCondition: Prisma.CourseWhereInput = {
			AND: andConditions,
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
							name: true,
						},
					},

					program: {
						select: {
							name: true,
						},
					},

					courseAssign: {
						include: {
							instructor: {
								select: {
									id: true,
									name: true,
									email: true,
								},
							},
							semester: true,
						},
					},
				},

				orderBy: {
					createdAt: "desc",
				},
			}),

			prisma.course.count({
				where: whereCondition,
			}),
		]);

		const totalPage = Math.ceil(total / pageLimit);

		return {
			meta: {
				page: currentPage,
				limit: pageLimit,
				total,
				totalPage,
			},
			data: courses,
		};
	}
}

export default new StudentService();
