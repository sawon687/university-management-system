import { NextFunction, Request, Response } from "express";

import { jwtUtils } from "../utils/jwt";

import { JwtPayload } from "jsonwebtoken";

import { Role } from "../../generated/prisma/enums";

import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";
import config from '../config';
import { prisma } from '../lib/pirsma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        role: string;
        id: string;
      };
    }
  }
}

export const auth = (...requriedRoles: Role[]) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization;
    
      if (!token) {
        throw new Error(
          "You are not logged in. Please log in to access this resource.",
        );
      }

      const verifedToken = jwtUtils.verifyToken(token, config.accessSecret);
      if (!verifedToken.success) {
        throw new Error(verifedToken.error);
      }

      const { id, name, email, role } = verifedToken.data as JwtPayload;
      if (requriedRoles.length && !requriedRoles.includes(role)) {
        throw new Error(
          "Forbidden. You don't have permission to access this resource.",
        );
      }

      const user = await prisma.users.findUnique({
        where: {
          id,
          name,
          email,
          role,
        },
      });

      if (!user) {
        throw new Error("User not found. Please log in again.");
      }
      req.user = {
        email,
        name,
        id,
        role,
      };
      next();
    } catch (error) {
      console.log("Auth Error:", error);

      sendResponse(res, {
        success: false,
        status: status.INTERNAL_SERVER_ERROR,
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  };
};
