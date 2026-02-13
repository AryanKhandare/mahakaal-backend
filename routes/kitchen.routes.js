const { authJwt } = require("../middleware");
const controller = require("../controllers/kitchen.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/kitchen/orders",
    [authJwt.verifyToken, authJwt.isKitchen],
    controller.getKitchenOrders
  );

  app.put(
    "/api/kitchen/order/:id",
    [authJwt.verifyToken, authJwt.isKitchen],
    controller.updateOrderStatus
  );

  app.get(
    "/api/kitchen/inventory",
    [authJwt.verifyToken, authJwt.isKitchen],
    controller.getInventory
  );

  app.put(
    "/api/kitchen/inventory/:id",
    [authJwt.verifyToken, authJwt.isKitchen],
    controller.updateInventoryStatus
  );

  app.get(
    "/api/kitchen/insights",
    [authJwt.verifyToken, authJwt.isKitchen],
    controller.getInsights
  );
};
