const { verifyToken, isAdmin } = require("../middleware/authJwt");
const controller = require("../controllers/food.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/categories", [verifyToken, isAdmin], controller.createCategory);
  app.get("/api/categories", controller.findAllCategories);

  app.post("/api/foods", [verifyToken, isAdmin], controller.createFood);
  app.get("/api/foods", controller.findAllFoods);
  app.get("/api/categories/:id/foods", controller.findByCategory);
};
