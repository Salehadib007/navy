import mongoose from "mongoose";

const setupSchema = new mongoose.Schema(
  {
    Branch: [String],
    Rank: [String],
    VehicleBrand: [String],
    UserCategory: [String],
    JobLocation: [String],
    BRTALocation: [String],
    BRTADigit: [String],
    BloodGroup: [String],
    VehicleModel: [String],
    VehicleType: [String],
    SMSCategory: [String],
    Employee: [String],
    Department: [String],
    Designation: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Setup", setupSchema);
