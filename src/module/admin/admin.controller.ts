import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import adminService from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
class Admin extends BaseController {
  CreateDepartment = this.handle(async (req: Request, res: Response) => {
    const paylaod = req.body;

    const result = await adminService.createDepartmentDB(paylaod);

    sendResponse(res, {
      message: "Department Created SuccessFully",
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
  

  s = this.handle(async (req: Request, res: Response) => {});
  n = this.handle(async (req: Request, res: Response) => {});
  t = this.handle(async (req: Request, res: Response) => {});
  ra = this.handle(async (req: Request, res: Response) => {});
}

export default new Admin();
