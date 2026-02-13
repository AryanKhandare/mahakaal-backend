const db = require("./models");
const User = db.user;
const bcrypt = require("bcryptjs"); // Ensure bcrypt is available, or use the controller logic if possible. 
// Actually, relying on the model directly is safer if we hash manually, 
// OR we can just use the auth controller via an internal call, but a script is standalone.

const seedGoogleUser = async () => {
  try {
    await db.sequelize.sync();

    const email = "google_guest@mahakaal.com";
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      console.log("Google Guest user already exists.");
      process.exit(0);
    }

    // specific password hash for "google_guest_123"
    // bcrypt.hashSync("google_guest_123", 8)
    const passwordHash = bcrypt.hashSync("google_guest_123", 8);

    await User.create({
      username: "Google Guest",
      email: email,
      password: passwordHash,
      role: "customer"
    });

    console.log("Google Guest user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed Google User:", error);
    process.exit(1);
  }
};

seedGoogleUser();
