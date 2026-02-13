const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    pool: config.pool,
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.food = require("./food.model.js")(sequelize, Sequelize);
db.category = require("./category.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.orderItem = require("./orderItem.model.js")(sequelize, Sequelize);
db.address = require("./address.model.js")(sequelize, Sequelize);

// Associations

// Category <-> Food
db.category.hasMany(db.food, { as: "foods" });
db.food.belongsTo(db.category, {
  foreignKey: "categoryId",
  as: "category",
});

// User <-> Order
db.user.hasMany(db.order, { as: "orders" });
db.order.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// User <-> Address
db.user.hasMany(db.address, { as: "addresses" });
db.address.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// Order <-> OrderItem
db.order.hasMany(db.orderItem, { as: "items" });
db.orderItem.belongsTo(db.order, {
  foreignKey: "orderId",
  as: "order",
});

// Food <-> OrderItem
db.food.hasMany(db.orderItem, { as: "orderItems" });
db.orderItem.belongsTo(db.food, {
  foreignKey: "foodId",
  as: "food",
});

module.exports = db;
