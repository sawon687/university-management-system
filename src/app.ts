
import express, { Application, Request, Response } from "express"
import cookie from "cookie-parser"
import { authRouter } from './module/auth/auth.routes'
import { studentRouter } from './module/students/students.routes'
import { adminRouter } from './module/admin/admin.routes'
import { teacherRouter } from './module/teacher/teacher.route'
import { paymentRouter } from './module/payment/payment.routes'
import PaymentController from './module/payment/Payment.controller'



const app:Application=express()
app.use(cookie())
app.use('/api/v1/payments/webhook',express.raw({ type: "application/json" }),PaymentController.confrimPayment)

app.use(express.json())


app.use(express.urlencoded({extended:true}))


app.get('/',async(req:Request,res:Response)=>{
    res.send('University managementsystem')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',studentRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/teacher',teacherRouter)
app.use('/api/v1/payments/',paymentRouter)

export default app