import { ExamType, Role, UserStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { redisClient } from "../../lib/redis";
import type {
	ICourseMarks,
	ICreateExam,
	ISetPasswordPayload,
	ITokenPyalod,
	IUpdateTeacherProfile,
} from "./teachers.interface";
import bcrypt from "bcrypt";
class Teachers {
	async setPasswordDB(paylaod: ISetPasswordPayload) {
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

		const tokenPaylod: ITokenPyalod = JSON.parse(redisToken);

		const { token, email } = tokenPaylod;

		if (tokenId !== token) {
			throw new Error("unathorizeacces your token");
		}
		const passwordHash = await bcrypt.hash(
			password,
			Number(config.bycriptHashRound),
		);

		const result = await prisma.users.update({
			where: {
				email,
			},
			data: {
				password: passwordHash,
				emailVerified: true,
				status: UserStatus.ACTIVE,
			},
		});

		await redisClient.del(readisTokenKey);

		return result;
	}

	async updateTeacherProfile(paylaod: IUpdateTeacherProfile, userId: string) {
		const {
			phone,
			address,
			experience,
			bio,
			gender,
			dateOfBirth,
			designation,
			specialization,
			qualification,
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
				bio,
			},
		});

		return result;
	}

	async myExamCouresesCreatedDB(paylaod: ICreateExam) {
		const {
			courseId,
			semesterId,
			instructorId,
			examType,
			examDate,
			totalMarks,
		} = paylaod;

		const result = await prisma.exam.create({
			data: {
				courseId,
				semesterId,
				examDate,
				examType,
				totalMarks,
				instructorId,
			},
		});

		return result;
	}

	async myCoursesAssignDB(id: string) {
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
												isEnrolled: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		return result;
	}

	async courseMarks(payload: ICourseMarks) {
		const {
			studentId,
			courseId,
			semesterId,
			attendanceMarks,
			assignmentMarks,
			midMarks,
			finalExamMarks,
		} = payload;

		// Convert marks to number
		const attendance = Number(attendanceMarks);
		const assignment = Number(assignmentMarks);
		const mid = Number(midMarks);
		const finalExam = Number(finalExamMarks);

		// Check if marks already exist
		const existsMarksStudent = await prisma.courseMarks.findUnique({
			where: {
				studentId_courseId_semesterId: {
					studentId,
					courseId,
					semesterId,
				},
			},
		});

		if (existsMarksStudent) {
			throw new Error(
				"This student already has marks for this course and semester",
			);
		}

		// Find MIDTERM exam
		const exitExamMidMarks = await prisma.exam.findUnique({
			where: {
				courseId_semesterId_examType: {
					courseId,
					semesterId,
					examType: ExamType.MIDTERM,
				},
			},
		});

		if (!exitExamMidMarks) {
			throw new Error("Midterm exam not found for this course and semester");
		}

		// Validate MIDTERM marks
		if (mid > exitExamMidMarks.totalMarks) {
			throw new Error(
				`Midterm marks cannot exceed ${exitExamMidMarks.totalMarks}`,
			);
		}

		// Find FINAL exam
		const exitExamFinalMarks = await prisma.exam.findUnique({
			where: {
				courseId_semesterId_examType: {
					courseId,
					semesterId,
					examType: ExamType.FINAL,
				},
			},
		});

		if (!exitExamFinalMarks) {
			throw new Error("Final exam not found for this course and semester");
		}

		// Validate FINAL marks
		if (finalExam > exitExamFinalMarks.totalMarks) {
			throw new Error(
				`Final exam marks cannot exceed ${exitExamFinalMarks.totalMarks}`,
			);
		}

		// Calculate total marks
		const totalMarks = attendance + assignment + mid + finalExam;

		// Calculate grade and grade point
		let grade: string;
		let gradePoint: number;

		if (totalMarks >= 80) {
			grade = "A+";
			gradePoint = 4.0;
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
			gradePoint = 3.0;
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
			gradePoint = 2.0;
		} else {
			grade = "F";
			gradePoint = 0;
		}

		// Create CourseMarks + Result together
		const result = await prisma.$transaction(async (tx) => {
			// 1. Create CourseMarks
			const courseMarks = await tx.courseMarks.create({
				data: {
					studentId,
					courseId,
					semesterId,
					attendanceMarks: attendance,
					assignmentMarks: assignment,
					midMarks: mid,
					finalExamMarks: finalExam,
				},
			});

			// 2. Create Result using FINAL exam ID
			const finalResult = await tx.result.create({
				data: {
					studentId,
					totalMarks,
					grade,
					gradePoint,
					examId: exitExamFinalMarks.id,
				},
			});

			return {
				courseMarks,
				result: finalResult,
			};
		});

		return result;
	}
}

export default new Teachers();
