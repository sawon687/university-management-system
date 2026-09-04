import { NextFunction, Request, Response } from 'express';
import statusCode from "http-status-codes"
export class BaseControoler{

    protected handle(fn:Function){
     async (req:Request,res:Response,next:NextFunction)=>{
                   try {
                            await fn(res,req)
      } catch (error) {
        
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          status: statusCode.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
          errormessage:
            error instanceof Error ? error.message : error,
        });
      }
     }
    }
}