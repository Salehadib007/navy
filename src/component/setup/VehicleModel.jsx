import React from "react";
import { useVehicle } from "../../../context/VehicleContext";
import { useSetup } from "../../../context/SetupContext";

const VehicleModel = () => {
  const {
    vehicles,
    loading,
    error,
    search,
    setSearch,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    closeModal,
  } = useVehicle();

  // Inline filtering using vehicles directly
  const displayedVehicles = vehicles.filter((v) =>
    v?.type?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-4 border-b">
          <h2 className="text-lg md:text-xl font-semibold">
            Vehicle Type Management
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search vehicle type..."
              className="border px-3 py-2 rounded-md w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
              + Add Vehicle
            </button>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading vehicles...
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}

        {/* ================= TABLE (Desktop) ================= */}
        {!loading && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-3">SL</th>
                    <th className="p-3">Vehicle Type</th>
                    <th className="p-3">Count</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    displayedVehicles.map((vehicle, index) => (
                      <tr key={vehicle._id} className="border-b">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 capitalize">{vehicle.type}</td>
                        <td className="p-3 font-medium">
                          {vehicle.count || 0}
                        </td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE VIEW ================= */}
            <div className="md:hidden p-4 space-y-3">
              {displayedVehicles.length === 0 ? (
                <p className="text-center text-gray-500">No data found</p>
              ) : (
                displayedVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle._id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <p className="text-sm text-gray-500">#{index + 1}</p>

                    <h3 className="font-semibold text-lg capitalize">
                      {vehicle.type}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Count:{" "}
                      <span className="font-medium">{vehicle.count || 0}</span>
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="flex-1 bg-teal-600 text-white py-2 rounded-md text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ================= FOOTER ================= */}
            <div className="p-4 text-sm text-gray-600 border-t">
              Showing {displayedVehicles.length} entries
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Vehicle Type" : "Add Vehicle Type"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Vehicle Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border px-4 py-2 rounded-md w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModel;
