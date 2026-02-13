const jwt = require("jsonwebtoken");
const config = require("../config/db.config.js"); // We should use process.env.JWT_SECRET actually
require('dotenv').config();

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
    return;
  }
  res.status(403).send({
    message: "Require Admin Role!"
  });
};

isKitchen = (req, res, next) => {
  if (req.userRole === 'kitchen' || req.userRole === 'admin') {
    next();
    return;
  }
  res.status(403).send({
    message: "Require Kitchen Role!"
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isKitchen: isKitchen
};
module.exports = authJwt;
