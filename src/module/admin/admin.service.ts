import {
	type AdmissionStatus,
	CourseAssignmentStatus,
	type DegreeType,
	Gender,
	PaymentStatus,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";
import type {
	CourseWhereInput,
	SemesterUpdateInput,
	UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import { redisClient } from "../../lib/redis";
import type {
	ICourse,
	ICourseAssingTeacher,
	ICourseQuery,
	ICreatePrerequisite,
	IDepartment,
	IProgram,
	ISemester,
	ITeacher,
	IUpdateSemester,
	Query,
} from "./admin.interface";
import crypto from "crypto";
class AdminService {
	async createDepartmentDB(payload: IDepartment) {
		const { name, code, description } = payload;
		const departmentExits = await prisma.department.findUnique({
			where: { code },
		});
		if (departmentExits) {
			throw new Error("Already this department created");
		}

		const result = await prisma.department.create({
			data: {
				name,
				code,
				description: description ?? null,
			},
		});

		return result;
	}

	async getALLDepartmentDB() {
		const result = await prisma.department.findMany();
		return result;
	}

	async getAllUserDB(query: Query) {
		const { role, status, department } = query;

		const whereQuery: UsersWhereInput = {};
		const departmentNormalization = department?.trim() ?? null;
		if (role) {
			whereQuery.role = role.toLocaleUpperCase() as Role;
		}

		if (status) {
			whereQuery.userStatus = status.toLocaleUpperCase() as UserStatus;
		}

		if (departmentNormalization) {
			whereQuery.department = {
				code: departmentNormalization.toLocaleUpperCase(),
			};
		}
		console.log("WHERE:", JSON.stringify(whereQuery, null, 2));
		const result = await prisma.users.findMany({
			where: whereQuery,
			include: {
				instructorProfile: true,
			},
		});
		console.log("result", result);

		return result;
	}
	async teachersCreateDB(payload: ITeacher) {
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
						gender,
					},
				},
			},

			include: {
				instructorProfile: true,
			},
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
				EX: 60 * 60 * 24,
			},
		);
		return {
			tokenId: token,
		};
	}

	async createProgramDB(payload: IProgram) {
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
			totalFee,
		} = payload;

		const result = await prisma.program.create({
			data: {
				semester,
				semesterType,
				duration,
				departmentId,
				degreeType: degreeType as DegreeType,
				description,
				totalCredits,
				tuitionFee,
				name,
				code,
				admissionFee,
				isActive,
				perCreditFee,
				totalFee,
			},
		});

		return result;
	}
	async updateStatusApplicationDB(id: string, status: AdmissionStatus) {
		 if(!id){
			throw new Error('id is Emptay')
		 }
		const result = await prisma.admissionApplication.update({
			where: { id },
			data: { status },
		});
		return result;
	}

	async updateStatusUserDB(id: string, status: UserStatus, adminId: string) {
		if (!status) {
			throw new Error("Status is required");
		}

		if(!id){
			throw new Error ('user id is empty')
		}
		const oldUser = await prisma.users.findUnique({
			where: { id },
			select: {
				id: true,
				role: true,
				userStatus: true,
			},
		});

		if (!oldUser) {
			throw new Error("User not found");
		}

		if (
			oldUser.role === Role.INSTRUCTOR &&
			(status === UserStatus.GRADUATED || status === UserStatus.DROPPED)
		) {
			throw new Error("Instructor status cannot be changed to this status");
		}

		const result = await prisma.$transaction(async (tx) => {
			const updatedUser = await tx.users.update({
				where: { id },
				data: {
					status,
				},
			});

			await tx.auditLog.create({
				data: {
					userId: adminId,
					action: "STATUS_CHANGE",
					resource: "USER",
					resourceId: id,

					oldData: {
						status: oldUser.userStatus,
					},

					newData: {
						status: updatedUser.userStatus,
					},
				},
			});

			return updatedUser;
		});

		return result;
	}

	async createCourseDB(payload: ICourse) {
		const {
			code,
			departmentId,
			description,
			title,
			programId,
			credit,
			semesterNumber,
		} = payload;
		const departmentExits = await prisma.department.findUnique({
			where: { id: departmentId },
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
				semesterNumber,
			},
		});
		return result;
	}
	async createPrerequisiteDB(paylaod: ICreatePrerequisite) {
		const { courseId, prerequisiteCourseId } = paylaod;
		const result = await prisma.prerequisiteCourse.create({
			data: {
				courseId,
				prerequisiteCourseId,
			},
		});
		return result;
	}

	async createSemesterDB(paylaod: ISemester) {
		const { name, year, startDate, endDate } = paylaod;

		const exitsSemester = await prisma.semester.findUnique({
			where: { name_year: { name, year } },
		});

		if (exitsSemester) {
			throw new Error("This Semester is Already cretate");
		}
		const result = await prisma.semester.create({
			data: {
				name,
				year,
				startDate,
				endDate,
			},
		});
		return result;
	}

	async updateSemesterDB(paylaod: IUpdateSemester, id: string) {
		const { startDate, endDate, registrationOpen } = paylaod;
		const whereSemesterUpdte: SemesterUpdateInput = {};
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
			data: whereSemesterUpdte,
		});

		return result;
	}

	async getllStudentApplicationDB() {
		const result = await prisma.admissionApplication.findMany();

		return result;
	}

	async courseTeacherAssign(payload: ICourseAssingTeacher, adminId: string) {
		const { semesterId, courseId, instructorId } = payload;

		const existingAssignment = await prisma.courseAssignt.findUnique({
			where: {
				courseId_semesterId: {
					courseId,
					semesterId,
					
				},
			},
		});

		if (existingAssignment) {
			throw new Error(
				"This course is already assigned to an instructor for this semester",
			);
		}

		const result = await prisma.$transaction(async (tx) => {
			const assignment = await tx.courseAssignt.create({
				data: {
					semesterId,
					courseId,
					instructorId,
				},
			});

			const course = await tx.course.update({
				where: {
					id: courseId,
				},
				data: {
					status: CourseAssignmentStatus.ASSIGNED,
				},
			});

			await tx.auditLog.create({
				data: {
					userId: adminId,
					action: "ASSIGN",
					resource: "COURSE",
					resourceId: courseId,

					oldData: {
						assignment: null,
						courseStatus: CourseAssignmentStatus.UNASSIGNED,
					},

					newData: {
						semesterId,
						instructorId,
						courseStatus: course.status,
					},
				},
			});

			return assignment;
		});

		return result;
	}
	async getAllCourse(payload: ICourseQuery) {
		const { department, search } = payload;

		const departmentNor = department?.trim() || null;
		const searchNor = search?.trim() || null;

		const whereCondition: CourseWhereInput = {};

		if (departmentNor) {
			whereCondition.department = {
				code: departmentNor.toUpperCase(),
			};
		}

		if (searchNor) {
			whereCondition.OR = [
				{
					title: {
						contains: searchNor,
						mode: "insensitive",
					},
				},
				{
					code: {
						contains: searchNor,
						mode: "insensitive",
					},
				},
			];
		}

		const result = await prisma.course.findMany({
			where: whereCondition,
			include: {
				department: true,
			},
		});

		return result;
	}

	async getALLSemester() {
		const result = await prisma.semester.findMany();
		return result;
	}
	async dashboardStatsDB() {
		const [userCount, studentCoutn, instructorCount, TotalMoney] =
			await Promise.all([
				prisma.users.count(),
				prisma.users.count({ where: { role: Role.STUDENT } }),
				prisma.users.count({ where: { role: Role.INSTRUCTOR } }),
				prisma.payment.aggregate({
					where: { paymentStatus: PaymentStatus.PAID },
					_sum: {
						amount: true,
					},
				}),
			]);

		return { userCount, studentCoutn, instructorCount, TotalMoney };
	}

	async updateUserAdminRole(id: string, role: Role, adminId: string) {
		const oldUser = await prisma.users.findUnique({
			where: { id },
			select: {
				id: true,
				role: true,
			},
		});

		if (!oldUser) {
			throw new Error("User not found");
		}

		const result = await prisma.$transaction(async (tx) => {
			const result = await tx.users.update({
				where: { id },
				data: {
					role,
				},
			});

			await tx.auditLog.create({
				data: {
					userId: adminId,
					action: "ROLE_CHANGE",
					resource: "USER",
					resourceId: id,

					oldData: {
						role: oldUser.role,
					},

					newData: {
						role: result.role,
					},
				},
			});
		});
		return result;
	}

	async userDeletedDB(id: string, adminId: string) {
		if (!id) {
			throw new Error("user id is Emptay");
		}
		const oldUser = await prisma.users.findUnique({
			where: { id },
			select: {
				id: true,
				isDeleted: true,
			},
		});

		if (!oldUser) {
			throw new Error("User not found");
		}
		if (oldUser.isDeleted) {
			throw new Error("User is already deleted");
		}

		const result = await prisma.$transaction(async (tx) => {
			const result = await tx.users.update({
				where: { id },
				data: {
					isDeleted: true,
					deletedAt: new Date(),
				},
			});

			await tx.auditLog.create({
				data: {
					userId: adminId,
					action: "User Deleted",
					resource: "USER",
					resourceId: id,

					oldData: {
						isDeleted: false,
					},

					newData: {
						isDeleted: result.isDeleted,
					},
				},
			});
			return result;
		});
		return result;
	}
	async auditLogDB() {
		const result = await prisma.auditLog.findMany();
		return result;
	}
}

export default new AdminService();
