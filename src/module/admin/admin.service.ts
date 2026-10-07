import { includes } from "zod";
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
  DepartmentWhereInput,
  ProgramWhereInput,
  SemesterUpdateInput,
  UsersWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/pirsma";
import ejs from "ejs";
import { IqueryProgram } from "../students/students.interface";
import bcrypt from "bcrypt";
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
import { passwordGenerator } from "../../utils/randomPasswordGenaretor";
import config from "../../config";
import { transporter } from "../../lib/nodemiler";
import path from "path";
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

  async getALLDepartmentDB(search: string) {
    const condition: DepartmentWhereInput[] = [];
    const searchNormalization = search ?? "";

    if (searchNormalization) {
      condition.push({
        OR: [
          {
            name: {
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

    const result = await prisma.department.findMany({
      where: { AND: condition },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            program: true,
            course: true,
          },
        },
      },
    });

    return result;
  }

  async getAllUserDB(query: Query) {
    const { role, status, department, search } = query;
        console.log(`role:${role},status:${status},deparmtent:${department} search:${search}`)
    const whereQuery: UsersWhereInput = {};
    const departmentNormalization = department?.trim() ?? null;
     const searchNormalization=search?.trim()?? null
    if (role) {
      whereQuery.role = role.toLocaleUpperCase() as Role;
    }

    if (status) {
      whereQuery.userStatus = status.toLocaleUpperCase() as UserStatus;
    }

    const userProfile =
      role === Role.STUDENT
        ? "studentProfile"
        : role === Role.INSTRUCTOR
          ? "instructorProfile"
          : null;

    if (departmentNormalization && userProfile) {
      whereQuery[userProfile] = {
        department: {
          code: departmentNormalization.toLocaleUpperCase(),
        },
      };
    } else if (departmentNormalization) {
      whereQuery.OR = [
        {
          studentProfile: {
            department: {
              code: departmentNormalization.toLocaleUpperCase(),
            },
          },
        },
        {
          instructorProfile: {
            department: {
              code: departmentNormalization.toLocaleUpperCase(),
            },
          },
        },
      ];
    }

    if(searchNormalization){
         whereQuery.OR=[
            {
               name:{
                contains:searchNormalization,
                mode:'insensitive'
               }

            },
            {
               email:{
                contains:searchNormalization,
                mode:'insensitive'
               }
            }
           
         ]
    }
    // if(query.search.tr)
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

    const password = passwordGenerator(12);

    const passwordHash = await bcrypt.hash(
      password,
      Number(config.bycriptHashRound),
    );

    const result = await prisma.users.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: Role.INSTRUCTOR,
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
    if (config.node_env === "development") {
      console.log(`password instrutor: ${password}`);
    }
    const templatesPath = path.join(
      process.cwd(),
      `/src/templates/instructor-created.ejs`,
    );

    const templateData = {
      name: result.name,
      email: result.email,
      teacherCode: result.instructorProfile?.teacherCode,
      password,
      loginUrl: `${config.frontendUrl}/auth/login`,
    };
    const html = await ejs.renderFile(templatesPath, templateData);
    console.log("html", templateData);
    await transporter.sendMail({
      from: config.smt_user,
      to: result.email,
      subject: "Your UniSphere Instructor Account",
      html,
    });

    return result;
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
    if (!id) {
      throw new Error("id is Emptay");
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

    if (!id) {
      throw new Error("user id is empty");
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
          userStatus: status,
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
    if (!id) {
      throw new Error("Semester id not proivides");
    }
    const semesterExits = await prisma.semester.findUnique({ where: { id } });
    if (!semesterExits) {
      throw new Error("semester not provides");
    }
    const whereSemesterUpdte: SemesterUpdateInput = {};
    if (startDate?.trim()) {
      whereSemesterUpdte.startDate = startDate.trim();
    }
    if (endDate?.trim()) {
      whereSemesterUpdte.endDate = endDate.trim();
    }
    if (registrationOpen == true || registrationOpen == false) {
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
    console.log("programs", programs);
    return {
      total,
      totalPages,
      currentPage,
      programs,
    };
  }

  async getCourseAssignmentDataDB(query: ICourseQuery) {
    console.log("query", query.departmentId);
    const departmentIdNor = query.departmentId?.trim() || null;

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 6, 1);

    const skip = (page - 1) * limit;

    const whereCoursesCondition: CourseWhereInput[] = [];
    const whereInstructorCondition: UsersWhereInput[] = [];

    // Department filter for courses
    if (departmentIdNor) {
      whereCoursesCondition.push({
        departmentId: departmentIdNor,
      });
    }

    // Course search
    if (query.courseSearch?.trim()) {
      whereCoursesCondition.push({
        OR: [
          {
            title: {
              contains: query.courseSearch.trim(),
              mode: "insensitive",
            },
          },
          {
            code: {
              contains: query.courseSearch.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    // Instructor filter
    whereInstructorCondition.push({
      role: Role.INSTRUCTOR,
      deletedAt: null,
    });

    // Instructor department filter
    if (departmentIdNor) {
      whereInstructorCondition.push({
        instructorProfile: {
          departmentId: departmentIdNor,
        },
      });
    }

    // Instructor search
    if (query.instructorSearch?.trim()) {
      whereInstructorCondition.push({
        OR: [
          {
            name: {
              contains: query.instructorSearch.trim(),
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query.instructorSearch?.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    const [course, instructor, totalCourse] = await Promise.all([
      prisma.course.findMany({
        where: {
          AND: whereCoursesCondition,
        },
        include: {
          department: true,
        },
        take: limit,
        skip,
      }),

      prisma.users.findMany({
        where: {
          AND: whereInstructorCondition,
        },
        include: {
          instructorProfile: {
            select: {
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.course.count({
        where: {
          AND: whereCoursesCondition,
        },
      }),
    ]);
    const totalpage = Math.ceil(Number(totalCourse) / Number(query.limit));
    return {
      course,
      instructor,
      meta: {
        totalpage,
        page,
        limit,
      },
    };
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
