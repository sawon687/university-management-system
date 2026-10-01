import type { Role } from "../../../generated/prisma/enums";

export interface IUser {
	name: string;
	email: string;
	role: Role;
	password: string;
	phone: string;
}

export interface IOtpSendPaylod {
	otp: string;
	email: string;
	purpose?:string
}

export interface ILoging {
	email: string;
	password: string;
}

export interface IUpdatePasswordPayload{
     token:string,
	 email:string,
	 passsword:string,

}