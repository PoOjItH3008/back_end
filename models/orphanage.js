const mongoose = require("mongoose");

const orphanageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationNumber: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    contact: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    },
    orphans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orphan" }]
});

orphanageSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Orphanage", orphanageSchema);
