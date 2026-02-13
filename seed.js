const db = require("./models");
const Category = db.category;
const Food = db.food;
const User = db.user;
const bcrypt = require("bcryptjs");

const seed = async () => {
    try {
        await db.sequelize.sync({ force: true });
        console.log("Database synced.");

        // Create Admin User
        await User.create({
            username: "admin",
            email: "admin@mahakaal.com",
            password: bcrypt.hashSync("admin123", 8),
            role: "admin",
            phone: "9999999999"
        });

        // Create Kitchen User
        await User.create({
            username: "kitchen",
            email: "kitchen@mahakaal.com",
            password: bcrypt.hashSync("kitchen123", 8),
            role: "kitchen",
            phone: "8888888888"
        });

        // Create Customer User
        await User.create({
            username: "rahul",
            email: "rahul@gmail.com",
            password: bcrypt.hashSync("rahul123", 8),
            role: "customer",
            phone: "7777777777"
        });

        console.log("Users created.");

        // Create Categories
        const catPizza = await Category.create({ name: "Pizza", image: "https://img.icons8.com/color/48/000000/pizza.png", description: "Delicious Pizza" });
        const catBurger = await Category.create({ name: "Burger", image: "https://img.icons8.com/color/48/000000/hamburger.png", description: "Juicy Burgers" });
        const catIndian = await Category.create({ name: "Indian", image: "https://img.icons8.com/color/48/000000/naan.png", description: "Authentic Indian" });

        console.log("Categories created.");

        // Create Foods
        await Food.create({ name: "Paneer Tikka Pizza", price: 299, description: "Spicy paneer tikka on a pizza", image: "https://source.unsplash.com/150x150/?pizza", categoryId: catPizza.id, isVeg: true });
        await Food.create({ name: "Margherita Pizza", price: 199, description: "Classic cheese pizza", image: "https://source.unsplash.com/150x150/?cheese-pizza", categoryId: catPizza.id, isVeg: true });
        await Food.create({ name: "Veggie Burger", price: 129, description: "Loaded veggie burger", image: "https://source.unsplash.com/150x150/?burger", categoryId: catBurger.id, isVeg: true });
        await Food.create({ name: "Butter Chicken", price: 350, description: "Rich and creamy butter chicken", image: "https://source.unsplash.com/150x150/?butter-chicken", categoryId: catIndian.id, isVeg: false });
        await Food.create({ name: "Dal Makhani", price: 220, description: "Slow cooked black lentils", image: "https://source.unsplash.com/150x150/?dal", categoryId: catIndian.id, isVeg: true });

        console.log("Foods created.");
        console.log("Seeding complete.");
        process.exit();

    } catch (error) {
        console.log("Error seeding:", error);
        process.exit(1);
    }
};

seed();
