import dotenv from 'dotenv'
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  appurl: process.env.APP_URL,
  bycriptHashRound: process.env.BCRYPT_SALT_ROUNDS,
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwt_access_Expires: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_Expires: process.env.JWT_REFRESH_EXPIRES_IN as string,
  stripe_secret_Key:process.env.STRIPE_SECRET_KEY as string
};
export default config;
