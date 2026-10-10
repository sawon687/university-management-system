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
        userStatus: UserStatus.ACTIVE,
      },
      omit: {
        password: true,
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

  async myExamCouresesCreatedDB(payload: ICreateExam) {
    const {
      courseId,
      semesterId,
      instructorId,
      examType,
      examDate,
      totalMarks,
    } = payload;

    if (!courseId) {
      throw new Error("Course ID is required");
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      throw new Error("This course does not exist");
    }

    const courseAssign = await prisma.courseAssignt.findUnique({
      where: {
        courseId_semesterId_instructorId: {
          courseId,
          semesterId,
          instructorId,
        },
      },
    });

    if (!courseAssign) {
      throw new Error(
        "This course is not assigned to this instructor for this semester",
      );
    }

    // Check if the same exam type already exists
    const existingExam = await prisma.exam.findUnique({
      where: {
        courseId_semesterId_examType: {
          courseId,
          semesterId,
          examType,
        },
      },
    });

    if (existingExam) {
      throw new Error(
        `An exam of type ${examType} already exists for this course and semester`,
      );
    }

    const result = await prisma.exam.create({
      data: {
        courseId,
        semesterId,
        examDate: new Date(examDate),
        examType,
        totalMarks,
        instructorId,
      },
    });

    return result;
  }

  async myCoursesAssignDB(id: string) {
    const result = await prisma.courseAssignt.findMany({
      where: {
        instructorId: id,
      },
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
                        userStatus: true,
                        studentProfile: {
                          select: {
                            departmentId: true,
                          },
                        },
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



  
async instructorDashboardStatsDB(instructorId: string) {
  const [assignedCourses, totalExams] = await Promise.all([
    prisma.courseAssignt.findMany({
      where: {
        instructorId,
      },
      select: {
        courseId: true,
        semesterId: true,
        course: {
          select: {
            courseEnrollment: {
              select: {
                enrollment: {
                  select: {
                    student: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.exam.count({
      where: {
        instructorId,
      },
    }),
  ]);

  // Unique students across the instructor's assigned courses
  const studentIds = new Set<string>();

  for (const assignment of assignedCourses) {
    for (const courseEnrollment of assignment.course.courseEnrollment) {
      const student = courseEnrollment.enrollment.student;

      if (student?.id) {
        studentIds.add(student.id);
      }
    }
  }

  // Count submitted marks for assigned course + semester combinations
  const assignmentConditions = assignedCourses.map((assignment) => ({
    courseId: assignment.courseId,
    semesterId: assignment.semesterId,
  }));

  const totalMarksSubmitted =
    assignmentConditions.length > 0
      ? await prisma.courseMarks.count({
          where: {
            OR: assignmentConditions,
          },
        })
      : 0;

  return {
    assignedCourseCount: assignedCourses.length,
    totalStudentCount: studentIds.size,
    totalExamCount: totalExams,
    totalMarksSubmitted,
  };
}


}

export default new Teachers();
