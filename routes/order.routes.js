const { verifyToken, isKitchen } = require("../middleware/authJwt");
const controller = require("../controllers/order.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/orders", [verifyToken], controller.createOrder);
  app.get("/api/orders/user", [verifyToken], controller.getUserOrders);
  app.get("/api/orders/kitchen", [verifyToken, isKitchen], controller.getKitchenOrders); // Kitchen or Admin only
  app.put("/api/orders/:id/status", [verifyToken, isKitchen], controller.updateStatus);
};
