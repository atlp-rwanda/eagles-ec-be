const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  development: {
    url: process.env.DB_CONNECTION,
    dialect: "postgres",
  },
  test: {
<<<<<<< HEAD
    url: process.env.TEST_DB,
=======
    url: process.env.DB_CONNECTION,
>>>>>>> 3072b30 (chore: Project Setup with TypeScript, PostgreSQL, and Sequelize)
    dialect: "postgres",
  },
  production: {
    url: process.env.DB_CONNECTION,
    dialect: "postgres",
<<<<<<< HEAD
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
=======
>>>>>>> 3072b30 (chore: Project Setup with TypeScript, PostgreSQL, and Sequelize)
  },
};
