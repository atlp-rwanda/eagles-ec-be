module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'orderItems',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'orderItems',
        'status',
        {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ["Pending", "Delivered", "Cancelled"],
          defaultValue: 'Pending'
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('orderItems', 'status'),
      queryInterface.removeColumn('orderItems', 'userId'),
    ]);
  },
};