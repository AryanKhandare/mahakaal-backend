require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    ssl: (process.env.DB_SSL === 'true' || process.env.DB_SSL === true || (process.env.DB_HOST && process.env.DB_HOST.includes('rlwy.net'))) ? {
      require: true,
      rejectUnauthorized: false
    } : undefined,
    connectTimeout: 60000, // 60 seconds
    family: 4 // Force IPv4
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
