const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Adoption", required: true },
    updatedBy: { type: String, required: true }, // Ensure this is a string if it's not a MongoDB ObjectId
    adminStatus: { type: String, enum: ["Pending", "Approved", "Rejected"] },
    orphanageStatus: { type: String, enum: ["Pending", "Approved", "Rejected"] }
},
 { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
