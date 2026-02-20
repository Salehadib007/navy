import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "/registrations";

  // ================= GET all registrations =================
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get(API_URL);
      setRegistrations(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE a new registration =================
  const addRegistration = async (data) => {
    setLoading(true);
    try {
      if (
        (!data.location || data.location.length === 0) &&
        (!data.unit || data.unit.length === 0)
      ) {
        throw new Error("Provide location or unit");
      }

      const res = await api.post(API_URL, data);
      setRegistrations((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE entire registration =================
  const updateRegistration = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.put(`${API_URL}/${id}`, data);
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? res.data : reg)),
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE registration document =================
  const deleteRegistration = async (id) => {
    setLoading(true);
    try {
      await api.delete(`${API_URL}/${id}`);
      setRegistrations((prev) => prev.filter((reg) => reg._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete registration");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD a single item to array =================
  const addItemToRegistration = async (id, type, value) => {
    setLoading(true);
    try {
      const res = await api.patch(`${API_URL}/${id}/add`, { type, value });
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? res.data : reg)),
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= REMOVE a single item from array =================
  const removeItemFromRegistration = async (id, type, value) => {
    setLoading(true);
    try {
      const res = await api.patch(`${API_URL}/${id}/remove`, { type, value });
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? res.data : reg)),
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        loading,
        error,
        fetchRegistrations,
        addRegistration,
        updateRegistration,
        deleteRegistration,
        addItemToRegistration,
        removeItemFromRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
