import { Sequelize } from "sequelize";
import { env } from "../utils/env";

const envT = process.env.NODE_ENV;

// const sequelize = new Sequelize(envT === "test" ? env.test_db_url : env.db_url);
const sequelize = new Sequelize(envT === "test" ? env.test_db_url : env.db_url, {
  dialectOptions: {
    ssl: {
      require: true, // This will force SSL
      rejectUnauthorized: false // Disable SSL certificate validation, you can set it to true if you want to validate the certificate
    }
  }
});

export const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("successfuly connected's to db");
  } catch (error: any) {
    console.log("error: ", error.message);
    return;
  }
};

export default sequelize;
