import { Request, Response } from 'express';
import { BaseController } from '../../utils/catchAsync';
import authService from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import statusCode from "http-status-codes"
import { prisma } from '../../lib/pirsma';
class AuthController extends BaseController{
    createStudent=this.handle(async(req:Request,res:Response)=>{
        const payload=req.body
        console.log('paylaod',payload)
      await authService.createDB(payload)
        
        sendResponse(res,{message:'Verifay OTP Send Pleace Check your Email',status:statusCode.OK,success:true})
    })
       verifayAccount=this.handle(async(req:Request,res:Response)=>{
          const paylaod=req.body
          const result=await authService.verifayAccountDB(paylaod)
             sendResponse(res,{message:'User Register is successFully',status:statusCode.OK,success:true,data:result})
    })

       login=this.handle(async(req:Request,res:Response)=>{
         const payload=req.body
         const result=await authService.loginDB(payload)

         if (!result) {
              throw new Error("User creation failed");
           }
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user login  successfully",
      status: statusCode.CREATED,
      data: { accessToken, refreshToken },
    });
    })

       me=this.handle(async(req:Request,res:Response)=>{
        
    })
}


export default new AuthController()