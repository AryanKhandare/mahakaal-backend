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
console.log(`Attempting to connect to Database at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306} as ${process.env.DB_USER}`);
db.sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

db.sequelize.sync().then(() => {
  console.log('Database synced.');
}).catch((err) => {
  console.error('Failed to sync database: ' + err.message);
});

// Simple Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Mahakaal Food Ordering System API.' });
});

// DB Test Route
app.get('/test-db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ 
      status: 'Success', 
      message: 'Database connection established successfully.',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        ssl: !!process.env.DB_SSL
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      message: 'Unable to connect to the database.', 
      error: error.message,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        ssl: !!process.env.DB_SSL
      }
    });
  }
});

// Network Test Route (Low Level)
const net = require('net');
app.get('/test-network', (req, res) => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || 3306;

  const socket = new net.Socket();
  const start = Date.now();
  
  socket.setTimeout(5000); // 5s timeout

  socket.on('connect', () => {
    const duration = Date.now() - start;
    res.json({ status: 'Success', message: `TCP Connection to ${host}:${port} successful in ${duration}ms` });
    socket.destroy();
  });

  socket.on('timeout', () => {
    res.status(500).json({ status: 'Error', message: `TCP Connection to ${host}:${port} timed out.` });
    socket.destroy();
  });

  socket.on('error', (err) => {
    res.status(500).json({ status: 'Error', message: `TCP Connection failed: ${err.message}` });
  });

  socket.connect({ port: parseInt(port), host: host, family: 4 });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/food.routes')(app);
require('./routes/order.routes')(app);
require('./routes/kitchen.routes')(app);

// 404 Handler for debugging
app.use((req, res, next) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).send({ message: `Route not found: ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});
