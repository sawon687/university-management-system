import { Gender } from '../../../generated/prisma/enums';

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