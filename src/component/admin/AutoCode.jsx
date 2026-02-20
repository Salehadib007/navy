import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../utils/api";
import QRImage from "./QRImage";
import { formatDate } from "../../../utils/formatDate";

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
    <div className="qr-wrapper">
      {loading ? (
        <div className="loading-container">
          <p>Generating QR Codes...</p>
          <div className="loader" />
        </div>
      ) : (
        <div className="qr-grid">
          {enrollments.map((item, index) => {
            const formattedString = `
Serial:${item.pno || ""}
Name and Rank:${item.fullName || ""} ${item.officialRank || ""}
O No:${item.brNoOrNid || ""}
Tax:${formatDate(item.taxToken)}
Reg No:${item.registrationNo || ""}
Issue:${formatDate(item.issueDate)}
Fitness:${formatDate(item.fitness)}
Validity:${formatDate(item.validity)}
Mobile:${item.primaryMobile || item.alternativeMobile || ""}
`.trim();

            const url = formattedString;

            return (
              <div key={item._id} className="qr-card w-full">
                {/* Top Section */}
                <div className="qr-top">
                  <div className="qr-image">
                    <QRImage value={url} />
                  </div>

                  <div className="qr-serial">
                    {String(index + 1).padStart(4, "0")}/25
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="qr-bottom">
                  <div>
                    <strong>REG NO:</strong> {item.registrationNo}
                  </div>
                  <div>
                    <strong>ISSUE DATE:</strong> {formatDate(item.issueDate)}
                  </div>
                  <div>
                    <strong>VALIDITY:</strong> {formatDate(item.validity)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print Button */}
      <div className="print:hidden print-button">
        <button onClick={() => window.print()}>Print / Save as PDF</button>
      </div>

      {/* Styles */}
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }

          .qr-wrapper {
            padding: 20px;
            text-align: center;
          }

          /* Loading */
          .loading-container {
            margin-top: 40px;
          }

          .loader {
            width: 50px;
            height: 50px;
            margin: auto;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #555;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* SCREEN Layout */
          .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 5px;
            justify-items: center;
          }

          .qr-card {
            border: 1px solid black;
            width: 100%;
            max-width: 220px;
            font-size: 9px;
          }

          .qr-top {
            display: flex;
          }

          .qr-image {
            flex: 1;
            border-right: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .qr-serial {
            width: 55%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
          }

          .qr-bottom {
            border-top: 1px solid black;
            padding: 4px;
            text-align: left;
          }

          .print-button {
            margin-top: 2px;
          }

          .print-button button {
            padding: 10px 20px;
            border: 1px solid black;
            background: white;
            font-weight: 600;
            cursor: pointer;
          }

          .print-button button:hover {
            background: black;
            color: white;
          }

          /* PRINT Layout */
          @media print {
            body {
              margin: 0;
            }

            .print\\:hidden {
              display: none !important;
            }

            .qr-wrapper {
              padding: 5px;
            }

            .qr-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              width: 100%;
            }

            .qr-card {
              width: 100%;
              height: 33mm;   /* 8 rows per page */
              max-width: none;
              page-break-inside: avoid;
            }

            @page {
              size: A4 portrait;
              margin: 10mm;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AutoQRCode;
