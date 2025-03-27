const express = require("express");
const PendingOrphanage = require("../models/PendingOrphanage"); // Import Model
const router = express.Router();
const multer = require("multer");
const upload = multer();

// 🟢 Register a new Orphanage (Pending Approval)
router.post("/register", upload.none(), async (req, res) => {
    try {
        const { name, registrationNumber, address, latitude, longitude, contact } = req.body;

        // Parse contact as JSON (if sent as a string)
        let contactInfo;
        try {
            contactInfo = typeof contact === "string" ? JSON.parse(contact) : contact;
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: "Invalid contact format. Expected JSON with 'name' and 'phone'.",
                data: []
            });
        }

        // 🛑 Validate Required Fields
        if (!name || !registrationNumber || !address || !latitude || !longitude || !contactInfo.name || !contactInfo.phone) {
            return res.status(400).json({
                status: false,
                message: "Missing required fields. Ensure 'contact' includes both 'name' and 'phone'.",
                data: []
            });
        }

        const newOrphanage = new PendingOrphanage({
            name,
            registrationNumber,
            address,
            latitude,
            longitude,
            contact: contactInfo // Save as an object
        });

        await newOrphanage.save();

        res.status(201).json({
            status: true,
            message: "Orphanage registered successfully, awaiting admin approval.",
            data: [{ orphanageId: newOrphanage._id }]
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
            data: [{ error: error.message }]
        });
    }
});

module.exports = router;
