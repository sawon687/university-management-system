import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";

import statusCode from "http-status-codes";
import { sendResponse } from '../../utils/sendResponse';
import studentService from './student.service';

class StudentController extends BaseController {
  
updateme = this.handle(async (req: Request, res: Response) => {
 const body = req.body;
 const id=req.user?.id
 const paylaod={...body, studentId:id}
    const studentProfile = await studentService.updateProfileDB(paylaod);

    sendResponse(res, {
      message: "profie updated successfully",
      status: statusCode.OK,
      success: true,
      data: studentProfile,
    });


  
})


    getStudentProfile=this.handle(async(req:Request,res:Response)=>{
        const id=req.user?.id as string

        const result=await studentService.getStudentProfile(id)
           sendResponse(res, {
      message: "profile found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
    })
  

}

export default new StudentController()
