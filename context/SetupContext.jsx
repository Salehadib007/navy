import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api.js"; // adjust path
import { useAuth } from "./AuthContext.jsx";

const SetupContext = createContext(null);
const res = await api.get("/setup");
export const SetupProvider = ({ children }) => {
  const auth = useAuth("auth");
  // console.log(auth);

  const [setup, setSetup] = useState(auth?.user?.access);

  const addSetup = (data) => {
    setSetup(data);
  };

  const [loadingSetup, setLoadingSetup] = useState(true);

  const fetchSetup = async () => {
    try {
      setLoadingSetup(true);

      // Example endpoint: GET /setup

      // CASE A: backend returns object
      setSetup(res.data);
      // console.log(setup);

      // CASE B: backend returns array (most common)
      // setSetup(res.data?.[0] || null);
    } catch (err) {
      // console.log("Setup fetch error:", err);
      setSetup(null);
    } finally {
      setLoadingSetup(false);
    }
  };

  useEffect(() => {
    fetchSetup();
  }, [res.data]);

  return (
    <SetupContext.Provider
      value={{ setup, setSetup, addSetup, loadingSetup, fetchSetup }}
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
