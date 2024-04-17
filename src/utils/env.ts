import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  db_url: process.env.DB_CONNECTION as string,
<<<<<<< HEAD
  jwt_secret:process.env.JWT_SECRET,
=======
  test_db_url: process.env.TEST_DB as string,
>>>>>>> a44a22c746b0a8d3c48c0576b86d096726854121
};
