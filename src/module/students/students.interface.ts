

export interface IStudentProfile {
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  studentId: string;
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
  degreeType?: string;
  page?: string;
}
export interface IEnrolementCorse{
  enrollmentId:string

}
export interface IStudentEnrolement{
       studentId:  string
       semesterId: string
       courseId:string
}
