
import express, { Application, Request, Response } from "express"
import cookie from "cookie-parser"
import { authRouter } from './module/auth/auth.routes'
import { userRouter } from './module/users/users.routes'

const app:Application=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie())

app.get('/',async(req:Request,res:Response)=>{
    res.send('University managementsystem')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)

export default app