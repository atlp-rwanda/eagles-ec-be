import { Sequelize } from "sequelize";
import { env } from "../utils/env";

const sequelize = new Sequelize(env.db_url, {
  dialect: "postgres",
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
