'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require("bcrypt");
    return queryInterface.bulkInsert("users", [
    {
      username: "dummyadmin",
      name: "Admin",
      email: "dummyAdmin@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 3
    }
  ]
  )
},

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  }
};
