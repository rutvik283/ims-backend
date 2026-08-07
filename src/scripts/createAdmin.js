require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
  console.log("=== Create Initial Admin User ===");
  
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in the environment or .env file.");
    rl.close();
    process.exit(1);
  }

  try {
    const name = await question("Enter Admin Name: ");
    if (!name || !name.trim()) throw new Error("Name cannot be empty.");

    const email = await question("Enter Admin Email: ");
    if (!email || !email.trim() || !email.includes("@")) throw new Error("Invalid email format.");

    const password = await question("Enter Admin Password (min 6 chars): ");
    if (!password || password.trim().length < 6) throw new Error("Password must be at least 6 characters.");

    console.log("\nConnecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      throw new Error(`A user with email ${email} already exists.`);
    }

    // Create the admin user (pre-save hook will automatically hash the password)
    const admin = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role: "ADMIN",
      isActive: true,
    });

    console.log(`\nSuccess! Admin user '${admin.name}' (${admin.email}) created successfully.`);

  } catch (error) {
    console.error(`\nError: ${error.message}`);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

run();
