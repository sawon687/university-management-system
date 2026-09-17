import type { NextFunction, Request, Response } from "express";
import { BaseController } from "../utils/catchAsync";
import type z from "zod";
class ValidationReq extends BaseController {
	validate(schema: z.ZodObject<any>) {
		return this.handle((req: Request, _res: Response, next: NextFunction) => {
			const payload = {
				body: req.body ?? {},
			};

			const result = schema.safeParse(payload);

			if (!result.success) {
				throw result.error;
			}

			req.body = result.data.body;

			next();
		});
	}
}

export const validationReq = new ValidationReq();
