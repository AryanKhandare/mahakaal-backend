const db = require("../models");
const Order = db.order;
const OrderItem = db.orderItem;
const Food = db.food;
const User = db.user;
const Op = db.Sequelize.Op;

// Get all active orders for kitchen (Placed, Preparing, Ready)
exports.getKitchenOrders = (req, res) => {
    Order.findAll({
        where: {
            status: {
                [Op.or]: ['new', 'preparing', 'ready']
            }
        },
        include: [
            {
                model: OrderItem,
                as: 'items',
                include: [
                    {
                        model: Food,
                        as: 'food'
                    }
                ]
            },
            {
                model: User,
                as: 'user',
                attributes: ['username', 'phone']
            }
        ],
        order: [['createdAt', 'ASC']]
    })
    .then(orders => {
        res.status(200).send(orders);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Update Order Status
exports.updateOrderStatus = (req, res) => {
    const id = req.params.id;
    const { status, prepTime } = req.body;

    Order.update({ status: status }, { // Add prepTime logic if column exists
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

// Get Inventory (All Food Items)
exports.getInventory = (req, res) => {
    Food.findAll({
        order: [['category', 'ASC'], ['name', 'ASC']]
    })
    .then(foods => {
        res.status(200).send(foods);
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Update Inventory Status (Availability)
exports.updateInventoryStatus = (req, res) => {
    const id = req.params.id;
    const { isAvailable } = req.body;

    Food.update({ isAvailable: isAvailable }, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({ message: "Food availability was updated successfully." });
        } else {
            res.send({ message: `Cannot update Food with id=${id}.` });
        }
    })
    .catch(err => {
        res.status(500).send({ message: "Error updating Food with id=" + id });
    });
};

// Get Basic Insights (Today's Stats)
exports.getInsights = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalOrders = await Order.count({
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });

        const pendingOrders = await Order.count({
            where: {
                status: { [Op.or]: ['placed', 'preparing'] },
                createdAt: { [Op.gte]: today }
            }
        });

        const completedOrders = await Order.count({
            where: {
                status: 'completed',
                createdAt: { [Op.gte]: today }
            }
        });

        const totalRevenue = await Order.sum('totalAmount', {
            where: {
                status: 'completed',
                createdAt: { [Op.gte]: today }
            }
        });

        res.status(200).send({
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue: totalRevenue || 0
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
