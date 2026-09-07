import { Role } from '../../../generated/prisma/enums';

export interface IUser{
    name:string,
    email:string,
    role:Role,
    password:string,

}

export interface IOtpSendPaylod{
    otp:string,
    email:string
}

export interface ILoging{
    email:string,
    password:string
}