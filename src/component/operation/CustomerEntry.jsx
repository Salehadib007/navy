import { useState } from "react";
import { uploadImage } from "../../../utils/uploadImages.js";
import { useSetup } from "../../../context/SetupContext";

// TODO: replace with your real api instance import
import api from "../../../utils/api.js";

export default function CustomerEntry() {
  const { setup, loadingSetup } = useSetup();
  console.log(setup);

  // Manual options (not in Setup model)
  const registrationInfoOptions = ["New Registration", "Renew", "Transfer"];

  const [enrollment, setEnrollment] = useState({
    // ---------------- PERSONAL ----------------
    pno: "",
    officialRank: "",
    brNoOrNid: "",
    jobLocation: "",
    permanentAddress: "",
    userCategory: "",
    fullName: "",
    primaryMobile: "",
    alternativeMobile: "",
    email: "",
    bloodGroup: "",
    profileImage: "",

    // ---------------- VEHICLE ----------------
    vehicleType: "",
    registrationInfo: "",
    registrationNo: "",
    issueDate: "",
    taxToken: "",
    taxTokenImage: "",
    vehicleBrand: "",
    validity: "",
    fitness: "",
    fitnessImage: "",
    vehicleModel: "",
    chassisNumber: "",
    engineNumber: "",
    sticker: "",
    stickerImage: "",

    // ---------------- DRIVING ----------------
    drivingType: "", // OWN | HIRED
    driverName: "",
    driverImage: "",
    driverNidNo: "",
    drivingLicenseNo: "",
    driverNidImage: "",
    licenseExpireDate: "",
  });

  const [uploading, setUploading] = useState(false);

  // universal change handler (Input/Select/Textarea/Radio)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEnrollment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // validation example
      if (!enrollment.pno || !enrollment.fullName) {
        alert("PNO and Full Name are required!");
        return;
      }
      console.log(enrollment);

      await api.post("/enrollment", enrollment);

      alert("Enrollment saved successfully!");

      // reset after submit
      setEnrollment({
        // ---------------- PERSONAL ----------------
        pno: "",
        officialRank: "",
        brNoOrNid: "",
        jobLocation: "",
        permanentAddress: "",
        userCategory: "",
        fullName: "",
        primaryMobile: "",
        alternativeMobile: "",
        email: "",
        bloodGroup: "",
        profileImage: "",

        // ---------------- VEHICLE ----------------
        vehicleType: "",
        registrationInfo: "",
        registrationNo: "",
        issueDate: "",
        taxToken: "",
        taxTokenImage: "",
        vehicleBrand: "",
        validity: "",
        fitness: "",
        fitnessImage: "",
        vehicleModel: "",
        chassisNumber: "",
        engineNumber: "",
        sticker: "",
        stickerImage: "",

        // ---------------- DRIVING ----------------
        drivingType: "",
        driverName: "",
        driverImage: "",
        driverNidNo: "",
        drivingLicenseNo: "",
        driverNidImage: "",
        licenseExpireDate: "",
      });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save enrollment!");
    }
  };

  // upload helper
  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);

      setEnrollment((prev) => ({
        ...prev,
        [fieldName]: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8 bg-gray-100">
      {loadingSetup ? (
        <p>Loading setup...</p>
      ) : (
        <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-4 md:p-6 space-y-8">
          {/* ================= Personal Identification ================= */}
          <section>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Personal Identification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="PNO"
                required
                name="pno"
                value={enrollment.pno}
                onChange={handleChange}
              />

              <Select
                label="User Category"
                name="userCategory"
                value={enrollment.userCategory}
                onChange={handleChange}
                options={setup?.UserCategory || []}
              />

              <Select
                label="Official Rank"
                name="officialRank"
                value={enrollment.officialRank}
                onChange={handleChange}
                options={setup?.Rank || []}
              />

              <Input
                label="User Full Name"
                required
                className="md:col-span-2"
                name="fullName"
                value={enrollment.fullName}
                onChange={handleChange}
              />

              <Input
                label="BR NO / NID Number"
                required
                name="brNoOrNid"
                value={enrollment.brNoOrNid}
                onChange={handleChange}
              />

              <Input
                label="Primary Mobile No"
                required
                name="primaryMobile"
                value={enrollment.primaryMobile}
                onChange={handleChange}
              />

              <Input
                label="Alternative Mobile No"
                name="alternativeMobile"
                value={enrollment.alternativeMobile}
                onChange={handleChange}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={enrollment.email}
                onChange={handleChange}
              />

              <Select
                label="Job Location"
                name="jobLocation"
                value={enrollment.jobLocation}
                onChange={handleChange}
                options={setup?.JobLocation || []}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                value={enrollment.bloodGroup}
                onChange={handleChange}
                options={setup?.BloodGroup || []}
              />

              <Textarea
                label="Permanent Address"
                className="md:col-span-3"
                name="permanentAddress"
                value={enrollment.permanentAddress}
                onChange={handleChange}
              />

              <Upload
                label="Profile Image"
                onUpload={async (file) => {
                  const url = await uploadImage(file);
                  setEnrollment((prev) => ({ ...prev, profileImage: url }));
                }}
              />

              {enrollment.profileImage && (
                <p className="text-xs text-green-700 md:col-span-3">
                  Profile Image Uploaded ✅
                </p>
              )}
            </div>
          </section>

          {/* ================= Vehicle Information ================= */}
          <section>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Vehicle Type"
                required
                name="vehicleType"
                value={enrollment.vehicleType}
                onChange={handleChange}
                options={setup?.VehicleType || []}
              />

              <Select
                label="Vehicle Brand"
                required
                name="vehicleBrand"
                value={enrollment.vehicleBrand}
                onChange={handleChange}
                options={setup?.VehicleBrand || []}
              />

              <Select
                label="Vehicle Model"
                required
                name="vehicleModel"
                value={enrollment.vehicleModel}
                onChange={handleChange}
                options={setup?.VehicleModel || []}
              />

              <Select
                label="Enter Registration Info"
                required
                name="registrationInfo"
                value={enrollment.registrationInfo}
                onChange={handleChange}
                options={registrationInfoOptions}
              />

              <Input
                label="Registration No"
                required
                className="md:col-span-2"
                name="registrationNo"
                value={enrollment.registrationNo}
                onChange={handleChange}
              />

              <Input
                label="Chassis Number"
                required
                name="chassisNumber"
                value={enrollment.chassisNumber}
                onChange={handleChange}
              />

              <Input
                label="Engine Number"
                required
                name="engineNumber"
                value={enrollment.engineNumber}
                onChange={handleChange}
              />

              <Input
                type="date"
                label="Issue Date"
                required
                name="issueDate"
                value={enrollment.issueDate}
                onChange={handleChange}
              />

              <Input
                type="date"
                label="Validity"
                required
                name="validity"
                value={enrollment.validity}
                onChange={handleChange}
              />

              <div className="flex gap-2 items-end">
                <Input
                  type="date"
                  label="Tax Token"
                  required
                  name="taxToken"
                  value={enrollment.taxToken}
                  onChange={handleChange}
                />
                <Upload
                  label="Tax Token Image"
                  onUpload={async (file) => {
                    const url = await uploadImage(file);
                    setEnrollment((prev) => ({ ...prev, taxTokenImage: url }));
                  }}
                />
                {enrollment.taxTokenImage && (
                  <p className="text-xs text-green-700 md:col-span-3">
                    Tax Token Image Uploaded ✅
                  </p>
                )}
              </div>

              <div className="flex gap-2 items-end">
                <Input
                  type="date"
                  label="Fitness"
                  name="fitness"
                  value={enrollment.fitness}
                  onChange={handleChange}
                />
                <Upload
                  label="Fitness Image"
                  onUpload={async (file) => {
                    const url = await uploadImage(file);
                    setEnrollment((prev) => ({ ...prev, fitnessImage: url }));
                  }}
                />
                {enrollment.fitnessImage && (
                  <p className="text-xs text-green-700 md:col-span-3">
                    Fitness Image Uploaded ✅
                  </p>
                )}
              </div>

              <div className="flex gap-2 items-end">
                <Input
                  type="date"
                  label="Sticker"
                  name="sticker"
                  value={enrollment.sticker}
                  onChange={handleChange}
                />
                <Upload
                  label="Sticker Image"
                  onUpload={async (file) => {
                    const url = await uploadImage(file);
                    setEnrollment((prev) => ({ ...prev, stickerImage: url }));
                  }}
                />
                {enrollment.stickerImage && (
                  <p className="text-xs text-green-700 md:col-span-3">
                    Sticker Image Uploaded ✅
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ================= Driving Information ================= */}
          <section>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Driving Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Driving Type <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="drivingType"
                      value="OWN"
                      checked={enrollment.drivingType === "OWN"}
                      onChange={handleChange}
                    />
                    OWN
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="drivingType"
                      value="HIRED"
                      checked={enrollment.drivingType === "HIRED"}
                      onChange={handleChange}
                    />
                    HIRED
                  </label>
                </div>
              </div>

              <Input
                label="Driver NID No"
                required
                name="driverNidNo"
                value={enrollment.driverNidNo}
                onChange={handleChange}
              />

              <Upload
                label="Driver NID Image"
                onUpload={async (file) => {
                  const url = await uploadImage(file);
                  setEnrollment((prev) => ({ ...prev, driverNidImage: url }));
                }}
              />
              {enrollment.driverNidImage && (
                <p className="text-xs text-green-700 md:col-span-3">
                  Driver Nid Image Uploaded ✅
                </p>
              )}
              <Input
                label="Driver Full Name"
                required
                name="driverName"
                value={enrollment.driverName}
                onChange={handleChange}
              />

              <Input
                label="Driving License No"
                required
                name="drivingLicenseNo"
                value={enrollment.drivingLicenseNo}
                onChange={handleChange}
              />

              <Input
                type="date"
                label="License Expire Date"
                required
                name="licenseExpireDate"
                value={enrollment.licenseExpireDate}
                onChange={handleChange}
              />

              <Upload
                label="Driver Image"
                onUpload={async (file) => {
                  const url = await uploadImage(file);
                  setEnrollment((prev) => ({ ...prev, driverImage: url }));
                }}
              />
              {enrollment.driverImage && (
                <p className="text-xs text-green-700 md:col-span-3">
                  Driver Image Uploaded ✅
                </p>
              )}
            </div>
          </section>

          {/* ================= Buttons ================= */}
          {uploading && (
            <p className="text-sm text-blue-600">Uploading image...</p>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              onClick={handleSubmit}
              type="button"
            >
              SAVE
            </button>

            <button
              type="button"
              className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Reusable Components ================= */

function Input({
  label,
  required,
  type = "text",
  className = "",
  name,
  value,
  onChange,
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
}

function Select({
  label,
  required,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">{placeholder}</option>

        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, className = "", name, value, onChange }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        rows="3"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
}

function Upload({ label, onUpload }) {
  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input type="file" onChange={handleChange} className="w-full text-sm" />
    </div>
  );
}
