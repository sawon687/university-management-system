import { Role } from '../../generated/prisma/enums'
import config from '../config';
import { prisma } from '../lib/pirsma'
import bcrypt from "bcrypt"

export const adminSeed=async()=>{
     try {
        const adminExits=await prisma.users.findFirst({where:{
            role:Role.ADMIN
        }})

        if(adminExits){
            console.log("Super Admin Already Exists!");
			return;
        }

        const name=config.admin_name
        const email=config.admin_email
        const password=config.admin_password

        if(!name || !email || !password)
        {
             throw new Error("Super Admin Name , Email, Password Missing In Env File!!!")
        }

        const passwordHash=await bcrypt.hash(password,Number(config.bycriptHashRound))
        const superAdmin=await prisma.users.create({data:{
            name,
            email,
            password:passwordHash,
            role:Role.ADMIN,
            emailVerified:true
        }})
        
		console.log("Super Admin Created : ", superAdmin);
     } catch (error) {
         console.log("Error Seeding Super Admin : ", error);
     }
}