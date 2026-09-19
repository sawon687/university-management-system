import { redisClient } from "../../lib/redis";
import type { ILoging, IOtpSendPaylod, IUser } from "./auth.interface";
import randomInt from "random-int";
import bcrypt from "bcrypt";

import { prisma } from "../../lib/pirsma";
import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";
import ejs from "ejs";
import path from "node:path";
import { transporter } from "../../lib/nodemiler";
import { jwtUtils } from "../../utils/jwt";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import config from "../../config";
import { StatusCodes } from "http-status-codes";

class AuthService {
	async createDB(payload: IUser) {
		console.log("paylaod", payload);
		const userExits = await prisma.users.findUnique({
			where: { email: payload.email },
		});
		if (userExits) {
			throw new Error("This Email Already Created");
		}

		if (payload.role === Role.INSTRUCTOR) {
			throw new Error("This instuctor not create normal users");
		}

		const otpkey = `otpkey:${payload.email}`;
		const userKey = `studentKey:${payload.email}`;

		const expirtionSeconds = 60 * 5;
		console.log(userKey, "userkey");
		const passwordhash = await bcrypt.hash(
			payload.password,
			Number(config.bycriptHashRound),
		);
		payload.password = passwordhash;
		const otp = randomInt(100000, 1000000);
		await redisClient.set(otpkey, otp.toString(), {
			EX: expirtionSeconds,
		});
		await redisClient.set(userKey, JSON.stringify(payload), {
			EX: expirtionSeconds,
		});

		const templatesPath = path.join(
			process.cwd(),
			`/src/templates/registration-user-otp.ejs`,
		);
		const templatesData = {
			name: payload.name,
			email: payload.email,
			otp: otp,
			expirtionSeconds: expirtionSeconds / 60,
		};
		const html = await ejs.renderFile(templatesPath, templatesData);
		console.log("html", templatesData);
		await transporter.sendMail({
			from: config.smt_user,
			to: payload.email,
			subject: "Email Verification",

			html,
		});
		return;
	}

	async verifayAccountDB(paylaod: IOtpSendPaylod) {
		const { email, otp } = paylaod;
		const userExits = await prisma.users.findUnique({ where: { email } });

		const otpkey = `otpkey:${email.trim()}`;
		const userKey = `studentKey:${email.trim()}`;
		const redisOtp = await redisClient.get(otpkey);
		if (!otp) {
			throw new Error("Invalid Otp");
		}
		if (redisOtp !== otp.toString()) {
			throw new Error("OTP Value Not Match!Pleace Valid OTP");
		}

		if (userExits?.emailVerified) {
			throw new Error("User Already Verified");
		}

		const RedisUserPayload = await redisClient.get(userKey);
		if (typeof RedisUserPayload !== "string") {
			throw new Error("User registration data not found or expired");
		}
		const userPayload: IUser = JSON.parse(RedisUserPayload);
		const result = await prisma.users.create({
			data: {
				name: userPayload.name,
				email: userPayload.email,
				password: userPayload.password,
				departmentId: userPayload.departmentId,
				role: Role.STUDENT,
				userStatus: UserStatus.ACTIVE,
				emailVerified: true,
				isEnrolled: false,
			},
			omit: {
				password: true,
			},
		});

		await redisClient.del(otpkey);
		await redisClient.del(userKey);
		const templatesPath = path.join(
			process.cwd(),
			`/src/templates/wecome-message.ejs`,
		);
		const html = await ejs.renderFile(templatesPath, { name: result.name });

		await transporter.sendMail({
			from: config.smt_user,
			to: result.email.trim(),
			subject: "Welcome to UniSphere",
			html,
		});
		return result;
	}

	async loginDB(paylaod: ILoging) {
		const { password, email } = paylaod;

		const userExits = await prisma.users.findUnique({
			where: {
				email,
			},
		});

		if (!userExits) {
			throw new Error("User not Found Pleace try Again");
		}

		if (!userExits.password) {
			throw new Error("User password is not set");
		}

		const passwordMatch = await bcrypt.compare(password, userExits.password);

		if (!passwordMatch) {
			throw new Error("Password Dosenot Match!Pleacce try again");
		}

		const jwtpayload = {
			id: userExits.id,
			name: userExits.name,
			email: userExits.email,
			role: userExits.role,
			departmentId: userExits.departmentId,
		};

		const accessToken = jwtUtils.createToken(
			jwtpayload,
			config.accessSecret as string,
			{
				expiresIn: config.jwt_access_Expires,
			} as SignOptions,
		);
		const refreshToken = jwtUtils.createToken(
			jwtpayload,
			config.refreshSecret as string,
			{ expiresIn: config.jwt_refresh_Expires } as SignOptions,
		);
		console.log("accessToken", accessToken, "refreshToken", refreshToken);

		return { accessToken, refreshToken };
	}
	async googleLoginDB(payload: { idToken: string; role?: string }) {
		console.log("paylaod", payload);
		const { idToken, role } = payload;

		if (!idToken) {
			throw new Error("Token is required");
		}

		const ticket = await googleClient.verifyIdToken({
			idToken,
			audience: config.google_client_id,
		});

		const googleUser = ticket.getPayload();

		if (!googleUser || !googleUser.email) {
			throw new Error("Invalid Google Token");
		}

		let user = await prisma.users.findUnique({
			where: {
				email: googleUser.email,
			},
		});

		if (!user || user.isDeleted) {
			throw new Error("User not found. Please register.");
		}

		if (user.role === Role.INSTRUCTOR) {
			throw new Error("Instructor  not google login and register");
		}

		if (user.authProvider !== AuthProvider.GOOGLE) {
			user = await prisma.users.update({
				where: { email: googleUser.email },
				data: {
					authProvider: AuthProvider.GOOGLE,
					googleId: googleUser.sub,
				},
			});
		}

		const jwtPayload = {
			userId: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			department: user.departmentId,
		};

		const accessToken = jwtUtils.createToken(jwtPayload, config.accessSecret, {
			expiresIn: config.jwt_access_Expires,
		} as SignOptions);
		const refreshToken = jwtUtils.createToken(
			jwtPayload,
			config.refreshSecret,
			{ expiresIn: config.jwt_refresh_Expires } as SignOptions,
		);

		return { accessToken, refreshToken };
	}

	async refreshToken(token: string) {
		const verifiedRefreshToken = jwtUtils.verifyToken(
			token,
			config.refreshSecret,
		);

		if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
			throw new Error(
				config.node_env === "development"
					? verifiedRefreshToken.error
					: "Invalid refresh token",
			);
		}

		const data = verifiedRefreshToken.data as JwtPayload;
		console.log("data is", data);

		const user = await prisma.users.findUnique({
			where: { id: data.id },
		});

		console.log("user", user);
		if (!user || user.isDeleted || user.userStatus !== UserStatus.ACTIVE) {
			throw new Error("User is inactive or not found");
		}

		const jwtPayload = {
			userId: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			departmentId: user.departmentId,
		};

		const accessToken = jwtUtils.createToken(
			jwtPayload,
			config.accessSecret,
			config.jwt_access_Expires as SignOptions,
		);

		const refreshToken = jwtUtils.createToken(
			jwtPayload,
			config.refreshSecret,
			config.jwt_refresh_Expires as SignOptions,
		);

		return {
			accessToken,
			refreshToken,
		};
	}
}

export default new AuthService();
