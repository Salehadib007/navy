import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api.js"; // adjust path

const SetupContext = createContext(null);

export const SetupProvider = ({ children }) => {
  const [setup, setSetup] = useState(null);
  const [loadingSetup, setLoadingSetup] = useState(true);

  const fetchSetup = async () => {
    try {
      setLoadingSetup(true);

      // Example endpoint: GET /setup
      const res = await api.get("/setup");

      // CASE A: backend returns object
      setSetup(res.data);

      // CASE B: backend returns array (most common)
      // setSetup(res.data?.[0] || null);
    } catch (err) {
      console.log("Setup fetch error:", err);
      setSetup(null);
    } finally {
      setLoadingSetup(false);
    }
  };

  useEffect(() => {
    fetchSetup();
  }, []);

  return (
    <SetupContext.Provider
      value={{ setup, setSetup, loadingSetup, fetchSetup }}
    >
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => {
  const ctx = useContext(SetupContext);
  if (!ctx) throw new Error("useSetup must be used inside SetupProvider");
  return ctx;
};
