// import React, { useState } from "react";
// import { useRegistration } from "../../../context/RegistrationContext";
// import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";

// const AddRegistrationOptions = () => {
//   const {
//     registrations,
//     addRegistration,
//     addItemToRegistration,
//     removeItemFromRegistration,
//     updateRegistration,
//     deleteRegistration,
//     loading,
//   } = useRegistration();

//   const [searchTerm, setSearchTerm] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(""); // "location" or "unit"
//   const [editing, setEditing] = useState({ id: null, value: "", index: null });
//   const [newItemValue, setNewItemValue] = useState("");

//   // ================= Filtered lists =================
//   const filteredLocations = registrations
//     .flatMap((r) => r.location.map((loc) => ({ id: r._id, value: loc })))
//     .filter((loc) =>
//       loc.value.toLowerCase().includes(searchTerm.toLowerCase()),
//     );

//   const filteredUnits = registrations
//     .flatMap((r) => r.unit.map((u) => ({ id: r._id, value: u })))
//     .filter((u) => u.value.toLowerCase().includes(searchTerm.toLowerCase()));

//   // ================= Open Modal =================
//   const openModal = (type, item = null) => {
//     setModalType(type);
//     if (item) {
//       setEditing(item);
//       setNewItemValue(item.value);
//     } else {
//       setEditing({ id: null, value: "", index: null });
//       setNewItemValue("");
//     }
//     setModalOpen(true);
//   };

//   // ================= Add or Update Item =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newItemValue.trim()) return;

//     try {
//       if (editing.id) {
//         // Update existing value
//         const reg = registrations.find((r) => r._id === editing.id);
//         const updatedArray =
//           modalType === "location" ? [...reg.location] : [...reg.unit];
//         updatedArray[updatedArray.indexOf(editing.value)] = newItemValue;

//         await updateRegistration(
//           editing.id,
//           modalType === "location"
//             ? { location: updatedArray }
//             : { unit: updatedArray },
//         );
//       } else {
//         // Add new item
//         if (registrations.length === 0) {
//           // No documents yet → create a new registration
//           await addRegistration(
//             modalType === "location"
//               ? { location: [newItemValue] }
//               : { unit: [newItemValue] },
//           );
//         } else {
//           // Add to the first document (or choose a document as needed)
//           const targetId = registrations[0]._id;
//           await addItemToRegistration(targetId, modalType, newItemValue);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setModalOpen(false);
//       setNewItemValue("");
//       setEditing({ id: null, value: "", index: null });
//     }
//   };

//   // ================= Delete item =================
//   const handleDelete = async (id, type, value) => {
//     if (!window.confirm("Are you sure you want to delete this?")) return;
//     try {
//       await removeItemFromRegistration(id, type, value);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen p-6 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4">Registration Options</h1>

//       {/* ================= Search & Add Buttons ================= */}
//       <div className="mb-6 flex items-center gap-2">
//         <FiSearch className="text-gray-500" />
//         <input
//           type="text"
//           placeholder="Search"
//           className="flex-1 p-2 border border-gray-300 rounded focus:outline-none"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button
//           onClick={() => openModal("location")}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
//         >
//           <FiPlus /> Add Location
//         </button>
//         <button
//           onClick={() => openModal("unit")}
//           className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1"
//         >
//           <FiPlus /> Add Unit
//         </button>
//       </div>

//       {/* ================= Locations Table ================= */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Locations</h2>
//         <div className="overflow-x-auto bg-white shadow rounded">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="2" className="text-center py-4">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredLocations.length === 0 ? (
//                 <tr>
//                   <td colSpan="2" className="text-center py-4">
//                     No locations
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLocations.map((loc, idx) => (
//                   <tr key={`${loc.id}-${idx}`}>
//                     <td className="px-6 py-4">{loc.value}</td>
//                     <td className="px-6 py-4 text-right flex justify-end gap-2">
//                       <button
//                         onClick={() => openModal("location", loc)}
//                         className="text-yellow-500 hover:text-yellow-700"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleDelete(loc.id, "location", loc.value)
//                         }
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= Units Table ================= */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Units</h2>
//         <div className="overflow-x-auto bg-white shadow rounded">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Unit
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="2" className="text-center py-4">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredUnits.length === 0 ? (
//                 <tr>
//                   <td colSpan="2" className="text-center py-4">
//                     No units
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUnits.map((u, idx) => (
//                   <tr key={`${u.id}-${idx}`}>
//                     <td className="px-6 py-4">{u.value}</td>
//                     <td className="px-6 py-4 text-right flex justify-end gap-2">
//                       <button
//                         onClick={() => openModal("unit", u)}
//                         className="text-yellow-500 hover:text-yellow-700"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(u.id, "unit", u.value)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= Modal ================= */}
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {editing.id ? "Edit" : "Add"} {modalType}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder={`Enter ${modalType}`}
//                 value={newItemValue}
//                 onChange={(e) => setNewItemValue(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none"
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setModalOpen(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`px-4 py-2 text-white rounded ${editing.id ? "bg-yellow-500 hover:bg-yellow-600" : modalType === "location" ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"}`}
//                 >
//                   {editing.id ? "Update" : "Add"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddRegistrationOptions;

import React, { useState } from "react";
import { useRegistration } from "../../../context/RegistrationContext";
import { FiSearch, FiPlus } from "react-icons/fi";

const AddRegistrationOptions = () => {
  const {
    registrations,
    addRegistration,
    addItemToRegistration,
    removeItemFromRegistration,
    updateRegistration,
    deleteRegistration,
    loading,
  } = useRegistration();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editing, setEditing] = useState({ id: null, value: "", index: null });
  const [newItemValue, setNewItemValue] = useState("");

  const filteredLocations = registrations
    .flatMap((r) => r.location.map((loc) => ({ id: r._id, value: loc })))
    .filter((loc) =>
      loc.value.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const filteredUnits = registrations
    .flatMap((r) => r.unit.map((u) => ({ id: r._id, value: u })))
    .filter((u) => u.value.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditing(item);
      setNewItemValue(item.value);
    } else {
      setEditing({ id: null, value: "", index: null });
      setNewItemValue("");
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItemValue.trim()) return;

    try {
      if (editing.id) {
        const reg = registrations.find((r) => r._id === editing.id);
        const updatedArray =
          modalType === "location" ? [...reg.location] : [...reg.unit];
        updatedArray[updatedArray.indexOf(editing.value)] = newItemValue;

        await updateRegistration(
          editing.id,
          modalType === "location"
            ? { location: updatedArray }
            : { unit: updatedArray },
        );
      } else {
        if (registrations.length === 0) {
          await addRegistration(
            modalType === "location"
              ? { location: [newItemValue] }
              : { unit: [newItemValue] },
          );
        } else {
          const targetId = registrations[0]._id;
          await addItemToRegistration(targetId, modalType, newItemValue);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setNewItemValue("");
      setEditing({ id: null, value: "", index: null });
    }
  };

  const handleDelete = async (id, type, value) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await removeItemFromRegistration(id, type, value);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Registration Options
      </h1>

      {/* Search & Add */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full">
          <FiSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => openModal("location")}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-1"
          >
            <FiPlus /> Add Location
          </button>

          <button
            onClick={() => openModal("unit")}
            className="w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center gap-1"
          >
            <FiPlus /> Add Unit
          </button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Locations</h2>
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-[500px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No locations
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <tr key={`${loc.id}-${idx}`}>
                    <td className="px-4 sm:px-6 py-4 break-words">
                      {loc.value}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => openModal("location", loc)}
                          className="text-yellow-500 hover:text-yellow-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(loc.id, "location", loc.value)
                          }
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Units Table */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Units</h2>
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-[500px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Unit
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No units
                  </td>
                </tr>
              ) : (
                filteredUnits.map((u, idx) => (
                  <tr key={`${u.id}-${idx}`}>
                    <td className="px-4 sm:px-6 py-4 break-words">{u.value}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          onClick={() => openModal("unit", u)}
                          className="text-yellow-500 hover:text-yellow-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, "unit", u.value)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white rounded shadow-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editing.id ? "Edit" : "Add"} {modalType}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={`Enter ${modalType}`}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-4 py-2 text-white rounded ${
                    editing.id
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : modalType === "location"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-purple-500 hover:bg-purple-600"
                  }`}
                >
                  {editing.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRegistrationOptions;
