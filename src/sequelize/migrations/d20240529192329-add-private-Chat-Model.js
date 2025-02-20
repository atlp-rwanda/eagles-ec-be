"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PrivateChats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    const isPrivateChatID = await queryInterface.describeTable("messages").then((columns) => {
      return "privateChatId" in columns;
    });
    const isPrivate = await queryInterface.describeTable("messages").then((columns) => {
      return "isPrivate" in columns;
    });

    if (!isPrivateChatID) {
      await queryInterface.addColumn("messages", "privateChatId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "PrivateChats",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
    if (!isPrivate) {
      await queryInterface.addColumn("messages", "isPrivate", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PrivateChats");
    await queryInterface.removeColumn("messages", "privateChatId");
    await queryInterface.removeColumn("messages", "isPrivate");
  },
};
