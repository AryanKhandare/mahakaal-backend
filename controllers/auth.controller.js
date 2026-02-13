const db = require("../models");
const config = require("../config/db.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require('dotenv').config();

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone,
    role: req.body.role ? req.body.role : 'customer'
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      console.error("Signup Error:", err);
      if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).send({ message: err.errors.map(e => e.message).join(", ") });
      }
      res.status(500).send({ message: err.message });
    });
};

exports.login = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id, role: user.role },
                              process.env.JWT_SECRET,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400 // 24 hours
                              });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.logout = (req, res) => {
    // Client side should clear token. Server side can blacklist if needed (not implemented for simplicity)
    res.status(200).send({ message: "Logout successful." });
};
