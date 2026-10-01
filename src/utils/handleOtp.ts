import { randomInt } from "crypto";
import { redisClient } from '../lib/redis';
import { OtpPurpose } from '../constants/otp';



export const generateAndSaveOtp = async (
  email: string,
   purpose:OtpPurpose
) => {
  const otp = randomInt(100000, 1000000);

  const otpKey = `otpkey:${purpose}:${email.trim().toLowerCase()}`;
  
  const expirationSeconds=60 * 5
  await redisClient.set(otpKey, otp.toString(), {
    EX: expirationSeconds,
  });

  return {
    otp,
    expirationSeconds,
  };
};