import type { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";

import statusCode from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import studentService from "./student.service";
import { IqueryProgram } from "./students.interface";

class StudentController extends BaseController {
  updateme = this.handle(async (req: Request, res: Response) => {
    const body = req.body;
    const id = req.user?.id;
    console.log("id suer", id);
    const paylaod = { ...body, studentId: id };
    console.log("payload me", paylaod);
    const studentProfile = await studentService.updateProfileDB(paylaod);

    sendResponse(res, {
      message: "profie updated successfully",
      status: statusCode.OK,
      success: true,
      data: studentProfile,
    });
  });

  admissionApplication = this.handle(async (req: Request, res: Response) => {
    const body = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const sscFile = files?.sscResult?.[0] ?? null;
    const hscFile = files?.hscResult?.[0] ?? null;
    const diplomaFile = files?.diplomaResult?.[0] ?? null;
    const userId = req.user?.id;

    const data = JSON.parse(body.data);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    if (!data.programId) {
      throw new Error("Program ID is required");
    }
    const payload = { ...data, userId };
    console.log("body:", data);
    console.log("programId:", data.programId);
    console.log("payload:", payload);

    const result = await studentService.admissionApplicationDB(
      payload,
      sscFile as Express.Multer.File,
      hscFile as Express.Multer.File,
      diplomaFile as Express.Multer.File,
    );
    sendResponse(res, {
      message: "Application success fully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getAllProgramg = this.handle(async (req: Request, res: Response) => {
    const queray = req.query;
    console.log("CONTROLLER QUERY:", req.query);
    const result = await studentService.getAllProgram(queray);

    sendResponse(res, {
      message: "program found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getDetailsProgram = this.handle(async (req: Request, res: Response) => {
    const id = req.params?.id as string;

    const result = await studentService.getDetailsProgramDB(id);

    sendResponse(res, {
      message: "Program retrey success fully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  myApplication = this.handle(async (req: Request, res: Response) => {
    const id = req.user?.id as string;
    const result = await studentService.myApplication(id);

    sendResponse(res, {
      message: "program found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  studentEnrolement = this.handle(async (req: Request, res: Response) => {
    const body = req.body;
    const studentId = req.params?.id;
    const paylaod = { ...body, studentId };
    const result = await studentService.stuedentEnrolement(paylaod);

    sendResponse(res, {
      message: "Stuent Enrolement successFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getFeeInstalment = this.handle(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const semesterId = req.query.semesterId as string;
    const result = await studentService.GetfeeInstalmentDB(userId, semesterId);

    sendResponse(res, {
      message: "get all fee",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  myEnrolement = this.handle(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const parmas = req.params
    const semeterId=parmas.id as string
  
    const result = await studentService.myEnrolementDB(userId,semeterId);
     console.log('result cornrses',result)
    sendResponse(res, {
      message: "get all enrolement",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  mySemester = this.handle(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await studentService.mySemesterDB(userId);

    sendResponse(res, {
      message: "get all enrolement",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  mygpa = this.handle(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const body = req.body;
    const paylaod = {
      ...body,
      studentId: userId,
    };
    const result = await studentService.myCgpaDB(paylaod);

    sendResponse(res, {
      message: "get all enrolement",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getAllcourses = this.handle(async (req: Request, res: Response) => {
    const departmentId = req.user?.departmentId as string;
    const query = req.query;
    const paylaod = {
      ...query,
      departmentId,
    };
    console.log("deparment", departmentId);

    const result = await studentService.getAllCourseDB(paylaod);

    sendResponse(res, {
      message: "get all  courses found",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  getDasbhoard = this.handle(async (req: Request, res: Response) => {
   const studentId = (req as any).user.id;

    const result =
      await studentService.getStudentDashboardDB(studentId);

    res.status(200).json({
      success: true,
      message: "Student dashboard retrieved successfully",
      data: result,
  });
})
}

export default new StudentController();


 
    