const db = require("../models");
const User = db.user;
const Address = db.address;

// Get User Profile
exports.getProfile = (req, res) => {
  User.findByPk(req.userId, {
    attributes: { exclude: ['password'] }
  })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Add Address
exports.addAddress = (req, res) => {
  Address.create({
    userId: req.userId,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    country: req.body.country,
    label: req.body.label
  })
    .then(address => {
        res.send(address);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Get User Addresses
exports.getAddresses = (req, res) => {
    Address.findAll({ where: { userId: req.userId } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};
