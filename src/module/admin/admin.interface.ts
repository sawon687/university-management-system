import { Gender, Role, SemesterCode, SemesterType, StudentStatus } from '../../../generated/prisma/enums';

export interface IDepartment {
  name: string;
  code: string;
  description?: string;
}

export interface ITeacher{
  name:string,
  email:string,
  departmentId: string, 
  gender:Gender
  
}

export interface IProgram {
  
  departmentId: string;
  name: string;
  code: string;
  semester:number   
  semesterType:SemesterType
  degreeType: string;
  duration: number;
  totalCredits: number;
  description: string;
  admissionFee: number;
  tuitionFee: number;
  isActive: boolean;
  perCreditFee:number
  totalFee:number
  
}

 
export interface ICourse{
  title:string,
  code:string,
   description:string
    departmentId:string
     programId:string
       credit :number
  
}

export interface Query{
    role:Role,
    status:StudentStatus

}

export interface  ICreatePrerequisite{
  courseId:string,
 prerequisiteCourseId:string,
}

export interface ISemester{

  name:string      
  code:SemesterCode             
  year:number            

  startDate:string
  endDate:string
}

export interface IUpdateSemester{
   startDate?:string
  endDate?:string
  registrationOpen?:boolean
}