import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

const CreatedBy = ({ createdBy }) => {
  const [creator, setCreator] = useState("");

  useEffect(() => {
    if (!createdBy) return;

    const fetchCreator = async () => {
      try {
        const response = await api.get(`/auth/${createdBy}`);
        setCreator(response?.data?.username || "Admin");
      } catch (error) {
        console.error("Failed to fetch creator:", error);
        setCreator("Admin");
      }
    };

    fetchCreator();
  }, [createdBy]);

  return <div>{creator}</div>;
};

export default CreatedBy;
