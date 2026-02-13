module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("categories", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING // URL to image
    },
    description: {
      type: Sequelize.STRING
    }
  });

  return Category;
};
