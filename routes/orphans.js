const express = require("express");
const Orphan = require("../models/orphan");
const Orphanage = require("../models/orphanage");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ Multer Storage for Images & Documents
// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/orphans/"); // Save files in "uploads/orphans/" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
});

// File upload configuration
const upload = multer({ storage: storage });

// ✅ Route to add orphan with file upload
router.post("/", upload.fields([
    { name: "profilePicture", maxCount: 1 }, 
    { name: "vaccinationReport", maxCount: 1 }, 
    { name: "legalAdoptionClearance", maxCount: 1 }
]), async (req, res) => {
    try {
        const orphanData = req.body;

        // Check if orphanage exists
        const orphanage = await Orphanage.findById(orphanData.orphanage);
        if (!orphanage) {
            return res.status(404).json({ status: false, message: "Orphanage not found", data: [] });
        }

        // 🔹 Save uploaded file paths
        if (req.files["profilePicture"]) {
            orphanData.profilePicture = path.join("uploads/orphans", req.files["profilePicture"][0].filename);
        }
        if (req.files["vaccinationReport"]) {
            orphanData.vaccinationReport = path.join("uploads/orphans", req.files["vaccinationReport"][0].filename);
        }
        if (req.files["legalAdoptionClearance"]) {
            orphanData.legalAdoptionClearance = path.join("uploads/orphans", req.files["legalAdoptionClearance"][0].filename);
        }

        // Create and save orphan
        const orphan = new Orphan(orphanData);
        await orphan.save();

        // Add orphan to orphanage
        orphanage.orphans.push(orphan._id);
        await orphanage.save();

        res.status(201).json({ status: true, message: "Orphan added successfully", data: [orphan] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});


// ✅ Update an orphan's details (with optional file upload)
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = req.body;

        // If a new file is uploaded, update the image field
        if (req.file) {
            updateData.image = path.join("uploads/orphans", req.file.filename); // ✅ Ensure correct path format
        }

        const orphan = await Orphan.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!orphan) {
            return res.status(404).json({ status: false, message: "Orphan not found", data: [] });
        }
        res.json({ status: true, message: "Orphan updated successfully", data: [orphan] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});


module.exports = router;
