import { Gender, Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/pirsma';
import { redisClient } from '../../lib/redis';
import { IUser } from "../auth/auth.interface";
import { IDepartment, ITeacher } from './admin.interface';
import crypto from "crypto"
class Admin {
   async createDepartmentDB(paylaod:IDepartment){
    const {name,code,description}=paylaod
       const departmentExits=await prisma.department.findUnique({where:{code}})
       if(departmentExits)
       {
         throw new Error('Already this department created')
       }

       const result=await prisma.department.create({data:{
          name,
          code,
          description
       }})

       return result
   }

     async teachersCreateDB(
    paylaod:ITeacher
  ) {
    const { name, email, departmentId,gender } = paylaod;

    const result = await prisma.users.create({
      data: {
        name,
        email,
        role: Role.TEACHER,

        teacherProfile: {
          create: {
            teacherCode: `Tch-${crypto.randomUUID()}`,
            departmentId,
             gender
          
          },
        },
      },

      include: {
        teacherProfile: true,
      },
    });

    if(!result)
    {
       throw new Error('Teacher Not Created')
    }

    const token= crypto.randomBytes(32).toString('hex')

    const readisTokenKey=`teacher:${token}`
    await redisClient.set(readisTokenKey, JSON.stringify({ email: result.email, token }), {
      EX:60*60*24,
    })
    return {
       tokenId:token,
        
    }
  }
}


export default new Admin()
