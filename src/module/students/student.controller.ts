import { Request } from 'express';
import { BaseController } from '../../utils/catchAsync';
import studentService from './student.service';

class StudentController extends BaseController{
    updateme=this.handle(async(req:Request,res:Response)=>{
          const paylaod=req.body
        const studentProfile=await studentService.updateProfileDB(paylaod)
    })
}