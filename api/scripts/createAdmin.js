import dotenv from "dotenv";
import knex from "knex";
import bcrypt from "bcryptjs";
dotenv.config();

const password = process.env.ADMIN_PASSWORD;
console.log(process.env.ADMIN_PASSWORD);
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
  },
});
const createAdmin = async () => {
  try {
    const existingAdmin = await db("Users")
      .where({
        role: "admin",
      })
      .first();
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = {
      username: "admin",
      password: hashedPassword,
      role: "admin",
      email: "admin@example.com",
    };
    await db("Users").insert(adminUser);
    console.log("Admin user created successfully");
  } catch (err) {
    console.log(err);
  } finally {
    db.destroy();
  }
};

createAdmin();
