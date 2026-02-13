const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every request
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`, req.body);
  next();
});

// Log every request
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Database Sync
db.sequelize.sync().then(() => {
  console.log('Database connected and synced.');
}).catch((err) => {
  console.error('Failed to sync database: ' + err.message);
});

// Simple Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mahakaal Food Ordering System API.' });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/food.routes')(app);
require('./routes/order.routes')(app);
require('./routes/kitchen.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});
