import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import adminService from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { prisma } from '../../lib/pirsma';
import { Query } from './admin.interface';

class Admin extends BaseController {
 CreateDepartment = this.handle(async (req: Request, res: Response) => {
    const payload = req.body ;

    const result = await adminService.createDepartmentDB(payload);

    sendResponse(res, {
      message: "Department Created SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });


    getAllDepartment=this.handle(async(req:Request,res:Response)=>{
      
    const result=await adminService.getALLDepartmentDB()
       sendResponse(res, {
      message: "Department",
      status: statusCode.OK,
      success: true,
      data: result,
    });


  });
 
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

  getAllUser=this.handle(async(req:Request,res:Response)=>{
      const query = req.query as Query | any;
        console.log('queray',query)
        
      const result=await adminService.getAllUserDB(query)
       sendResponse(res, {
      message: "user Found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  })
    updateStatus=this.handle(async(req:Request,res:Response)=>{
       const id=req.params?.id as string
       const status=req.body?.status
      const result=await adminService.updateStatusUserDB(id,status)
       sendResponse(res, {
      message: `user ${status} is successfully`,
      status: statusCode.OK,
      success: true,
      data: result,
    });
  })

  createCourse = this.handle(async (req: Request, res: Response) => {
         const paylaod=req.body
        const result=await adminService.createCourseDB(paylaod)
                sendResponse(res, {
      message: `create Course is successfully`,
      status: statusCode.OK,
      success: true,
      data: result,
    });

  });
  ra = this.handle(async (req: Request, res: Response) => {});
}

export default new Admin();
