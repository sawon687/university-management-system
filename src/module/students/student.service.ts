import { AdmissionApplication, AdmissionStatus } from '../../../generated/prisma/client';
import { AdmissionApplicationWhereInput, UsersWhereInput } from '../../../generated/prisma/models';
import { prisma } from "../../lib/pirsma";
import { IAdmissionApplication, IStudentProfile } from "./students.interface";

class StudentService {
  async updateProfileDB(paylaod: IStudentProfile) {
    const { phone, gender, dateOfBirth, address, studentId } = paylaod;

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
      status:AdmissionStatus.PENDING,
      sscResult,
      hscResult,
      diplomaResult,
    },
  });

  return result;
}
}

export default new StudentService();
