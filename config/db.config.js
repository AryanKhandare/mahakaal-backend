require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000,
    family: 4 // Force IPv4
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },

  logging: false
};
