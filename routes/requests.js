const express = require("express");
const Request = require("../models/Request");
const multer = require("multer");
const upload = multer();

const router = express.Router();

// 📌 Update Request Status (Admin/Orphanage)
router.post("/update-status", upload.none(), async (req, res) => {
  try {
    const { requestId, status, updatedBy, role } = req.body;

    // 🛑 Validate Required Fields
    if (!requestId || !status || !updatedBy || !role) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: requestId, status, updatedBy, role.",
        data: []
      });
    }

    // 🛑 Validate Status
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status. Allowed values: 'Pending', 'Approved', 'Rejected'.",
        data: []
      });
    }

    let updateFields = { updatedBy };

    // 🛑 Validate Role
    if (role === "Admin") {
      updateFields.adminStatus = status;
    } else if (role === "Orphanage") {
      updateFields.orphanageStatus = status;
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid role. Must be 'Admin' or 'Orphanage'.",
        data: []
      });
    }

    // 🔄 Update Request in Database
    const request = await Request.findByIdAndUpdate(requestId, updateFields, { new: true });

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Request not found.",
        data: []
      });
    }

    // ✅ Success Response
    res.status(200).json({
      status: true,
      message: "Request status updated successfully.",
      data: [{ request }]
    });

  } catch (error) {
    // 🚨 Internal Server Error Response
    res.status(500).json({
      status: false,
      message: "Internal server error.",
      data: [{ error: error.message }]
    });
  }
});

module.exports = router;
