import type {
	Gender,
	Role,
	SemesterCode,
	SemesterType,
	UserStatus,
} from "../../../generated/prisma/enums";

export interface IDepartment {
	name: string;
	code: string;
	description?: string;
}

export interface ITeacher {
	name: string;
	email: string;
	departmentId: string;
	gender: Gender;
}

export interface IProgram {
	departmentId: string;
	name: string;
	code: string;
	semester: number;
	semesterType: SemesterType;
	degreeType: string;
	duration: number;
	totalCredits: number;
	description: string;
	admissionFee: number;
	tuitionFee: number;
	isActive: boolean;
	perCreditFee: number;
	totalFee: number;
}

export interface ICourse {
	title: string;
	code: string;
	description: string;
	departmentId: string;
	programId: string;
	credit: number;
	semesterNumber: number;
}

export interface Query {
	role: Role;
	status: UserStatus;
	department: string;
}

export interface ICreatePrerequisite {
	courseId: string;
	prerequisiteCourseId: string;
}

export interface ISemester {
	name: SemesterCode;
	year: number;

	startDate: string;
	endDate: string;
}

export interface IUpdateSemester {
	startDate?: string;
	endDate?: string;
	registrationOpen?: boolean;
}

export interface ICourseAssingTeacher {
	courseId: string;
	instructorId: string;
	semesterId: string;
}

export interface ICourseQuery {
	department: string;
	search: string;
}
