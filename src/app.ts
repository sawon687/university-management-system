
import express, { Application, Request, Response } from "express"
import cookie from "cookie-parser"
import { authRouter } from './module/auth/auth.routes'
import { studentRouter } from './module/students/students.routes'
import { adminRouter } from './module/admin/admin.routes'
import { teacherRouter } from './module/teacher/teacher.route'



const app:Application=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())

app.get('/',async(req:Request,res:Response)=>{
    res.send('University managementsystem')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',studentRouter)
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/teacher',teacherRouter)

export default app