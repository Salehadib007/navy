import { useEffect, useState } from "react";
import { uploadImage } from "../../../utils/uploadImages.js";
import { useSetup } from "../../../context/SetupContext";
import { useRegistration } from "../../../context/RegistrationContext";
import { useVehicle } from "../../../context/VehicleContext.jsx";
import api from "../../../utils/api.js";
import { formatDate } from "../../../utils/formatDate.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function CustomerEntry() {
  const { setup, loadingSetup } = useSetup();
  const { vehicles } = useVehicle();
  const { registrations } = useRegistration();
  // convert mm/dd/yyyy -> yyyy-mm-dd (for input type="date")
  const toISODate = (value) => {
    if (!value) return "";

    const parts = value.split("/");
    if (parts.length !== 3) return value;

    const [mm, dd, yyyy] = parts; // <-- swapped order

    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  };

  const [registrationParts, setRegistrationParts] = useState({
    location: "",
    unit: "",
    serial: "",
    year: "",
  });

  const locationOptions = registrations.flatMap((r) => r.location || []);
  const unitOptions = registrations.flatMap((r) => r.unit || []);

  const [enrollment, setEnrollment] = useState({
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
    chassisNumber: "",
    engineNumber: "",
    sticker: "",
    stickerImage: "",
    drivingType: "",
    driverName: "",
    driverImage: "",
    driverNidNo: "",
    drivingLicenseNo: "",
    driverNidImage: "",
    licenseExpireDate: "",
  });

  const [uploading, setUploading] = useState(false);

  // universal change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollment((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // update registrationParts and generate registrationInfo
  const handleRegistrationChange = (field, value) => {
    setRegistrationParts((prev) => {
      const updated = { ...prev, [field]: value };
      const { location, unit, serial, year } = updated;

      const combined =
        (location || "") +
        (unit ? "." + unit : "") +
        (serial ? "." + serial : "") +
        (year ? "." + year : "");

      setEnrollment((prevEnroll) => ({
        ...prevEnroll,
        registrationInfo: combined,
      }));

      return updated;
    });
  };

  // upload helper
  const handleImageUpload = async (fieldName, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setEnrollment((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!enrollment.pno || !enrollment.fullName) {
        alert("PNO and Full Name are required!");
        return;
      }

      await api.post("/enrollment", enrollment);
      alert("Enrollment saved successfully!");

      setEnrollment({
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
        chassisNumber: "",
        engineNumber: "",
        sticker: "",
        stickerImage: "",
        drivingType: "",
        driverName: "",
        driverImage: "",
        driverNidNo: "",
        drivingLicenseNo: "",
        driverNidImage: "",
        licenseExpireDate: "",
      });

      setRegistrationParts({ location: "", unit: "", serial: "", year: "" });
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save enrollment!");
    }
  };

  return (
    <div className="w-full bg-gray-200 min-h-screen p-4">
      {loadingSetup ? (
        <p>Loading setup...</p>
      ) : (
        <div className="w-full bg-white border border-gray-400">
          {/* ---------------- PERSONAL ---------------- */}
          <section className="border-b border-gray-400 p-4">
            <h2 className="font-semibold text-sm mb-4 border-b border-gray-400 pb-1">
              Personal Identification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <Input
                label="* PNO"
                name="pno"
                value={enrollment.pno}
                onChange={handleChange}
              />
              <Select
                label="* User Category"
                name="userCategory"
                value={enrollment.userCategory}
                onChange={handleChange}
                options={setup?.UserCategory || []}
              />
              <Select
                label="* Official Rank"
                name="officialRank"
                value={enrollment.officialRank}
                onChange={handleChange}
                options={setup?.Rank || []}
              />
              <Input
                label="* Full Name"
                className="md:col-span-2"
                name="fullName"
                value={enrollment.fullName}
                onChange={handleChange}
              />
              <Input
                label="* Primary Mobile"
                name="primaryMobile"
                value={enrollment.primaryMobile}
                onChange={handleChange}
              />
              <Input
                label="Alternative Mobile"
                name="alternativeMobile"
                value={enrollment.alternativeMobile}
                onChange={handleChange}
              />
              <Input
                label="* BR NO / NID"
                name="brNoOrNid"
                value={enrollment.brNoOrNid}
                onChange={handleChange}
              />
              <Select
                label="* Job Location"
                name="jobLocation"
                value={enrollment.jobLocation}
                onChange={handleChange}
                options={setup?.JobLocation || []}
              />
              <Select
                label="* Blood Group"
                name="bloodGroup"
                value={enrollment.bloodGroup}
                onChange={handleChange}
                options={setup?.BloodGroup || []}
              />
              <Input
                label="Email"
                name="email"
                value={enrollment.email}
                onChange={handleChange}
              />

              <Textarea
                label="Permanent Address"
                className="md:col-span-2"
                name="permanentAddress"
                value={enrollment.permanentAddress}
                onChange={handleChange}
              />

              {/* Profile Image */}
              <Upload
                label="Profile Image"
                value={enrollment.profileImage}
                onUpload={(file) => handleImageUpload("profileImage", file)}
              />
            </div>
          </section>

          {/* ---------------- VEHICLE ---------------- */}
          <section className="border-b border-gray-400 p-4">
            <h2 className="font-semibold text-sm mb-4 border-b border-gray-400 pb-1">
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <Select
                label="* Vehicle Type"
                name="vehicleType"
                value={enrollment.vehicleType}
                onChange={handleChange}
                options={vehicles?.map((v) => v.type) || []}
              />
              <Select
                label="* Vehicle Brand"
                name="vehicleBrand"
                value={enrollment.vehicleBrand}
                onChange={handleChange}
                options={setup?.VehicleBrand?.map((v) => v.split(".")[1]) || []}
              />
              <Select
                label="* Vehicle Model"
                name="vehicleModel"
                value={enrollment.vehicleModel}
                onChange={handleChange}
                options={setup?.VehicleModel?.map((v) => v) || []}
              />

              {/* Registration Info */}
              <div className="border rounded-xl p-4 space-y-4 bg-gray-50 md:col-span-3">
                <h3 className="font-semibold text-gray-700">
                  Registration Information
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <Select
                    value={registrationParts.location}
                    onChange={(e) =>
                      handleRegistrationChange("location", e.target.value)
                    }
                    options={locationOptions}
                  />
                  <Select
                    value={registrationParts.unit}
                    onChange={(e) =>
                      handleRegistrationChange("unit", e.target.value)
                    }
                    options={unitOptions}
                  />
                  <Input
                    value={registrationParts.serial}
                    onChange={(e) =>
                      handleRegistrationChange(
                        "serial",
                        e.target.value.toUpperCase(),
                      )
                    }
                  />
                  <Input
                    value={registrationParts.year}
                    onChange={(e) =>
                      handleRegistrationChange("year", e.target.value)
                    }
                  />
                </div>

                <Input
                  label="* Registration No"
                  className="md:col-span-2"
                  name="registrationNo"
                  value={enrollment.registrationNo}
                  onChange={handleChange}
                />

                <Upload
                  label="Sticker Image"
                  value={enrollment.stickerImage}
                  onUpload={(file) => handleImageUpload("stickerImage", file)}
                />
                <Input
                  label="Fitness"
                  name="fitness"
                  value={enrollment.fitness}
                  onChange={handleChange}
                />

                <Upload
                  label="Fitness Image"
                  value={enrollment.fitnessImage}
                  onUpload={(file) => handleImageUpload("fitnessImage", file)}
                />
              </div>

              <Input
                label="Sticker"
                name="sticker"
                value={enrollment.sticker}
                onChange={handleChange}
              />

              <Upload
                label="Sticker Image"
                value={enrollment.stickerImage}
                onUpload={(file) => handleImageUpload("stickerImage", file)}
              />
              <Input
                label="* Chassis Number"
                name="chassisNumber"
                value={enrollment.chassisNumber}
                onChange={handleChange}
              />
              <Input
                label="* Engine Number"
                name="engineNumber"
                value={enrollment.engineNumber}
                onChange={handleChange}
              />
              <Input
                type="date"
                label="* Issue Date"
                name="issueDate"
                value={enrollment.issueDate}
                onChange={(e) =>
                  setEnrollment((prev) => ({
                    ...prev,
                    issueDate: e.target.value,
                  }))
                }
              />

              <Input
                type="date"
                label="* Validity"
                name="validity"
                value={enrollment.validity}
                onChange={(e) =>
                  setEnrollment((prev) => ({
                    ...prev,
                    validity: e.target.value,
                  }))
                }
              />
              <Input
                label="Fitness"
                name="fitness"
                value={enrollment.fitness}
                onChange={handleChange}
              />

              <Upload
                label="Fitness Image"
                value={enrollment.fitnessImage}
                onUpload={(file) => handleImageUpload("fitnessImage", file)}
              />
              <Input
                type="date"
                label="* Tax Token"
                name="taxToken"
                value={enrollment.taxToken}
                onChange={(e) =>
                  setEnrollment((prev) => ({
                    ...prev,
                    taxToken: e.target.value,
                  }))
                }
              />
              <Upload
                label="Tax Token Image"
                value={enrollment.taxTokenImage}
                onUpload={(file) => handleImageUpload("taxTokenImage", file)}
              />
            </div>
          </section>

          {/* ---------------- DRIVING ---------------- */}
          <section className="p-4">
            <h2 className="font-semibold text-sm mb-4 border-b border-gray-400 pb-1">
              Driving Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <div>
                <label className="block mb-1">* Driving Type</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="drivingType"
                      value="OWN"
                      checked={enrollment.drivingType === "OWN"}
                      onChange={handleChange}
                    />{" "}
                    OWN
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="drivingType"
                      value="HIRED"
                      checked={enrollment.drivingType === "HIRED"}
                      onChange={handleChange}
                    />{" "}
                    HIRED
                  </label>
                </div>
              </div>

              <Input
                label="* Driver NID NO"
                name="driverNidNo"
                value={enrollment.driverNidNo}
                onChange={handleChange}
              />

              <Upload
                label="Driver NID Image"
                value={enrollment.driverNidImage}
                onUpload={(file) => handleImageUpload("driverNidImage", file)}
              />

              <Input
                label="* Full Name"
                name="driverName"
                value={enrollment.driverName}
                onChange={handleChange}
              />

              <Upload
                label="Driver Image"
                value={enrollment.driverImage}
                onUpload={(file) => handleImageUpload("driverImage", file)}
              />

              <Input
                label="* Driving License No"
                name="drivingLicenseNo"
                value={enrollment.drivingLicenseNo}
                onChange={handleChange}
              />

              <Input
                type="date"
                label="* License Expire Date"
                name="licenseExpireDate"
                value={enrollment.licenseExpireDate}
                onChange={(e) =>
                  setEnrollment((prev) => ({
                    ...prev,
                    licenseExpireDate: e.target.value,
                  }))
                }
              />
            </div>
          </section>

          {/* ---------------- BUTTONS ---------------- */}
          <div className="flex justify-end gap-4 p-4 border-t border-gray-400 bg-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-700 text-white text-sm"
            >
              SAVE
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 text-white text-sm"
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

      {type === "date" ? (
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) =>
            onChange({
              target: {
                name,
                value: date, // pass Date object directly
              },
            })
          }
          dateFormat="dd/MM/yy"
          className="w-[400px] border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          placeholderText="dd/mm/yy"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
      )}
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
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring focus:ring-blue-300"
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {typeof opt === "object" ? opt.value : opt}
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

/* ================= UPLOAD COMPONENT WITH PREVIEW ================= */
function Upload({ label, onUpload, value }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    onUpload(file);

    return () => URL.revokeObjectURL(objectUrl);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <input type="file" onChange={handleChange} className="w-full text-sm" />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-2 w-24 h-24 object-cover rounded border"
        />
      )}
    </div>
  );
}
