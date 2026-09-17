import type { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import userService from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

class UserController extends BaseController {
	uploadeProfileImage = this.handle(async (req: Request, res: Response) => {
		if (!req.file) {
			throw new Error("No File Provided.");
		}
		const id = req.user?.id as string;

		const result = await userService.uploadeProfieImageDB(req.file?.buffer, id);
		sendResponse(res, {
			message: "Profiel Imges uploade successfully",
			status: StatusCodes.OK,
			success: true,
			data: result,
		});
	});
}

export default new UserController();
