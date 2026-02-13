const db = require("./models");
const bcrypt = require("bcryptjs");

const seedKitchenUser = async () => {
  try {
    await db.sequelize.sync();

    const kitchenUser = await db.user.findOne({ where: { email: "kitchen@mahakaal.com" } });

    if (kitchenUser) {
      console.log("Kitchen user already exists.");
      process.exit(0);
    }

    await db.user.create({
      username: "Head Chef",
      email: "kitchen@mahakaal.com",
      password: bcrypt.hashSync("kitchen123", 8),
      phone: "9998887777",
      role: "kitchen"
    });

    console.log("Kitchen user seeded successfully: kitchen@mahakaal.com / kitchen123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedKitchenUser();
