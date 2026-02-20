import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const AddVehicleContext = createContext();

// Provider component
export const AddVehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all vehicles
  const getVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/vehicles");
      setVehicles(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new vehicle
  const addVehicle = async (vehicle) => {
    try {
      const res = await axios.post("/api/vehicles", vehicle);
      setVehicles((prev) => [res.data.data, ...prev]);
      setError(null);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Update vehicle
  const updateVehicle = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/vehicles/${id}`, updatedData);
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? res.data.data : v)),
      );
      setError(null);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`/api/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Fetch vehicles on mount
  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <AddVehicleContext.Provider
      value={{
        vehicles,
        loading,
        error,
        getVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </AddVehicleContext.Provider>
  );
};

// Custom hook to use context
export const useAddVehicle = () => useContext(AddVehicleContext);
