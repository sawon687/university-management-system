import {
  AdmissionStatus,
  Gender,
  Role,
  UserStatus,
} from "../../../generated/prisma/enums";
import {
  SemesterUpdateInput,
  UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import { redisClient } from "../../lib/redis";
import {
  ICourse,
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
        description,
      },
    });

    return result;
  }

  async getALLDepartmentDB() {
    const result = await prisma.department.findMany();
    return result;
  }

  async getAllUserDB(queray: Query) {
    const { role, status } = queray;
    const whereQuery: UsersWhereInput = {};
    if (role) {
      whereQuery.role = role;
    }
    if (status) {
      whereQuery.status = status;
    }
    const result = await prisma.users.findMany({ where: whereQuery });
    return result;
  }

  async teachersCreateDB(payload: ITeacher) {
    const { name, email, departmentId, gender } = payload;

    const result = await prisma.users.create({
      data: {
        name,
        email,
        role: Role.INSTRUCTOR,

        teacherProfile: {
          create: {
            teacherCode: `Tch-${crypto.randomUUID()}`,
            departmentId,
            gender,
          },
        },
      },

      include: {
        teacherProfile: true,
      },
    });

    if (!result) {
      throw new Error("Teacher Not Created");
    }

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
      },
    });

    return result;
  }
  async updateStatusApplicationDB(id: string, status: AdmissionStatus) {
    const result = await prisma.admissionApplication.update({
      where: { id },
      data: { status },
    });
    return result;
  }

  async updateStatusUserDB(id: string, status: UserStatus) {
    if (!status) {
      throw new Error("status is empty");
    }
    const result = await prisma.users.update({
      where: { id },
      data: {
        status,
      },
    });
    return result;
  }

  async createCourseDB(payload: ICourse) {
    const { code, departmentId, description, title, programId, credit } =
      payload;
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
    const { name, year, code, startDate, endDate } = paylaod;
    const result = await prisma.semester.create({
      data: {
        name,
        year,
        code,
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
}

export default new AdminService();
