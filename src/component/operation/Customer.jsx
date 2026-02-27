import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api"; // adjust path
import EditModal from "./EditModal";
import { useNavigate } from "react-router-dom";
import { PrinterIcon } from "lucide-react";
import CreatedBy from "./CreatedBy";
// import QRCode from "qrcode";

export default function Customer() {
  // ===============================
  // Enrollment Data
  // ===============================
  const [customers, setCustomers] = useState([]);
  // const [enteredBy, setEnteredBy] = useState("Admin");
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

  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map((item) => item._id));
    }
  };

  const generateQr = async () => {
    // console.log(selectedIds);

    if (!selectedIds.length) return alert("Select enrollments first!");

    try {
      // console.log(selectedIds);

      navigate("/enrollment-list", {
        state: {
          ids: selectedIds,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate qr-code");
    }
  };

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
    // console.log(customer);

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

  const showDetails = async (id) => {
    const res = await api.get(`/enrollment/${id}`);
    console.log(res.data[0]._id);
    navigate("/enrollment-details", {
      state: {
        enrollmentId: res?.data[0]?._id,
      },
    });
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
    // <div className="min-h-screen bg-gray-100 p-4">
    //   <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-4">
    //     {/* Header */}
    //     <div className="flex justify-between items-center mb-4">
    //       <div className="flex items-center gap-3">
    //         <h2 className="text-lg font-semibold text-gray-700">
    //           Customer Entry
    //         </h2>
    //         <div className="bg-red-500 rounded-full w-8 h-8 flex cursor-pointer items-center justify-center">
    //           <PrinterIcon onClick={generateQr} color="white">
    //             {/* <button
    //               disabled={selectedIds.length === 0}
    //               onClick={generateQr}
    //               className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
    //             >
    //               Generate QR ({selectedIds.length})
    //             </button> */}
    //           </PrinterIcon>
    //         </div>
    //       </div>
    //       <Link
    //         to="/customerEntry"
    //         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs"
    //       >
    //         + Add Customer
    //       </Link>
    //     </div>

    //     {loading ? (
    //       <p>Loading...</p>
    //     ) : (
    //       <>
    //         {/* Table */}
    //         <div className="overflow-x-auto border rounded-lg">
    //           <table className="min-w-[1100px] w-full text-xs">
    //             <thead className="bg-gray-800 text-white">
    //               <tr>
    //                 <th className="px-3 py-2">
    //                   <input
    //                     type="checkbox"
    //                     checked={
    //                       currentData.length > 0 &&
    //                       selectedIds.length === currentData.length
    //                     }
    //                     onChange={toggleSelectAll}
    //                   />
    //                 </th>
    //                 <th className="px-3 py-2">#</th>
    //                 <th className="px-3 py-2">Profile</th>
    //                 <th className="px-3 py-2">PNO</th>
    //                 <th className="px-3 py-2">Full Name</th>
    //                 <th className="px-3 py-2">Mobile</th>
    //                 <th className="px-3 py-2">NID</th>
    //                 <th className="px-3 py-2">Category</th>
    //                 <th className="px-3 py-2">Entry By</th>
    //                 <th className="px-3 py-2">Operation</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {currentData.map((item, idx) => (
    //                 <tr key={item._id} className="border-b hover:bg-gray-50">
    //                   <td className="px-3 py-2">
    //                     <input
    //                       type="checkbox"
    //                       checked={selectedIds.includes(item._id)}
    //                       onChange={() => toggleSelect(item._id)}
    //                     />
    //                   </td>
    //                   <td className="px-3 py-2">{startIndex + idx + 1}</td>
    //                   <td className="px-3 py-2">
    //                     <img
    //                       src={item.profileImage || "https://i.pravatar.cc/100"}
    //                       alt="profile"
    //                       className="w-10 h-10 rounded-full border"
    //                     />
    //                   </td>
    //                   <td
    //                     className="px-3 py-2 cursor-pointer hover:text-green-500 hover:underline"
    //                     onClick={() => showDetails(item._id)}
    //                   >
    //                     {item.pno}
    //                   </td>
    //                   <td className="px-3 py-2">{item.fullName}</td>
    //                   <td className="px-3 py-2">{item.primaryMobile}</td>
    //                   <td className="px-3 py-2">{item.brNoOrNid}</td>
    //                   <td className="px-3 py-2">{item.userCategory}</td>
    //                   <td className="px-3 py-2">{item.entryBy || "system"}</td>
    //                   <td className="px-3 py-2 flex gap-2 justify-center">
    //                     <button
    //                       onClick={() => openEditModal(item)}
    //                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
    //                     >
    //                       Edit
    //                     </button>
    //                     <button
    //                       onClick={() => handleDelete(item._id)}
    //                       className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
    //                     >
    //                       Delete
    //                     </button>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>

    //         {/* Pagination */}
    //         <div className="flex justify-between items-center mt-4 text-xs">
    //           <p className="text-gray-600">
    //             Showing {startIndex + 1} to{" "}
    //             {Math.min(startIndex + itemsPerPage, customers.length)} of{" "}
    //             {customers.length}
    //           </p>
    //           <div className="flex gap-1">
    //             <button
    //               disabled={page === 1}
    //               onClick={() => setPage(page - 1)}
    //               className="px-3 py-1 border rounded disabled:opacity-50"
    //             >
    //               Previous
    //             </button>
    //             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
    //               (p) => (
    //                 <button
    //                   key={p}
    //                   onClick={() => setPage(p)}
    //                   className={`px-3 py-1 border rounded ${
    //                     page === p ? "bg-blue-500 text-white" : ""
    //                   }`}
    //                 >
    //                   {p}
    //                 </button>
    //               ),
    //             )}
    //             <button
    //               disabled={page === totalPages}
    //               onClick={() => setPage(page + 1)}
    //               className="px-3 py-1 border rounded disabled:opacity-50"
    //             >
    //               Next
    //             </button>
    //           </div>
    //         </div>
    //       </>
    //     )}
    //   </div>

    // edited

    <div className="min-h-screen min-w-full bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b bg-white rounded-t-2xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Enrollment Entry
            </h2>

            <button
              onClick={generateQr}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-md"
            >
              <PrinterIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <Link
            to="/customerEntry"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-medium shadow-md transition duration-200"
          >
            + Add
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 text-lg">
            Loading...
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          currentData.length > 0 &&
                          selectedIds.length === currentData.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-center">#</th>
                    <th className="px-4 py-3 text-center">Profile</th>
                    <th className="px-4 py-3 text-left">PNO</th>
                    <th className="px-4 py-3 text-left">Rank & Full Name</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-left">NID</th>
                    <th className="px-4 py-3 text-left">User Category</th>
                    <th className="px-4 py-3 text-left">Entry By</th>
                    <th className="px-4 py-3 text-center">Operation</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentData.map((item, idx) => (
                    <tr
                      key={item._id}
                      className="hover:bg-indigo-50 transition duration-150"
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => toggleSelect(item._id)}
                          className="w-4 h-4"
                        />
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-gray-600">
                        {startIndex + idx + 1}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <img
                          src={item.profileImage || "https://i.pravatar.cc/100"}
                          alt="profile"
                          className="w-11 h-11 rounded-full border-2 border-indigo-200 shadow-sm object-cover mx-auto"
                        />
                      </td>

                      <td
                        className="px-4 py-3 cursor-pointer text-indigo-600 font-medium hover:underline"
                        onClick={() => showDetails(item._id)}
                      >
                        {item.pno}
                      </td>

                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {`${item.officialRank} ${item.fullName}`}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.primaryMobile}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {item.brNoOrNid}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                          {item.userCategory}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        <CreatedBy createdBy={item.createdBy} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item._id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-t bg-gray-50 rounded-b-2xl">
              <p className="text-gray-600 text-xs">
                Showing <span className="font-semibold">{startIndex + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(startIndex + itemsPerPage, customers.length)}
                </span>{" "}
                of <span className="font-semibold">{customers.length}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        page === p
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 transition"
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
