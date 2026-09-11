import { Request, Response } from 'express';
import { BaseController } from '../../utils/catchAsync';
import paymentService from './payment.service';
import { sendResponse } from '../../utils/sendResponse';
import statusCode from "http-status-codes";
class PaymentController extends BaseController {
    createPayment=this.handle(async(req:Request,res:Response)=>{
          const payload=req.body


       const result=await paymentService.createPayments(payload)

                   sendResponse(res, {
      message: "program found",
      status: statusCode.OK,
      success: true,
      data: result,
    })
    })

    })

   confrimPayment= this.handle(async(req:Request,res:Response)=>{
        
    })

   
}

export default new PaymentController()