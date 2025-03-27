const express = require("express");
const Orphanage = require("../models/orphanage");
const router = express.Router();
const multer = require("multer");
const upload = multer();

// ✅ Create Orphanage (with structured response)
router.post("/", upload.none(), async (req, res) => {
    try {
        const orphanage = new Orphanage(req.body);
        await orphanage.save();
        res.status(201).json({ status: true, message: "Orphanage created successfully", data: [orphanage] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

router.get("/nearby", async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query; // Default radius is 10 km

        if (!latitude || !longitude) {
            return res.status(400).json({ status: false, message: "Latitude and Longitude are required", data: [] });
        }

        const nearbyOrphanages = await Orphanage.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    distanceField: "distance",
                    maxDistance: parseFloat(radius) * 1000, // Convert km to meters
                    spherical: true
                }
            }
        ]);

        res.json({ status: true, message: "Nearby orphanages fetched successfully", data: nearbyOrphanages });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});


// ✅ Get All Orphanages
router.get("/", async (req, res) => {
    try {
        const orphanages = await Orphanage.find();
        res.json({ status: true, message: "Orphanages fetched successfully", data: orphanages });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

// ✅ Get Orphanage by ID
router.get("/:id", async (req, res) => {
    try {
        const orphanage = await Orphanage.findById(req.params.id);
        if (!orphanage) {
            return res.status(404).json({ status: false, message: "Orphanage not found", data: [] });
        }
        res.json({ status: true, message: "Orphanage fetched successfully", data: [orphanage] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

// ✅ Update Orphanage
router.put("/:id", upload.none(), async (req, res) => {
    try {
        const orphanage = await Orphanage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!orphanage) {
            return res.status(404).json({ status: false, message: "Orphanage not found", data: [] });
        }
        res.json({ status: true, message: "Orphanage updated successfully", data: [orphanage] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

// ✅ Delete Orphanage
router.delete("/:id", async (req, res) => {
    try {
        const orphanage = await Orphanage.findByIdAndDelete(req.params.id);
        if (!orphanage) {
            return res.status(404).json({ status: false, message: "Orphanage not found", data: [] });
        }
        res.json({ status: true, message: "Orphanage deleted successfully", data: [] });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

module.exports = router;
