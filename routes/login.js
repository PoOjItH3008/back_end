const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

const upload = multer();
const router = express.Router();

router.post("/login", upload.none(), async (req, res) => {
  try {
    console.log("Received Login Request:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: false,
        message: "Form-data not received",
        data: [],
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
        data: [],
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
        data: [],
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
        data: [],
      });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: [
        {
          id: user._id,
          name: user.name,
          email: user.email,
          token: token,
        },
      ],
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      data: [],
    });
  }
});

module.exports = router;
