const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();
router.get("/", (req, res) => {
  res.json({ message: "Hello users router" });
});

router.post("/users", userController.createUser); // Handle POST request to create user

module.exports = router;
