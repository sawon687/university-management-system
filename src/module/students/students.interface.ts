export interface IStudentProfile {
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  studentId: string;
  departmentId: string;
}
export interface IAdmissionApplication {
  userId: string;
  programId: string;
  previousInstitution?: string;
  previousDegree?: string;
  sscResult?: number;
  hscResult?: number;
  diplomaResult?: number;
}

export interface IqueryProgram {
  search?: string;
  department?: string;
  degree?: "BSC" | "MSC" | "BA" | "BBA" | "MBA";
  page?: string;
  study?:string
}
export interface IEnrolementCorse {
  enrollmentId: string;
}
export interface IStudentEnrolement {
  studentId: string;
  semesterId: string;
  Enrolementcourses: { courseId: string }[];
}

export interface ICourseQuery {
  search?: string;
  departmentId: string;
  semesterNumber?: string;
  page?: string;
  limit?: string;
}
