module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM('customer', 'admin', 'kitchen'),
      defaultValue: 'customer'
    }
  });

  return User;
};
