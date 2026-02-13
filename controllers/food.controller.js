const db = require("../models");
const Food = db.food;
const Category = db.category;
const Op = db.Sequelize.Op;

// Create and Save a new Category
exports.createCategory = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const category = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image
  };

  Category.create(category)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    });
};

// Retrieve all Categories
exports.findAllCategories = (req, res) => {
  Category.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });
};

// Create and Save a new Food
exports.createFood = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const food = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    isVeg: req.body.isVeg,
    categoryId: req.body.categoryId
  };

  Food.create(food)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Food."
      });
    });
};

// Retrieve all Foods
exports.findAllFoods = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null; // Example search

    Food.findAll({ where: condition, include: ["category"] })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving foods."
        });
      });
};

// Find Food by Category
exports.findByCategory = (req, res) => {
    const categoryId = req.params.id;
    Food.findAll({ where: { categoryId: categoryId } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving foods with category id=" + categoryId
            });
        });
};
