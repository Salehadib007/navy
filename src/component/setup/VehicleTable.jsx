import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VehicleTable() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const vehicles = location.state;
  console.log(vehicles);

  const filtered = vehicles?.filter((v) =>
    `${v.vehicleType} ${v.vehicleBrand} ${v.registrationNo}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const showData = (data) => {
    navigate("/vehicle-Details", { state: data });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Vehicle List</h2>

          <input
            type="text"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Registration No</th>
                <th className="px-4 py-3 text-left">Chassis</th>
                <th className="px-4 py-3 text-left">Engine</th>
                <th className="px-4 py-3 text-left">Tax Token</th>
                <th className="px-4 py-3 text-left">Validity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filtered.map((v, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50"
                    onClick={() => showData(v)}
                  >
                    <td className="px-4 py-3">{v.vehicleType}</td>
                    <td className="px-4 py-3">{v.vehicleBrand}</td>
                    <td className="px-4 py-3">{v.registrationNo}</td>
                    <td className="px-4 py-3">{v.chassisNumber}</td>
                    <td className="px-4 py-3">{v.engineNumber}</td>
                    <td className="px-4 py-3">{v.taxToken}</td>
                    <td className="px-4 py-3">{v.validity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
