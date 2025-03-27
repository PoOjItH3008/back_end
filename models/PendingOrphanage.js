const mongoose = require("mongoose");

const pendingOrphanageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    contact: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model("PendingOrphanage", pendingOrphanageSchema);
