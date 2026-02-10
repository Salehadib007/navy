import React, { useEffect, useState } from "react";
// import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api";
import QRImage from "./QRImage";

const AutoQRCode = () => {
  const location = useLocation();
  const ids = location.state?.ids || [];

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (ids.length === 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // backend expects comma-separated IDs
        const res = await api.get(`/enrollment/${ids.join(",")}`);
        setEnrollments(res.data);
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ids]);

  if (ids.length === 0) return <p>No IDs provided</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {loading ? (
        <div>
          <p>Generating QR Codes...</p>
          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "auto",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #555",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            justifyItems: "center",
          }}
        >
          {enrollments.map((item) => {
            const url = `https://navy-ruddy.vercel.app/show-data/${item._id}`;
            // const url = `http://localhost:5173/show-data/${item._id}`;

            return (
              <div key={item._id} style={{ textAlign: "center" }}>
                <QRImage value={url} />
                <div style={{ marginTop: "10px", lineHeight: "1.4" }}>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
                    {item.fullName}
                  </p>

                  <p
                    style={{ fontSize: "14px", color: "#555", margin: "2px 0" }}
                  >
                    {item.officialRank}
                  </p>

                  <p style={{ fontSize: "14px", color: "#000", margin: 0 }}>
                    📞 {item.primaryMobile}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="text-center mt-6 print:hidden">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 border border-black font-semibold hover:bg-black hover:text-white transition"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default AutoQRCode;
