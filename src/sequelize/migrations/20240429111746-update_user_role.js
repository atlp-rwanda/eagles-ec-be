'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    
  

    
    await queryInterface.changeColumn('users', 'roleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

  },

  async down (queryInterface, Sequelize) {
      
    await queryInterface.changeColumn('users', 'roleId', {
      type: Sequelize.ORIGINAL_TYPE,
      allowNull: true,
      defaultValue: 7
    });
  }
};
