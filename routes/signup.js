const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("../models/User");

const upload = multer();
const router = express.Router();

router.post("/signup", upload.none(), async (req, res) => {
  try {
    console.log("Received Signup Request:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: false,
        message: "Form-data not received",
        data: [],
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
        data: [],
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
        data: [],
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: true,
      message: "Signup successful!",
      data: [{ id: newUser._id, name: newUser.name, email: newUser.email }],
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      data: [],
    });
  }
});

module.exports = router;
