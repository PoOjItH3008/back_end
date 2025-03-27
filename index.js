require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");
const multer = require('multer');

// Import Routes
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const orphanRoutes = require("./routes/orphans");
const orphanageRoutes = require("./routes/orphanages");
const adoptionRoutes = require("./routes/adoptions");
const requestRoutes = require("./routes/requests");
const orphanageRegister = require("./routes/orphanageRoutes");
const orphanageApproval = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save images inside "uploads" folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// ✅ Ensure Environment Variables are Loaded
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
    console.error("❌ Missing MONGO_URI or JWT_SECRET in .env file.");
    process.exit(1);
}

// ✅ MongoDB Atlas Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Routes
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/orphans", orphanRoutes);
app.use("/api/orphanages", orphanageRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api", requestRoutes);
app.use("/api", orphanageRegister);
app.use("/api", orphanageApproval);

// ✅ Start Server (Only Once!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
