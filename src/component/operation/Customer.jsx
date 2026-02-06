import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api"; // adjust path
import EditModal from "./EditModal";

export default function Customer() {
  // ===============================
  // Enrollment Data
  // ===============================
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Pagination
  // ===============================
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  // ===============================
  // Modal & Form State
  // ===============================
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  // ===============================
  // Fetch enrollments
  // ===============================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enrollment");
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ===============================
  // Open Modal
  // ===============================
  const openEditModal = (customer) => {
    console.log(customer);

    setSelectedCustomer(customer);
    setForm({ ...customer }); // load all fields from backend
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedCustomer(null);
    setForm({});
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ===============================
  // Update Enrollment
  // ===============================
  const handleUpdate = async () => {
    try {
      await api.put(`/enrollment/${selectedCustomer._id}`, form);
      alert("Updated successfully!");
      fetchCustomers();
      closeEditModal();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  // ===============================
  // Delete Enrollment
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/enrollment/${id}`);
      fetchCustomers();
      alert("Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // ===============================
  // Pagination
  // ===============================
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = customers.slice(startIndex, startIndex + itemsPerPage);

  // ===============================
  // ESC closes modal
  // ===============================
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeEditModal();
    };
    if (isEditOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditOpen]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Customer Entry
          </h2>
          <Link
            to="/customerEntry"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Customer
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Profile</th>
                    <th className="px-3 py-2">PNO</th>
                    <th className="px-3 py-2">Full Name</th>
                    <th className="px-3 py-2">Mobile</th>
                    <th className="px-3 py-2">NID</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Entry By</th>
                    <th className="px-3 py-2">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, idx) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{startIndex + idx + 1}</td>
                      <td className="px-3 py-2">
                        <img
                          src={item.profileImage || "https://i.pravatar.cc/100"}
                          alt="profile"
                          className="w-10 h-10 rounded-full border"
                        />
                      </td>
                      <td className="px-3 py-2">{item.pno}</td>
                      <td className="px-3 py-2">{item.fullName}</td>
                      <td className="px-3 py-2">{item.primaryMobile}</td>
                      <td className="px-3 py-2">{item.brNoOrNid}</td>
                      <td className="px-3 py-2">{item.userCategory}</td>
                      <td className="px-3 py-2">{item.entryBy || "system"}</td>
                      <td className="px-3 py-2 flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm">
              <p className="text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, customers.length)} of{" "}
                {customers.length}
              </p>
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 border rounded ${
                        page === p ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===============================
          Edit Modal
         =============================== */}
      {isEditOpen && (
        <EditModal
          enrollmentInfo={form}
          setEnrollmentInfo={setForm}
          onClose={closeEditModal}
          onUpdate={handleUpdate}
          uploading={uploading}
          setUploading={setUploading}
        />
      )}
    </div>
  );
}

// ===============================
// Edit Modal
// ===============================
// function EditModal({
//   enrollmentData,
//   setEnrollmentData,
//   onClose,
//   onUpdate,
//   uploading,
//   setUploading,
// }) {
//   const { setup, loadingSetup } = useSetup();

//   if (!enrollmentData) return null;

//   // universal change handler for modal
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEnrollmentData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // image upload helper
//   const handleImageUpload = async (fieldName, file) => {
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

//   const registrationInfoOptions = ["New Registration", "Renew", "Transfer"];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-3"
//       role="dialog"
//       aria-modal="true"
//     >
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />

//       {/* Modal Box */}
//       <div className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] p-4">
//         <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-3 rounded-t-xl">
//           <div className="font-semibold text-sm md:text-base">
//             Edit Customer
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center"
//           >
//             ✕
//           </button>
//         </div>

//         {/* ================= Personal Identification ================= */}
//         <section className="mt-4">
//           <h2 className="text-lg font-semibold border-b pb-2 mb-4">
//             Personal Identification
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Input
//               label="PNO"
//               required
//               name="pno"
//               value={enrollmentData.pno}
//               onChange={handleChange}
//             />
//             <Select
//               label="User Category"
//               name="userCategory"
//               value={enrollmentData.userCategory}
//               onChange={handleChange}
//               options={setup?.UserCategory || []}
//             />
//             <Select
//               label="Official Rank"
//               name="officialRank"
//               value={enrollmentData.officialRank}
//               onChange={handleChange}
//               options={setup?.Rank || []}
//             />
//             <Input
//               label="User Full Name"
//               required
//               className="md:col-span-2"
//               name="fullName"
//               value={enrollmentData.fullName}
//               onChange={handleChange}
//             />
//             <Input
//               label="BR NO / NID Number"
//               required
//               name="brNoOrNid"
//               value={enrollmentData.brNoOrNid}
//               onChange={handleChange}
//             />
//             <Input
//               label="Primary Mobile No"
//               required
//               name="primaryMobile"
//               value={enrollmentData.primaryMobile}
//               onChange={handleChange}
//             />
//             <Input
//               label="Alternative Mobile No"
//               name="alternativeMobile"
//               value={enrollmentData.alternativeMobile}
//               onChange={handleChange}
//             />
//             <Input
//               label="Email Address"
//               type="email"
//               name="email"
//               value={enrollmentData.email}
//               onChange={handleChange}
//             />
//             <Select
//               label="Job Location"
//               name="jobLocation"
//               value={enrollmentData.jobLocation}
//               onChange={handleChange}
//               options={setup?.JobLocation || []}
//             />
//             <Select
//               label="Blood Group"
//               name="bloodGroup"
//               value={enrollmentData.bloodGroup}
//               onChange={handleChange}
//               options={setup?.BloodGroup || []}
//             />
//             <Textarea
//               label="Permanent Address"
//               className="md:col-span-3"
//               name="permanentAddress"
//               value={enrollmentData.permanentAddress}
//               onChange={handleChange}
//             />
//             <Upload
//               label="Profile Image"
//               onUpload={(file) => handleImageUpload("profileImage", file)}
//             />
//             {enrollmentData.profileImage && (
//               <p className="text-xs text-green-700 md:col-span-3">
//                 Profile Image Uploaded ✅
//               </p>
//             )}
//           </div>
//         </section>

//         {/* ================= Vehicle Information ================= */}
//         <section className="mt-6">
//           <h2 className="text-lg font-semibold border-b pb-2 mb-4">
//             Vehicle Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Select
//               label="Vehicle Type"
//               required
//               name="vehicleType"
//               value={enrollmentData.vehicleType}
//               onChange={handleChange}
//               options={setup?.VehicleType || []}
//             />
//             <Select
//               label="Vehicle Brand"
//               required
//               name="vehicleBrand"
//               value={enrollmentData.vehicleBrand}
//               onChange={handleChange}
//               options={setup?.VehicleBrand || []}
//             />
//             <Select
//               label="Vehicle Model"
//               required
//               name="vehicleModel"
//               value={enrollmentData.vehicleModel}
//               onChange={handleChange}
//               options={setup?.VehicleModel || []}
//             />
//             <Select
//               label="Enter Registration Info"
//               required
//               name="registrationInfo"
//               value={enrollmentData.registrationInfo}
//               onChange={handleChange}
//               options={registrationInfoOptions}
//             />
//             <Input
//               label="Registration No"
//               required
//               className="md:col-span-2"
//               name="registrationNo"
//               value={enrollmentData.registrationNo}
//               onChange={handleChange}
//             />
//             <Input
//               label="Chassis Number"
//               required
//               name="chassisNumber"
//               value={enrollmentData.chassisNumber}
//               onChange={handleChange}
//             />
//             <Input
//               label="Engine Number"
//               required
//               name="engineNumber"
//               value={enrollmentData.engineNumber}
//               onChange={handleChange}
//             />
//             <Input
//               type="date"
//               label="Issue Date"
//               required
//               name="issueDate"
//               value={enrollmentData.issueDate}
//               onChange={handleChange}
//             />
//             <Input
//               label="Validity"
//               required
//               name="validity"
//               value={enrollmentData.validity}
//               onChange={handleChange}
//             />

//             {/* Tax Token */}
//             <div className="flex gap-2 items-end">
//               <Input
//                 label="Tax Token"
//                 required
//                 name="taxToken"
//                 value={enrollmentData.taxToken}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Tax Token Image"
//                 onUpload={(file) => handleImageUpload("taxTokenImage", file)}
//               />
//               {enrollmentData.taxTokenImage && (
//                 <p className="text-xs text-green-700 md:col-span-3">
//                   Tax Token Image Uploaded ✅
//                 </p>
//               )}
//             </div>

//             {/* Fitness */}
//             <div className="flex gap-2 items-end">
//               <Input
//                 label="Fitness"
//                 name="fitness"
//                 value={enrollmentData.fitness}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Fitness Image"
//                 onUpload={(file) => handleImageUpload("fitnessImage", file)}
//               />
//               {enrollmentData.fitnessImage && (
//                 <p className="text-xs text-green-700 md:col-span-3">
//                   Fitness Image Uploaded ✅
//                 </p>
//               )}
//             </div>

//             {/* Sticker */}
//             <div className="flex gap-2 items-end">
//               <Input
//                 label="Sticker"
//                 name="sticker"
//                 value={enrollmentData.sticker}
//                 onChange={handleChange}
//               />
//               <Upload
//                 label="Sticker Image"
//                 onUpload={(file) => handleImageUpload("stickerImage", file)}
//               />
//               {enrollmentData.stickerImage && (
//                 <p className="text-xs text-green-700 md:col-span-3">
//                   Sticker Image Uploaded ✅
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* ================= Driving Information ================= */}
//         <section className="mt-6">
//           <h2 className="text-lg font-semibold border-b pb-2 mb-4">
//             Driving Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Driving Type <span className="text-red-500">*</span>
//               </label>
//               <div className="flex gap-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="drivingType"
//                     value="OWN"
//                     checked={enrollmentData.drivingType === "OWN"}
//                     onChange={handleChange}
//                   />
//                   OWN
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="drivingType"
//                     value="HIRED"
//                     checked={enrollmentData.drivingType === "HIRED"}
//                     onChange={handleChange}
//                   />
//                   HIRED
//                 </label>
//               </div>
//             </div>

//             <Input
//               label="Driver NID No"
//               required
//               name="driverNidNo"
//               value={enrollmentData.driverNidNo}
//               onChange={handleChange}
//             />
//             <Upload
//               label="Driver NID Image"
//               onUpload={(file) => handleImageUpload("driverNidImage", file)}
//             />
//             {enrollmentData.driverNidImage && (
//               <p className="text-xs text-green-700 md:col-span-3">
//                 Driver Nid Image Uploaded ✅
//               </p>
//             )}

//             <Input
//               label="Driver Full Name"
//               required
//               name="driverName"
//               value={enrollmentData.driverName}
//               onChange={handleChange}
//             />
//             <Input
//               label="Driving License No"
//               required
//               name="drivingLicenseNo"
//               value={enrollmentData.drivingLicenseNo}
//               onChange={handleChange}
//             />
//             <Input
//               type="date"
//               label="License Expire Date"
//               required
//               name="licenseExpireDate"
//               value={enrollmentData.licenseExpireDate}
//               onChange={handleChange}
//             />
//             <Upload
//               label="Driver Image"
//               onUpload={(file) => handleImageUpload("driverImage", file)}
//             />
//             {enrollmentData.driverImage && (
//               <p className="text-xs text-green-700 md:col-span-3">
//                 Driver Image Uploaded ✅
//               </p>
//             )}
//           </div>
//         </section>

//         {/* ================= Buttons ================= */}
//         {uploading && (
//           <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
//         )}
//         <div className="flex justify-end gap-4 pt-4">
//           <button
//             disabled={uploading}
//             className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
//             onClick={onUpdate}
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

// ===============================
// Field Input Helper
// ===============================
// function FieldInput({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="text-xs font-semibold text-gray-600">{label}</label>
//       <input
//         type="text"
//         value={value || ""}
//         onChange={(e) => onChange(e.target.value)}
//         className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         placeholder={label}
//       />
//     </div>
//   );
// }
