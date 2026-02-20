// // VehicleBrand.jsx
// import SetupItem from "../../component/setup/SetupItem";

// export default function VehicleBrand() {
//   return (
//     <SetupItem
//       setupKey="VehicleBrand"
//       title="Vehicle Type Setup"
//       placeholder="Vehicle Brand Name"
//     />
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
// import { useAddVehicle } from "../../../context/AddVehicleContext";
import { useVehicle } from "../../../context/VehicleContext";

const VehicleBrand = () => {
  const { vehicles } = useVehicle(); // Vehicle types from context

  const [brands, setBrands] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [brandName, setBrandName] = useState("");
  const [editingValue, setEditingValue] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= GET ================= */
  const getBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/setup");

      setBrands(res.data?.VehicleBrand || []);
      setError(null);
    } catch {
      setError("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  /* ================= ADD ================= */
  const addBrand = async () => {
    if (!selectedType || !brandName.trim()) return;

    const formattedValue = `${selectedType}.${brandName}`;

    setLoading(true);
    try {
      await api.post("/setup/add", {
        key: "VehicleBrand",
        value: formattedValue,
      });

      setBrands((prev) => [...prev, formattedValue]);
      resetForm();
      setError(null);
    } catch {
      setError("Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE ================= */
  const updateBrand = async () => {
    if (!editingValue) return;

    const newFormatted = `${selectedType}.${brandName}`;

    setLoading(true);
    try {
      // Remove old
      await api.post("/setup/remove", {
        key: "VehicleBrand",
        value: editingValue,
      });

      // Add new
      await api.post("/setup/add", {
        key: "VehicleBrand",
        value: newFormatted,
      });

      setBrands((prev) =>
        prev.map((b) => (b === editingValue ? newFormatted : b)),
      );

      resetForm();
      setError(null);
    } catch {
      setError("Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteBrand = async (brand) => {
    setLoading(true);
    try {
      await api.post("/setup/remove", {
        key: "VehicleBrand",
        value: brand,
      });

      setBrands((prev) => prev.filter((b) => b !== brand));
      setError(null);
    } catch {
      setError("Failed to remove brand");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (brand) => {
    const [type, name] = brand.split(".");
    setSelectedType(type);
    setBrandName(name);
    setEditingValue(brand);
  };

  const resetForm = () => {
    setSelectedType("");
    setBrandName("");
    setEditingValue(null);
  };

  /* ================= SEARCH ================= */
  const filteredBrands = brands?.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase()),
  );
  console.log(brands);

  console.log(filteredBrands);

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Vehicle Brand Setup</h1>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Vehicle Type Select */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Select Vehicle Type</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v.type}>
                {v.type}
              </option>
            ))}
          </select>

          {/* Brand Name */}
          <input
            type="text"
            placeholder="Brand Name"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="border p-3 rounded"
          />

          {/* Action Button */}
          {editingValue ? (
            <button
              onClick={updateBrand}
              className="bg-yellow-500 text-white rounded p-3"
            >
              Update
            </button>
          ) : (
            <button
              onClick={addBrand}
              className="bg-blue-600 text-white rounded p-3"
            >
              Add
            </button>
          )}
        </div>

        {/* ================= SEARCH ================= */}
        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded w-full mb-6"
        />

        {/* ================= TABLE ================= */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredBrands?.length === 0 ? (
          <p>No brands found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Vehicle Type</th>
                <th className="border p-2 text-left">Brand</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands?.map((brand, index) => {
                const [type, name] = brand.split(".");
                return (
                  <tr key={index}>
                    <td className="border p-2">{type}</td>
                    <td className="border p-2">{name}</td>
                    <td className="border p-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="bg-yellow-400 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBrand(brand)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default VehicleBrand;
