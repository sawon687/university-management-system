import { redisClient } from "../../lib/redis";
import type {
  ILoging,
  IOtpSendPaylod,
  IUpdatePasswordPayload,
  IUser,
} from "./auth.interface";
import randomInt from "random-int";
import bcrypt, { genSaltSync } from "bcrypt";

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
import { generateAndSaveOtp } from "../../utils/handleOtp";
import { OtpPurpose } from "../../constants/otp";
import { randomBytes } from "crypto";
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

    const passwordhash = await bcrypt.hash(
      payload.password,
      Number(config.bycriptHashRound),
    );

    const { otp, expirationSeconds } = await generateAndSaveOtp(
      payload.email,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    const templatesPath = path.join(
      process.cwd(),
      `/src/templates/registration-user-otp.ejs`,
    );

    const result = await prisma.users.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: passwordhash,
        role: Role.STUDENT,
        userStatus: UserStatus.PENDING,
        emailVerified: false,
        isEnrolled: false,
        studentProfile: {
          create: {
            phone: payload.phone || "",
            departmentId: "",
          },
        },
      },

      omit: {
        password: true,
      },
    });
    const templatesData = {
      name: payload.name,
      email: payload.email,
      otp: otp,
      expirtionSeconds: expirationSeconds / 60,
    };
    const html = await ejs.renderFile(templatesPath, templatesData);
    console.log("html", templatesData);
    await transporter.sendMail({
      from: config.smt_user,
      to: payload.email,
      subject: "Email Verification",

      html,
    });
    return result;
  }

  async verifayAccountDB(payload: IOtpSendPaylod) {
    const email = payload.email.trim().toLowerCase();
    const { otp, purpose } = payload;

    if (!otp) {
      throw new Error("Invalid OTP");
    }

    const userExists = await prisma.users.findUnique({
      where: { email },
    });

    if (!userExists) {
      throw new Error("User not found");
    }

    if (purpose === OtpPurpose.EMAIL_VERIFICATION && userExists.emailVerified) {
      throw new Error("User already verified");
    }

    if (purpose === OtpPurpose.PASSWORD_RESET && !userExists.emailVerified) {
      throw new Error("This user is not verified");
    }

    const otpKey = `otpkey:${email}`;
    const redisOtp = await redisClient.get(otpKey);

    if (!redisOtp) {
      throw new Error("OTP has expired or is invalid");
    }
    if (
      purpose !== OtpPurpose.EMAIL_VERIFICATION &&
      purpose !== OtpPurpose.PASSWORD_RESET
    ) {
      throw new Error("Invalid OTP purpose");
    }
    if (redisOtp !== otp.toString()) {
      throw new Error("OTP value does not match");
    }

    await redisClient.del(otpKey);

    if (OtpPurpose.PASSWORD_RESET === purpose) {
      const token = randomBytes(32).toString("hex");

      const tokenKey = `ResetPasswordToken:${email}`;
      const expirationSeconds = 60 * 10;
      await redisClient.set(tokenKey, token.toString(), {
        EX: expirationSeconds,
      });

      return token;
    }

    const result = await prisma.users.update({
      where: { email },
      data: {
        emailVerified: true,
        userStatus: UserStatus.ACTIVE,
      },
      omit: {
        password: true,
      },
    });

    const templatesPath = path.join(
      process.cwd(),
      "src/templates/wecome-message.ejs",
    );

    const html = await ejs.renderFile(templatesPath, {
      name: result.name,
    });

    await transporter.sendMail({
      from: config.smt_user,
      to: result.email,
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
      include: {
        studentProfile: {
          select: {
            departmentId: true,
          },
        },
      },
    });

    if (!userExits) {
      throw new Error("This Email not Found Pleace try Again");
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
      departmentId: userExits.studentProfile?.departmentId ?? null,
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

  async forgotPasswordDB(email: string) {
    if (!email) {
      throw new Error("Email not provided, please provide an email");
    }
    const userExits = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!userExits) {
      throw new Error("This Account Not Found");
    }

    if (userExits.emailVerified === false) {
      throw new Error("This Account Not Verifyed Pleace try Again");
    }

    const { otp, expirationSeconds } = await generateAndSaveOtp(
      email,
      OtpPurpose.PASSWORD_RESET,
    );

    const templatesPath = path.join(
      process.cwd(),
      `/src/templates/forgot-password.ejs`,
    );
    const templatesData = {
      name: userExits.name,
      email: userExits.email,
      otp: otp,
      expirtionSeconds: expirationSeconds / 60,
    };
    const html = await ejs.renderFile(templatesPath, templatesData);
    console.log("html", templatesData);
    await transporter.sendMail({
      from: config.smt_user,
      to: userExits.email,
      subject: "Forgot Password",

      html,
    });

    return;
  }

  async updatePasswordDB(payload: IUpdatePasswordPayload) {
    const { email, token, passsword } = payload;
    const userExits = await prisma.users.findUnique({ where: { email } });

    if (!userExits) {
      throw new Error("This Account Not Found");
    }

    const passwordhash = await bcrypt.hash(
      passsword,
      Number(config.bycriptHashRound),
    );

    const tokenKey = `ResetPasswordToken:${email}`;
    const redisToken = await redisClient.get(tokenKey);

    if (!redisToken || token !== redisToken) {
      throw new Error("Unauthorized password reset request");
    }
    await redisClient.del(tokenKey);

    const result = await prisma.users.update({
      where: { email },
      data: {
        password: passwordhash,
      },
    });

    return result;
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
      include: {
        studentProfile: {
          select: {
            departmentId: true,
          },
        },
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
        include: {
          studentProfile: {
            select: {
              departmentId: true,
            },
          },
        },
      });
    }

    const jwtPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.studentProfile?.departmentId,
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
      include: {
        studentProfile: {
          select: {
            departmentId: true,
          },
        },
      },
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
      departmentId: user.studentProfile?.departmentId,
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
