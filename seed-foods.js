const db = require("./models");
const Category = db.category;
const Food = db.food;

const seed = async () => {
  try {
    await db.sequelize.sync();

    // 1. Seed Categories
    const categoriesData = [
      { id: 1, name: "Pizza", image: "https://img.icons8.com/color/96/000000/pizza.png" },
      { id: 2, name: "Indian", image: "https://img.icons8.com/color/96/000000/naan.png" },
      { id: 3, name: "Chinese", image: "https://img.icons8.com/color/96/000000/noodles.png" },
      { id: 4, name: "Thali", image: "https://img.icons8.com/color/96/000000/thali.png" },
      { id: 5, name: "South Indian", image: "https://img.icons8.com/color/96/000000/dosa.png" },
      { id: 6, name: "Dessert", image: "https://img.icons8.com/color/96/000000/pancake.png" },
      { id: 7, name: "Beverages", image: "https://img.icons8.com/color/96/000000/soda-bottle.png" },
    ];

    for (const cat of categoriesData) {
      const [category, created] = await Category.findOrCreate({
        where: { id: cat.id },
        defaults: cat
      });
      if (created) console.log(`Created Category: ${cat.name}`);
      else console.log(`Category exists: ${cat.name}`);
    }

    // 2. Seed Foods
    const foodData = [
        { id: 1, name: "Paneer Tikka", description: "Smoky cottage cheese cubes marinated in rich spices...", price: 249, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1", categoryId: 2, isVeg: true },
        { id: 2, name: "Mahakaal Biryani", description: "Aromatic basmati rice cooked with saffron and secret spices.", price: 399, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1", categoryId: 2, isVeg: true },
        { id: 3, name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato mix, served with chutney.", price: 149, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1", categoryId: 5, isVeg: true },
        { id: 4, name: "Veg Supreme Pizza", description: "Loaded with black olives, capsicum, onion, grilled mushroom.", price: 299, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1", categoryId: 1, isVeg: true },
        { id: 5, name: "Royal Thali", description: "A complete meal with dal, paneer, roti, rice, sweet, and salad.", price: 349, image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?ixlib=rb-1.2.1", categoryId: 4, isVeg: true },
        { id: 6, name: "Hakka Noodles", description: "Wok-tossed noodles with crunchy vegetables and soy sauce.", price: 179, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1", categoryId: 3, isVeg: true },
        { id: 7, name: "Gulab Jamun", description: "Soft cardamom-spiced dumplings dipped in rose-water sugar syrup.", price: 99, image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?ixlib=rb-1.2.1", categoryId: 6, isVeg: true },
        { id: 8, name: "Garden Salad Bowl", description: "Fresh seasonal vegetables with house-made lemon zest dressing.", price: 189, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1", categoryId: 7, isVeg: true },
    ];

    for (const food of foodData) {
      const [item, created] = await Food.findOrCreate({
        where: { id: food.id },
        defaults: food
      });
      if (created) console.log(`Created Food: ${food.name}`);
      else console.log(`Food exists: ${food.name}`);
    }

    console.log("Seeding completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
