module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define("order_items", {
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  });

  return OrderItem;
};
