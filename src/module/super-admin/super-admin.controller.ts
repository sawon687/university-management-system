import { Request, Response } from 'express';
import { BaseController } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import statusCode from "http-status-codes";
import superAdminService from './super-admin.service';






class SuperAdminController extends BaseController{
      CreateDepartment = this.handle(async (req: Request, res: Response) => {
    const payload = req.body ;

    const result = await superAdminService.createDepartmentDB(payload);

    sendResponse(res, {
      message: "Department Created SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getAllDepartment=this.handle(async(req:Request,res:Response)=>{
      
    const result=await superAdminService.getAllDepartmentDB()
       sendResponse(res, {
      message: "Department",
      status: statusCode.OK,
      success: true,
      data: result,
    });


  });
 
  getAllUser=this.handle(async(req:Request,res:Response)=>{
       const query=req.query
        console.log('queray',query)
      const result=await superAdminService.getAllUserDB(query)
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
      const result=await superAdminService.updateStatusUserDB(id,status)
       sendResponse(res, {
      message: `user ${status} is successfully`,
      status: statusCode.OK,
      success: true,
      data: result,
    });
  })

  departmetnAdminAssign=this.handle(async(req:Request,res:Response)=>{
     
  })

  
} 

export default new SuperAdminController()