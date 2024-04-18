/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "isMerchant")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "isMerchant")
  },
}
