module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('new', 'preparing', 'ready', 'completed', 'cancelled'),
      defaultValue: 'new'
    },
    paymentMethod: {
      type: Sequelize.STRING,
      defaultValue: 'COD'
    },
    isPaid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    deliveryAddress: {
      type: Sequelize.TEXT // Storing full address snapshot for simplicity
    }
  });

  return Order;
};
