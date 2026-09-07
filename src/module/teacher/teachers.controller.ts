import { Request, Response } from 'express';
import { BaseController } from '../../utils/catchAsync';
import teachersService from './teachers.service';
import { sendResponse } from '../../utils/sendResponse';
import statusCode from "http-status-codes";
class Teachers extends BaseController{
    setPassoword=this.handle(async(req:Request,res:Response)=>{
         const paylaod=req.body 
        const result=await teachersService.setPasswordDB(paylaod)

         sendResponse(res, {
      message: "Password change  is  SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });

    })

 updateTeacherProfile= this.handle(async(req:Request,res:Response)=>{
       const paylaod=req.body
       const userId=req.user?.id as string
       const result=await teachersService.updateTeacherProfile(paylaod,userId)
     sendResponse(res, {
      message: "profie update  is  SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });

             
    })
 n=  this.handle(async(req:Request,res:Response)=>{

    })
   t= this.handle(async(req:Request,res:Response)=>{

    })
  ra=this.handle(async(req:Request,res:Response)=>{

    })
   
}

export default new Teachers()