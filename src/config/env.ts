import dotenv from "dotenv";
import path from "path";

// Cross platform Support
dotenv.config({
  path: path.join(process.cwd(), ".env"), //process.cwd-> Node's Current Working Directory
});

const env = {
  port: process.env.PORT || (5000 as number),
  NODE_ENV: process.env.NODE_ENV as string,
  database_url: process.env.DATABASE_URL as string,
  user_email: process.env.USER_EMAIL as string,
  app_password: process.env.USER_APP_PASSWORD as string,
  salt_rounds: process.env.SALT_ROUNDS as string,
};

export default env;
