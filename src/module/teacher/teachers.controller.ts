import { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import teachersService from "./teachers.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
class Teachers extends BaseController {
  setPassoword = this.handle(async (req: Request, res: Response) => {
    const paylaod = req.body;
    const result = await teachersService.setPasswordDB(paylaod);

    sendResponse(res, {
      message: "Password change  is  SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  updateTeacherProfile = this.handle(async (req: Request, res: Response) => {
    const paylaod = req.body;
    const userId = req.user?.id as string;
    const result = await teachersService.updateTeacherProfile(paylaod, userId);
    sendResponse(res, {
      message: "profie update  is  SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });
  myCoursesExamCreated = this.handle(async (req: Request, res: Response) => {
    const courseId = req.params?.id;
    const instructorId=req.user?.id
    const body = req.body;
    const paylaod = {
      ...body,
      courseId,
      instructorId
    };
    const result = await teachersService.myExamCouresesCreatedDB(paylaod);
    sendResponse(res, {
      message: "Exam created  is  SuccessFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });

  });
  myCouresAssign = this.handle(async (req: Request, res: Response) => {
    const id=req.user?.id as string
      const  result = await teachersService.myCoursesAssignDB(id);
          sendResponse(res, {
      message: "my corses found",
      status: statusCode.OK,
      success: true,
      data: result,
    });


  });
  ra = this.handle(async (req: Request, res: Response) => {});
}

export default new Teachers();
