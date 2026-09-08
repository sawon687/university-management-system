import { AdmissionStatus, Gender, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/pirsma";
import { redisClient } from "../../lib/redis";
import { IUser } from "../auth/auth.interface";
import { IDepartment, IProgram, ITeacher } from "./admin.interface";
import crypto from "crypto";
class Admin {
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
  async updateStatusApplicationDB(id: string, status:AdmissionStatus) {
    const result = await prisma.admissionApplication.update({
      where: { id },
      data: { status },
    });
    return result
  }

  //   async createCourse(payload) {

  //   const result = await prisma.course.create({
      
  //   });
  //   return result
  // }
}

export default new Admin();
