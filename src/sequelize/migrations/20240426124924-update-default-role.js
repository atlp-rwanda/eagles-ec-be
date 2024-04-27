'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'admin'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'user'
    });
  }
};
