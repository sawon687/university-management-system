import { redisClient } from "../../lib/redis";
import { IOtpSendPaylod, IStudent } from "./auth.interface";
import randomInt from "random-int";
import bcrypt from "bcrypt";
import config from "../../config";
import { prisma } from "../../lib/pirsma";
import { Role, StudentStatus } from "../../../generated/prisma/enums";
import ejs from "ejs";
import path from "node:path";
import { transporter } from "../../lib/nodemiler";

class AuthService {
  async createDB(payload: IStudent) {
    console.log("paylaod", payload);
    const userExits = await prisma.student.findUnique({
      where: { email: payload.email },
    });
    if (userExits) {
      throw new Error("This Email Already Created");
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
    const userExits = await prisma.student.findUnique({ where: { email } });

    const otpkey = `otpkey:${email}`;
    const userKey = `studentKey:${email}`;
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
    if (!RedisUserPayload) {
      throw new Error("User registration data not found or expired");
    }
    const userPayload: IStudent = JSON.parse(RedisUserPayload);
    const result = await prisma.student.create({
      data: {
        name: userPayload.name,
        email: userPayload.email,
        password: userPayload.password,
        role: Role.STUDENT,
        status: StudentStatus.ACTIVE,
        emailVerified: true,
      },
    });

    await redisClient.del(otpkey)
    await redisClient.del(userKey)
    const templatesPath=path.join(process.cwd(), 
      `/src/templates/wecome-message.ejs`)
    const html=await ejs.renderFile(templatesPath,{name:result.name})
 
    await transporter.sendMail({
      from:config.smt_user,
      to:result.email,
      subject:'Welcome to UniSphere',
      html
    })
    return result;
  }

  async loginDB() {}
  async getMeDB() {}
}

export default new AuthService();
