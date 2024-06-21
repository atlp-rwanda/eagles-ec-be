'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isDescriptionColumnExists = await queryInterface.describeTable('products').then((columns) => {
      return 'description' in columns;
    });

    if (!isDescriptionColumnExists) {
      await queryInterface.addColumn('products', 'description', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'default description'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'description');
  },
}
