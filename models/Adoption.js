const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const adoptionSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, default: uuidv4 }, // Auto-generated Request ID
  orphanId: { type: mongoose.Schema.Types.ObjectId, ref: "Orphan", required: true },
  orphanageId: { type: mongoose.Schema.Types.ObjectId, ref: "Orphanage", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Parent applying

  // Applicant Details
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  phoneNumber: { type: String, required: true },
  maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], required: true },
  spouseName: { type: String },
  residentialAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },

  // Government ID
  governmentIdType: { type: String, enum: ["Aadhar", "PAN Card", "Passport", "Driver License", "Other"], required: true },
  idNumber: { type: String, required: true },
  idUpload: { type: String, required: true }, // File URL
  incomeProofUpload: { type: String, required: true },
  addressProofUpload: { type: String, required: true },

  // Employment & Financial Details
  occupation: { type: String, required: true },
  employerName: { type: String },
  employmentType: { type: String, enum: ["Permanent", "Self Employed", "Business", "Retired"], required: true },
  annualIncome: { type: Number, required: true },
  financialStability: { type: Boolean, required: true },

  // Family & Health
  hasChildren: { type: Boolean, required: true },
  numberOfChildren: { type: Number, required: function() { return this.hasChildren === true; } }, // Required if hasChildren is true
  religion: { type: String, required: true },
  familySupport: { type: Boolean, required: true },
  chronicIllness: { type: Boolean, required: true },
  mentalHealthConditions: { type: Boolean, required: true },
  fertilityTreatments: { type: Boolean, required: true },
  healthDocumentsUpload: { type: String },

  // Adoption Preferences
  adoptionReason: { 
    type: String, 
    enum: ["Unable to conceive", "Provide a loving home", "Expand family", "Humanitarian cause", "Religious beliefs", "Other"], 
    required: true 
  },
  adoptionReasonOther: { type: String, required: function() { return this.adoptionReason === "Other"; } }, // Required if "Other" is selected

  openToSiblingAdoption: { type: Boolean, required: true },
  openToSpecialNeedsAdoption: { type: Boolean, required: true },
  adoptionType: { type: String, enum: ["Domestic", "International", "Open Adoption", "Closed Adoption"], required: true },

  // Adoption Process
  preferredDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  policeClearance: { type: Boolean, required: true },
  policeClearanceUpload: { type: String },
  previousAdoption: { type: Boolean, required: true },
  educationPlan: { type: String, required: true },
  healthcarePlan: { type: String, required: true },
  livingArrangement: { type: String, enum: ["Own House", "Rented House"], required: true },
  postAdoptionFollowUp: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Adoption", adoptionSchema);
