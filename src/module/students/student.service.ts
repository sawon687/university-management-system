import {
  AdmissionStatus,
  DegreeType,
  PaymentType,
} from "../../../generated/prisma/client";
import {
  AdmissionApplicationWhereInput,
  FeeWhereInput,
  ProgramWhereInput,
  UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import {
  IAdmissionApplication,
  IqueryProgram,
  IStudentEnrolement,
  IStudentProfile,
} from "./students.interface";

class StudentService {
  async updateProfileDB(paylaod: IStudentProfile) {
    const { phone, gender, dateOfBirth, address, studentId, departmentId } =
      paylaod as IStudentProfile & {
        departmentId: string;
      };

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
  async getAllCourseDB(departmentId: string) {
    const result = await prisma.course.findMany({
      where: { departmentId },
    });
    return result;
  }

  async stuedentEnrolement(payload: IStudentEnrolement) {
    const { semesterId, studentId, Enrolementcourses } = payload;

    const result = await prisma.$transaction(async (tx) => {
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

      const courses = enrollment.Enrolementcourses.map((item) => item.course);

      const totalCredit = courses.reduce(
        (sum, course) => sum + Number(course.credit),
        0,
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
      whereConditon.semesterId = semesterId;
    }

    const result = await prisma.fee.findMany({ where: whereConditon });

    return result;
  }

  async myEnrolementDB(id: string) {
    const result = await prisma.enrollment.findMany({
      where: { studentId: id },
      include: {
        Enrolementcourses: true,
      },
    });

    return result;
  }
}

export default new StudentService();
