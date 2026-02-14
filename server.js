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

    // Check force flag
    const forceUpdate = req.query.force === 'true';

    // Check if data exists
    const existingCategories = await Category.count();
    if (existingCategories > 0 && !forceUpdate) {
       return res.send({ message: "Database already seeded! Use /seed?force=true to overwrite." });
    }

    if (forceUpdate) {
        // Clear existing data
        await Food.destroy({ where: {}, truncate: false }); // dependent on category
        await Category.destroy({ where: {}, truncate: false });
    }

    // --- Categories using reliable Icons8 URLs ---
    const categoriesData = [
      { name: "Pizza", image: "https://img.icons8.com/color/96/000000/pizza.png", description: "Cheesy Italian delights" },
      { name: "Burger", image: "https://img.icons8.com/color/96/000000/hamburger.png", description: "Juicy stacked burgers" },
      { name: "Thali", image: "https://img.icons8.com/color/96/000000/thali.png", description: "Complete wholesome meals" },
      { name: "South Indian", image: "https://img.icons8.com/color/96/000000/dosa.png", description: "Dosa, Idli & more" },
      { name: "Chinese", image: "https://img.icons8.com/color/96/000000/noodles.png", description: "Noodles and Manchurian" },
      { name: "Dessert", image: "https://img.icons8.com/color/96/000000/pancake.png", description: "Sweet treats" },
      { name: "Beverages", image: "https://img.icons8.com/color/96/000000/soda-bottle.png", description: "Refreshing drinks" }
    ];

    const createdCategories = {};
    for (const cat of categoriesData) {
      createdCategories[cat.name] = await Category.create(cat);
    }

    // --- Foods ---
    const foodsData = [
      // Pizza
      { name: "Margherita Pizza", price: 199, description: "Classic cheese pizza with fresh basil", isVeg: true, categoryId: createdCategories["Pizza"].id, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },
      { name: "Farmhouse Pizza", price: 299, description: "Loaded with fresh veggies and cheese", isVeg: true, categoryId: createdCategories["Pizza"].id, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: false },
      
      // Burger
      { name: "Aloo Tikki Burger", price: 99, description: "Crispy potato patty with special sauces", isVeg: true, categoryId: createdCategories["Burger"].id, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },
      
      // Thali
      { name: "Royal Thali", price: 349, description: "Dal, Paneer, Mixed Veg, Rice, Roti, Salad, Sweet", isVeg: true, categoryId: createdCategories["Thali"].id, image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },
      
      // South Indian
      { name: "Masala Dosa", price: 149, description: "Crispy rice crepe filled with spiced potato", isVeg: true, categoryId: createdCategories["South Indian"].id, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },

      // Chinese
      { name: "Hakka Noodles", price: 179, description: "Wok-tossed noodles with crunchy vegetables", isVeg: true, categoryId: createdCategories["Chinese"].id, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },
      
      // Dessert
      { name: "Gulab Jamun", price: 49, description: "Soft dough balls dipped in sugar syrup", isVeg: true, categoryId: createdCategories["Dessert"].id, image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: true },
      
      // Beverages
      { name: "Mango Lassi", price: 79, description: "Thick and creamy yogurt drink with mango", isVeg: true, categoryId: createdCategories["Beverages"].id, image: "https://images.unsplash.com/photo-1543362140-5b651082c3c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", isPopular: false }
    ];

    for (const food of foodsData) {
      await Food.create(food);
    }

    res.send({ message: "Database re-seeded successfully with corrected icons!" });
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
