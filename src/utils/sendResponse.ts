import { Response } from 'express'

interface TSendResponse<T>{
    success:boolean,
    status:number,
    message:string,
    data?:T
}


export const sendResponse=<T>(res:Response,data:TSendResponse<T>)=>{
    
    res.status(data.status).json({
        success:data.success,
        status:data.status,
        message:data.message,
        data:data.data

    })
}