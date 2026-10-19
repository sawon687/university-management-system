import { create } from "node:domain";
import {
  AdmissionStatus,
  type DegreeType,
  PaymentType,
  Prisma,
  SemesterType,
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
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../lib/cloudinary";
import { uploadToCloudinary } from "../../utils/cludinaryfileuploaded";

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
        departmentId,
      },
    });

    return result;
  }

  async admissionApplicationDB(
    payload: IAdmissionApplication,
    sscFile: Express.Multer.File,
    hscFile: Express.Multer.File,
    diplomaFile?: Express.Multer.File,
  ) {
    const { userId, programId, educationType } = payload;

    // 1. Check if user has already applied
    const applicationExists = await prisma.admissionApplication.findUnique({
      where: { userId },
    });

    if (applicationExists) {
      throw new Error("This user has already submitted an application");
    }

    // 2. Required SSC document
    if (!sscFile) {
      throw new Error("SSC result document is required");
    }

    // 3. Required HSC document for HSC students
    if (educationType === "HSC" && !hscFile) {
      throw new Error("HSC result document is required");
    }

    // 4. Cloudinary folder
    const folderPath = "university-management/admission";

    // 5. Helper to determine Cloudinary resource type
    const getResourceType = (file: Express.Multer.File): "image" | "raw" => {
      if (file.mimetype.startsWith("image/")) {
        return "image";
      }

      if (file.mimetype === "application/pdf") {
        return "raw";
      }

      throw new Error(`Unsupported file type: ${file.mimetype}`);
    };

    // 6. SSC upload
    const sscResourceType = getResourceType(sscFile);

    const sscResultData = await uploadToCloudinary(
      sscFile.buffer,
      folderPath,
      sscResourceType,
    );

    // 7. HSC upload
    let hscResultData = null;

    if (hscFile) {
      const hscResourceType = getResourceType(hscFile);

      hscResultData = await uploadToCloudinary(
        hscFile.buffer,
        folderPath,
        hscResourceType,
      );
    }

    // 8. Diploma upload
    let diplomaResultData = null;

    if (diplomaFile) {
      const diplomaResourceType = getResourceType(diplomaFile);

      diplomaResultData = await uploadToCloudinary(
        diplomaFile.buffer,
        folderPath,
        diplomaResourceType,
      );
    }

    // 9. Create admission application
    const result = await prisma.admissionApplication.create({
      data: {
        userId,
        programId,
        educationType: educationType || "HSC",

        status: AdmissionStatus.PENDING,

        sscResult: sscResultData,

        hscResult: hscResultData ?? Prisma.DbNull,

        diplomaResult: diplomaResultData ?? Prisma.DbNull,
      },
    });

    return result;
  }
  async getAllProgram(query: IqueryProgram) {
    const { search, department, degree, page, study } = query;

    const whereProgramCondition: ProgramWhereInput = {};

    const searchNormalization = search?.trim() ?? null;
    const departmentNormalization = department?.trim() ?? null;
    const degreeTypeNormalization = degree?.trim() ?? null;
    const studyNor = study?.trim() ?? null;
    console.log("deaprmten", departmentNormalization);
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
        {
          description: {
            contains: searchNormalization,
            mode: "insensitive",
          },
        },
      ];
    }

    // Department filter
    if (
      departmentNormalization &&
      departmentNormalization !== "All Deprtment"
    ) {
      whereProgramCondition.department = {
        code: departmentNormalization,
      };
    }

    // semester type

    if (studyNor && study !== "All") {
      whereProgramCondition.semesterType = studyNor as SemesterType;
    }
    // Degree type filter

    if (degreeTypeNormalization && degreeTypeNormalization !== "All") {
      whereProgramCondition.degreeType = degreeTypeNormalization as DegreeType;
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

    const totalPage = Math.ceil(total / limit);

    return {
      programs,
      meta: {
        total,
        totalPage,
        currentPage,
        limit,
      },
    };
  }

  async getDetailsProgramDB(id: string) {
    if (!id) {
      throw new Error("details page id is Empty");
    }
    const result = await prisma.program.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    return result;
  }

  async myApplication(id: string) {
    const result = await prisma.admissionApplication.findUnique({
      where: { userId: id },
      include: {
        user: true,
        program: {
          include: {
            department: true,
          },
        },
      },
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

      //  First semester not allow
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
          const prerequisiteResult = await tx.studentSubjectResult.findFirst({
            where: {
              studentId,
              courseId: prerequisite.prerequisiteCourseId,
            },
            select: {
              gradePoint: true,
            },
          });

          if (!prerequisiteResult) {
            throw new Error(
              `You must complete prerequisite course ${prerequisite.prerequisiteCourse.code} before enrolling`,
            );
          }

          if (Number(prerequisiteResult.gradePoint) === 0) {
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
    if (!semesterId) {
      throw new Error("Pleace selectd your semester");
    }

    const result = await prisma.fee.findUnique({
      where: {
        studentId_semesterId: {
          studentId: userId,
          semesterId,
        },
      },
    });

    return result;
  }

  async myEnrolementDB(id: string, semesterId: string) {
    const result = await prisma.enrollment.findUnique({
      where: {
        studentId_semesterId: {
          studentId: id,
          semesterId,
        },
      },
      include: {
        Enrolementcourses: {
          include: {
            course: {
              include: {
                department: true,
              },
            },
          },
        },
      },
    });

    const totalCredit =
      result?.Enrolementcourses.reduce(
        (total, enrollmentCourse) => total + enrollmentCourse.course.credit,
        0,
      ) ?? 0;

    return {
      ...result,
      totalCredit,
    };
  }
  async mySemesterDB(userId: string) {
    const result = await prisma.semester.findMany({
      where: {
        enrollments: {
          some: {
            studentId: userId,
          },
        },
      },
    });

    return result;
  }


async getSemesterResult(payload: {
  studentId: string;
  semesterId: string;
}) {
  const { studentId, semesterId } = payload;

  const [enrollment, results] = await Promise.all([

    prisma.enrollment.findUnique({
      where: {
        studentId_semesterId: {
          studentId,
          semesterId,
        },
      },
      select: {
        semester: {
          select: {
            id: true,
            name: true,
            year: true,
          },
        },
        Enrolementcourses: {
          select: {
            course: {
              select: {
                id: true,
                title: true,
                code: true,
                credit: true,
              },
            },
          },
        },
      },
    }),


    prisma.studentSubjectResult.findMany({
      where: {
        studentId,
        semesterId,
      },
      select: {
        courseId: true,
        grade: true,
        gradePoint: true,
      },
    }),
  ]);

  if (!enrollment) {
    return {
      studentId,
      semesterId,
      semester: null,
      gpa: 0,
      totalCredits: 0,
      totalPoints: 0,
      totalSubjects: 0,
      subjects: [],
    };
  }


  const resultMap = new Map(
    results.map((result) => [
      result.courseId,
      {
        grade: result.grade,
        gradePoint: Number(result.gradePoint),
      },
    ]),
  );

  let totalCredits = 0;
  let totalPoints = 0;

  const subjects = enrollment.Enrolementcourses.map(({ course }) => {
    const credit = Number(course.credit);
    const result = resultMap.get(course.id);

    const grade = result?.grade ?? null;

    const gradePoint =
      result && Number.isFinite(result.gradePoint)
        ? result.gradePoint
        : null;

 
    if (
      gradePoint !== null &&
      Number.isFinite(credit) &&
      credit > 0
    ) {
      totalCredits += credit;
      totalPoints += credit * gradePoint;
    }

    return {
      courseId: course.id,
      courseName: course.title,
      courseCode: course.code,
      credit,
      grade,
      gradePoint,
    };
  });

  const gpa =
    totalCredits > 0
      ? Number((totalPoints / totalCredits).toFixed(2))
      : 0;

  return {
    studentId,
    semesterId,
    semester: enrollment.semester,
    gpa,
    totalCredits,
    totalPoints: Number(totalPoints.toFixed(2)),
    totalSubjects: subjects.length,
    subjects,
  };
}

  async getMyCgpa(studentId: string) {
    const results = await prisma.studentSubjectResult.findMany({
      where: {
        studentId,
      },
      select: {
        gradePoint: true,
        course: {
          select: {
            credit: true,
          },
        },
      },
    });
    console.log('gap result',results)

    let totalCredits = 0;
    let totalPoints = 0;

    for (const result of results) {
      const credit = Number(result.course.credit);
      const gradePoint = Number(result.gradePoint);

      if (
        Number.isFinite(credit) &&
        Number.isFinite(gradePoint) &&
        credit > 0
      ) {
        totalCredits += credit;
        totalPoints += credit * gradePoint;
      }
    }

    const cgpa =
      totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;

    return {
      studentId,
      cgpa,
      totalCredits,
      totalPoints: Number(totalPoints.toFixed(2)),
    };
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

  async getStudentDashboardDB(studentId: string) {
    if (!studentId) {
      throw new Error("Student ID is required");
    }

    const [
      student,
      studentProfile,
      admissionApplication,
      enrollments,
      gpaResults,
      fees,
      totalResults,
    ] = await Promise.all([
      // 1. Student basic information + profile photo
      prisma.users.findUnique({
        where: {
          id: studentId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          studentProfile: {
            select: {
              profilePhoto: true,
            },
          },
        },
      }),

      // 2. Student profile details
      prisma.studentProfile.findUnique({
        where: {
          studentId,
        },
      }),

      // 3. Admission application
      prisma.admissionApplication.findUnique({
        where: {
          userId: studentId,
        },
        include: {
          program: {
            include: {
              department: true,
            },
          },
        },
      }),

      // 4. Student enrollments
      prisma.enrollment.findMany({
        where: {
          studentId,
        },
        include: {
          semester: true,
          Enrolementcourses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  code: true,
                  credit: true,
                },
              },
            },
          },
        },
      }),

      // 5. GPA results
      prisma.gPAResult.findMany({
        where: {
          studentId,
        },
        include: {
          semester: true,
        },
      }),

      // 6. Student fees
      prisma.fee.findMany({
        where: {
          studentId,
        },
      }),

      // 7. Total result count
      prisma.studentSubjectResult.count({
        where: {
          studentId,
        },
      }),
    ]);

    if (!student) {
      throw new Error("Student not found");
    }

    // Total enrolled courses
    const totalCourses = enrollments.reduce(
      (total, enrollment) => total + enrollment.Enrolementcourses.length,
      0,
    );

    // Total credits
    const totalCredits = enrollments.reduce(
      (total, enrollment) =>
        total +
        enrollment.Enrolementcourses.reduce(
          (courseTotal, item) => courseTotal + Number(item.course.credit),
          0,
        ),
      0,
    );

    // Total fees
    const totalFees = fees.reduce(
      (total, fee) => total + Number(fee.totalAmount),
      0,
    );

    // Total paid amount
    const totalPaid = fees.reduce(
      (total, fee) =>
        total +
        Math.max(0, Number(fee.totalAmount) - Number(fee.remainingAmount)),
      0,
    );

    // Total outstanding amount
    const totalDue = fees.reduce(
      (total, fee) => total + Number(fee.remainingAmount),
      0,
    );

    return {
      student,
      studentProfile,
      admissionApplication,

      statistics: {
        enrolledSemesters: enrollments.length,
        totalCourses,
        totalCredits,
        totalResults,
        totalFees,
        totalPaid,
        totalDue,
      },

      enrollments,
      gpaResults,
      fees,
    };
  }
}

export default new StudentService();
