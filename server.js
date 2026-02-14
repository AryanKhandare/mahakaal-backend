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

// Sync Database (Alter = true updates tables if schema changes)
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced with alter: true.');
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

  const dns = require('dns');
  dns.lookup(host, (err, address, family) => {
    if (err) {
       return res.status(500).json({ status: 'Error', message: `DNS Lookup failed: ${err.message}` });
    }
    
    console.log(`Resolved ${host} to ${address} (IPv${family})`);

    const socket = new net.Socket();
    const start = Date.now();
    
    socket.setTimeout(5000); // 5s timeout
  
    socket.on('connect', () => {
      const duration = Date.now() - start;
      res.json({ 
          status: 'Success', 
          message: `TCP Connection to ${host}:${port} successful in ${duration}ms`,
          dns: { address, family }
      });
      socket.destroy();
    });
  
    socket.on('timeout', () => {
      res.status(500).json({ 
          status: 'Error', 
          message: `TCP Connection to ${host}:${port} timed out.`,
          dns: { address, family }
      });
      socket.destroy();
    });
  
    socket.on('error', (err) => {
      res.status(500).json({ 
          status: 'Error', 
          message: `TCP Connection failed: ${err.message}`,
          dns: { address, family }
       });
    });
  
    // socket.connect({ port: parseInt(port), host: host, family: 4 });
    // Use the resolved IP directly to be 100% sure
    socket.connect({ port: parseInt(port), host: address }); 
  });
});

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/food.routes')(app);
require('./routes/order.routes')(app);
require('./routes/kitchen.routes')(app);

// Seeding Route
app.get('/seed', async (req, res) => {
  try {
    const Category = db.category;
    const Food = db.food;

    // Check if data already exists to avoid duplicates
    const existingCategories = await Category.count();
    if (existingCategories > 0) {
       return res.send({ message: "Database already seeded!" });
    }

    // Create Categories
    const starters = await Category.create({
      name: "Starters",
      image: "https://images.unsplash.com/photo-1541529086526-db283c563270?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Appetizers to start your meal"
    });

    const mainCourse = await Category.create({
      name: "Main Course",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      description: "Hearty meals for the soul"
    });

    // Create Foods
    await Food.create({
      name: "Paneer Tikka",
      price: 249,
      description: "Marinated paneer grilled to perfection",
      isVeg: true,
      categoryId: starters.id,
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      isPopular: true
    });

    await Food.create({
      name: "Mahakaal Biryani",
      price: 399,
      description: "Signature biryani with divine spices",
      isVeg: true,
      categoryId: mainCourse.id,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      isPopular: true
    });

    res.send({ message: "Database seeded successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Seeding failed: " + error.message });
  }
});

// 404 Handler for debugging
app.use((req, res, next) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).send({ message: `Route not found: ${req.method} ${req.url}` });
});

// Seeding Route moved above 404 handler



const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
});
