import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
 const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
    try {
        const token = jwt.sign(payload, secret, expiresIn as SignOptions)
        return token
    } catch (error) {
        console.log(error)
    }
}

const verifyToken=(token:string,secret:string)=>{
    try {
        const verifedToken=jwt.verify(token,secret)
        return{
            success:true,
            data:verifedToken
        }
    } catch (error:any) {
           console.log('Token verifed falied',error)
        return {
         
            success:false,
            error:error.message
        }
    }
}


export const jwtUtils={
     createToken,
     verifyToken
}