const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/login', async (req, res) => {
  console.log("REquest recieved");
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username: "admin", role: "Admin" });
    console.log(user);
    if (!user) return res.status(404).send("User not by ayush");
    if (user.password != password) return res.status(401).send("Invalid credentials");

    res.status(200).send("Login successful");
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

router.post('/logout', (req, res) => {
  res.send("Logged out successfully");
});

module.exports = router;
