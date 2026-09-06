import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";

import statusCode from "http-status-codes";
import { sendResponse } from '../../utils/sendResponse';
import studentService from './student.service';

class StudentController extends BaseController {
  
updateme = this.handle(async (req: Request, res: Response) => {
 const paylaod = req.body;
    const studentProfile = await studentService.updateProfileDB(paylaod);

    sendResponse(res, {
      message: "profie updated successfully",
      status: statusCode.OK,
      success: true,
      data: studentProfile,
    });
  

  
})

}

export default new StudentController()
