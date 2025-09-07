import bcrypt from "bcryptjs";

// The password you want to hash.
const plainTextPassword = "AdminPass123!";

// The number of salt rounds. This should match what's used in your registration logic.
const saltRounds = 12;

// Asynchronously generate the salt and hash the password.
bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
    return;
  }

  console.log("Your plain-text password is:", plainTextPassword);
  console.log("---");
  console.log("Copy this new, valid hash into your mock_data.sql file:");
  console.log(hash);
});
