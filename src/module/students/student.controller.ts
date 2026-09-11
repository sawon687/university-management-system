import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";

import statusCode from "http-status-codes";
import { sendResponse } from '../../utils/sendResponse';
import studentService from './student.service';
import { prisma } from '../../lib/pirsma';

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

    admissionApplication=this.handle(async(req:Request,res:Response)=>{
            const body=req.body
            const userId=req.user?.id

            const paylaod={...body,userId}

                const result=await studentService.admissionApplicationDB(paylaod)
           sendResponse(res, {
      message: "profile found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
    })
  
    getAllProgramg=this.handle(async(req:Request,res:Response)=>{
      const queray=req.query
        const result=await studentService.getAllProgram(queray)

                   sendResponse(res, {
      message: "program found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
    })

    myApplication=this.handle(async(req:Request,res:Response)=>{
       const id=req.user?.id as string
               const result=await studentService.myApplication(id)

                   sendResponse(res, {
      message: "program found",
      status: statusCode.OK,
      success: true,
      data: result,
    })
    })

    studentEnrolement=this.handle(async(req:Request,res:Response)=>{
           const body=req.body
           const studentId=req.params?.id
           const paylaod={...body,studentId}
           const result=await studentService.stuedentEnrolement(paylaod)

                            sendResponse(res, {
      message: "Stuent Enrolement successFully",
      status: statusCode.OK,
      success: true,
      data: result,
    })
    })

}

export default new StudentController()
