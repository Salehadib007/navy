// import { useEffect, useState } from "react";
// import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path
// import api from "../../../utils/api.js";
// import { uploadImage } from "../../../utils/uploadImages.js"; // adjust path

// export default function EditModal({ enrollmentInfo, onClose, onUpdated }) {
//   const { setup, loadingSetup } = useSetup();
//   const [enrollmentData, setEnrollmentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   // console.log(enrollmentInfo);
//   const enrollmentId = enrollmentInfo._id;
//   // ===================== Fetch single enrollment =====================
//   const fetchEnrollment = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/enrollment/${enrollmentId}`);
//       setEnrollmentData(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch enrollment data!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (enrollmentId) fetchEnrollment();
//   }, [enrollmentId]);

//   if (loading || loadingSetup)
//     return <p className="text-center mt-4">Loading...</p>;
//   if (!enrollmentData) return null;

//   // ===================== Universal change handler =====================
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEnrollmentData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // ===================== File upload helper =====================
//   const handleFileChange = async (fieldName, file) => {
//     if (!file) return;
//     try {
//       setUploading(true);
//       const url = await uploadImage(file);
//       setEnrollmentData((prev) => ({ ...prev, [fieldName]: url }));
//     } catch (err) {
//       console.error(err);
//       alert("Image upload failed!");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ===================== Update enrollment =====================
//   const handleUpdate = async () => {
//     try {
//       await api.put(`/enrollment/${enrollmentId}`, enrollmentData);
//       alert("Enrollment updated successfully!");
//       if (onUpdated) onUpdated();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update enrollment!");
//     }
//   };

//   // ===================== Options from Setup =====================
//   const {
//     UserCategory = [],
//     Rank = [],
//     JobLocation = [],
//     BloodGroup = [],
//     VehicleType = [],
//     VehicleBrand = [],
//     VehicleModel = [],
//   } = setup || {};

//   const registrationInfoOptions = ["New Registration", "Renew", "Transfer"];
//   const drivingTypes = ["OWN", "HIRED"];

//   // ===================== UI =====================
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />
//       <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] p-4">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-t-xl">
//           <div className="font-semibold text-sm md:text-base">
//             Edit Enrollment
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center"
//           >
//             ✕
//           </button>
//         </div>

//         {/* ===================== Personal Info ===================== */}
//         <section className="mt-4">
//           <h2 className="text-lg font-semibold border-b pb-2 mb-4">
//             Personal Identification
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <label>
//               <span className="text-sm font-medium">PNO</span>
//               <input
//                 type="text"
//                 name="pno"
//                 value={enrollmentData.pno || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">User Category</span>
//               <select
//                 name="userCategory"
//                 value={enrollmentData.userCategory || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {UserCategory.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Official Rank</span>
//               <select
//                 name="officialRank"
//                 value={enrollmentData.officialRank || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {Rank.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label className="md:col-span-2">
//               <span className="text-sm font-medium">Full Name</span>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={enrollmentData.fullName || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">BR NO / NID</span>
//               <input
//                 type="text"
//                 name="brNoOrNid"
//                 value={enrollmentData.brNoOrNid || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Primary Mobile</span>
//               <input
//                 type="text"
//                 name="primaryMobile"
//                 value={enrollmentData.primaryMobile || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Alternative Mobile</span>
//               <input
//                 type="text"
//                 name="alternativeMobile"
//                 value={enrollmentData.alternativeMobile || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Email</span>
//               <input
//                 type="email"
//                 name="email"
//                 value={enrollmentData.email || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Job Location</span>
//               <select
//                 name="jobLocation"
//                 value={enrollmentData.jobLocation || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {JobLocation.map((j) => (
//                   <option key={j} value={j}>
//                     {j}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Blood Group</span>
//               <select
//                 name="bloodGroup"
//                 value={enrollmentData.bloodGroup || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {BloodGroup.map((b) => (
//                   <option key={b} value={b}>
//                     {b}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label className="md:col-span-3">
//               <span className="text-sm font-medium">Permanent Address</span>
//               <textarea
//                 name="permanentAddress"
//                 value={enrollmentData.permanentAddress || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label className="md:col-span-3">
//               <span className="text-sm font-medium">Profile Image</span>
//               <input
//                 type="file"
//                 onChange={(e) =>
//                   handleFileChange("profileImage", e.target.files[0])
//                 }
//                 className="mt-1 w-full"
//               />
//               {enrollmentData.profileImage && (
//                 <p className="text-xs text-green-700">Uploaded ✅</p>
//               )}
//             </label>
//           </div>
//         </section>

//         {/* ===================== Vehicle Info ===================== */}
//         <section className="mt-6">
//           <h2 className="text-lg font-semibold border-b pb-2 mb-4">
//             Vehicle Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <label>
//               <span className="text-sm font-medium">Vehicle Type</span>
//               <select
//                 name="vehicleType"
//                 value={enrollmentData.vehicleType || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {VehicleType.map((v) => (
//                   <option key={v} value={v}>
//                     {v}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Vehicle Brand</span>
//               <select
//                 name="vehicleBrand"
//                 value={enrollmentData.vehicleBrand || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {VehicleBrand.map((b) => (
//                   <option key={b} value={b}>
//                     {b}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Vehicle Model</span>
//               <select
//                 name="vehicleModel"
//                 value={enrollmentData.vehicleModel || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {VehicleModel.map((m) => (
//                   <option key={m} value={m}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Registration Info</span>
//               <select
//                 name="registrationInfo"
//                 value={enrollmentData.registrationInfo || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               >
//                 <option value="">Select</option>
//                 {registrationInfoOptions.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               <span className="text-sm font-medium">Registration No</span>
//               <input
//                 type="text"
//                 name="registrationNo"
//                 value={enrollmentData.registrationNo || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Chassis Number</span>
//               <input
//                 type="text"
//                 name="chassisNumber"
//                 value={enrollmentData.chassisNumber || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Engine Number</span>
//               <input
//                 type="text"
//                 name="engineNumber"
//                 value={enrollmentData.engineNumber || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Issue Date</span>
//               <input
//                 type="date"
//                 name="issueDate"
//                 value={enrollmentData.issueDate || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>

//             <label>
//               <span className="text-sm font-medium">Validity</span>
//               <input
//                 type="text"
//                 name="validity"
//                 value={enrollmentData.validity || ""}
//                 onChange={handleChange}
//                 className="mt-1 w-full border rounded-md px-2 py-1 text-sm"
//               />
//             </label>
//           </div>
//         </section>

//         {/* ===================== Buttons ===================== */}
//         {uploading && (
//           <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
//         )}
//         <div className="flex justify-end gap-4 pt-4">
//           <button
//             disabled={uploading}
//             className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
//             onClick={handleUpdate}
//           >
//             UPDATE
//           </button>
//           <button
//             type="button"
//             className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
//             onClick={onClose}
//           >
//             CLOSE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useSetup } from "../../../context/SetupContext.jsx";
import api from "../../../utils/api.js";
import { uploadImage } from "../../../utils/uploadImages.js";

export default function EditModal({ enrollmentInfo, onClose, onUpdated }) {
  const { setup, loadingSetup } = useSetup();
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const enrollmentId = enrollmentInfo._id;

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
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!enrollmentData) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollmentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-t-2xl">
          <h2 className="text-white font-semibold text-lg">Edit Enrollment</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:opacity-70"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* ================= PERSONAL INFO ================= */}
          <section className="bg-gray-50 p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">
              Personal Identification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "PNO", name: "pno", type: "text" },
                { label: "Full Name", name: "fullName", type: "text", span: 2 },
                { label: "BR NO / NID", name: "brNoOrNid", type: "text" },
                {
                  label: "Primary Mobile",
                  name: "primaryMobile",
                  type: "text",
                },
                {
                  label: "Alternative Mobile",
                  name: "alternativeMobile",
                  type: "text",
                },
                { label: "Email", name: "email", type: "email" },
              ].map((field) => (
                <div
                  key={field.name}
                  className={field.span === 2 ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={enrollmentData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}

              {/* Select Fields */}
              {[
                {
                  label: "User Category",
                  name: "userCategory",
                  options: UserCategory,
                },
                { label: "Official Rank", name: "officialRank", options: Rank },
                {
                  label: "Job Location",
                  name: "jobLocation",
                  options: JobLocation,
                },
                {
                  label: "Blood Group",
                  name: "bloodGroup",
                  options: BloodGroup,
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={enrollmentData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Address */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Permanent Address
                </label>
                <textarea
                  name="permanentAddress"
                  value={enrollmentData.permanentAddress || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Profile Image */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange("profileImage", e.target.files[0])
                  }
                  className="w-full text-sm"
                />
                {enrollmentData.profileImage && (
                  <p className="text-xs text-green-600 mt-1">Uploaded ✅</p>
                )}
              </div>
            </div>
          </section>

          {/* ================= VEHICLE INFO ================= */}
          <section className="bg-gray-50 p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-6 border-b pb-2">
              Vehicle Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  label: "Vehicle Type",
                  name: "vehicleType",
                  options: VehicleType,
                },
                {
                  label: "Vehicle Brand",
                  name: "vehicleBrand",
                  options: VehicleBrand,
                },
                {
                  label: "Vehicle Model",
                  name: "vehicleModel",
                  options: VehicleModel,
                },
                {
                  label: "Registration Info",
                  name: "registrationInfo",
                  options: registrationInfoOptions,
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={enrollmentData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {[
                { label: "Registration No", name: "registrationNo" },
                { label: "Chassis Number", name: "chassisNumber" },
                { label: "Engine Number", name: "engineNumber" },
                { label: "Issue Date", name: "issueDate", type: "date" },
                { label: "Validity", name: "validity" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={enrollmentData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          {uploading && (
            <p className="text-sm text-indigo-600">Uploading image...</p>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <button
              disabled={uploading}
              onClick={handleUpdate}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition disabled:opacity-50"
            >
              UPDATE
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-medium shadow transition"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
