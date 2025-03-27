const express = require("express");
const Adoption = require("../models/Adoption");
const Request = require("../models/Request");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// 🔹 Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/adoption-docs/"); // Save files in uploads/adoption-docs/
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// 🔹 File Filter: Only allow PDFs & images
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDFs and images are allowed."), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ Upload Handler for Multiple File Fields
const uploadFields = upload.fields([
    { name: "idUpload", maxCount: 1 },
    { name: "incomeProofUpload", maxCount: 1 },
    { name: "addressProofUpload", maxCount: 1 },
    { name: "healthDocumentsUpload", maxCount: 1 },
    { name: "policeClearanceUpload", maxCount: 1 }
]);

// ✅ Create Adoption Request with Document Upload
router.post("/", uploadFields, async (req, res) => {
    try {
        // Validate "Other" adoption reason
        if (req.body.adoptionReason === "Other" && !req.body.adoptionReasonOther) {
            return res.status(400).json({ status: false, message: "Please provide details for 'Other' adoption reason.", data: [] });
        }

        // Validate "numberOfChildren" if "hasChildren" is true
        if (req.body.hasChildren === "true" && (!req.body.numberOfChildren || req.body.numberOfChildren < 1)) {
            return res.status(400).json({ status: false, message: "Please provide the number of children.", data: [] });
        }

        // Extract uploaded file paths
        const files = req.files;
        const documentPaths = {
            idUpload: files.idUpload ? "/uploads/adoption-docs/" + files.idUpload[0].filename : null,
            incomeProofUpload: files.incomeProofUpload ? "/uploads/adoption-docs/" + files.incomeProofUpload[0].filename : null,
            addressProofUpload: files.addressProofUpload ? "/uploads/adoption-docs/" + files.addressProofUpload[0].filename : null,
            healthDocumentsUpload: files.healthDocumentsUpload ? "/uploads/adoption-docs/" + files.healthDocumentsUpload[0].filename : null,
            policeClearanceUpload: files.policeClearanceUpload ? "/uploads/adoption-docs/" + files.policeClearanceUpload[0].filename : null
        };

        // Step 1️⃣: Save the adoption request
        const newApplication = new Adoption({
            ...req.body,
            ...documentPaths
        });

        await newApplication.save();

        // Step 2️⃣: Store request ID in the Request Database
        const newRequest = new Request({
            requestId: newApplication._id,
            applicantId: req.body.applicantId,
            orphanageId: req.body.orphanageId,
            orphanId: req.body.orphanId,
            status: "Pending"
        });

        await newRequest.save();

        res.status(201).json({
            status: true,
            message: "Adoption application submitted successfully!",
            data: [{ requestId: newApplication._id, documents: documentPaths }]
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", data: [{ error: error.message }] });
    }
});

// ✅ Serve Uploaded Files
router.use("/uploads/adoption-docs", express.static("uploads/adoption-docs"));

module.exports = router;
