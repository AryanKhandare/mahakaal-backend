const db = require("../models");
const Order = db.order;
const OrderItem = db.orderItem;
const User = db.user;
const Food = db.food;

// Create and Save a new Order
exports.createOrder = (req, res) => {
  const { items, totalAmount, paymentMethod, address } = req.body;

  if (!items || items.length === 0) {
    res.status(400).send({ message: "Order must contain items!" });
    return;
  }

  Order.create({
    userId: req.userId,
    totalAmount: totalAmount,
    paymentMethod: paymentMethod,
    deliveryAddress: JSON.stringify(address), // Store address as JSON string for simplicity
    status: 'new'
  })
    .then(order => {
      // Create Order Items
      const orderItems = items.map(item => ({
        orderId: order.id,
        foodId: item.foodId,
        quantity: item.quantity,
        price: item.price
      }));

      OrderItem.bulkCreate(orderItems)
        .then(() => {
          res.send({ message: "Order placed successfully!", orderId: order.id });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Retrieve all Orders for a User
exports.getUserOrders = (req, res) => {
  Order.findAll({
    where: { userId: req.userId },
    include: [
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] }
    ],
    order: [['createdAt', 'DESC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Retrieve all Orders for Kitchen (All active orders)
exports.getKitchenOrders = (req, res) => {
  Order.findAll({
    where: {
        status: ['new', 'preparing', 'ready']
    },
    include: [
        { model: OrderItem, as: 'items', include: [{ model: Food, as: 'food' }] },
        { model: User, as: 'user', attributes: ['username', 'phone'] }
    ],
    order: [['createdAt', 'ASC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Update Order Status
exports.updateStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  Order.update({ status: status }, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Order status was updated successfully." });
      } else {
        res.send({ message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating Order with id=" + id });
    });
};
