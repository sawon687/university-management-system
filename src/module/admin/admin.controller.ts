import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import adminService from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { prisma } from '../../lib/pirsma';
import { Query } from 'pg';
class Admin extends BaseController {

  teacherCreate=this.handle(async(req:Request,res:Response)=>{
         const paylaod=req.body 
        const result=await adminService.teachersCreateDB(paylaod)
   sendResponse(res, {
      message: "Teacher is Created SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
    })
  

  createProgram = this.handle(async (req: Request, res: Response) => {
        
         const payload=req.body

         const result=await adminService.createProgramDB(payload)
           sendResponse(res, {
      message: "Program is Created SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });
  updateApplicationStatus= this.handle(async (req: Request, res: Response) => {
      const status=req.body?.status
      const id=req.params?.id as string
     
    const result=await adminService.updateStatusApplicationDB(id,status)

           sendResponse(res, {
      message: `Application ${status} is  SuccessFully`,
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });
  t = this.handle(async (req: Request, res: Response) => {});
  ra = this.handle(async (req: Request, res: Response) => {});
}

export default new Admin();
