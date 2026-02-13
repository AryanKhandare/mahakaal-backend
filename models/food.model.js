module.exports = (sequelize, Sequelize) => {
  const Food = sequelize.define("foods", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING
    },
    isVeg: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    isPopular: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Food;
};
