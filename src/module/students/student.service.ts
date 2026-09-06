import { prisma } from '../../lib/pirsma';
import { IStudentProfile } from './students.interface';


class StudentService{
 async updateProfileDB(paylaod:IStudentProfile){
    const {phone,gender,dateOfBirth,address,studentId}=paylaod
         
      const result= await prisma.studentProfile.upsert({where:{
        studentId
      },
      create:{
        phone,
        gender,
        dateOfBirth,
        address,
        studentId
      },
      update:{
        phone,
        gender,
        dateOfBirth,
        address,
        
      }
    })

    return result
    }
}

export default new StudentService()