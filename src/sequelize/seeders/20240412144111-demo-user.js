/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "Alice",
        username: "alice00",
        email: "alice@example.com",
        password: "$2b$10$NDKLjvgkntdvmTJWnCnJvO/avmN96hl.Ce3GJ3Q0I7hm07ClG5vPK", //test123 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Bob",
        username: "bob00",
        email: "bob@example.com",
        password: "$2b$10$vHvXU9jL4qlZ3qg3H0NhK.kJHeRY4rQEniF3xV0B2I2aMGG/Z3G8e",//password123
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Charlie",
        username:"char",
        email: "charlie@example.com",
        password: "$2b$10$yHx49XToSAXj3IbC7N1W2ueWDjCjH0/zP03wQpXzFK5gJ4L4GjS8G",// secret
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
