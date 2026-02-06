import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    // ---------------- PERSONAL ----------------
    pno: { type: String, required: true },
    officialRank: { type: String, required: true },
    brNoOrNid: { type: String, required: true },
    jobLocation: { type: String },
    permanentAddress: { type: String },
    userCategory: { type: String, required: true },
    fullName: { type: String, required: true },
    primaryMobile: { type: String, required: true },
    alternativeMobile: { type: String },
    email: { type: String },
    bloodGroup: { type: String },
    profileImage: { type: String },

    // ---------------- VEHICLE ----------------
    vehicleType: { type: String },
    registrationInfo: { type: String },
    registrationNo: { type: String },
    issueDate: { type: String },
    taxToken: { type: String },
    taxTokenImage: { type: String },
    vehicleBrand: { type: String },
    validity: { type: String },
    fitness: { type: String },
    fitnessImage: { type: String },
    vehicleModel: { type: String },
    chassisNumber: { type: String },
    engineNumber: { type: String },
    sticker: { type: String },
    stickerImage: { type: String },

    // ---------------- DRIVING ----------------
    drivingType: { type: String, enum: ["OWN", "HIRED"] },
    driverName: { type: String },
    driverImage: { type: String },
    driverNidNo: { type: String },
    drivingLicenseNo: { type: String },
    driverNidImage: { type: String },
    licenseExpireDate: { type: String },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Enrollment", enrollmentSchema);
