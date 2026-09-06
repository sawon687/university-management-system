import { Request, Response } from 'express';
import { BaseController } from '../../utils/catchAsync';
import authService from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import statusCode from "http-status-codes"
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
        
    })

       me=this.handle(async(req:Request,res:Response)=>{
        
    })
}


export default new AuthController()