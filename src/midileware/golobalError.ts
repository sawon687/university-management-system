import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.node_env === "development") {
    console.log("Error from Global Error Handler:", err);
  }

  let statusCode = 500;
  let errorMessage = "Something went wrong";

  const errors: unknown[] = [];

  // Zod Error
  if (err instanceof ZodError) {
    statusCode = 400;
    errorMessage = "Validation Error";

    errors.push(
      ...err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );

  // JWT Token Expired
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    errorMessage = "Token has expired";

  // JWT Invalid Token
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    errorMessage = "Invalid token";

  // Prisma Validation Error
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid data provided";

  // Prisma Known Request Error
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "User already exists";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Requested record was not found";
    }

  // Prisma Initialization Error
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    errorMessage = "Database connection failed";

  // Prisma Unknown Error
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";

  // Normal Error
  } else if (err instanceof Error) {
    statusCode = 400;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errors,
  });
};