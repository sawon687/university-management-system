import { randomInt } from "crypto";
import {
  AdmissionApplication,
  AdmissionStatus,
  DegreeType,
  ProgramType,
} from "../../../generated/prisma/client";
import {
  AdmissionApplicationWhereInput,
  ProgramWhereInput,
  UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import {
  IAdmissionApplication,
  IqueryProgram,
  IStudentProfile,
} from "./students.interface";

class StudentService {
  async updateProfileDB(paylaod: IStudentProfile) {
    const {
      phone,
      gender,
      dateOfBirth,
      address,
      studentId,
      studentIDNO,
      departmentId,
    } = paylaod as IStudentProfile & {
      studentIDNO: string;
      departmentId: string;
    };
    const deparmentIdno = `stu-${randomInt(8)}`;
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
        studentIDNO: deparmentIdno,
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
    const { programType, search, department, degreeType, page } = query;

    const whereProgramCondition: ProgramWhereInput = {};

    const searchNormalization = search?.trim() ?? null;
    const departmentNormalization = department?.trim() ?? null;
    const programTypeNormalization = programType?.trim() ?? null;
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
        name: departmentNormalization,
      };
    }

    // Degree type filter
    if (degreeTypeNormalization && degreeTypeNormalization !== "All") {
      whereProgramCondition.degreeType = degreeTypeNormalization as DegreeType;
    }

    // Program type filter
    if (programTypeNormalization && programTypeNormalization !== "All") {
      whereProgramCondition.code = programTypeNormalization as ProgramType;
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
}

export default new StudentService();
