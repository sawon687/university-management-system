import { Role, StudentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { redisClient } from "../../lib/redis";
import { ICreateTeacherProfile, ISetPasswordPayload, ITokenPyalod, IUpdateTeacherProfile } from "./teachers.interface";
import bcrypt from "bcrypt";
class Teachers {
  async setPasswordDB(paylaod: ISetPasswordPayload) {
    const { password, confirmPassword, tokenId } = paylaod;
       if(!tokenId){
        throw new Error("token is emapty pleace token")
    }
    const readisTokenKey = `teacher:${tokenId}`;
    const redisToken = await redisClient.get(readisTokenKey);
    if (password !== confirmPassword) {
      throw new Error("confirm password doesnot match");
    }
 
    if (!redisToken) {
      throw new Error("Token is invalid or expired");
    }

    const tokenPaylod: ITokenPyalod = JSON.parse(redisToken);

    const { token, email } = tokenPaylod;

    if (tokenId !== token) {
      throw new Error("unathorizeacces your token");
    }
    const passwordHash = await bcrypt.hash(
      password,
      Number(config.bycriptHashRound),
    );

    const result = await prisma.users.update({
      where: {
        email,
      },
      data: {
        password: passwordHash,
        emailVerified: true,
        status: StudentStatus.ACTIVE,
      },
    });
    
    
      await redisClient.del(readisTokenKey)

     return result
  }

  async updateTeacherProfile(paylaod:IUpdateTeacherProfile,userId:string){
     const {phone,address,experience,bio,gender,dateOfBirth,designation,specialization,qualification}=paylaod

     const result=await prisma.teacherProfile.update({where:{userId},data:{
        experience,
        phone,
        gender,
        dateOfBirth,
        designation,
        specialization,
        qualification,
        address,
        bio
     }})

     return result
     
  }
}

export default new Teachers();
