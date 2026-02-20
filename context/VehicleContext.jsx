// src/context/VehicleContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api"; // adjust path if needed

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    type: "",
  });

  // ================= FETCH ALL =================
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/vehicle");

      if (data.success) {
        setVehicles(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/vehicle/${editingId}`, formData);
      } else {
        await api.post("/vehicle", formData);
      }

      await fetchVehicles();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      type: vehicle.type,
    });
    setIsModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle type?"))
      return;

    try {
      setLoading(true);
      await api.delete(`/vehicle/${id}`);
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= CLOSE MODAL =================
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ type: "" });
  };

  return (
    <VehicleContext.Provider
      value={{
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
        fetchVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => useContext(VehicleContext);
