const mongoose = require("mongoose");

const orphanSchema = new mongoose.Schema({
    // 🔹 Basic Information
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    orphanage: { type: mongoose.Schema.Types.ObjectId, ref: "Orphanage", required: true },

    // 🔹 Health & Medical Information
    generalHealth: { type: String, required: true },
    vaccinationStatus: { type: String, required: true },
    medicalHistory: { type: String },

    // 🔹 Background & Social Information
    familyStatus: { type: String, required: true },
    dateOfAdmission: { type: Date, required: true },
    previousLivingSituation: { type: String },
    languagesSpoken: [{ type: String }],
    hobbiesInterests: [{ type: String }],
    educationLevel: { type: String },

    // 🔹 Adoption Preferences & Legal Status
    eligibleForAdoption: { type: Boolean, required: true },
    countryRestrictions: { type: String, required: true },
    specialNeedsRequirements: { type: String },
    guardianContact: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    },

    // 🔹 Attachments (URLs for documents or images)
    profilePicture: { type: String },
    vaccinationReport: { type: String },
    legalAdoptionClearance: { type: String }
});

module.exports = mongoose.model("Orphan", orphanSchema);
