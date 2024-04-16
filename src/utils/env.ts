import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db_url: `${process.env.DB_CONNECTION}`,
  test_db: `${process.env.TEST_DB}`,
};
