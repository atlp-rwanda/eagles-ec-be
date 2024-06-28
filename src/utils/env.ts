import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db_url: process.env.DB_CONNECTION as string,
  test_db_url: process.env.TEST_DB as string,
  jwt_secret: process.env.JWT_SECRET,
  smtp_host: process.env.SMTP_HOST as string,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER as string,
  smtp_password: process.env.SMTP_PASS as string,
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
  remote_url: `${process.env.REMOTE_URL}/api/v1/users/2fa-verify`,
  local_url: `${process.env.LOCAL_URL}:${process.env.PORT}/api/v1/users/2fa-verify`,
  redis_url: process.env.REDIS_URL as string,
  client_url: process.env.CLIENT_URL as string,
  client_url2: process.env.CLIENT_URL2 as string,
  client_url3: process.env.CLIENT_URL3 as string,
  client_url4: process.env.CLIENT_URL4 as string,
  stripe_secret: process.env.STRIPE_SECRET_KEY as string,
  password_expiration_time: process.env.TIME_FOR_PASSWORD_EXPIRATION as string,
  ADS_URL: process.env.ADS_URL as String,
  fe_url:process.env.FE_URL as string,
};