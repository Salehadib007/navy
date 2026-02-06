import { useEffect, useState } from "react";
import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path
import api from "../../../utils/api.js";
import { uploadImage } from "../../../utils/uploadImages.js"; // adjust path

export default function EditModal({ enrollmentInfo, onClose, onUpdated }) {
  const { setup, loadingSetup } = useSetup();
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  console.log(enrollmentInfo);
  const enrollmentId = enrollmentInfo._id;
  // ===================== Fetch single enrollment =====================
  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/enrollment/${enrollmentId}`);
      setEnrollmentData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch enrollment data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enrollmentId) fetchEnrollment();
  }, [enrollmentId]);

  if (loading || loadingSetup)
    return <p className="text-center mt-4">Loading...</p>;
  if (!enrollmentData) return null;

  // ===================== Universal change handler =====================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollmentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===================== File upload helper =====================
  const handleFileChange = async (fieldName, file) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setEnrollmentData((prev) => ({ ...prev, [fieldName]: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // ===================== Update enrollment =====================
  const handleUpdate = async () => {
    try {
      await api.put(`/enrollment/${enrollmentId}`, enrollmentData);
      alert("Enrollment updated successfully!");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update enrollment!");
    }
  };

  // ===================== Options from Setup =====================
  const {
    UserCategory = [],
    Rank = [],
    JobLocation = [],
    BloodGroup = [],
    VehicleType = [],
    VehicleBrand = [],
    VehicleModel = [],
  } = setup || {};

  const registrationInfoOptions = ["New Registration", "Renew", "Transfer"];
  const drivingTypes = ["OWN", "HIRED"];

  // ===================== UI =====================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] p-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-t-xl">
          <div className="font-semibold text-sm md:text-base">
            Edit Enrollment
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* ===================== Personal Info ===================== */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Personal Identification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label>
              <span className="text-sm font-medium">PNO</span>
              <input
                type="text"
                name="pno"
                value={enrollmentData.pno || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">User Category</span>
              <select
                name="userCategory"
                value={enrollmentData.userCategory || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {UserCategory.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Official Rank</span>
              <select
                name="officialRank"
                value={enrollmentData.officialRank || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {Rank.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-medium">Full Name</span>
              <input
                type="text"
                name="fullName"
                value={enrollmentData.fullName || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">BR NO / NID</span>
              <input
                type="text"
                name="brNoOrNid"
                value={enrollmentData.brNoOrNid || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Primary Mobile</span>
              <input
                type="text"
                name="primaryMobile"
                value={enrollmentData.primaryMobile || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Alternative Mobile</span>
              <input
                type="text"
                name="alternativeMobile"
                value={enrollmentData.alternativeMobile || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                value={enrollmentData.email || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Job Location</span>
              <select
                name="jobLocation"
                value={enrollmentData.jobLocation || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {JobLocation.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Blood Group</span>
              <select
                name="bloodGroup"
                value={enrollmentData.bloodGroup || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {BloodGroup.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="md:col-span-3">
              <span className="text-sm font-medium">Permanent Address</span>
              <textarea
                name="permanentAddress"
                value={enrollmentData.permanentAddress || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label className="md:col-span-3">
              <span className="text-sm font-medium">Profile Image</span>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange("profileImage", e.target.files[0])
                }
                className="mt-1 w-full"
              />
              {enrollmentData.profileImage && (
                <p className="text-xs text-green-700">Uploaded ✅</p>
              )}
            </label>
          </div>
        </section>

        {/* ===================== Vehicle Info ===================== */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label>
              <span className="text-sm font-medium">Vehicle Type</span>
              <select
                name="vehicleType"
                value={enrollmentData.vehicleType || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {VehicleType.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Vehicle Brand</span>
              <select
                name="vehicleBrand"
                value={enrollmentData.vehicleBrand || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {VehicleBrand.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Vehicle Model</span>
              <select
                name="vehicleModel"
                value={enrollmentData.vehicleModel || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {VehicleModel.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Registration Info</span>
              <select
                name="registrationInfo"
                value={enrollmentData.registrationInfo || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              >
                <option value="">Select</option>
                {registrationInfoOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-medium">Registration No</span>
              <input
                type="text"
                name="registrationNo"
                value={enrollmentData.registrationNo || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Chassis Number</span>
              <input
                type="text"
                name="chassisNumber"
                value={enrollmentData.chassisNumber || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Engine Number</span>
              <input
                type="text"
                name="engineNumber"
                value={enrollmentData.engineNumber || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Issue Date</span>
              <input
                type="date"
                name="issueDate"
                value={enrollmentData.issueDate || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-medium">Validity</span>
              <input
                type="text"
                name="validity"
                value={enrollmentData.validity || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
              />
            </label>
          </div>
        </section>

        {/* ===================== Buttons ===================== */}
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
        )}
        <div className="flex justify-end gap-4 pt-4">
          <button
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={handleUpdate}
          >
            UPDATE
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
