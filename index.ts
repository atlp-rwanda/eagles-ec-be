import sequelize, { connect } from "./src/config/dbConnection";
import app from "./src/utils/server";

app.listen(5000, async () => {
  await connect();
  await sequelize
    .sync()
    .then(() => {
      console.log(" db synced and server is running");
    })
    .catch((error: any) => {
      console.log(error.message);
    });
});
