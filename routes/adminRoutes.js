const express = require("express");
const Orphanage = require("../models/orphanage"); // Main Orphanage Model
const PendingOrphanage = require("../models/PendingOrphanage"); // Pending Model
const router = express.Router();
const multer = require('multer');
const upload = multer();

// 🟢 Admin Approves Orphanage
router.put("/approve-orphanage/:id",upload.none(), async (req, res) => {
    try {
        // ✅ Find the orphanage in Pending Database
        const pendingOrphanage = await PendingOrphanage.findById(req.params.id);
        if (!pendingOrphanage) return res.status(404).json({ error: "Orphanage not found in pending requests" });

        // ✅ Move to Orphanage Database
        const approvedOrphanage = new Orphanage({
            name: pendingOrphanage.name,
            registrationNumber: pendingOrphanage.registrationNumber,
            address: pendingOrphanage.address,
            latitude: pendingOrphanage.latitude,
            longitude: pendingOrphanage.longitude,
            contact: pendingOrphanage.contact,
            orphans: [] // Empty initially
        });

        await approvedOrphanage.save();

        // ✅ Delete from Pending Database
        await PendingOrphanage.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Orphanage approved and moved to database!", orphanage: approvedOrphanage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
