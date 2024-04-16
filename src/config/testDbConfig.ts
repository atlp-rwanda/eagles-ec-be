import { Sequelize } from "sequelize";
import { env } from "../utils/env";

export const testSequelize = new Sequelize(env.test_db, {
  dialect: "postgres",
});
export const testDbConnection = async () => {
  try {
    await testSequelize.authenticate();
  } catch (error) {
    testSequelize.close();
  }
};
