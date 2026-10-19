import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BaseController } from "../../utils/catchAsync";
import AIService from "./ai.service";
import { sendResponse } from "../../utils/sendResponse";
import aiService from './ai.service';

class AIController extends BaseController {
  chat = this.handle(async (req: Request, res: Response) => {
    const { message } = req.body;

    const answer = await AIService.chat(message);

    sendResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "AI response generated successfully",
      data: {
        answer,
      },
    });
  });

generateAcademicInsights = this.handle(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error(
        "Unauthorized",
      );
    }

    const result =
      await aiService.generateAcademicInsights(userId);

    sendResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: "Academic insights generated successfully",
      data: result,
    });
  },
);
}

export default new AIController();
