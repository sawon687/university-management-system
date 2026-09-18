import type { Request, Response } from "express";
import { BaseController } from "../../utils/catchAsync";
import authService from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { prisma } from "../../lib/pirsma";
import config from "../../config";
class AuthController extends BaseController {
  createStudent = this.handle(async (req: Request, res: Response) => {
    const payload = req.body;
    console.log("paylaod", payload);
    await authService.createDB(payload);

    sendResponse(res, {
      message: "Verifay OTP Send Pleace Check your Email",
      status: statusCode.OK,
      success: true,
    });
  });
  verifayAccount = this.handle(async (req: Request, res: Response) => {
    const paylaod = req.body;
    const result = await authService.verifayAccountDB(paylaod);
    sendResponse(res, {
      message: "User Register is successFully",
      status: statusCode.OK,
      success: true,
      data: result,
    });
  });

  login = this.handle(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginDB(payload);

    if (!result) {
      throw new Error("User creation failed");
    }
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 24 hour or 7 day
    });
    sendResponse(res, {
      success: true,
      message: "user login  successfully",
      status: statusCode.CREATED,
      data: { accessToken, refreshToken },
    });
  });

  me = this.handle(async (req: Request, res: Response) => {});

  googleLogin = this.handle(async (req: Request, res: Response) => {
    console.log("googleLogin", req.body);
    const result = await authService.googleLoginDB(req.body);

    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      message: "Google login successful!",
      status: statusCode.OK,
      data: { accessToken, refreshToken },
    });
  });

  refreshToken = this.handle(async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
      throw new Error("Refresh token is missing");
    }
    const result = await authService.refreshToken(req.cookies.refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = result;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: config.node_env === "development" ? false : true,
      sameSite: config.node_env === "development" ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.node_env === "development" ? false : true,
      sameSite: config.node_env === "development" ? "lax" : "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      status: statusCode.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  });
}

export default new AuthController();
