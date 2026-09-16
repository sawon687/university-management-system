import { NextFunction, Request, Response } from "express";
import type z from "zod";
import { BaseController } from "../utils/catchAsync";

class ValidationReq extends BaseController {
  validate(schema: z.ZodObject) {
    return this.handle(
      (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body ?? {};

        const result = schema.safeParse(payload);

        if (!result.success) {
          console.log(result.error.issues);

          throw new Error(
            result.error.issues[0]?.message || "Validation failed",
          );
        }

        req.body = result.data;

        next();
      },
    );
  }
}

export const validationReq = new ValidationReq();